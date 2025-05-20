import express, { Request, Response, Router } from 'express';
import { Op } from 'sequelize';
import { MysqlRecruitInfoSequelize, MysqlJobValidTypeSequelize } from '../../models/MysqlRecruitInfoModel'; // 경로는 실제 모델 위치로 조정

// 라우터 인스턴스 생성
const router: Router = express.Router();

// 라우터 정의
router.get('/job', async (req: Request ,res: Response): Promise<any> => {
  try {
    const recruitInfo = await MysqlRecruitInfoSequelize.findAll({
      include: [
        {
          model: MysqlJobValidTypeSequelize,
          as: 'jobValidTypes',
          attributes: ['valid_type'],
          where: {
            valid_type: {
              [Op.is]: null
            }
          },
          required: false
        }
      ]
    });

    if (!recruitInfo || recruitInfo.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }
    return res.json({ data: recruitInfo });
  } catch (error) {
    console.error('Error fetching job:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// 라우터 내보내기
export default router;