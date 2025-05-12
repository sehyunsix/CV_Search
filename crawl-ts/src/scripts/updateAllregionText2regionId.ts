import 'dotenv/config';
import { regionText2RegionIdsAi } from '../trasnform/Transform';
import { MysqlJobRegionSequelize } from '../models/MysqlRecruitInfoModel';
import { MysqlRecruitInfoSequelize } from '../models/MysqlRecruitInfoModel';
import { GeminiParser } from '../parser/GeminiParser';

(async () => {

  const paser = new GeminiParser();
  MysqlRecruitInfoSequelize.findAll({ attributes: ['id', 'region_text'] })
    .then(async (results) => {
      for (const result of results) {
        const region_text = result.region_text;
        if (!region_text) {
          console.log('region_text가 없습니다.');
          continue;
        }
        const region_id = await regionText2RegionIdsAi(paser ,region_text);
        if (region_id.length > 0) {
          for (const id of region_id) {
            await MysqlJobRegionSequelize.upsert({
              job_id: result.id,
              region_id: id,
            });
          }
        }
      }
    })
}
)()