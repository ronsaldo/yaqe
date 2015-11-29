///<reference path='../Common/Assert.ts'/>
///<reference path='./Matrix4.ts'/>
///<reference path='./Vector3.ts'/>

module Yaqe.Math3D
{
	export class Matrix3 implements Serialization.BinarySerializable
	{
		values : Array<number>
		
		constructor(values : Array<number>)
		{
			this.assert(values.length == 9, "Matrix3 requires 9 values");

			this.values = values;
		}
		
		static identity()
		{
			return new Matrix3([
				1.0, 0.0, 0.0,
				0.0, 1.0, 0.0,
				0.0, 0.0, 1.0
			]);
		}
		
		static ones()
		{
			return new Matrix3([
				1.0, 1.0, 1.0,
				1.0, 1.0, 1.0,
				1.0, 1.0, 1.0
			]);
		}

		static zeros()
		{
			return new Matrix3([
				0.0, 0.0, 0.0,
				0.0, 0.0, 0.0,
				0.0, 0.0, 0.0
			]);
		}
		
		static scaleUniform(scale: number)
		{
			return new Matrix3([
				scale, 0.0, 0.0,
				0.0, scale, 0.0,
				0.0, 0.0, scale
			]);
		}
		
		static xRotation(angle : number)
		{
			let c = Math.cos(angle);
			let s = Math.sin(angle);
			return new Matrix3([
				1.0, 0.0, 0.0,
				0.0, c, -s,
				0.0, s, c
			]);
		}

		static yRotation(angle : number)
		{
			let c = Math.cos(angle);
			let s = Math.sin(angle);
			return new Matrix3([
				c, 0.0, s,
				0.0, 1.0, 0.0,
				-s, 0.0, c
			]);
		}

		static zRotation(angle : number)
		{
			let c = Math.cos(angle);
			let s = Math.sin(angle);
			return new Matrix3([
				c, -s, 0.0,
				s, c, 0.0,
				0.0, 0.0, 1.0
			]);
		}
		
		static xyzRotation(xrot: number, yrot: number, zrot: number)
		{
			return Matrix3.xRotation(xrot).mul(Matrix3.yRotation(yrot).mul(Matrix3.zRotation(zrot)));
		}
		
		static zyxRotation(zrot: number, yrot: number, xrot: number)
		{
			return Matrix3.zRotation(zrot).mul(Matrix3.yRotation(yrot).mul(Matrix3.xRotation(xrot)));
		}
		
		get m11() { return this.values[0]; }
		get m12() { return this.values[1]; }
		get m13() { return this.values[2]; }

		get m21() { return this.values[3]; }
		get m22() { return this.values[4]; }
		get m23() { return this.values[5]; }

		get m31() { return this.values[6]; }
		get m32() { return this.values[7]; }
		get m33() { return this.values[8]; }

		set m11(value : number) {this.values[0] = value; }
		set m12(value : number) {this.values[1] = value; }
		set m13(value : number) {this.values[2] = value; }

		set m21(value : number) {this.values[3] = value; }
		set m22(value : number) {this.values[4] = value; }
		set m23(value : number) {this.values[5] = value; }
		
		set m31(value : number) {this.values[6] = value; }
		set m32(value : number) {this.values[7] = value; }
		set m33(value : number) {this.values[8] = value; }
		
		get firstRow()	{ return new Vector3(this.m11, this.m12, this.m13); }
		get secondRow()	{ return new Vector3(this.m21, this.m22, this.m23); }
		get thirdRow()	{ return new Vector3(this.m31, this.m32, this.m33); }

		set firstRow(v : Vector3)	{ this.m11 = v.x; this.m12 = v.y; this.m13 = v.z; }
		set secondRow(v : Vector3)	{ this.m21 = v.x; this.m22 = v.y; this.m23 = v.z; }
		set thirdRow(v : Vector3)	{ this.m31 = v.x; this.m32 = v.y; this.m33 = v.z; }
		
		get firstColumn()	{ return new Vector3(this.m11, this.m21, this.m31); }
		get secondColumn()	{ return new Vector3(this.m12, this.m22, this.m32); }
		get thirdColumn()	{ return new Vector3(this.m13, this.m23, this.m33); }

