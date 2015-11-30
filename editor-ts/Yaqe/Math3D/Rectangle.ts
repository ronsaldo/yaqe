///<reference path='./Common.ts'/>
///<reference path='./Vector2.ts'/>
///<reference path='./Vector4.ts'/>

module Yaqe.Math3D
{
    export class Rectangle{
        min: Vector2;
        max: Vector2;

        constructor(min: Vector2, max: Vector2) {
            this.min = min;
            this.max = max;
        }

        containsPoint(point: Vector2) {
            return this.min.x <= point.x && point.x <= this.max.x &&
                   this.min.y <= point.y && point.y <= this.max.y;
        }

        containsRectangle(rect: Rectangle) {
            return this.min.x <= rect.min.x && rect.max.x <= this.max.x &&
                   this.min.y <= rect.min.y && rect.max.y <= this.max.y;
        }

        closeTo(o: Rectangle) {
            return this.min.closeTo(o.min) && this.max.closeTo(o.max);
        }
    }
}
