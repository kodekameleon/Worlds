
export const PointType = Object.freeze({CURVED: 0, CORNER: 1});

export class Point {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
  }

  isNear(that) {
    return this.x - 5 <= that.x && this.x + 5 >= that.x && this.y - 5 <= that.y && this.y + 5 >= that.y;
  }
}
