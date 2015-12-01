///<reference path='../Math3D/Vector3.ts'/>
///<reference path='../Math3D/Rectangle.ts'/>
///<reference path='../Rendering/StateTracker.ts'/>
///<reference path='../Rendering/GeometryBuilder.ts'/>
///<reference path='../Rendering/Vertex.ts'/>
///<reference path='../Rendering/Renderable.ts'/>
///<reference path='../Level/Map.ts'/>
///<reference path='./MainView.ts'/>
///<reference path='./DragTool.ts'/>
///<reference path="./HtmlEvents.ts"/>
///<reference path="../typings.d.ts" />

module Yaqe.Editor {
    import StateTracker = Rendering.StateTracker;
    import Camera = Rendering.Camera;
    import Vector3 = Math3D.Vector3;
    import Vector2 = Math3D.Vector2;
    import Rectangle = Math3D.Rectangle;
    import Matrix3 = Math3D.Matrix3;
    import Matrix4 = Math3D.Matrix4;
    import Color = Math3D.Color;

    export enum ViewRenderMode {
        Wireframe = 0,
        Solid = 1,
        LightedSolid = 2,
        Textured = 3,
        LightedTextured = 4,
    };

    export class View {
		position: Vector2;
		size: Vector2;
        stateTracker: StateTracker;
        camera: Camera;

        renderMode: ViewRenderMode;
        gridTransform: Matrix3;
        gridCameraDirection: Vector3;

        private currentDragTool: DragTool;
        private mainView_ : MainView;
        private renderable: Rendering.Renderable;
        private isOrthographic_: boolean;

        constructor(mainView : MainView, stateTracker : StateTracker) {
            // Create the rendering context.
            this.mainView_ = mainView;
            this.stateTracker = stateTracker;
            this.camera = new Camera();
            this.isOrthographic_ = true;
            this.renderMode = ViewRenderMode.Wireframe;
            this.gridTransform = Matrix3.identity();
            this.gridCameraDirection = new Vector3(1.0, 0.0, 1.0);
            this.currentDragTool = null;
        }

        get rectangle() {
            return new Rectangle(this.position, this.position.add(this.size));
        }

        get currentMap() {
            return this.mainView.currentMap;
        }

        get mainView() {
            return this.mainView_;
        }

        setTop() {
            this.camera.orientation = Matrix3.xRotation(-Math.PI/2);
            this.gridTransform = Matrix3.identity()
            this.gridCameraDirection = new Vector3(1.0, 0.0, 1.0);
            return this;
        }

        setFront() {
            this.camera.orientation = Matrix3.identity();
            this.gridTransform = Matrix3.xRotation(Math.PI / 2);
            this.gridCameraDirection = new Vector3(1.0, 1.0, 0.0);
            return this;
        }

        setSide() {
            this.camera.orientation = Matrix3.yRotation(Math.PI/2);
            this.gridTransform = Matrix3.yRotation(Math.PI/2).mul(Matrix3.xRotation(Math.PI / 2));
            this.gridCameraDirection = new Vector3(0.0, 1.0, 1.0);
            return this;
        }

        updateCameraProjection() {
            if(!this.size)
                return;

            if(this.isOrthographic) {
                this.computeOrthographicProjection();
            }
            else {
                this.computePerspectiveProjection();
            }
        }

        private computeOrthographicProjection() {
            let aspect = this.size.x / this.size.y;
            let oh = 3.0;
    		let ow = oh*aspect;
            this.camera.setOrthographicProjection(-ow, ow, -oh, oh, -1000.0, 1000.0);
        }

        private computePerspectiveProjection() {
            let aspect = this.size.x / this.size.y;
            this.camera.setPerspectiveProjection(60.0, aspect, 0.01, 100.0);
        }

        setPerspective() : View {
            this.isOrthographic_ = false;
            this.updateCameraProjection();
            return this;
        }

        setOrthographic() : View  {
            this.isOrthographic_ = true;
            this.updateCameraProjection();
            return this;
        }

        setWireMode() : View  {
            this.renderMode = ViewRenderMode.Wireframe;
            return this;
        }

        setSolidMode() : View  {
            this.renderMode = ViewRenderMode.Solid;
            return this;
        }

        setLightedSolidMode() : View  {
            this.renderMode = ViewRenderMode.LightedSolid;
            return this;
        }

        setTexturedMode() : View  {
            this.renderMode = ViewRenderMode.Textured;
            return this;
        }

        setLightedTexturedModed() : View  {
            this.renderMode = ViewRenderMode.LightedTextured;
            return this;
        }

        get isOrthographic() {
            return this.isOrthographic_;
        }

