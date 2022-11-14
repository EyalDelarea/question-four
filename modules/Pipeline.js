const { Semaphore } = require("await-semaphore");
const logger = require("./logger.js");

async function sleep(timeout) {
  return new Promise((r) => {
    setTimeout(r, timeout);
  });
}

/**
 * Define each object in the restaurant pipeline
 * @param name
 * @param limit semaphore limit (amount of available works)
 * @param timeout among of time in seconds to process the order.
 * @param concurrency how many object can this worker handle at any given moment //TODO address toppings here
 */
class Pipeline {
  //TODO handle concurrency
  constructor(name, limit, timeout, concurrency) {
    this.asyncSem = new Semaphore(limit);
    this.name = name;
    this.timeout = timeout * 1000;
  }
  async start(order, index) {
    const sem = this.asyncSem;
    const timeout = this.timeout;
    await sem.use(async () => {
      logger.info(this.name + " STARTED, order: " + index);
      await sleep(timeout);
      logger.info(this.name + " FINISHED order: " + index);
    });
  }
}
exports.Pipeline = Pipeline;
