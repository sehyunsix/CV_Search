import { IBrowserManager } from './IBrowserManager';
import { defaultLogger as logger } from '../utils/logger';
import CONFIG from '../config/config';
import { execSync } from 'child_process';
import { Browser, Page } from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import puppeteer from 'puppeteer';
/**
 * Chrome 브라우저 관리 구현체
 * Puppeteer를 사용하여 Chrome 브라우저를 관리합니다.
 */
export class ChromeBrowserManager implements IBrowserManager {
  browser?: Browser;
  browserPID?: number;

  /**
   * 브라우저 초기화
   * @returns 브라우저 인스턴스
   */private isLaunching = false;

// async initBrowser(): Promise<Browser | undefined> {
//   if (this.browser && this.browser.isConnected()) return this.browser;

//   if (this.isLaunching) {
//     while (this.isLaunching) {
//       await new Promise(res => setTimeout(res, 100));
//     }
//     return this.browser;
//   }

//   this.isLaunching = true;
//   try {
//     this.browser = await puppeteer.launch({
//       headless: CONFIG.BROWSER.HEADLESS,
//       args: CONFIG.BROWSER.LAUNCH_ARGS,
//       timeout: 10000,
//     });
//     return this.browser;
//   } catch (err) {
//     logger.error("브라우저 생성 실패", err);
//     return undefined;
//   } finally {
//     this.isLaunching = false;
//   }
  // }
  
async initBrowser(retries = 3, delay = 2000): Promise<Browser |undefined> {
  for (let i = 0; i < retries; i++) {
    try {
      this.browser = await puppeteer.launch({
        headless: CONFIG.BROWSER.HEADLESS,
        args: CONFIG.BROWSER.LAUNCH_ARGS,
        timeout: 10000,
      });
      return this.browser;
    } catch (err) {
      if (err instanceof Error) {
        logger.warn(`puppeteer.launch() 실패 [시도 ${i + 1}/${retries}]: ${err.message}`);
        if (i === retries - 1) throw new Error("브라우저 재시도 실패");
        await new Promise(res => setTimeout(res, delay));
      }
    }
  }
}
  /**
   * 새로운 페이지 생성 후 반환
   */
  async getNewPage(): Promise<Page>{
    if (!this.browser) {
      throw new Error("No broswer inialized");
    }
    return await this.browser.newPage();
  }
  /**
   * 브라우저 종료
   */
    async closeBrowser(): Promise<void> {
      if (this.browser) {
        logger.debug('브라우저 정리 중...');
        try {
          await this.browser.close();
          this.browser = undefined;
          logger.debug('브라우저가 정상적으로 종료되었습니다.');
        } catch (err) {
          logger.error('브라우저 종료 중 오류:', err);
        } finally {
          // Google Chrome for Testing 프로세스 강제 종료
          this.browser = undefined;
          this.killChromeProcesses();
        }
      }
    }

  /**
   * Chrome 프로세스 강제 종료
   */
  killChromeProcesses(): void {
    try {
      logger.debug('남은 Chrome 프로세스 정리 중...');

      // OS별로 다른 명령어 실행
      if (process.platform === 'darwin') {
        // macOS
        execSync('pkill -f "Google Chrome for Testing"');
        logger.debug('Google Chrome for Testing 프로세스가 정리되었습니다.');
      } else if (process.platform === 'linux') {
        // Linux
        execSync('pkill -f "chrome-for-testing"');
        execSync('pkill -f "chrome-test"');
      } else if (process.platform === 'win32') {
        // Windows
        execSync('taskkill /F /IM "chrome.exe" /FI "WINDOWTITLE eq *Chrome for Testing*"');
      }
    } catch (error) {
      // 이미 죽어있거나 다른 이유로 실패할 수 있음 - 무시
      logger.debug('Chrome 프로세스 종료 완료 또는 종료할 프로세스가 없음');
    }
  }

  /**
   * 오류 발생 시 스크린샷 저장
   * @param page 페이지 객체
   * @param url 대상 URL
   * @returns 저장된 스크린샷 경로 또는 null
   */
  async saveErrorScreenshot(page: any, url: string): Promise<string | null> {
    if (!page) {
      logger.debug('페이지 객체가 없어 스크린샷을 저장할 수 없습니다.');
      return null;
    }

    try {
      // 스크린샷 저장 경로 생성
      const screenshotsDir = path.join(CONFIG.PATHS.ERROR_SCREENSHOTS_DIR);

      // 디렉토리가 없으면 생성
      await fs.promises.mkdir(screenshotsDir, { recursive: true });

      // 파일명에 사용할 수 있는 URL 문자열 생성 (잘못된 문자 제거)
      const sanitizedUrl = url
        .replace(/^https?:\/\//, '')
        .replace(/[^a-zA-Z0-9]/g, '_')
        .substring(0, 100); // URL이 너무 길지 않도록 제한

      // 타임스탬프 추가
      const timestamp = new Date().toISOString().replace(/:/g, '-');
      const fileName = `${sanitizedUrl}_${timestamp}.png`;
      const filePath = path.join(screenshotsDir, fileName);

      // 스크린샷 저장
      await page.screenshot({
        path: filePath,
        fullPage: true // 전체 페이지 캡처
      });

      logger.debug(`에러 스크린샷 저장됨: ${filePath}`);
      return filePath;
    } catch (screenshotError) {
      logger.error('스크린샷 저장 중 오류:', screenshotError);
      return null;
    }
  }
}