///<reference path='./View.ts'/>
/// <reference path="./DragTool.ts"/>
///<reference path="../typings.d.ts" />

module Yaqe.Editor {
    import Vector2 = Math3D.Vector2;
    import Vector3 = Math3D.Vector3;
    import Matrix3 = Math3D.Matrix3;
    import Matrix4 = Math3D.Matrix4;

    export class CameraRelativeDragTool extends RelativePositionDragTool {
        update(rawDeltaVector: Vector2, ev) {
            let depthHint = this.depthHint();
            let deltaVector = this.view.windowToLocal(rawDeltaVector, depthHint).sub(this.view.windowToLocal(Vector2.zeros(), depthHint));

            let xDirection = new Vector3(1, 0, 0);
            let yDirection;
            if(ev.ctrlKey) {
                yDirection = new Vector3(0, 0, -1);
            }
            else {
                yDirection = new Vector3(0, 1, 0);
            }

            let orientation = this.view.camera.orientation;
            let worldXDirection = orientation.transformVector(xDirection);
            let worldYDirection = orientation.transformVector(yDirection);

            let delta3D = worldXDirection.mulScalar(deltaVector.x).add(worldYDirection.mulScalar(deltaVector.y));
            this.update3D(delta3D, ev);
        }

        update3D(deltaVector: Vector3, ev) {

        }
    }

    export class CameraDragTool extends CameraRelativeDragTool {
        initialPosition: Vector3;
        begin(ev) {
            this.initialPosition = this.view.camera.position.copy();
        }

        update3D(deltaVector: Vector3, ev) {
            this.view.camera.position = this.initialPosition.add(deltaVector);
        }
    }
}
