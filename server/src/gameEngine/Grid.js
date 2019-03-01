export default class Grid {
  init(d, c, r) {
    this.width = c;
    this.height = r;
    this.state = [];

    for (let x = 0; x < c; x += 1) {
      this.state.push([]);
      for (let y = 0; y < r; y += 1) {
        this.state[x].push(d);
      }
    }
  }

  get grid() {
    return this.state;
  }

  set grid(newState) {
    this.state = JSON.parse(JSON.stringify(newState));
  }

  set(val, x, y) {
    this.state[x][y] = val;
  }

  get(x, y) {
    return this.state[x][y];
  }
}