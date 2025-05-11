import { Sequelize ,QueryTypes ,Model} from 'sequelize'
import {  IDbRecruitInfo ,RegionResult ,RecruitInfoUrlDto} from '../models/RecruitInfoModel';
import { MysqlRecruitInfoSequelize  ,mysqlRecruitInfoSequelize} from '../models/MysqlRecruitInfoModel';
import { defaultLogger as logger } from '../utils/logger';
import { IRecruitInfoRepository } from './IRecruitInfoRepository';
import axios from 'axios';
/**
 * MySQL 데이터베이스 서비스 클래스
 * 채용 정보를 MySQL 데이터베이스에 저장하고 관리하는 서비스
 */
export class MysqlRecruitInfoRepository implements IRecruitInfoRepository {
  private recruitInfoModel?: Model
  private sequelize?: Sequelize
  /**
   * 지역 코드에 해당하는 ID 조회
   * @param regionCd 지역 코드
   * @returns 해당 지역 코드의 id 또는 null (찾을 수 없는 경우)
   */
  async getRegionIdByCode(regionCd: string): Promise<number | null> {
    if (!this.sequelize) {
      throw new Error('데이터베이스 연결이 초기화되지 않았습니다.');
    }

    try {
      logger.debug(`쿼리 시작`);
      const [regionResult] : [RegionResult] = await this.sequelize.query(
        'SELECT id FROM regions WHERE cd = :regionCd LIMIT 1',
        {
          replacements: { regionCd },
          type: QueryTypes.SELECT
        }
      ) as [RegionResult];

      logger.debug(`쿼리 결과: ${JSON.stringify(regionResult)}`);
      if (regionResult && regionResult.id !== undefined) {
          logger.info(`지역 코드 ${regionCd}에 해당하는 ID ${regionResult.id}를 찾았습니다.`);
          return regionResult.id;
        } else {
          logger.warn(`지역 코드 ${regionCd}에 해당하는 ID를 찾을 수 없습니다.`);
          return null;
        }
    } catch (error) {
      logger.error(`지역 정보 조회 중 오류:`, error);
      return null;
    }
  }

  /**
   * 채용 정보 저장
   * @param recruitInfo 저장할 채용 정보 객체
   * @returns 저장된 채용 정보 객체
   */
  async createRecruitInfo(recruitInfo: IDbRecruitInfo ): Promise<IDbRecruitInfo> {
    try {
      // 현재 시간
      const now = new Date();

      // 데이터 준비 (region_id는 아직 처리하지 않음)
      let recruitData = {
        ...recruitInfo,
        created_at: now,
        updated_at: now
      };

      // URL로 기존 데이터 확인
      const existingRecord = await MysqlRecruitInfoSequelize.findOne({
        where: { url: recruitInfo.url }
      });


      if (existingRecord) {
        // 기존 데이터 업데이트
        return await existingRecord.update({
          ...recruitData,
          updated_at: now
        });
      } else {
        // 새 데이터 생성
        return await MysqlRecruitInfoSequelize.create(recruitData);
      }
    } catch (error) {
      logger.error('채용 정보 저장 중 오류:', error);
      throw error;
    }
  }

  /**
   * 채용 정보 업데이트
   * @param recruitInfo 업데이트할 채용 정보 객체
   * @returns 업데이트된 채용 정보 객체 또는 null (업데이트 실패 시)
   */
  async updateRecruitInfo(recruitInfo: IDbRecruitInfo): Promise<IDbRecruitInfo | null> {

    try {
      const now = new Date();
      const [affectedCount, updatedRecords] = await MysqlRecruitInfoSequelize.update(
        {
          ...recruitInfo,
          updated_at: now
        },
        {
          where: { url: recruitInfo.url },
          returning: true
        }
      );

      if (affectedCount > 0 && updatedRecords.length > 0) {
        return updatedRecords[0];
      } else {
        return null;
      }
    } catch (error) {
      logger.error('채용 정보 업데이트 중 오류:', error);
      throw error;
    }
  }


    /**
   * 채용 정보 업데이트
   * @param recruitInfo 업데이트할 채용 정보 객체
   * @returns 업데이트된 채용 정보 객체 또는 null (업데이트 실패 시)
   */
  async getAllRecruitInfoUrl(): Promise<RecruitInfoUrlDto[] | []> {

    try {
      const now = new Date();
      const result: RecruitInfoUrlDto[] = await MysqlRecruitInfoSequelize.findAll({ attributes: ['id','url'] },);
      return result
    } catch (error) {
      logger.error('채용 정보 업데이트 중 오류:', error);
      throw error;
    }
  }


/**
 * 채용 정보 업데이트
 * @param recruitInfo 업데이트할 채용 정보 객체
 * @returns 업데이트된 채용 정보 객체 또는 null (업데이트 실패 시)
 */
  async deleteRecruitInfoById(id: number): Promise<void> {
   try {
    const response = await axios.delete(`${process.env.SPRING_API_DOMAIN}/jobs/delete-one-job?jobId=${id}`, {
    });

    if (response.status === 200) {
      console.log(`✅ Job ${id} 삭제 성공`);
    } else {
      console.warn(`⚠️ Job ${id} 삭제 응답 코드: ${response.status}`);
    }
  } catch (error) {
     console.error(`❌ Job ${id} 삭제 실패`, error);
     throw error;
   }

  }
}