import 'dotenv/config';
import { defaultLogger as logger } from '../../src/utils/logger';
import axios from 'axios';
import { writeFileSync } from 'fs';
import { MysqlRecruitInfoRepository } from '../database/MysqlRecruitInfoRepository';
import { getSpringAuthToken } from '../utils/key';
const puppeteer = require('puppeteer');
import { rejects } from 'assert';
import { Dialog } from 'puppeteer';
import * as fs from 'fs';


const mysqlRecruitInfoRepository = new MysqlRecruitInfoRepository();



export async function checkUrl(url: string): Promise<{ url:string, status: number | string; success: boolean; reason?: string }> {

  try {
    const response = await axios.get(url);
    // console.log(response.data);
    const html  = response.data;
    const contentType = response.headers['content-type'];

    if (html.includes('<body')) {
      // console.log("HTML 응답입니다.");

    } else {
      // console.log("HTML이 아닙니다.");
      return {
        url,
        status: response.status,
        success: false,
        reason: 'NOT_HTML',
      };
    }
    const isEmpty = !html || html.trim().length === 0;


    if (isEmpty ) {
      console.log(`[FAIL - ${isEmpty ? 'EMPTY' : 'KEYWORD'}] ${url}`);
      return {
        url,
        status: response.status,
        success: false,
        reason: isEmpty
          ? 'EMPTY_BODY'
          : 'CLOSED_OR_INVALID_CONTENT',
      };
    } else {
      return {
        url,
        status: response.status,
        success: true,
      };

    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`[ERROR] ${url}: ${error.message}`);
      return {
        url,
        status: error.response?.status || 'UNKNOWN_ERROR',
        success: false,
        reason: 'REQUEST_ERROR',
      };
    }
    return {
      url,
        status: 'UNKNOWN_ERROR',
        success: false,
        reason: 'REQUEST_ERROR',
      };
  }
}

async function getNotVaildUrls() : Promise<{ id: number; url: string }[]> {
  const RecruitInfoUrls = await mysqlRecruitInfoRepository.getAllVaildRecruitInfoUrl();
  const tasks: Promise<boolean>[] = [];
  const results: {
    id: number;
    url: string;
    status: number | string;
    success: boolean;
    reason?: string;
  }[] = [];
  for (const data of RecruitInfoUrls) {

      tasks.push(checkUrl(data.url)
        .then((result) => {
          results.push({
            id: data.id,
            url: data.url,
            status: result.status,
            success: result.success,
            reason: result.reason,
          });
          return true;
        }
      )
      .catch((error) => {
        logger.error(`URL 체크 중 오류 발생: ${data.url}`, error);
        return false;
      }
    )
    )
  }

  await Promise.all(tasks);
  writeFileSync('url-check-detailed-results.json', JSON.stringify(results, null, 2), 'utf-8');
  const successCount = results.filter(r => r.success).length;
  const failCount = results.length - successCount;
  console.log(`✅ 성공: ${successCount}`);
  console.log(`❌ 실패: ${failCount}`);
  return results.filter(r => r.success == false);
}


if (require.main === module) {
  (async () => {
    const token = await getSpringAuthToken()
    await getNotVaildUrls()
      .then(async (datas) => {
        const deleteCount = datas.length;
        logger.debug(`삭제할 URL 갯수: ${deleteCount}`);
        const tasks: Promise<boolean>[] = [];
        for (const data of datas) {
          tasks.push(
            mysqlRecruitInfoRepository.deleteRecruitInfoByIdValidType(data.id, 1, token)
              .then(() => {
                logger.debug(`삭제 성공: ${data.id} - ${data.url}`);
                return true;
              })
              .catch((error) => {
                logger.debug(`삭제 실패: ${data.id} - ${data.url}`, error);
                return false;
              })
          );
        }
        const successCount = (await Promise.all(tasks)).filter(r => r == true).length;
        logger.debug(`삭제한 URL 갯수: ${successCount} / ${datas.length}`);
      }
      )



  })();
}