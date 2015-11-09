///<reference path='../Serialization/BinarySerializable.ts'/>
///<reference path='../Serialization/BinaryReader.ts'/>
///<reference path='../Serialization/BinaryWriter.ts'/>

module Yaqe.Math3D
{
    export class Vector4 implements Serialization.BinarySerializable  {
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

        add(other: Vector4) {
            return new Vector4(this.x + other.x, this.y + other.y, this.z + other.z, this.w + other.w);
        }

        sub(other: Vector4) {
            return new Vector4(this.x - other.x, this.y - other.y, this.z - other.z, this.w - other.w);
        }

        mul(other: Vector4) {
            return new Vector4(this.x * other.x, this.y * other.y, this.z * other.z, this.w * other.w);
        }

        div(other: Vector4) {
            return new Vector4(this.x / other.x, this.y / other.y, this.z / other.z, this.w / other.w);
        }

        mulScalar(scalar: number) {
            return new Vector4(this.x*scalar, this.y*scalar, this.z*scalar, this.w*scalar);
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

        dot(other: Vector4) {
            return this.x*other.x + this.y*other.y + this.z*other.z + this.w*other.w;
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
    }
}
