///<reference path="../Level/BrushFace.ts"/>

module Yaqe.Editor {
    import BrushFace = Level.BrushFace;

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

        abstract addFace(face: BrushFace);

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
    }

    export class BrushSelection extends Selection {
        addFace(face: BrushFace) {
            this.add(face.brush);
        }

        isBrushSelection() {
            return true;
        }
    }

    export class FaceSelection extends Selection {
        addFace(face: BrushFace) {
            this.add(face);
        }

        isFaceSelection() {
            return true;
        }
    }
}
