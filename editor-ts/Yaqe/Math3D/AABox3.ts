///<reference path='./Vector3.ts'/>

module Yaqe.Math3D {
    /**
     * 3D Axis Aligned Bounding Box
     */
    export class AABox3 {
        center: Vector3;
        halfExtent: Vector3;

        constructor(center: Vector3, halfExtent: Vector3) {
            this.center = center;
            this.halfExtent = halfExtent;
        }

        static fromMinMax(min: Vector3, max: Vector3) {
            let halfExtent = max.sub(min).mulScalar(0.5);
            let center = min.add(halfExtent);
            return new AABox3(center, halfExtent);
        }

        static fromPoints(points: Vector3[]) {
            let pin = Number.POSITIVE_INFINITY;
            let nin = Number.NEGATIVE_INFINITY;
            let min = new Vector3(pin, pin, pin);
            let max = new Vector3(nin, nin, nin);
            for(let point of points) {
                min.x = Math.min(min.x, point.x);
                min.y = Math.min(min.y, point.y);
                min.z = Math.min(min.z, point.z);
                max.x = Math.max(max.x, point.x);
                max.y = Math.max(max.y, point.y);
                max.z = Math.max(max.z, point.z);
            }

            return AABox3.fromMinMax(min, max);
        }

        static fromBoxes(boxes: AABox3[]) {
            let pin = Number.POSITIVE_INFINITY;
            let nin = Number.NEGATIVE_INFINITY;
            let min = new Vector3(pin, pin, pin);
            let max = new Vector3(nin, nin, nin);
            for(let box of boxes) {
                let bmin = box.min;
                let bmax = box.max;
                min.x = Math.min(min.x, bmin.x);
                min.y = Math.min(min.y, bmin.y);
                min.z = Math.min(min.z, bmin.z);
                max.x = Math.max(max.x, bmax.x);
                max.y = Math.max(max.y, bmax.y);
                max.z = Math.max(max.z, bmax.z);
            }

            return AABox3.fromMinMax(min, max);
        }

        get extent() {
            return this.halfExtent.mulScalar(2);
        }

        get min() {
            return this.center.sub(this.halfExtent);
        }

        get max() {
            return this.center.add(this.halfExtent);
        }

        containsPoint(point: Vector3) {
            let c = this.center;
            let he = this.halfExtent;
            return c.x - he.x <= point.x && point.x <= c.x + he.x &&
                c.y - he.y <= point.y && point.y <= c.y + he.y &&
                c.z - he.z <= point.z && point.z <= c.z + he.z;
        }

        containsBox(box: AABox3) {
            let min = this.min;
            let max = this.max;
            let omin = box.min;
            let omax = box.max;
            return min.x <= omin.x && omax.x <= max.x &&
                min.y <= omin.y && omax.y <= max.y &&
                min.z <= omin.z && omax.z <= max.z;
        }

        toString() {
            return '{center: ' + this.center.toString() + ', halfExtent: ' + this.halfExtent.toString() + '}';
        }
    }
}
