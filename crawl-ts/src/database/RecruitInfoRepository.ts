import { CreateDBRecruitInfoDTO } from '../models/RecruitInfoModel';
import { IRecruitInfoRepository } from './IRecruitInfoRepository';
import { MysqlRecruitInfoRepository } from './MysqlRecruitInfoRepository';
import { RedisUrlManager, URLSTAUS } from '../url/RedisUrlManager';

export class RecruitInfoRepository implements IRecruitInfoRepository {

  private mysqlRepository: MysqlRecruitInfoRepository;
  private urlManager: RedisUrlManager;


  constructor() {

    this.mysqlRepository = new MysqlRecruitInfoRepository();
    this.urlManager = new RedisUrlManager();
  }

  async initialize() {
    await this.urlManager.connect();
  }

  async createRecruitInfo(recruitInfo: CreateDBRecruitInfoDTO): Promise<Boolean> {

    return await this.mysqlRepository.createRecruitInfo(recruitInfo).then(
      (result) => {
        if(!result) { throw new Error('Failed to create recruit info'); }
        return this.urlManager.setURLStatus(result.url, URLSTAUS.HAS_RECRUITINFO)
      }
    )
    .catch((error) => {
      console.error('Error creating recruit info:', error);
      throw error;
    })
    .then(() => {
      return true;
    })
    .catch((error) => {
      console.error('Error setting URL status:', error);
      throw error;
    })

  }

}