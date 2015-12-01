///<reference path='./Vector2.ts'/>
///<reference path='./Vector4.ts'/>
///<reference path='../Serialization/BinarySerializable.ts'/>
///<reference path='../Serialization/BinaryReader.ts'/>
///<reference path='../Serialization/BinaryWriter.ts'/>

module Yaqe.Math3D
{
    export class Vector3 implements Serialization.BinarySerializable {
        x: number;
        y: number;
        z: number;

        constructor(x: number = 0.0, y: number = 0.0, z: number = 0.0) {
            this.x = x;
            this.y = y;
            this.z = z;
        }

        copy() {
            return new Vector3(this.x, this.y, this.z);
        }

        static zeros()
        {
            return new Vector3(0.0, 0.0, 0.0);
        }

        static ones()
        {
            return new Vector3(1.0, 1.0, 1.0);
        }

        asVector4() {
            return new Vector4(this.x, this.y, this.z, 0.0);
        }

        negated() {
            return new Vector3(-this.x, -this.y, -this.z);
        }

        add(other: Vector3) {
            return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z);
        }

        sub(other: Vector3) {
            return new Vector3(this.x - other.x, this.y - other.y, this.z - other.z);
        }

        mulElements(other: Vector3) {
            return new Vector3(this.x*other.x, this.y*other.y, this.z*other.z);
        }

        divElements(other: Vector3) {
            return new Vector3(this.x/other.x, this.y/other.y, this.z/other.z);
        }

        mulScalar(scalar: number) {
            return new Vector3(this.x*scalar, this.y*scalar, this.z*scalar);
        }

        divScalar(scalar: number) {
            return this.mulScalar(1.0 / scalar);
        }

        length2() {
            return this.x * this.x + this.y * this.y + this.z * this.z;
        }

        length() {
            return Math.sqrt(this.length2());
        }

        normalized() {
            return this.divScalar(this.length());
        }

        dot(other: Vector3) {
            return this.x*other.x + this.y*other.y + this.z*other.z;
        }

        cross(o: Vector3) {
            return new Vector3(
                this.y*o.z - this.z*o.y,
                this.z*o.x - this.x*o.z,
                this.x*o.y - this.y*o.x);
        }

        binaryWrite(output: Serialization.BinaryWriter) {
            output
                .writeFloat32(this.x)
                .writeFloat32(this.y)
                .writeFloat32(this.z);
        }

        binaryRead(input: Serialization.BinaryReader) {
            this.x = input.readFloat32();
            this.y = input.readFloat32();
            this.z = input.readFloat32();
        }

        closeTo(o: Vector3) {
            return this.x.closeTo(o.x) && this.y.closeTo(o.y) && this.z.closeTo(o.z);
        }

        toString() {
            return '{x: ' + this.x + ', y: ' + this.y + ', z: ' + this.z + '}';
        }

        roundTo(quantum) {
            return new Vector3(this.x.roundTo(quantum), this.y.roundTo(quantum), this.z.roundTo(quantum));
        }
    }
}
