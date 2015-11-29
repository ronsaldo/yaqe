///<reference path='../Math3D/Vector3.ts'/>
///<reference path='../Rendering/StateTracker.ts'/>
///<reference path='../Rendering/GeometryBuilder.ts'/>
///<reference path='../Rendering/Vertex.ts'/>
///<reference path='../Rendering/Renderable.ts'/>
///<reference path='../Level/Map.ts'/>
///<reference path='./MainView.ts'/>
///<reference path="../typings.d.ts" />

module Yaqe.Editor {
    import StateTracker = Rendering.StateTracker;
    import Camera = Rendering.Camera;
    import Vector3 = Math3D.Vector3;
    import Vector2 = Math3D.Vector2;
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
        
        private mainView : MainView;
        private renderable: Rendering.Renderable;
        private isOrthographic_: boolean;
        private rendern
        
        constructor(mainView : MainView, stateTracker : StateTracker) {
            // Create the rendering context.
            this.mainView = mainView;
            this.stateTracker = stateTracker;
            this.camera = new Camera();
            this.camera.position = new Vector3(0.0, 0.5, 2.0);
            this.isOrthographic_ = true;
            this.renderMode = ViewRenderMode.Wireframe;
        }

        get currentMap() {
            return this.mainView.currentMap;
        }   
        
        setTop() {
            return this;
        }
        
        setFront() {
            return this;
        }
        
        setSide() {
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
            this.camera.projectionMatrix = Matrix4.orthographicProjection(-ow, ow, -oh, oh, -1000.0, 1000.0);
        }
        
        private computePerspectiveProjection() {
            let aspect = this.size.x / this.size.y;
            this.camera.projectionMatrix = Matrix4.perspectiveProjection(60.0, aspect, 0.01, 100.0);
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
    }
}
