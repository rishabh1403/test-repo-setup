export default class Snake {


  init(d, x, y, id) {

    this.direction = d;
    this._queue = [];
    this.id = id;
    this.insert(x, y);
  }
  insert(x, y) {
    this._queue.unshift({ x: x, y: y });
    this.last = this._queue[0];
  }
  remove() {
    return this._queue.pop();
  }
}