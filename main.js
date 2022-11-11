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


class pizzaOrder{
  constructor(numOfTopping){
    this.numOfTopping = numOfTopping
    this.startTime = null
    this.endTime = null
    this.totalTime = null
  }
  calcTotalTime(){
    const diff = new Date(Date.parse(this.endTime) - Date.parse(this.startTime))
    this.totalTime = diff.getSeconds()
  }
}


async function main() {
  //Init restaurant workers
  doughChef = new Pipeline("Dough Chef", 2, 1, 1);
  toppingsChef = new Pipeline("Toppings Chef", 3, 1, 2);
  oven = new Pipeline("Oven", 1, 1, 1);
  waiter = new Pipeline("Waiter", 2, 1, 1);
  var totalStartTime = null;
  var totalEndTime = null;

  /**
   * Define list of orders , can be expanded to more info about each order
   * also, this array can turn into a queue.
   */
  const ordersArray = [
    new pizzaOrder(1),
    new pizzaOrder(4),
    new pizzaOrder(8),
    new pizzaOrder(2),
    new pizzaOrder(0),
  ];

  /**
   * Describes the restaurant process of serving a pizza
   * @param order
   * @param index
   * @returns
   */
  function processPizza(order, index) {
    return new Promise((resolve) => {
      ordersArray[index].startTime = new Date().toJSON();
      doughChef
        .start(order, index)
        .then(() => toppingsChef.start(order, index))
        .then(() => oven.start(order, index))
        .then(() => waiter.start(order, index))
        .then(() => {
          ordersArray[index].endTime = new Date().toJSON();
        })
        .then(() => resolve());
    });
  }

  await new Promise(() => {
    const promises = ordersArray.map((order, index) =>
      processPizza(order, index)
    );
    totalStartTime = new Date().toJSON();
    Promise.all(promises).then(() => {
      totalEndTime = new Date().toJSON();
      logger.info("Thank you! Everyone has been feed. now let's see the results:")
      ordersArray.map(a=>a.calcTotalTime())
      ordersArray['total'] = {
        "start_time":totalStartTime,
        "end_time":totalEndTime,
        "total_seconds" : new Date(Date.parse(totalEndTime)-Date.parse(totalStartTime)).getSeconds()
      }
      console.log(ordersArray);
    });
  });
}

main();
