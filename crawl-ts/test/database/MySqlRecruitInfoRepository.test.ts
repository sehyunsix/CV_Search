import 'dotenv/config';
// dotenv.config({path : '../../.env.test'});
import { MysqlRecruitInfoRepository } from '../../src/database/MysqlRecruitInfoRepository';
import { MysqlRecruitInfoSequelize } from '../../src/models/MysqlRecruitInfoModel';
import { IDbRecruitInfo } from '../../src/models/RecruitInfoModel';
import { Sequelize, Model, QueryTypes } from 'sequelize';




describe('getRegionIdByCode', () => {

  let repository: MysqlRecruitInfoRepository;

  repository = new MysqlRecruitInfoRepository();
  test('job ID로 job 삭제하기',async() => {

    await repository.deleteRecruitInfoById(9999);
  }
  )
  });
