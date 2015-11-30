///<reference path='./View.ts'/>
///<reference path="./MapRenderer.ts" />
///<reference path="./Selection.ts"/>
///<reference path='../Math3D/Vector3.ts'/>
///<reference path='../Rendering/StateTracker.ts'/>
///<reference path='../Rendering/GeometryBuilder.ts'/>
///<reference path='../Rendering/Vertex.ts'/>
///<reference path='../Rendering/Renderable.ts'/>
///<reference path="../Rendering/GpuProgram.ts" />
///<reference path="../Level/Map.ts" />
///<reference path="../Level/Brush.ts" />
///<reference path="../typings.d.ts" />

module Yaqe.Editor {
    import StateTracker = Rendering.StateTracker;
    import Vector3 = Math3D.Vector3;
    import Vector2 = Math3D.Vector2;
    import Color = Math3D.Color;
    import Map = Level.Map;
    import Brush = Level.Brush;

    export class MainView {
        canvas: HTMLCanvasElement;
        gl: WebGLRenderingContext;
        stateTracker: StateTracker;
        currentMap : Map;
        selectionClass: any;
        private selection_: Selection;
        private activeView: View;
        private mouseView: View;
        private menuView: View;
        private mouseCaptureView: View;
        private views: View[];
        private renderable: Rendering.Renderable;
        private mapRenderer: MapRenderer;
        private lastMousePosition: Vector2;

        constructor(canvas: HTMLCanvasElement) {
            // Create an empty map.
            this.currentMap = Map.createEmpty();
            this.currentMap.mapEntity.addBrush(Brush.createPrism(new Vector3(1.0, 1.0, 1.0))),

            // Create the rendering context.
            this.canvas = canvas;
            this.registerCanvasEvents();

            this.gl = <WebGLRenderingContext>canvas.getContext("webgl");
            if (!this.gl)
                this.gl = <WebGLRenderingContext>canvas.getContext("experimental-webgl");
            this.initializeExtensions();

            // Create the state tracker.
            this.stateTracker = new StateTracker(this.gl);
            this.lastMousePosition = new Vector2(-1, -1);
            this.selection_ = new BrushSelection();
            this.selectionClass = BrushSelection;

            // Load the shader
            this.loadShaders(() => {

                // Create the views
                this.createViews();

                // Create the map renderer.
                this.mapRenderer = new MapRenderer(this.stateTracker)
            });
        }

        mainLoopIteration(currentTime : number) {
            this.updateTime(currentTime);
            this.render();
        }

        initializeExtensions() {
            this.enableRequiredExtension("OES_element_index_uint")
        }

        enableRequiredExtension(extensionName: string) {
            var enabled = this.gl.getExtension(extensionName);
            if(!enabled)
                throw "Unsupported required extension "
        }

        createViews() {
            this.views = [new View(this, this.stateTracker), new View(this, this.stateTracker), new View(this, this.stateTracker), new View(this, this.stateTracker)]

            // Top view
            this.views[0]
                .setTop()
                .setOrthographic()
                .setWireMode();

            // Perspective
            this.views[1]
                .setPerspective()
                .setLightedSolidMode();
            this.views[1].camera.position = new Vector3(0.0, 0.5, 3.0);

            // Front view
            this.views[2]
                .setFront()
                .setOrthographic()
                .setWireMode();

            // Side view
            this.views[3]
                .setSide()
                .setOrthographic()
                .setWireMode();

            this.updateCanvasSize();
        }

        checkCanvasSize() {
            var parentWidth = this.canvas.parentElement.clientWidth;
            var parentHeight = this.canvas.parentElement.clientHeight;

            if(this.canvas.width == parentWidth &&
                this.canvas.height == parentHeight)
                return;

            this.updateCanvasSize();
        }

        updateTime(currentTime : number) {

        }

