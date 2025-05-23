// repositories/MongoRecruitInfoRepository.ts
import { ICacheDbRecruitInfo } from '@models/RecruitInfoModel';
import { MongoRecruitInfoModel } from '@models/MongoRecruitInfoModel';
import { IRecruitInfoRepository } from './IRecruitInfoRepository';

export class MongoRecruitInfoRepository implements IRecruitInfoRepository {
  private recruitInfoModel: typeof MongoRecruitInfoModel;

  constructor(recruitInfoModel: typeof MongoRecruitInfoModel) {
    this.recruitInfoModel = recruitInfoModel;
  }

  async createRecruitInfo(recruitInfo: ICacheDbRecruitInfo): Promise<ICacheDbRecruitInfo> {
    return this.recruitInfoModel.create(recruitInfo);
  }

  async updateRecruitInfo(recruitInfo: ICacheDbRecruitInfo): Promise<ICacheDbRecruitInfo> {
    return this.recruitInfoModel.findByIdAndUpdate(recruitInfo._id, recruitInfo, { new: true }).exec() as Promise<ICacheDbRecruitInfo>;
  }

  async findByUrl(url: string): Promise<ICacheDbRecruitInfo | null> {
    return this.recruitInfoModel.findOne({ url }).exec();
  }

}
