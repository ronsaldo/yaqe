///<reference path='./Matrix3.ts'/>
///<reference path='./Vector3.ts'/>

module Yaqe.Math3D
{
	export class Matrix4
	{
		values : Array<number>
		
		constructor(values: Array<number>)
		{
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
			var halfAngle = fovy * Math.PI / 360.0;
			var top = near * Math.tan(halfAngle);
			var right = top * aspect;
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
	}
}