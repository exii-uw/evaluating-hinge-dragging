class Path {
  constructor(startPos = 1) {
    this.startPos = startPos;
    this.path = [`M ${this.startPos} ${this.startPos}`];
    this.x = this.startPos;
    this.y = this.startPos;

    this.minX = this.startPos;
    this.minY = this.startPos;
    this.maxX = this.startPos;
    this.maxY = this.startPos;
  }

  move(dir, len) {
    this.x += len * Math.cos(dir);
    this.y -= len * Math.sin(dir); // recall y is inverted in svg
    this.path.push(`L ${this.x} ${this.y}`);

    this.minX = Math.min(this.minX, this.x);
    this.minY = Math.min(this.minY, this.y);
    this.maxX = Math.max(this.maxX, this.x);
    this.maxY = Math.max(this.maxY, this.y);
  }

  circle(r, x, y, opts = "0 0 0") {
    this.x += x;
    this.y -= y;
    this.path.push(`A ${r} ${r} ${opts} ${this.x} ${this.y}`);
  }

  close() {
    this.path.push("z");
  }

  dims() {
    const delta = 0.001;
    return {
      width: this.maxX - this.minX + 2 * delta,
      height: this.maxY - this.minY + 2 * delta,
      viewBox: `${this.minX + delta} ${this.minY + delta} ${
        this.maxX + delta
      } ${this.maxY + delta}`,
    };
  }

  toString() {
    return this.path.join(" ");
  }
}

export default Path;
