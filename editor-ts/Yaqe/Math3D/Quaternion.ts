///<reference path='../Serialization/BinarySerializable.ts'/>
///<reference path='../Serialization/BinaryReader.ts'/>
///<reference path='../Serialization/BinaryWriter.ts'/>
///<reference path="./Matrix3.ts"/>

module Yaqe.Math3D
{
    export class Quaternion implements Serialization.BinarySerializable  {
        x: number;
        y: number;
        z: number;
        w: number;

        constructor(x: number = 0.0, y: number = 0.0, z: number = 0.0, w: number = 0.0) {
            this.x = x;
            this.y = y;
            this.z = z;
			this.w = w;
        }

        static axisAngle(axis: Vector3, angle: number) {
            let halfAngle = angle * 0.5;
            let c = Math.cos(halfAngle);
            let s = Math.sin(halfAngle);
            return new Quaternion(s*axis.x, s*axis.y, s*axis.z, c);
        }

        static xRotation(angle: number) {
            let halfAngle = angle * 0.5;
            let c = Math.cos(halfAngle);
            let s = Math.sin(halfAngle);
            return new Quaternion(s, 0.0, 0.0, c);
        }

        static yRotation(angle: number) {
            let halfAngle = angle * 0.5;
            let c = Math.cos(halfAngle);
            let s = Math.sin(halfAngle);
            return new Quaternion(0.0, s, 0.0, c);
        }

        static zRotation(angle: number) {
            let halfAngle = angle * 0.5;
            let c = Math.cos(halfAngle);
            let s = Math.sin(halfAngle);
            return new Quaternion(0.0, 0.0, s, c);
        }

        get r() {
            return this.w;
        }

        set r(value: number) {
            this.w = value;
        }

        get i() {
            return this.x;
        }

        set i(value: number) {
            this.x = value;
        }

        get j() {
            return this.y;
        }

        set j(value: number) {
            this.z = value;
        }

        get k() {
            return this.z;
        }

        set k(value: number) {
            this.z = value;
        }

        add(other: Quaternion) {
            return new Quaternion(this.x + other.x, this.y + other.y, this.z + other.z, this.w + other.w);
        }

        sub(other: Quaternion) {
            return new Quaternion(this.x - other.x, this.y - other.y, this.z - other.z, this.w - other.w);
        }

        mul(other: Quaternion) {
            return new Quaternion(
                this.r*other.i + this.i*other.r + this.j*other.k - this.k*other.j,
                this.r*other.j - this.i*other.k + this.j*other.r + this.k*other.i,
                this.r*other.k + this.i*other.j - this.j*other.i + this.k*other.r,
                this.r*other.r - this.i*other.i - this.j*other.j - this.k*other.k);
        }

        mulScalar(scalar: number) {
            return new Quaternion(this.x*scalar, this.y*scalar, this.z*scalar, this.w*scalar);
        }

        divScalar(scalar: number) {
            return this.mulScalar(1.0 / scalar);
        }

        length2() {
            return this.x*this.x + this.y*this.y + this.z*this.z + this.w*this.w;
        }

        length() {
            return Math.sqrt(this.length2());
        }

        conjugated() {
            return new Quaternion(-this.x, -this.y, -this.z, this.w);
        }

        inverse() {
            return this.conjugated().divScalar(this.length());
        }

        dot(other: Quaternion) {
            return this.x*other.x + this.y*other.y + this.z*other.z + this.w*other.w;
        }

        asRotationMatrix() {
            let r = this.r;
            let i = this.i
            let j = this.j;
            let k = this.k;
            return new Matrix3([
                1 - 2*j*j - 2*k*k, 2*(i*j - k*r), 2*(i*k + j*r),
                2*(i*j + k*r), 1 - 2*i*i - 2*k*k, 2*(j*k - i*r),
                2*(i*k - j*r), 2*(j*k + i*r), 1 - 2*i*i - 2*j*j
            ]);
        }

        binaryWrite(output: Serialization.BinaryWriter) {
            output
                .writeFloat32(this.x)
                .writeFloat32(this.y)
                .writeFloat32(this.z)
                .writeFloat32(this.w);
        }

        binaryRead(input: Serialization.BinaryReader) {
            this.x = input.readFloat32();
            this.y = input.readFloat32();
            this.z = input.readFloat32();
            this.w = input.readFloat32();
        }

        closeTo(o: Quaternion) {
            return this.x.closeTo(o.x) && this.y.closeTo(o.y) && this.z.closeTo(o.z) && this.w.closeTo(o.w);
        }

        toString() {
            return '{x: ' + this.x + ', y: ' + this.y + ', z: ' + this.z + ', w: ' + this.w + '}';
        }
    }
}
