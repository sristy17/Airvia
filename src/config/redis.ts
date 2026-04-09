import { Redis as IORedis } from "ioredis";

/**
 * Redis connection instance using ioredis.
 *
 * This connection is used by BullMQ (queues, workers, events)
 * and can also be reused for caching or pub/sub if needed.
 *
 * Configuration details:
 * - host: Redis server address (default: localhost)
 * - port: Redis server port (default: 6379)
 * - maxRetriesPerRequest: null disables automatic retries,
 *   which is recommended for BullMQ to avoid blocking behavior
 *
 * @type {IORedis}
 *
 * @property {string} host - Redis server host
 * @property {number} port - Redis server port
 * @property {number|null} maxRetriesPerRequest - Retry behavior configuration
 */

export const connection = new IORedis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null,
});