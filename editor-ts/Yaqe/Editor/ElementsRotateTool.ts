///<reference path='./View.ts'/>
///<reference path='./Selection.ts'/>
///<reference path="./CameraDragTool.ts"/>
///<reference path="../Math3D/Quaternion.ts"/>
///<reference path="../typings.d.ts" />

module Yaqe.Editor {
    import Vector2 = Math3D.Vector2;
    import Vector3 = Math3D.Vector3;
    import Matrix3 = Math3D.Matrix3;
    import Matrix4 = Math3D.Matrix4;
    import Quaternion = Math3D.Quaternion;

    export class ElementsRotateTool extends WindowSpaceDragTool {
        private selection: Selection;
        private mementos: any[];
        private pivot: Vector2;
        private initialPosition: Vector2;
        private axis: Vector3;


        begin(ev) {
            this.selection = this.mainView.selection.copy();
            this.mementos = this.selection.createMementos();
            this.pivot = this.view.worldToWindow(this.mainView.currentPivot);
            this.initialPosition = this.mouseStartPosition.copy();
            this.axis = this.view.camera.orientation.transformVector(new Vector3(0.0, 0.0, 1.0));
        }

        end(status) {
            this.finish();
            if(!status)
            {
                this.selection.restoreFromMementos(this.mementos);
                return;
            }
        }

        update(mousePosition: Vector2, ev) {
            // Restore the elements
        	this.selection.restoreFromMementos(this.mementos);

        	// Check for actual rotation
            if(this.changeDirection.dot(this.axis).closeTo(0))
                return

            // Compute the rotation angle.
            let u = this.initialPosition.sub(this.pivot).asComplex();
            let v = mousePosition.sub(this.pivot).asComplex();
            let angle = v.div(u).argument.radiansToDegrees().roundTo(1.0);

            let quat = Quaternion.axisAngle(this.axis, angle.degreesToRadians());
            let rotationMatrix = quat.asRotationMatrix();
            let matrix = rotationMatrix;
            for(let el of this.selection.elements)
                el.modifyVerticesNotRoundingApplying((vertex) => matrix.transformPosition(vertex))
        }

    }

}
