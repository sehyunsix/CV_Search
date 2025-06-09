import Docker from 'dockerode';
import { Request, Response } from 'express';
import {}
const docker = new Docker();


/**
 * @swagger
 * /api/test:
 *   get:
 *     summary: Get list of Docker containers
 *     description: Returns a list of all Docker containers (running and stopped).
 *     tags:
 *       - Docker
 *     responses:
 *       200:
 *         description: A list of containers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Server error while fetching container list
 */
export async function getContainerList (req: Request, res: Response): Promise<void>  {
  try {
    const containers = await docker.listContainers({ all: true });
    res.status(200).json(containers);
  } catch (error) {
    console.error('Error fetching container list:', error);
    res.status(500).json({ error: 'Failed to fetch container list' });
  }
}



/**
 * @swagger
 * /api/crawl-start:
 *   Post:
 *     summary: Get list of Docker containers
 *     description: Returns a list of all Docker containers (running and stopped).
 *     tags:
 *       - Docker
 *     parameters:
 *     responses:
 *       200:
 *         description: A list of containers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Server error while fetching container list
 */
export async function crawlStart (req: Request, res: Response): Promise<void>  {
  try {
    // 크롤링 시작 로직을 여기에 추가합니다.
    // 예를 들어, 크롤러를 초기화하고 URL을 방문하는 등의 작업을 수행할 수 있습니다.

    res.status(200).json({ message: 'Crawl started successfully' });
  } catch (error) {
    console.error('Error starting crawl:', error);
    res.status(500).json({ error: 'Failed to start crawl' });
  }
}