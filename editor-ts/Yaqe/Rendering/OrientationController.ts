///<reference path='../Math3D/Vector3.ts'/>
///<reference path='../Math3D/Matrix3.ts'/>

module Yaqe.Rendering {
    import Vector3 = Math3D.Vector3;
    import Vector2 = Math3D.Vector2;
	import Matrix3 = Math3D.Matrix3;

	/**
	 * A controller for the orientation of an object.
	 */
	export abstract class OrientationController
	{
        controlled: TransformableObject;

		constructor(controlled: TransformableObject)
		{
            this.controlled = controlled;
		}

	    dragMouse(delta: Vector2) {
        }

        abstract updateOrientation() : void;
	}

    /**
	 * A controller for the orientation of an object.
	 */
	export class HeadOrientationController extends OrientationController
	{
        static AngleFactor = Math.PI/180.0;
        headAngle: Vector3;

        constructor(controlled: TransformableObject)
        {
            super(controlled);
            this.headAngle = new Vector3();
        }

	    dragMouse(delta: Vector2) {
            this.headAngle.y += delta.x*HeadOrientationController.AngleFactor;
            this.headAngle.x += delta.y*HeadOrientationController.AngleFactor;
            this.updateOrientation();
        }

        updateOrientation() : void {
            this.controlled.orientation = Matrix3.xyzRotation(-this.headAngle.x, this.headAngle.y, -this.headAngle.z).transposed();
        }
	}

    /**
	 * A controller for the orientation of an object.
	 */
	export class NullOrientationController extends OrientationController
	{
        updateOrientation() : void {
            // Do nothing
        }
	}
}
