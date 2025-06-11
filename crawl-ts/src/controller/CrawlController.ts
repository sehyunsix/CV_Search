import { Request, Response } from 'express';
import { concurrentWebCrawler } from '../crawler/CocurrentCralwer';


/**
 * @swagger
 * /api/crawl/start:
 *   post:
 *     summary: Start the web crawler
 *     description: Initiates the web crawler with specified concurrency.
 *     tags:
 *       - Crawler
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               concurrency:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       200:
 *         description: Crawl started successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Crawl started successfully
 *       500:
 *         description: Server error while starting crawl
 */
export async function startCrawler (req: Request, res: Response): Promise<void>  {
  try {
    // 크롤링 시작 로직을 여기에 추가합니다.
    const { concurrency } = req.body;
    concurrentWebCrawler.emit('start', concurrency); // 예시로 동시성 10으로 시작
    res.status(200).json({ message: 'Crawl started successfully' });
  } catch (error) {
    console.error('Error starting crawl:', error);
    res.status(500).json({ error: 'Failed to start crawl' });
  }
}


/**
 * @swagger
 * /api/crawl/stop:
 *   post:
 *     summary: Stop the web crawler
 *     description: Stop the web crawler .
 *     tags:
 *       - Crawler
 *     responses:
 *       200:
 *         description: Crawl stop successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Crawl stop successfully
 *       500:
 *         description: Server error while stop crawl
 */
export async function stopCrawler (req: Request, res: Response): Promise<void>  {
  try {
    // 크롤링 시작 로직을 여기에 추가합니다.
    concurrentWebCrawler.emit('stop'); // 예시로 동시성 10으로 시작
    res.status(200).json({ message: 'Crawl stoped successfully' });
  } catch (error) {
    console.error('Error starting crawl:', error);
    res.status(500).json({ error: 'Failed to start crawl' });
  }
}