///<reference path='../Common/Assert.ts'/>
///<reference path='./Matrix3.ts'/>
///<reference path='./Vector3.ts'/>

module Yaqe.Math3D
{
	export class Matrix4
	{
		values : Array<number>

		constructor(values: Array<number>)
		{
			this.assert(values.length == 16, "Matrix4 requires 16 values");

			this.values = values;
		}

		static identity()
		{
			return new Matrix4([
				1.0, 0.0, 0.0, 0.0,
				0.0, 1.0, 0.0, 0.0,
				0.0, 0.0, 1.0, 0.0,
				0.0, 0.0, 0.0, 1.0
			]);
		}

		static ones()
		{
			return new Matrix4([
				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0
			]);
		}

		static zeros()
		{
			return new Matrix4([
				0.0, 0.0, 0.0, 0.0,
				0.0, 0.0, 0.0, 0.0,
				0.0, 0.0, 0.0, 0.0,
				0.0, 0.0, 0.0, 0.0
			]);
		}

		static fromMatrix3AndVector3(m: Matrix3, v: Vector3)
		{
			return new Matrix4([
				m.m11, m.m12, m.m13, v.x,
				m.m21, m.m22, m.m23, v.y,
				m.m31, m.m32, m.m33, v.z,
				0.0, 0.0, 0.0, 1.0
			]);
		}

        static translation(v: Vector3)
        {
            return new Matrix4([
                1.0, 0.0, 0.0, v.x,
                0.0, 1.0, 0.0, v.y,
                0.0, 0.0, 1.0, v.z,
                0.0, 0.0, 0.0, 1.0
            ]);
        }

        static scale(v: Vector3)
        {
            return new Matrix4([
                v.x, 0.0, 0.0, 0.0,
                0.0, v.y, 0.0, 0.0,
                0.0, 0.0, v.z, 0.0,
                0.0, 0.0, 0.0, 1.0
            ]);
        }

		static frustumProjection(left: number, right: number, bottom: number, top: number, near: number, far: number)
		{
			return new Matrix4([
				2*near/(right - left), 0.0, (right + left) / (right - left), 0.0,
				0.0, 2*near / (top - bottom), (top + bottom) / (top - bottom), 0.0,
				0.0, 0.0, - (far + near) / (far - near), - 2*far*near / (far - near),
				0.0, 0.0, -1.0, 0.0
			]);
		}

		static perspectiveProjection(fovy: number, aspect: number, near: number, far: number)
		{
			let halfAngle = fovy * Math.PI / 360.0;
			let top = near * Math.tan(halfAngle);
			let right = top * aspect;
			return this.frustumProjection(-right, right, -top, top, near, far);
		}

		static orthographicProjection(left: number, right: number, bottom: number, top: number, near: number, far: number)
		{
			return new Matrix4([
				2 / (right - left), 0, 0, - (right + left) / (right - left),
				0, 2 / (top - bottom), 0, - (top + bottom) / (top - bottom),
				0, 0, -2 / (far - near), - (far + near) / (far - near),
				0, 0, 0, 1
			]);
		}

		get m11() { return this.values[0]; }
		get m12() { return this.values[1]; }
		get m13() { return this.values[2]; }
		get m14() { return this.values[3]; }

		get m21() { return this.values[4]; }
		get m22() { return this.values[5]; }
		get m23() { return this.values[6]; }
		get m24() { return this.values[7]; }

		get m31() { return this.values[8]; }
		get m32() { return this.values[9]; }
		get m33() { return this.values[10]; }
		get m34() { return this.values[11]; }

		get m41() { return this.values[12]; }
		get m42() { return this.values[13]; }
		get m43() { return this.values[14]; }
		get m44() { return this.values[15]; }

		set m11(value : number) {this.values[0] = value; }
		set m12(value : number) {this.values[1] = value; }
		set m13(value : number) {this.values[2] = value; }
		set m14(value : number) {this.values[3] = value; }

		set m21(value : number) {this.values[4] = value; }
		set m22(value : number) {this.values[5] = value; }
		set m23(value : number) {this.values[6] = value; }
		set m24(value : number) {this.values[7] = value; }

		set m31(value : number) {this.values[8] = value; }
		set m32(value : number) {this.values[9] = value; }
		set m33(value : number) {this.values[10] = value; }
		set m34(value : number) {this.values[1] = value; }

		set m41(value : number) {this.values[12] = value; }
		set m42(value : number) {this.values[13] = value; }
		set m43(value : number) {this.values[14] = value; }
		set m44(value : number) {this.values[15] = value; }

		get firstRow()	{ return new Vector4(this.m11, this.m12, this.m13, this.m14); }
		get secondRow()	{ return new Vector4(this.m21, this.m22, this.m23, this.m24); }
		get thirdRow()	{ return new Vector4(this.m31, this.m32, this.m33, this.m34); }
		get fourthRow()	{ return new Vector4(this.m41, this.m42, this.m43, this.m44); }

		set firstRow(v : Vector4)	{ this.m11 = v.x; this.m12 = v.y; this.m13 = v.z; this.m14 = v.w; }
		set secondRow(v : Vector4)	{ this.m21 = v.x; this.m22 = v.y; this.m23 = v.z; this.m24 = v.w; }
		set thirdRow(v : Vector4)	{ this.m31 = v.x; this.m32 = v.y; this.m33 = v.z; this.m34 = v.w; }
		set fourthRow(v : Vector4)	{ this.m41 = v.x; this.m42 = v.y; this.m43 = v.z; this.m44 = v.w; }

