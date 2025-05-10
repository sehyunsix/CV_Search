import { Page } from 'puppeteer';
import { IDbConnector } from '@database/IDbConnector';
import { IBotRecruitInfo, IDbRecruitInfo, IRawContent } from '@models/RecruitInfoModel';
import { ConsumeMessage } from 'amqplib';
/**
 * 파싱 결과 저장 옵션
 */
export interface SaveParsedContentOptions {
  /**
   * 저장할 ID
   */
  id?: string;

  /**
   * 저장 대상 (cache, file, db)
   */
  destination?: 'cache' | 'file' | 'db';

  /**
   * 추가 옵션
   */
  options?: Record<string, any>;
}

/**
 * 파서 인터페이스
 * 모든 파서 구현체가 구현해야 하는 인터페이스
 */
export interface IParser {

  /**
   * 원본 콘텐츠 로드
   * @param options 로드 옵션
   */
  loadRawContent(batchSize : number ):Promise<IRawContent[]>;

  /**
   * 원본 콘텐츠를 파싱하여 채용 정보 추출
   * @param rawContent 원본 콘텐츠
   */
  parseRawContentRetry(rawContent: IRawContent, retryNumber: number): Promise<IBotRecruitInfo | undefined>;


  /**
   * DB 저장용 모델로 변환
   * @param botRecruitInfo 봇 파싱 결과
   * @param rawContent 원본 콘텐츠
   */
  makeDbRecruitInfo(botRecruitInfo: IBotRecruitInfo, rawContent: IRawContent): IDbRecruitInfo;



}