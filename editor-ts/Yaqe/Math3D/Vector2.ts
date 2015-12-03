///<reference path='./Common.ts'/>
///<reference path='./Complex.ts'/>
///<reference path='./Vector3.ts'/>
///<reference path='./Vector4.ts'/>

///<reference path='../Serialization/BinarySerializable.ts'/>
///<reference path='../Serialization/BinaryReader.ts'/>
///<reference path='../Serialization/BinaryWriter.ts'/>
module Yaqe.Math3D
{
    export class Vector2 implements Serialization.BinarySerializable {
        x: number;
        y: number;

        constructor(x: number = 0.0, y: number = 0.0) {
            this.x = x;
            this.y = y;
        }

        copy() {
            return new Vector2(this.x, this.y);
        }

        static zeros() {
            return new Vector2();
        }

        static ones() {
            return new Vector2(1, 1);
        }

        asComplex() {
            return new Complex(this.x, this.y);
        }

        asVector2() {
            return this;
        }

        asVector3() {
            return new Vector3(this.x, this.y, 0.0);
        }

        asVector4() {
            return new Vector4(this.x, this.y, 0.0, 0.0);
        }

        add(other: Vector2) {
            return new Vector2(this.x + other.x, this.y + other.y);
        }

        sub(other: Vector2) {
            return new Vector2(this.x - other.x, this.y - other.y);
        }

        mulScalar(scalar: number) {
            return new Vector2(this.x*scalar, this.y*scalar);
        }

        divScalar(scalar: number) {
            return this.mulScalar(1.0 / scalar);
        }

        length2() {
            return this.x * this.x + this.y * this.y;
        }

        length() {
            return Math.sqrt(this.length2());
        }

        dot(other: Vector3) {
            return this.x*other.x + this.y*other.y;
        }

        normalized() {
            return this.divScalar(this.length());
        }

        binaryWrite(output: Serialization.BinaryWriter) {
            output
                .writeFloat32(this.x)
                .writeFloat32(this.y);
        }

        binaryRead(input: Serialization.BinaryReader) {
            this.x = input.readFloat32();
            this.y = input.readFloat32();
        }

        closeTo(o: Vector2) {
            return this.x.closeTo(o.x) && this.y.closeTo(o.y);
        }

        toString() {
            return '{x: ' + this.x + ', y: ' + this.y + '}';
        }
    }
}
