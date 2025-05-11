import 'dotenv/config';
import { MysqlRecruitInfoRepository } from '../../src/database/MysqlRecruitInfoRepository';




describe('getRegionIdByCode', () => {

    let repository: MysqlRecruitInfoRepository;

    repository = new MysqlRecruitInfoRepository();
      test('job ID로 job 삭제하기',async() => {

        await repository.deleteRecruitInfoById(9999);
      }
    )
  });
