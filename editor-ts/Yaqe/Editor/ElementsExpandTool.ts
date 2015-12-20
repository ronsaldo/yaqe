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

    export class ElementsExpandTool extends WindowSpaceDragTool {
        private selection: Selection;
        private mementos: any[];
        private worldPivot: Vector3;
        private pivot: Vector2;
        private initialPosition: Vector3;
        private boundingBox: AABox3;
        private depthHint_: number;

        depthHint() {
            return this.depthHint_;
        }

        begin(ev) {
            this.selection = this.mainView.selection.copy();
            this.boundingBox = this.selection.boundingBox;
            this.mementos = this.selection.createMementos();
            this.worldPivot = this.mainView.currentPivot;
            this.pivot = this.view.worldToWindow(this.worldPivot);
            this.depthHint_ = this.depthHintFor(this.view.camera, this.worldPivot)
            this.initialPosition = this.view.windowToWorld(this.mouseStartPosition, this.depthHint());
        }

        end(status) {
            this.finish();
            if(!status)
            {
                this.selection.restoreFromMementos(this.mementos);
                return;
            }
        }

        findVectorDirection(vector: Vector3) {
            let ax = Math.abs(vector.x);
            let ay = Math.abs(vector.y);
            let az = Math.abs(vector.z);
        	let bestValue = ax;
        	let direction = new Vector3(1, 0, 0);
            if(ay > bestValue) {
                bestValue = ay;
            	direction = new Vector3(0, 1, 0);
            }
            if(az > bestValue) {
                bestValue = az;
            	direction = new Vector3(0, 0, 1);
            }

        	return direction;
        }

        computeScaleVector(scale: number, direction: Vector3) {
            return new Vector3(this.scaleFactor(scale, direction.x), this.scaleFactor(scale, direction.y), this.scaleFactor(scale, direction.z))
        }

        scaleFactor(scale: number, factor: number) {
            if(factor.closeTo(1))
                return scale;
            return 1;
        }

        computeScaleTransform(scale: number, direction: Vector3, sign: number) {
            let scaleVector = this.computeScaleVector(scale, direction);
            let oldFixPoint;
            if(sign < 0)
                oldFixPoint = this.boundingBox.max;
            else
                oldFixPoint = this.boundingBox.min;

            let newFixPoint = oldFixPoint.mulElements(scaleVector);
            let translation = oldFixPoint.sub(newFixPoint);
            return new Matrix4([
                scaleVector.x, 0, 0, translation.x,
                0, scaleVector.y, 0, translation.y,
                0, 0, scaleVector.z, translation.z,
                0, 0, 0, 1
            ]);
        }

        update(mousePosition: Vector2, ev) {
    	    let worldMousePosition = this.view.windowToWorld(mousePosition, this.depthHint());
            let deltaVector = worldMousePosition.sub(this.initialPosition);
        	let pivotDeltaVector = worldMousePosition.sub(this.worldPivot);

        	// Compute the expansion direction
            let expansionDirection = this.changeDirection;
            if(this.changeDirection.x + this.changeDirection.y + this.changeDirection.z > 1) {
                expansionDirection = this.findVectorDirection(pivotDeltaVector)
            }

            console.log(expansionDirection);
        	let changeSign = pivotDeltaVector.dot(expansionDirection).sign();

        	// Compute the amount to add/subtract
        	let sizeExtra = deltaVector.dot(expansionDirection) * changeSign;

            if(ev.ctrlKey) {
                sizeExtra = sizeExtra.roundTo(this.mainView.primaryGridSize);
            }
            else {
                sizeExtra = sizeExtra.roundTo(this.mainView.secondaryGridSize);
            }

        	// Compute the scale
        	let currentSize = this.boundingBox.extent.dot(expansionDirection);
            let newSize = Math.max((currentSize + sizeExtra), 0.001);
            let scale = newSize / currentSize;
        	let scaleTransform = this.computeScaleTransform(scale, expansionDirection, changeSign);

        	// Apply the scale
        	this.selection.restoreFromMementos(this.mementos);
            for(let element of this.selection.elements)
                element.modifyVerticesApplying(vert => scaleTransform.transformPosition(vert));
        }

    }

}
