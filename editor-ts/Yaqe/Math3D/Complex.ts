///<reference path='./Common.ts'/>
///<reference path='./Vector3.ts'/>
///<reference path='./Vector4.ts'/>

///<reference path='../Serialization/BinarySerializable.ts'/>
///<reference path='../Serialization/BinaryReader.ts'/>
///<reference path='../Serialization/BinaryWriter.ts'/>
module Yaqe.Math3D
{
    export class Complex implements Serialization.BinarySerializable {
        x: number;
        y: number;

        constructor(x: number = 0.0, y: number = 0.0) {
            this.x = x;
            this.y = y;
        }

        get r() {
            return this.x;
        }

        set r(value: number) {
            this.x = value;
        }

        get i() {
            return this.y;
        }

        set i(value: number) {
            this.y = value;
        }

        get argument() {
            return Math.atan2(this.y, this.x);
        }

        copy() {
            return new Complex(this.x, this.y);
        }

        static zeros() {
            return new Complex();
        }

        static ones() {
            return new Complex(1, 1);
        }

        static polar(radius: number, angle: number) {
            return new Complex(radius*Math.cos(angle), radius*Math.sin(angle));
        }

        asComplex() {
            return this;
        }

        asVector2() {
            return new Vector2(this.x, this.y);
        }

        asVector3() {
            return new Vector3(this.x, this.y, 0.0);
        }

        asVector4() {
            return new Vector4(this.x, this.y, 0.0, 0.0);
        }

        add(other: Complex) {
            return new Complex(this.x + other.x, this.y + other.y);
        }

        sub(other: Complex) {
            return new Complex(this.x - other.x, this.y - other.y);
        }

        mulScalar(scalar: number) {
            return new Complex(this.x*scalar, this.y*scalar);
        }

        divScalar(scalar: number) {
            return this.mulScalar(1.0 / scalar);
        }

        mul(other: Complex) {
            return new Complex(this.x*other.x - this.y*other.y, this.x*other.y + this.y*other.x);
        }

        div(other: Complex) {
            return this.mul(other.inverse());
        }

        conjugated() {
            return new Complex(this.x, -this.y);
        }

        inverse() {
            let l2 = this.length2();
            return new Complex(this.x / l2, -this.y / l2);
        }

        length2() {
            return this.x * this.x + this.y * this.y;
        }

        length() {
            return Math.sqrt(this.length2());
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

        closeTo(o: Complex) {
            return this.x.closeTo(o.x) && this.y.closeTo(o.y);
        }

        toString() {
            return this.x + ' + ' + this.y + 'i';
        }
    }
}
