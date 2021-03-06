﻿///<reference path='./Vector2.ts'/>
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

        copy() {
            return new Plane(this.normal.copy(), this.distance);
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

        negated() {
            return new Plane(this.normal.negated(), -this.distance);
        }

        closeTo(plane: Plane) {
            return this.normal.closeTo(plane.normal) && this.distance.closeTo(plane.distance);
        }

        intersectWithSegment(startPoint: Vector3, endPoint: Vector3) {
            let startFront = this.inFront(startPoint);
            let endFront = this.inFront(endPoint);

            // Check for the existence of the intersection.
	        if(startFront == endFront)
                return null;

	        // Compute the intersection point.
        	let dir = endPoint.sub(startPoint);
            let n = this.normal;
        	let den = dir.dot(n);
            if(den.closeTo(0))
                return null;

            let t = (this.distance - startPoint.dot(n)) / den;
        	return startPoint.add(dir.mulScalar(t))
        }

        intersectionWithAndWith(second: Plane, third: Plane) {
            let first = this;
            let n1 = first.normal;
            let n2 = second.normal;
            let n3 = third.normal;

            let d1 = first.distance;
            let d2 = second.distance;
            let d3 = third.distance;

            // Build the equation system.
            let x1 = n1.x; let y1 = n1.y; let z1= n1.z; // d1
            let x2 = n2.x; let y2 = n2.y; let z2= n2.z; // d2
            let x3 = n3.x; let y3 = n3.y; let z3= n3.z; // d3

            // Compute the denominator
            let den = Matrix3.determinantOfArray([
                x1, y1, z1,
                x2, y2, z2,
                x3, y3, z3]);
            if(den.closeTo(0))
                return null;

            let dx = Matrix3.determinantOfArray([
                d1, y1, z1,
                d2, y2, z2,
                d3, y3, z3]);

            let dy = Matrix3.determinantOfArray([
                x1, d1, z1,
                x2, d2, z2,
                x3, d3, z3]);
            let dz = Matrix3.determinantOfArray([
                x1, y1, d1,
                x2, y2, d2,
                x3, y3, d3]);
            return new Vector3(dx / den, dy / den, dz / den);
        }
    }
}
