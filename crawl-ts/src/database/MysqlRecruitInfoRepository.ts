import { Sequelize ,QueryTypes ,Model} from 'sequelize'
import {  CreateDBRecruitInfoDTO ,RegionResult ,RecruitInfoUrlDto} from '../models/RecruitInfoModel';
import { MysqlRecruitInfoSequelize  ,MysqlJobRegionSequelize} from '../models/MysqlRecruitInfoModel';
import { defaultLogger as logger } from '../utils/logger';
import { IRecruitInfoRepository } from './IRecruitInfoRepository';
import axios from 'axios';
/**
 * MySQL 데이터베이스 서비스 클래스
 * 채용 정보를 MySQL 데이터베이스에 저장하고 관리하는 서비스
 */
export class MysqlRecruitInfoRepository implements IRecruitInfoRepository {


  /**
   * 채용 정보 저장
   * @param recruitInfo 저장할 채용 정보 객체
   * @returns 저장된 채용 정보 객체
   */
  async createRecruitInfo(recruitInfo: CreateDBRecruitInfoDTO ): Promise<CreateDBRecruitInfoDTO|null> {
    try {
      // 현재 시간
      const now = new Date();

      // 데이터 준비 (region_id는 아직 처리하지 않음)
      let recruitData = {
        ...recruitInfo,
        created_at: now,
        updated_at: now
      }

      // URL로 기존 데이터 확인
      const [record, created] = await MysqlRecruitInfoSequelize.upsert(recruitData);
      logger.debug(created?'🔵 새로 생성된 데이터:':'🟡 기존 데이터 업데이트됨:'+`${record.id}`);
      return record;

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
  async updateRecruitInfo(recruitInfo: CreateDBRecruitInfoDTO): Promise<CreateDBRecruitInfoDTO | null> {

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