        updateCanvasSize() {
            var parentWidth = this.canvas.parentElement.clientWidth;
            var parentHeight = this.canvas.parentElement.clientHeight;
            this.canvas.width = parentWidth;
            this.canvas.height = parentHeight;
            this.updateViewLayout();
        }

        updateViewLayout() {
            var width = this.canvas.width;
            var height = this.canvas.height;
            var gapSize = 4;

            var viewWidth = Math.floor(width / 2 - gapSize / 2);
            var viewHeight = Math.floor(height / 2 - gapSize / 2);
            var viewSize = new Vector2(viewWidth, viewHeight);

            var topLeft = this.views[0];
            var topRight = this.views[1];
            var bottomLeft = this.views[2];
            var bottomRight = this.views[3];

            bottomLeft.size = viewSize;
            bottomLeft.position = new Vector2(0.0, 0.0);

            bottomRight.size = viewSize;
            bottomRight.position = new Vector2(viewWidth + gapSize, 0.0);

            topLeft.size = viewSize;
            topLeft.position = new Vector2(0.0, viewHeight + gapSize);

            topRight.size = viewSize;
            topRight.position = new Vector2(viewWidth + gapSize, viewHeight + gapSize);
        }

        loadShaders(continuation: () => void ) {
            var remote = require('remote')
            var app = <GitHubElectron.App>remote.require('app')
            var shaderBasePath = app.getAppPath() + "/assets/shaders/";
            var fs = require("fs");
            var shaderDescriptions = JSON.parse(fs.readFileSync(shaderBasePath + "shaders.json", "utf8"))
            for(var shaderName in shaderDescriptions) {
                var shaderDesc = shaderDescriptions[shaderName]

                var vertexFileName = shaderDesc["vertex"];
                var fragmentFileName = shaderDesc["fragment"];

                var vertexSource = fs.readFileSync(shaderBasePath + vertexFileName, "utf8")
                var fragmentSource = fs.readFileSync(shaderBasePath + fragmentFileName, "utf8")

                var attributes = shaderDesc["attributes"]
                var uniforms = shaderDesc["uniforms"]

                this.createShader(shaderName, vertexFileName, vertexSource, fragmentFileName, fragmentSource, attributes, uniforms)
            }


            continuation()
        }

        createShader(name: string, vertexFileName: string, vertexSource: string, fragmentFileName: string, fragmentSource: string, attributes: Object[], uniforms: Object[]) {
            var gl = this.gl;
            var vertexShader = this.compileShader(name, vertexFileName, vertexSource, gl.VERTEX_SHADER);
            var fragmentShader = this.compileShader(name, fragmentFileName, fragmentSource, gl.FRAGMENT_SHADER);

            var program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);

            for(var i = 0; i < attributes.length; ++i) {
                var attribute = attributes[i];
                var varName = attribute["variable"]
                var bindingName = attribute["binding"]
                var bindingLocation = this.stateTracker.getAttributeBindingLocation(bindingName);
                gl.bindAttribLocation(program, bindingLocation, varName);
            }

            gl.linkProgram(program);
            var status = gl.getProgramParameter(program, gl.LINK_STATUS);
            var message = "Program linking of " + name + ":\n" + gl.getProgramInfoLog(program) + '\n';
            process.stdout.write(message);
            if(!status)
                throw message;

            this.stateTracker.addProgram(name, new Rendering.GpuProgram(gl, program, uniforms))
        }

        compileShader(name: string, filename:string, source: string, type: number) {
            var gl = this.gl;
            var shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            var status = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
            var message = "Shader compilation of '" + filename + "':\n" + gl.getShaderInfoLog(shader) + '\n';
            process.stdout.write(message)
            if(!status) {
                 throw message
            }

            return shader;
        }

        render() {
            this.checkCanvasSize();
            this.stateTracker.screenWidth = this.canvas.width;
            this.stateTracker.screenHeight = this.canvas.height;
            this.mapRenderer.renderViews(this.views);
        }

