import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';

import { processPaymentEscalations } from '@lanceflow/payments';

const QUEUE_NAME = 'payment-escalation';
const DEFAULT_CRON = '0 8 * * *';

function isJobsEnabled(): boolean {
  const raw = process.env.PAYMENT_ESCALATION_JOBS_ENABLED?.trim().toLowerCase();
  return raw === '1' || raw === 'true' || raw === 'yes';
}

async function runEscalationJob() {
  const result = await processPaymentEscalations();
  console.info(
    `[${QUEUE_NAME}] scanned=${result.scanned} updated=${result.updated.length}`,
    result.updated.length > 0 ? result.updated : ''
  );
}

async function main() {
  const redisUrl = process.env.REDIS_URL?.trim();
  if (!redisUrl) {
    console.error('REDIS_URL is required to run the worker');
    process.exit(1);
  }

  if (!isJobsEnabled()) {
    console.info('PAYMENT_ESCALATION_JOBS_ENABLED is off — exiting');
    process.exit(0);
  }

  const connection = new Redis(redisUrl, { maxRetriesPerRequest: null });

  const worker = new Worker(
    QUEUE_NAME,
    async () => {
      await runEscalationJob();
    },
    { connection }
  );

  worker.on('failed', (job, err) => {
    console.error(`[${QUEUE_NAME}] job ${job?.id} failed`, err);
  });

  const cron = process.env.PAYMENT_ESCALATION_CRON?.trim() || DEFAULT_CRON;
  const queue = new Queue(QUEUE_NAME, { connection });
  await queue.add(
    'daily-escalation',
    {},
    {
      repeat: { pattern: cron },
      jobId: 'payment-escalation-daily',
    }
  );

  console.info(`Worker listening on queue "${QUEUE_NAME}" (cron: ${cron})`);

  const shutdown = async () => {
    await worker.close();
    await queue.close();
    await connection.quit();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
