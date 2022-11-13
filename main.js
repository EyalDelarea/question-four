const { logger } = require("./logger");
const { Pipeline } = require("./Pipeline");
const { PizzaOrder } = require("./PizzaOrder");

let totalStartTime = null;
let totalEndTime = null;
const doughChef = new Pipeline("Dough Chef", 2, 1, 1);
const toppingsChef = new Pipeline("Toppings Chef", 3, 1, 2);
const oven = new Pipeline("Oven", 1, 1, 1);
const waiter = new Pipeline("Waiter", 2, 1, 1);

const ordersArray = [
  new PizzaOrder(1),
  new PizzaOrder(4),
  new PizzaOrder(8),
  new PizzaOrder(2),
  new PizzaOrder(0),
];

async function processPizza(order, index) {
  const pizzOrder = ordersArray[index];
  pizzOrder.startTime = new Date().toJSON();
  await doughChef.start(order, index);
  await toppingsChef.start(order, index);
  await oven.start(order, index);
  await waiter.start(order, index);
  pizzOrder.setEndTime(new Date().toJSON());
}

async function main() {
  const promises = ordersArray.map((order, index) =>
    processPizza(order, index)
  );
  totalStartTime = new Date().toJSON();
  await Promise.all(promises);
  totalEndTime = new Date().toJSON();
  logger.info("Thank you! Everyone has been feed. now let's see the results:");
  const total = {
    start_time: totalStartTime,
    end_time: totalEndTime,
    total_seconds: new Date(
      Date.parse(totalEndTime) - Date.parse(totalStartTime)
    ).getSeconds(),
  };
  console.log([ordersArray, total]);
  return [ordersArray, total];
}

main();