		set firstColumn(v : Vector3)	{ this.m11 = v.x; this.m21 = v.y; this.m31 = v.z; }
		set secondColumn(v : Vector3)	{ this.m12 = v.x; this.m22 = v.y; this.m32 = v.z; }
		set thirdColumn(v : Vector3)	{ this.m31 = v.x; this.m23 = v.y; this.m33 = v.z; }
		
		binaryElementMap(o : Matrix3, op : (first: number, second: number) => number ) : Matrix3
		{
			var resultData = new Array<number> (9);
			for(let i = 0; i < 9; ++i)
				resultData[i] = op(this.values[i], o.values[i]);
			return new Matrix3(resultData);
		}
		
		add(o : Matrix3)
		{
			return this.binaryElementMap(o, (a,b) => a + b);
		}
		
		sub(o : Matrix3)
		{
			return this.binaryElementMap(o, (a,b) => a - b);
		}
		
		mulElements(o : Matrix3)
		{
			return this.binaryElementMap(o, (a,b) => a * b);
		}
		
		divideElements(o : Matrix3)
		{
			return this.binaryElementMap(o, (a,b) => a / b);
		}
		
		transposed() : Matrix3
		{
			return new Matrix3([
				this.m11, this.m21, this.m31,
				this.m12, this.m22, this.m32,
				this.m13, this.m23, this.m33,
			]);
		}
		
		determinant() : number
		{
			/**
			 * Sarrus rule
			 * m11 m12 m13 | m11 m12 
			 * m21 m22 m23 | m21 m22
			 * m31 m32 m33 | m31 m32
			 */
			return this.m11*this.m22*this.m33 +
				this.m12*this.m23*this.m31 +
				this.m13*this.m21*this.m32 -
				this.m31*this.m22*this.m13 -
				this.m32*this.m23*this.m11 -
				this.m33*this.m21*this.m12;
		}
		
		static determinantOfArray(values: number[]) {
			return (new Matrix3(values)).determinant();
		}
		
		mul(o: Matrix3) : Matrix3
		{
			return new Matrix3([
				this.m11*o.m11 + this.m12*o.m21 + this.m13*o.m31,
				this.m11*o.m12 + this.m12*o.m22 + this.m13*o.m32,
				this.m11*o.m13 + this.m12*o.m23 + this.m13*o.m33,
				
				this.m21*o.m11 + this.m22*o.m21 + this.m23*o.m31,
				this.m21*o.m12 + this.m22*o.m22 + this.m23*o.m32,
				this.m21*o.m13 + this.m22*o.m23 + this.m23*o.m33,
				
				this.m31*o.m11 + this.m32*o.m21 + this.m33*o.m31,
				this.m31*o.m12 + this.m32*o.m22 + this.m33*o.m32,
				this.m31*o.m13 + this.m32*o.m23 + this.m33*o.m33
			]);
		}
		
		transformVector(v: Vector3) : Vector3
		{
			return new Vector3(
				this.m11*v.x + this.m12*v.y + this.m13*v.z,
				this.m21*v.x + this.m22*v.y + this.m23*v.z,
				this.m31*v.x + this.m32*v.y + this.m33*v.z
			);
		}
		
		transformPosition(p: Vector3) : Vector3
		{
			return this.transformVector(p);
		}
		
		transposeTransformVector(v: Vector3) : Vector3
		{
			return new Vector3(
				this.m11*v.x + this.m21*v.y + this.m31*v.z,
				this.m12*v.x + this.m22*v.y + this.m32*v.z,
				this.m13*v.x + this.m23*v.y + this.m33*v.z
			);
		}
		
		transposeTransformPosition(p: Vector3) : Vector3
		{
			return this.transposeTransformVector(p);
		}
		
		binaryWrite(output: Serialization.BinaryWriter) {
			for(let i = 0; i < 9; ++i)
				output.writeFloat32(this.values[i]);
        }

        binaryRead(input: Serialization.BinaryReader) {
			for(let i = 0; i < 9; ++i)
				this.values[i] = input.readFloat32();
        }
	}
}