        getViewAtPosition(position: Vector2) {
            for(let view of this.views) {
                if(view.rectangle.containsPoint(position))
                    return view;
            }

            return null;
        }

        getViewAtPositionOrCapture(position: Vector2) {
            if(this.mouseCaptureView != null)
                return this.mouseCaptureView;
            return this.getViewAtPosition(position);
        }

        captureMouseOn(view: View) {
            this.mouseCaptureView = view;
        }

        releaseMouseCapture() {
            this.mouseCaptureView = null;
        }

        isMouseCaptured() {
            return this.mouseCaptureView != null;
        }

        changeActiveView(view: View) {
            if(this.activeView == view)
                return;

            if(this.activeView != null)
                this.activeView.deactivated();
            this.activeView = view;
            if(this.activeView != null)
                this.activeView.activated();
        }

        changeMouseView(view: View) {
            if(this.mouseView == view)
                return;

            if(this.mouseView != null)
                this.mouseView.mouseLeaved();
            this.mouseView = view;
            if(this.mouseView != null)
                this.mouseView.mouseEntered();
        }

        changeMenuView(view: View) {
            this.menuView = view;
        }

        get selection() {
            return this.selection_;
        }

        set selection(newSelection: Selection) {
            if(this.selection_ != null)
                this.selection_.clearSelectionFlag();

            this.selection_ = newSelection;

            if(this.selection_ != null)
                this.selection_.setSelectionFlag();
        }

        private registerCanvasEvents() {
            let canvas =  this.canvas;
            canvas.addEventListener("keydown", (ev) => this.onKeyDown(ev));
            canvas.addEventListener("keyup", (ev) => this.onKeyUp(ev));
            canvas.addEventListener("mousedown", (ev) => this.onMouseDown(ev));
            canvas.addEventListener("mouseup", (ev) => this.onMouseUp(ev));
            canvas.addEventListener("mousemove", (ev) => this.onMouseMove(ev));
        }

        private onMouseMove(ev: MouseEvent) {
            let position = new Vector2(ev.offsetX, this.stateTracker.screenHeight - ev.offsetY);
            this.lastMousePosition = position.copy();
            let view = this.getViewAtPositionOrCapture(position);
            if(view != null)
            {
                this.changeMouseView(view);
                view.onMouseMove(position.sub(view.position), ev);
            }
            else
            {
                this.changeMouseView(null);
            }
        }

        private onMouseDown(ev: MouseEvent) {
            let position = new Vector2(ev.offsetX, this.stateTracker.screenHeight - ev.offsetY);
            this.lastMousePosition = position.copy();
            let view = this.getViewAtPositionOrCapture(position);
            if(view != null)
            {
                this.changeActiveView(view);
                this.changeMouseView(view);
                this.changeMenuView(view);
                view.onMouseDown(position.sub(view.position), ev);
            }
            else
            {
                this.changeActiveView(null);
                this.changeMouseView(null);
                this.changeMenuView(null);
            }

        }

        private onMouseUp(ev: MouseEvent) {
            let position = new Vector2(ev.offsetX, this.stateTracker.screenHeight - ev.offsetY);
            this.lastMousePosition = position.copy();
            let view = this.getViewAtPositionOrCapture(position);
            if(view != null)
            {
                this.changeActiveView(view);
                this.changeMouseView(view);
                this.changeMenuView(view);
                view.onMouseUp(position.sub(view.position), ev);
            }
            else
            {
                this.changeActiveView(null);
                this.changeMouseView(null);
                this.changeMenuView(null);
            }
        }

        private onKeyDown(ev: KeyboardEvent) {
            if(this.activeView != null)
                this.activeView.onKeyDown(this.lastMousePosition, ev);
        }

        private onKeyUp(ev: KeyboardEvent) {
            if(this.activeView != null)
                this.activeView.onKeyUp(this.lastMousePosition, ev);
        }
    }
}
