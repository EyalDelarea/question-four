class PizzaOrder {
  constructor(numOfTopping) {
    this.numOfTopping = numOfTopping;
    this.startTime = null;
    this.endTime = null;
    this.totalTime = null;
  }
  setEndTime(endTime) {
    this.endTime = endTime;
    const diff = new Date(
      Date.parse(this.endTime) - Date.parse(this.startTime)
    );
    this.totalTime = diff.getSeconds();
  }
}
exports.PizzaOrder = PizzaOrder;
