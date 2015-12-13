///<reference path="../Level/BrushFace.ts"/>
///<reference path="../Math3D/AABox3.ts"/>
///<reference path="../Math3D/Vector3.ts"/>

module Yaqe.Editor {
    import BrushFace = Level.BrushFace;
    import Vector3 = Math3D.Vector3;
    import AABox3 = Math3D.AABox3;

    export abstract class Selection {
        // TODO: Use a proper set
        elements: any[];

        constructor() {
            this.elements = [];
        }

        isEmpty() {
            return this.elements.length == 0;
        }

        add(element: any) {
            if(!this.contains(element))
                this.elements.push(element)
        }

        contains(element: any) {
            for(let el of this.elements) {
                if(el == element)
                    return true;
            }

            return false;
        }

        get center() {
            let center = Vector3.zeros();
            for(let element of this.elements) {
                center = center.add(element.center);
            }

            return center.divScalar(this.elements.length);
        }

        get boundingBox() {
            let boxes = this.elements.map((element) => element.boundingBox)
            return AABox3.fromBoxes(boxes)
        }

        abstract addFace(face: BrushFace);
        abstract newInstance(): Selection;

        isBrushSelection() {
            return false;
        }

        isFaceSelection() {
            return false;
        }

        clearSelectionFlag() {
            for(let element of this.elements)
                element.selected = false;
        }

        setSelectionFlag() {
            for(let element of this.elements)
                element.selected = true;
        }

        createMementos() {
            return this.elements.map(element => element.createMemento());
        }

        restoreFromMementos(mementos: any[]) {
            this.assert(mementos.length == this.elements.length);

            for(let i = 0; i < mementos.length; ++i) {
                this.elements[i].restoreFromMemento(mementos[i]);
            }
        }

        copy() {
            let instance = this.newInstance();
            instance.elements = this.elements.map(el => el);
            return instance;
        }
    }

    export class BrushSelection extends Selection {
        addFace(face: BrushFace) {
            this.add(face.brush);
        }

        isBrushSelection() {
            return true;
        }

        newInstance() {
            return new BrushSelection();
        }
    }

    export class FaceSelection extends Selection {
        addFace(face: BrushFace) {
            this.add(face);
        }

        isFaceSelection() {
            return true;
        }

        newInstance() {
            return new FaceSelection();
        }

    }
}
