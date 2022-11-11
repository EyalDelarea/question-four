const { createLogger, format, transports } = require("winston");
const logger = createLogger({
  format: format.combine(format.timestamp(), format.json()),
  transports: [new transports.Console({})],
});

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
    this.sem = require("semaphore")(limit);
    this.name = name;
    this.timeout = timeout * 1000;
  }
  start(order, index) {
    return new Promise((resolve, reject) => {
      this.sem.take(() => {
        logger.info(this.name + " STARTED, order: " + index);
        setTimeout(() => {
          logger.info(this.name + " FINISHED order: " + index);
          this.sem.leave(1);
          resolve();
        }, this.timeout);
      }, 1);
    });
  }
}

const pizzaOrder = (numOfTopping) => {
  this.numOfTopping = numOfTopping;
  this.startTime = null;
  this.endTime = null;
  return this;
};

async function main() {
  //Init restaurant workers
  doughChef = new Pipeline("Dough Chef", 7, 2, 1);
  toppingsChef = new Pipeline("Toppings Chef", 3, 4, 2);
  oven = new Pipeline("Oven", 1, 10, 1);
  waiter = new Pipeline("Waiter", 2, 5, 1);

  /**
   * Define list of orders , can be expanded to more info about each order
   * also, this array can turn into a queue.
   */
  const ordersArray = [
    pizzaOrder(1),
    pizzaOrder(4),
    pizzaOrder(8),
    pizzaOrder(2),
    pizzaOrder(0),
  ];

  /**
   * Describes the restaurant process of serving a pizza
   * @param order
   * @param index
   * @returns
   */
  function processPizza(order, index) {
    return new Promise((resolve) => {
      doughChef
        .start(order, index)
        .then(() => toppingsChef.start(order, index))
        .then(() => oven.start(order, index))
        .then(() => waiter.start(order, index))
        .then(() => resolve());
    });
  }

  await new Promise(() => {
    const promises = ordersArray.map((order, index) =>
      processPizza(order, index)
    );
    Promise.all(promises);
  });

  //TODO save report to DB
  console.log("done");
}

main();
