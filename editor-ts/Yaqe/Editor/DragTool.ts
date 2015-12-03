///<reference path='./View.ts'/>
///<reference path="../typings.d.ts" />

module Yaqe.Editor {
    import Camera = Rendering.Camera;
    import Vector3 = Math3D.Vector3;
    import Vector2 = Math3D.Vector2;
    import Rectangle = Math3D.Rectangle;
    import Matrix3 = Math3D.Matrix3;
    import Matrix4 = Math3D.Matrix4;
    import Color = Math3D.Color;

    export class DragTool {
        view: View;

        get mainView() {
            return this.view.mainView;
        }

        startOnMouseDown(mousePosition: Vector2, ev: MouseEvent) {
        }

        startOnKeyDown(mousePosition: Vector2, ev: KeyboardEvent) {
        }

        finish() {
            this.view.dragFinished();
        }

        depthHint() {
            return 3.0;
        }

        depthHintFor(camera: Camera, position: Vector3) {
            let matrix = camera.viewMatrix;
            let viewPosition = matrix.transformPosition(position);
            return -viewPosition.z;
        }

        onMouseMove(mousePosition: Vector2, ev: MouseEvent) {
        }

        onMouseDown(mousePosition: Vector2, ev: MouseEvent) {
        }

        onMouseUp(mousePosition: Vector2, ev: MouseEvent) {
        }

        onKeyDown(mousePosition: Vector2, ev: KeyboardEvent) {
        }

        onKeyUp(mousePosition: Vector2, ev: KeyboardEvent) {
        }
    }

    export class MovementDragTool extends DragTool {
        keyStarted: boolean;
        changeDirection: Vector3;
        mouseStartButton: number;
        mouseStartPosition: Vector2;

        constructor() {
            super();
            this.changeDirection = Vector3.ones();
        }

        begin(ev) {
        }

        end(status: boolean) {
            this.finish();
        }

        startOnMouseDown(mousePosition: Vector2, ev: MouseEvent) {
            this.keyStarted = false;
            this.mouseStartButton = ev.button;
            this.mouseStartPosition = mousePosition;
            this.begin(ev);
        }

        startOnKeyDown(mousePosition: Vector2, ev: KeyboardEvent) {
            this.keyStarted = true;
            this.mouseStartPosition = mousePosition;
            this.begin(ev);
        }

        changeDirectionOn(newDirection: Vector3, mousePosition: Vector2, ev) {
            this.changeDirection = newDirection;
            this.update(mousePosition.sub(this.mouseStartPosition), ev);
        }

        onKeyDown(mousePosition: Vector2, ev: KeyboardEvent) {
            let key = ev.which || ev.keyCode;

            if(ev.shiftKey) {
                switch(key)
                {
                case 'X'.asKeyCode():
                    this.changeDirectionOn(new Vector3(0, 1, 1), mousePosition, ev);
                    break;
                case 'Y'.asKeyCode():
                    this.changeDirectionOn(new Vector3(1, 0, 1), mousePosition, ev);
                    break;
                case 'Z'.asKeyCode():
                    this.changeDirectionOn(new Vector3(1, 1, 0), mousePosition, ev);
                    break;
                default:
                    // Ignore this case.
                    break;
                }
            }
            else {
                switch(key)
                {
                case 'X'.asKeyCode():
                    this.changeDirectionOn(new Vector3(1, 0, 0), mousePosition, ev);
                    break;
                case 'Y'.asKeyCode():
                    this.changeDirectionOn(new Vector3(0, 1, 0), mousePosition, ev);
                    break;
                case 'Z'.asKeyCode():
                    this.changeDirectionOn(new Vector3(0, 0, 1), mousePosition, ev);
                    break;
                default:
                    // Ignore this case.
                    break;
                }
            }
        }

        onKeyUp(mousePosition: Vector2, ev: KeyboardEvent) {
        }

        update(delta: Vector2, ev) {

        }
    }

    export class RelativePositionDragTool extends MovementDragTool {
        onMouseMove(mousePosition: Vector2, ev: MouseEvent) {
            this.update(mousePosition.sub(this.mouseStartPosition), ev);
        }

        onMouseDown(mousePosition: Vector2, ev: MouseEvent) {
            this.update(mousePosition.sub(this.mouseStartPosition), ev);
            if(this.keyStarted) {
                if(ev.button == MouseButton.Left)
                    this.end(true);
                else if(ev.button == MouseButton.Right)
                    this.end(false);
            }
        }

        onMouseUp(mousePosition: Vector2, ev: MouseEvent) {
            this.update(mousePosition.sub(this.mouseStartPosition), ev);
            if(ev.button == this.mouseStartButton)
                this.end(true);
        }
    }

    export class WindowSpaceDragTool extends MovementDragTool {
        onMouseMove(mousePosition: Vector2, ev: MouseEvent) {
            this.update(mousePosition, ev);
        }

        onMouseDown(mousePosition: Vector2, ev: MouseEvent) {
            this.update(mousePosition, ev);
            if(this.keyStarted) {
                if(ev.button == MouseButton.Left)
                    this.end(true);
                else if(ev.button == MouseButton.Right)
                    this.end(false);
            }
        }

        onMouseUp(mousePosition: Vector2, ev: MouseEvent) {
            this.update(mousePosition, ev);
            if(ev.button == this.mouseStartButton)
                this.end(true);
        }
    }
}
