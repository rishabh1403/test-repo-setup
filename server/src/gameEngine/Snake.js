export default class Snake {
  init(d, x, y, id, color) {
    this.direction = d;
    this.queue = [];
    this.id = id;
    this.color = color;
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