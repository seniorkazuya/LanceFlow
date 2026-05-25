import { processKpiRollup } from '@lanceflow/analytics';
import { processPaymentEscalations } from '@lanceflow/payments';
import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';

const PAYMENT_QUEUE = 'payment-escalation';
const KPI_QUEUE = 'kpi-rollup';
const PAYMENT_CRON_DEFAULT = '0 8 * * *';
const KPI_CRON_DEFAULT = '0 3 * * *';

function flagEnabled(name: string): boolean {
  const raw = process.env[name]?.trim().toLowerCase();
  return raw === '1' || raw === 'true' || raw === 'yes';
}

async function registerCron(
  connection: Redis,
  queueName: string,
  jobName: string,
  cron: string,
  jobId: string
) {
  const queue = new Queue(queueName, { connection });
  await queue.add(
    jobName,
    {},
    {
      repeat: { pattern: cron },
      jobId,
    }
  );
  return queue;
}

async function main() {
  const redisUrl = process.env.REDIS_URL?.trim();
  if (!redisUrl) {
    console.error('REDIS_URL is required to run the worker');
    process.exit(1);
  }

  const paymentEnabled = flagEnabled('PAYMENT_ESCALATION_JOBS_ENABLED');
  const kpiEnabled = flagEnabled('KPI_ROLLUP_JOBS_ENABLED');

  if (!paymentEnabled && !kpiEnabled) {
    console.info('No worker jobs enabled — exiting');
    process.exit(0);
  }

  const connection = new Redis(redisUrl, { maxRetriesPerRequest: null });
  const queues: Queue[] = [];
  const workers: Worker[] = [];

  if (paymentEnabled) {
    const cron = process.env.PAYMENT_ESCALATION_CRON?.trim() || PAYMENT_CRON_DEFAULT;
    workers.push(
      new Worker(
        PAYMENT_QUEUE,
        async () => {
          const result = await processPaymentEscalations();
          console.info(
            `[${PAYMENT_QUEUE}] scanned=${result.scanned} updated=${result.updated.length}`
          );
        },
        { connection }
      )
    );
    queues.push(
      await registerCron(connection, PAYMENT_QUEUE, 'daily-escalation', cron, 'payment-escalation-daily')
    );
    console.info(`[${PAYMENT_QUEUE}] scheduled (cron: ${cron})`);
  }

  if (kpiEnabled) {
    const cron = process.env.KPI_ROLLUP_CRON?.trim() || KPI_CRON_DEFAULT;
    workers.push(
      new Worker(
        KPI_QUEUE,
        async () => {
          const result = await processKpiRollup();
          console.info(
            `[${KPI_QUEUE}] period=${result.periodKey} scanned=${result.scanned} upserted=${result.upserted.length}`
          );
        },
        { connection }
      )
    );
    queues.push(
      await registerCron(connection, KPI_QUEUE, 'nightly-rollup', cron, 'kpi-rollup-nightly')
    );
    console.info(`[${KPI_QUEUE}] scheduled (cron: ${cron})`);
  }

  for (const worker of workers) {
    worker.on('failed', (job, err) => {
      console.error(`[${job?.queueName}] job ${job?.id} failed`, err);
    });
  }

  const shutdown = async () => {
    await Promise.all(workers.map((w) => w.close()));
    await Promise.all(queues.map((q) => q.close()));
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
