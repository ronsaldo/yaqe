///<reference path='./Vector3.ts'/>
///<reference path='./Plane.ts'/>
module Yaqe.Math3D {
    /**
     * 3D ray.
     * Defined with the equation: P = origin + t*direction
     */
    export class Ray {
        origin: Vector3;
        direction: Vector3;

        constructor(origin: Vector3, direction: Vector3) {
            this.origin = origin;
            this.direction = direction;
        }

        pointAtDistance(distance: number) {
            if(distance == null || distance < 0)
                return null;
            return this.origin.add(this.direction.mulScalar(distance));
        }

        intersectionDistanceForPlane(plane: Plane) {
            let normal = plane.normal;
            let det = this.direction.dot(normal);
            if(det.closeTo(0))
                return null;

            return (plane.distance - normal.dot(this.origin)) / det;
        }

        intersectWithPlane(plane: Plane) {
            return this.pointAtDistance(this.intersectionDistanceForPlane(plane));
        }

        toString() {
            return '{origin: ' + this.origin.toString() + ', direction: ' + this.direction.toString() + '}';
        }
    }
}