        mouseButtonDownAction(mousePosition: Vector2, ev: MouseEvent) {
            if(ev.button == MouseButton.Left)
                this.startSelectionTool(mousePosition, ev);
            else if(ev.button == MouseButton.Right)
                this.startCameraDragTool(mousePosition, ev);
        }

        captureMouse() {
            this.mainView.captureMouseOn(this);
        }

        releaseMouseCapture() {
            this.mainView.releaseMouseCapture();
        }

        private startSelectionTool(mousePosition: Vector2, ev: MouseEvent) {
            let ray = this.rayForWindowPosition(mousePosition);
            let intersection = this.currentMap.pickFaceWithRay(ray);
            let face = intersection[1];
            if(face == null) {
                this.mainView.selection = new this.mainView.selectionClass;
            }
            else {
                let selection = new this.mainView.selectionClass;
                selection.addFace(face);
                this.mainView.selection = selection;
            }
        }

        private startCameraDragTool(mousePosition: Vector2, ev: MouseEvent) {
            this.startDragOnMouse(mousePosition, ev, new CameraDragTool());
        }

        startDragOnMouse(mousePosition: Vector2, ev: MouseEvent, dragTool: DragTool) {
            this.currentDragTool = dragTool;
            this.captureMouse();
            dragTool.view = this;
            dragTool.startOnMouseDown(mousePosition, ev);
        }

        startDragOnKey(mousePosition: Vector2, ev: KeyboardEvent, dragTool: DragTool) {
            this.currentDragTool = dragTool;
            this.captureMouse();
            dragTool.view = this;
            dragTool.startOnKeyDown(mousePosition, ev);
        }

        dragFinished() {
            this.currentDragTool = null;
            this.releaseMouseCapture();
        }

        onMouseMove(mousePosition: Vector2, ev: MouseEvent) {
            if(this.currentDragTool != null)
                return this.currentDragTool.onMouseMove(mousePosition, ev);
        }

        onMouseDown(mousePosition: Vector2, ev: MouseEvent) {
            if(this.currentDragTool != null)
                return this.currentDragTool.onMouseDown(mousePosition, ev);
            this.mouseButtonDownAction(mousePosition, ev);
        }

        onMouseUp(mousePosition: Vector2, ev: MouseEvent) {
            if(this.currentDragTool != null)
                return this.currentDragTool.onMouseUp(mousePosition, ev);
        }

        onKeyDown(mousePosition: Vector2, ev: KeyboardEvent) {
            if(this.currentDragTool != null)
                return this.currentDragTool.onKeyDown(mousePosition, ev);

            let keyCode = ev.which || ev.keyCode;
            if(!ev.altKey && ev.shiftKey && !ev.ctrlKey) {
                switch(keyCode)
                {
                case 'A'.asKeyCode():
                    return this.addNewElement(mousePosition, ev);
                default:
                    // Do nothing.
                    break;
                }
            }
            else if(!ev.altKey && !ev.shiftKey && !ev.ctrlKey) {
                switch(keyCode)
                {
                case 'X'.asKeyCode():
                    return this.mainView.removeSelectedElements();
                case 'G'.asKeyCode():
                    return this.grabToolStart(mousePosition, ev);
                default:
                    // Do nothing.
                    break;
                }
            }
        }

        onKeyUp(mousePosition: Vector2, ev: KeyboardEvent) {
            if(this.currentDragTool != null)
                return this.currentDragTool.onKeyUp(mousePosition, ev);
        }

        activated() {

        }

        deactivated() {

        }

        mouseLeaved() {

        }

        mouseEntered() {
            if(!this.mainView.isMouseCaptured())
                this.mainView.changeActiveView(this);
        }

        normalizedPosition(windowPosition: Vector2) {
            return new Vector2(windowPosition.x / this.size.x,  windowPosition.y / this.size.y)
        }

        normalizedToLocal(normalizedPosition: Vector2, depth: number) {
            return this.camera.localPointAtDistance(normalizedPosition, depth);
        }

        windowToLocal(windowPosition: Vector2, depth: number) {
            return this.normalizedToLocal(this.normalizedPosition(windowPosition), depth);
        }

        rayForWindowPosition(mousePosition: Vector2) {
            return this.camera.worldRayAtPosition(this.normalizedPosition(mousePosition));
        }

        snapToGrid(vector: Vector3, primary: boolean) {
            if(primary)
                return vector.roundTo(1.0);
            return vector.roundTo(0.1);
        }

        addNewElement(mousePosition: Vector2, ev) {
        }

        grabToolStart(mousePosition: Vector2, ev) {
            this.startDragOnKey(mousePosition, ev, new ElementsGrabTool());
        }

    }
}