		get firstColumn()	{ return new Vector4(this.m11, this.m21, this.m31, this.m41); }
		get secondColumn()	{ return new Vector4(this.m12, this.m22, this.m32, this.m42); }
		get thirdColumn()	{ return new Vector4(this.m13, this.m23, this.m33, this.m43); }
		get fourthColumn()	{ return new Vector4(this.m14, this.m24, this.m34, this.m44); }

		set firstColumn(v : Vector4)	{ this.m11 = v.x; this.m21 = v.y; this.m31 = v.z; this.m41 = v.w; }
		set secondColumn(v : Vector4)	{ this.m12 = v.x; this.m22 = v.y; this.m32 = v.z; this.m42 = v.w; }
		set thirdColumn(v : Vector4)	{ this.m13 = v.x; this.m23 = v.y; this.m33 = v.z; this.m43 = v.w; }
		set fourthColumn(v : Vector4)	{ this.m14 = v.x; this.m24 = v.y; this.m34 = v.z; this.m44 = v.w; }

		binaryElementMap(o : Matrix4, op : (first: number, second: number) => number ) : Matrix4
		{
			let resultData = new Array<number> (16);
			for(let i = 0; i < 16; ++i)
				resultData[i] = op(this.values[i], o.values[i]);
			return new Matrix4(resultData);
		}

		add(o : Matrix4)
		{
			return this.binaryElementMap(o, (a,b) => a + b);
		}

		sub(o : Matrix4)
		{
			return this.binaryElementMap(o, (a,b) => a - b);
		}

		mulElements(o : Matrix4)
		{
			return this.binaryElementMap(o, (a,b) => a * b);
		}

		divideElements(o : Matrix4)
		{
			return this.binaryElementMap(o, (a,b) => a / b);
		}

		transposed() : Matrix4
		{
			return new Matrix4([
				this.m11, this.m21, this.m31, this.m41,
				this.m12, this.m22, this.m32, this.m42,
				this.m13, this.m23, this.m33, this.m43,
				this.m14, this.m24, this.m34, this.m44
			]);
		}

		mul(o: Matrix4) : Matrix4
		{
			return new Matrix4([
				this.m11*o.m11 + this.m12*o.m21 + this.m13*o.m31 + this.m14*o.m41,
				this.m11*o.m12 + this.m12*o.m22 + this.m13*o.m32 + this.m14*o.m42,
				this.m11*o.m13 + this.m12*o.m23 + this.m13*o.m33 + this.m14*o.m43,
				this.m11*o.m14 + this.m12*o.m24 + this.m13*o.m34 + this.m14*o.m44,

				this.m21*o.m11 + this.m22*o.m21 + this.m23*o.m31 + this.m24*o.m41,
				this.m21*o.m12 + this.m22*o.m22 + this.m23*o.m32 + this.m24*o.m42,
				this.m21*o.m13 + this.m22*o.m23 + this.m23*o.m33 + this.m24*o.m43,
				this.m21*o.m14 + this.m22*o.m24 + this.m23*o.m34 + this.m24*o.m44,

				this.m31*o.m11 + this.m32*o.m21 + this.m33*o.m31 + this.m34*o.m41,
				this.m31*o.m12 + this.m32*o.m22 + this.m33*o.m32 + this.m34*o.m42,
				this.m31*o.m13 + this.m32*o.m23 + this.m33*o.m33 + this.m34*o.m43,
				this.m31*o.m14 + this.m32*o.m24 + this.m33*o.m34 + this.m34*o.m44,

				this.m41*o.m11 + this.m42*o.m21 + this.m43*o.m31 + this.m44*o.m41,
				this.m41*o.m12 + this.m42*o.m22 + this.m43*o.m32 + this.m44*o.m42,
				this.m41*o.m13 + this.m42*o.m23 + this.m43*o.m33 + this.m44*o.m43,
				this.m41*o.m14 + this.m42*o.m24 + this.m43*o.m34 + this.m44*o.m44,
			]);
		}

		transformVector(v: Vector3) : Vector3 {
			return new Vector3(
				this.m11*v.x + this.m12*v.y + this.m13*v.z,
				this.m21*v.x + this.m22*v.y + this.m23*v.z,
				this.m31*v.x + this.m32*v.y + this.m33*v.z
			);
		}

		transformPosition(p: Vector3) : Vector3 {
			return new Vector3(
				this.m11*p.x + this.m12*p.y + this.m13*p.z + this.m14,
				this.m21*p.x + this.m22*p.y + this.m23*p.z + this.m24,
				this.m31*p.x + this.m32*p.y + this.m33*p.z + this.m34
			);
		}

        transformPosition4(p: Vector4): Vector4 {
            return new Vector4(
				this.m11*p.x + this.m12*p.y + this.m13*p.z + this.m14*p.w,
				this.m21*p.x + this.m22*p.y + this.m23*p.z + this.m24*p.w,
				this.m31*p.x + this.m32*p.y + this.m33*p.z + this.m34*p.w,
                this.m41*p.x + this.m42*p.y + this.m43*p.z + this.m44*p.w
			);

        }
	}
}
