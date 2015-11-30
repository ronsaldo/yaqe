///<reference path='../Math3D/Common.ts'/>
///<reference path='../Math3D/Vector3.ts'/>
///<reference path='../Math3D/Matrix3.ts'/>
///<reference path='../Math3D/Matrix4.ts'/>
///<reference path='../Math3D/Plane.ts'/>
///<reference path='../Math3D/Ray.ts'/>
///<reference path='./TransformableObject.ts'/>

module Yaqe.Rendering {
    import Vector3 = Math3D.Vector3;
    import Vector2 = Math3D.Vector2;
	import Matrix3 = Math3D.Matrix3;
	import Matrix4 = Math3D.Matrix4;
	import Plane = Math3D.Plane;
    import Ray = Math3D.Ray;

	/**
	 * A camera
	 */
	export class Camera extends TransformableObject
	{
		projectionMatrix : Matrix4;

        leftBottomNear: Vector3;
        rightBottomNear: Vector3;
        leftTopNear: Vector3;
        rightTopNear: Vector3;
        leftBottomFar: Vector3;
        rightBottomFar: Vector3;
        leftTopFar: Vector3;
        rightTopFar: Vector3;
        nearDistance: number;
        farDistance: number;

		constructor(position: Vector3 = Vector3.zeros(), orientation: Matrix3 = Matrix3.identity())
		{
			super(position, orientation);

            this.setOrthographicProjection(-1.0, 1.0, -1.0, 1.0, -1.0, 1.0);
		}

        setOrthographicProjection(left: number, right: number, bottom: number, top: number, near: number, far: number) {
            this.projectionMatrix = Matrix4.orthographicProjection(left, right, bottom, top, near, far);

            this.nearDistance = near;
            this.farDistance = far;

            this.leftBottomNear = new Vector3(left, bottom, near);
            this.rightBottomNear = new Vector3(right, bottom, near);
            this.leftTopNear = new Vector3(left, top, near);
            this.rightTopNear = new Vector3(right, top, near);

            this.leftBottomFar = new Vector3(left, bottom, far);
            this.rightBottomFar = new Vector3(right, bottom, far);
            this.leftTopFar = new Vector3(left, top, far);
            this.rightTopFar = new Vector3(right, top, far);
        }

        setPerspectiveProjection(fovy: number, aspect: number, near: number, far: number) {
            this.projectionMatrix = Matrix4.perspectiveProjection(fovy, aspect, near, far);

            let angle = fovy * Math.PI / 360.0;
            let tan = Math.tan(angle);
            let nearTop  = near*tan;
            let nearRight = nearTop*aspect;
            let farTop = far*tan;
            let farRight = farTop*aspect;

            this.nearDistance = near;
            this.farDistance = far;

            this.leftBottomNear = new Vector3(-nearRight, -nearTop, -near);
            this.rightBottomNear = new Vector3(nearRight, -nearTop, -near);
            this.leftTopNear = new Vector3(-nearRight, nearTop, -near);
            this.rightTopNear = new Vector3(nearRight, nearTop, -near);

            this.leftBottomFar = new Vector3(-farRight, -farTop, -far);
            this.rightBottomFar = new Vector3(farRight, -farTop, -far);
            this.leftTopFar = new Vector3(-farRight, farTop, -far);
            this.rightTopFar = new Vector3(farRight, farTop, -far);
        }

        localPointAtNearPlane(point: Vector2): Vector3 {
            let bottom = Math3D.lerp(this.leftBottomNear, this.rightBottomNear, point.x);
            let top = Math3D.lerp(this.leftTopNear, this.rightTopNear, point.x);
            return Math3D.lerp(bottom, top, point.y);
        }

        localPointAtFarPlane(point: Vector2): Vector3 {
            let bottom = Math3D.lerp(this.leftBottomFar, this.rightBottomFar, point.x);
            let top = Math3D.lerp(this.leftTopFar, this.rightTopFar, point.x);
            return Math3D.lerp(bottom, top, point.y);
        }

        localPointAtDistance(point: Vector2, distance: number): Vector3 {
            let nearPoint = this.localPointAtNearPlane(point);
            let farPoint = this.localPointAtFarPlane(point);
            let distanceFactor = (distance - this.nearDistance) / (this.farDistance - this.nearDistance);
            return Math3D.lerp(nearPoint, farPoint, distanceFactor);
        }

        localRayAtPosition(point: Vector2) {
            let origin = this.localPointAtNearPlane(point);
            let target = this.localPointAtFarPlane(point);
            let direction = target.sub(origin).normalized();
            return new Ray(origin, direction);
        }

        worldRayAtPosition(point: Vector2) {
            let modelMatrix = this.modelMatrix;
            let origin = modelMatrix.transformPosition(this.localPointAtNearPlane(point));
            let target = modelMatrix.transformPosition(this.localPointAtFarPlane(point));
            let direction = target.sub(origin).normalized();
            return new Ray(origin, direction);
        }
	}
}
