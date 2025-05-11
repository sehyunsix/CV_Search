import { IBaseRecruitInfo } from '@models/RecruitInfoModel';
import { IRecruitInfoRepository } from './IRecruitInfoRepository';
import { MysqlRecruitInfoRepository } from '@database/MysqlRecruitInfoRepository';
import { MongoRecruitInfoRepository } from './MongoRecruitInfoRepository';
import { RedisUrlManager } from '@url/RedisUrlManager';

class RecruitInfoRepository implements IRecruitInfoRepository {

  private mysqlRepository: MysqlRecruitInfoRepository;
  private mongoDBRepository: MongoRecruitInfoRepository;
  private urlManager: RedisUrlManager;


  constructor() {

    this.mongoDBRepository = new MongoRecruitInfoRepository();
    this.mysqlRepository = new MysqlRecruitInfoRepository();
    this.urlManager = new RedisUrlManager();
  }

  async initialize() {
    await this.mongoDBRepository.connect();
    await this.urlManager.connect();
  }

  createRecruitInfo(recruitInfo: IBaseRecruitInfo): Promise<IBaseRecruitInfo | null> {

    //날짜 유효성 검증
    //region_text to region_id
    // mysql qeury 날리기
    // redis qeury 날리기
    // mongodb qeury 날리기

  }

  updateRecruitInfo(recruitInfo: IBaseRecruitInfo): Promise<IBaseRecruitInfo | null> {

  }

}