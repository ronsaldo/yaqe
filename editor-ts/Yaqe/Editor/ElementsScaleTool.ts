///<reference path='./View.ts'/>
///<reference path='./Selection.ts'/>
///<reference path="./CameraDragTool.ts"/>
///<reference path="../typings.d.ts" />

module Yaqe.Editor {
    import Vector2 = Math3D.Vector2;
    import Vector3 = Math3D.Vector3;
    import Matrix3 = Math3D.Matrix3;
    import Matrix4 = Math3D.Matrix4;
    import AABox3 = Math3D.AABox3;

    export class ElementsScaleTool extends WindowSpaceDragTool {
        private selection: Selection;
        private mementos: any[];
        private worldPivot: Vector3;
        private pivot: Vector2;
        private initialPosition: Vector2;
        private boundingBox: AABox3;
        private axis: Vector3;

        begin(ev) {
            this.selection = this.mainView.selection.copy();
            this.boundingBox = this.selection.boundingBox;
            this.mementos = this.selection.createMementos();
            this.worldPivot = this.mainView.currentPivot;
            this.pivot = this.view.worldToWindow(this.worldPivot);
            this.initialPosition = this.mouseStartPosition.copy();
            this.axis = this.view.camera.orientation.transformVector(new Vector3(0.0, 0.0, -1.0));
        }

        end(status) {
            this.finish();
            if(!status)
            {
                this.selection.restoreFromMementos(this.mementos);
                return;
            }
        }

        computeSnappedScale(scale: number, coarse: boolean) {
            // Snap the scale
            let gridSize = this.view.gridSizeFor(coarse);
            let extent = this.boundingBox.extent;
            let currentSize = Number.POSITIVE_INFINITY;
            if(extent.x < currentSize && this.changeDirection.x.closeTo(1))
                currentSize = extent.x;
            if(extent.y < currentSize && this.changeDirection.y.closeTo(1))
                currentSize = extent.y;
            if(extent.z < currentSize && this.changeDirection.z.closeTo(1))
                currentSize = extent.z;

            let snapSize = (scale * currentSize).roundTo(gridSize);
            return snapSize / currentSize;
        }

        computeScaleVector(scale: number) {
            return this.changeDirection.mulScalar(scale);
        }

        update(mousePosition: Vector2, ev) {
        	// Compute the scale
            let initialDist = this.initialPosition.sub(this.pivot).length();
        	let newDist = mousePosition.sub(this.pivot).length();
        	let scale = Math.max(newDist / initialDist,  0.001);

        	// Snap the scale
            scale = this.computeSnappedScale(scale, ev.ctrlKey);
        	let scaleVector = this.computeScaleVector(scale);

            // Restore the elements
        	this.selection.restoreFromMementos(this.mementos);

            // Build the transformation matrix.
            let matrix = Matrix4.translation(this.worldPivot).mul(Matrix4.scale(scaleVector).mul(Matrix4.translation(this.worldPivot.negated())))

            // Apply the scale
            for(let el of this.selection.elements)
                el.modifyVerticesNotRoundingApplying((vertex) => matrix.transformPosition(vertex))
        }

    }

}
