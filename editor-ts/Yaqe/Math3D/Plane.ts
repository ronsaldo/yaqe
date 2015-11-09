///<reference path='./Vector2.ts'/>
module Yaqe.Math3D {
    /**
     * 3D plane.
     * Defined with the equation: <P,N> = d => <P,N> - d = 0
     */
    export class Plane {
        normal: Vector3;
        distance: number;

        constructor(normal: Vector3, distance: number) {
            this.normal = normal;
            this.distance = distance;
        }
        
        pointDistance(point: Vector3) {
            return this.normal.dot(point) - this.distance;
        }
        
        inFront(point: Vector3) {
            return this.pointDistance(point) > 0
        }

        isBehind(point: Vector3) {
            return this.pointDistance(point) < 0
        }
    }
}