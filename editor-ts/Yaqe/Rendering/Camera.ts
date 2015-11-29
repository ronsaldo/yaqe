///<reference path='../Math3D/Vector3.ts'/>
///<reference path='../Math3D/Matrix3.ts'/>
///<reference path='../Math3D/Matrix4.ts'/>
///<reference path='../Math3D/Plane.ts'/>
///<reference path='./TransformableObject.ts'/>

module Yaqe.Rendering {
    import Vector3 = Math3D.Vector3;
    import Vector2 = Math3D.Vector2;
	import Matrix3 = Math3D.Matrix3;
	import Matrix4 = Math3D.Matrix4;
	import Plane = Math3D.Plane;
		
	/**
	 * A camera
	 */
	export class Camera extends TransformableObject
	{
		projectionMatrix : Matrix4;
		
		constructor(position: Vector3 = Vector3.zeros(), orientation: Matrix3 = Matrix3.identity())
		{
			super(position, orientation);
			
			this.projectionMatrix = Matrix4.orthographicProjection(-1.0, 1.0, -1.0, 1.0, -1.0, 1.0);
		}
		
		
	}
}
