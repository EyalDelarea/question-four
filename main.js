const { Pipeline } = require("./modules/Pipeline");
const { PizzaOrder } = require("./modules/PizzaOrder");
const { savePizzaReport, saveTotalReport }= require("./modules/DbDal");
const { createLogger } = require("winston");

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

/**
 * The process each pizza has to pass
 * @param {*} order 
 * @param {*} index 
 */
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
  const total = {
    start_time: totalStartTime,
    end_time: totalEndTime,
    total_seconds: new Date(
      Date.parse(totalEndTime) - Date.parse(totalStartTime)
    ).getSeconds(),
  };
 const {id} = await saveTotalReport(total)
  ordersArray.map(async (p)=>{
   await savePizzaReport(p,id)
  })

 
  return [ordersArray, total];
}


main()