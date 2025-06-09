import { Router } from 'express';
import { getContainerList } from '../controller/CrawlController';
const router = Router();

router.get('/test', getContainerList);


export default router;
