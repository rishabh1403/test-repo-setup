export default class Snake {
  init(d, x, y, id) {
    this.direction = d;
    this.queue = [];
    this.id = id;
    this.insert(x, y);
  }

  insert(x, y) {
    this.queue.unshift({ x, y });
    [this.last] = this.queue;
  }

  remove() {
    return this.queue.pop();
  }
}