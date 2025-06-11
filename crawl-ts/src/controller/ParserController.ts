import { Request, Response } from 'express';
import { JobPipeLine } from '../pipeline/JobPipeLine';

const jobPipeLine = new JobPipeLine();

/**
 * @swagger
 * /api/parser/start:
 *   post:
 *     summary: Start the parser
 *     description: Initiates the parser pipeline.
 *     tags:
 *       - Parser
 *     responses:
 *       200:
 *         description: Parser started successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Parser started successfully
 *       500:
 *         description: Server error while starting parseRawContentRetry
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to start parser
 */
export async function startJobPipeLine(req: Request, res: Response): Promise<void> {
  try {
    await jobPipeLine.run();
    res.status(200).json({ message: 'Parser started successfully' });
  } catch (error) {
    console.error('Error starting parser:', error);
    res.status(500).json({ error: 'Failed to start parser' });
  }
}

/**
 * @swagger
 * /api/parser/stop:
 *   post:
 *     summary: Stop the parser
 *     description: Stops the parser pipeline.
 *     tags:
 *       - Parser
 *     responses:
 *       200:
 *         description: Parser stopped successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Parser stopped successfully
 *       500:
 *         description: Server error while stopping parser
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to stop parser
 */
export async function stopJobPipeLine(req: Request, res: Response): Promise<void> {
  try {
    await jobPipeLine.stop();
    res.status(200).json({ message: 'Parser stopped successfully' });
  } catch (error) {
    console.error('Error stopping parser:', error);
    res.status(500).json({ error: 'Failed to stop parser' });
  }
}
