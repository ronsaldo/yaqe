///<reference path='../Math3D/Vector3.ts'/>
///<reference path='../Math3D/Matrix3.ts'/>
///<reference path='../Math3D/Matrix4.ts'/>
///<reference path='../Math3D/Plane.ts'/>

module Yaqe.Rendering {
    import Vector3 = Math3D.Vector3;
    import Vector2 = Math3D.Vector2;
	import Matrix3 = Math3D.Matrix3;
	import Matrix4 = Math3D.Matrix4;
	import Plane = Math3D.Plane;

	/**
	 * An object that contains a position and an orientation in the space.
	 */
	export class TransformableObject
	{
		position: Vector3;
		orientation: Matrix3;
        orientationController: OrientationController;

		constructor(position: Vector3 = Vector3.zeros(), orientation: Matrix3 = Matrix3.identity())
		{
			this.position = position;
			this.orientation = orientation;
            this.orientationController = new NullOrientationController(this);
		}

		/**
		 * Gets the model matrix for this object.
		 */
		get modelMatrix()
		{
			return Matrix4.fromMatrix3AndVector3(this.orientation, this.position);
		}

		/**
		 * Gets the view matrix for this object.
		 */
		get viewMatrix()
		{
			var inverseRotation = this.orientation.transposed();
			var inverseTranslation = inverseRotation.transformVector(this.position.negated());
			return Matrix4.fromMatrix3AndVector3(inverseRotation, inverseTranslation);
		}
	}
}
