///<reference path='./View.ts'/>
///<reference path='./Selection.ts'/>
///<reference path="./CameraDragTool.ts"/>
///<reference path="../typings.d.ts" />

module Yaqe.Editor {
    import Vector2 = Math3D.Vector2;
    import Vector3 = Math3D.Vector3;
    import Matrix3 = Math3D.Matrix3;
    import Matrix4 = Math3D.Matrix4;

    export class ElementsGrabTool extends CameraRelativeDragTool {
        private selection: Selection;
        private mementos: any[];
        private pivot: Vector3;
        private depthHint_: number;

        depthHint() {
            return 3.0;//this.depthHint_;
        }

        begin(ev) {
            this.selection = this.mainView.selection.copy();
            this.mementos = this.selection.createMementos();
            this.pivot = this.mainView.currentPivot;
            this.depthHint_ = this.depthHintFor(this.view.camera, this.pivot);
        }

        end(status) {
            this.finish();
            if(!status)
            {
                this.selection.restoreFromMementos(this.mementos);
                return;
            }
        }

        update3D(deltaVector: Vector3, ev) {
            let snappedDelta = this.view.snapToGrid(deltaVector, ev.ctrlKey);
            console.log(deltaVector);
            this.selection.restoreFromMementos(this.mementos);
            for(let el of this.selection.elements)
                el.translateBy(snappedDelta);
        }
    }

}
