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
    import Color = Math3D.Color;
    
    export class View {
		position: Vector2;
		size: Vector2;
        stateTracker: StateTracker;
        camera: Camera;
        
        private mainView : MainView;
        private renderable: Rendering.Renderable;
        
        constructor(mainView : MainView, stateTracker : StateTracker) {
            // Create the rendering context.
            this.mainView = mainView;
            this.stateTracker = stateTracker;
            this.camera = new Camera();
            this.camera.position = new Vector3(0.0, 1.5, 2.0);
        }

        get currentMap() {
            return this.mainView.currentMap;
        }   
              
        render() {
            var gl = this.stateTracker.gl;

            gl.viewport(this.position.x, this.position.y, this.size.x, this.size.y);
            gl.scissor(this.position.x, this.position.y, this.size.x, this.size.y);
            gl.enable(gl.SCISSOR_TEST);
            
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            
            this.stateTracker.useCamera(this.camera);
            
            this.drawGrid();
            this.drawMap();
        }
        
        drawGrid() {
            
        }
        
        drawMap()
        {
            var map = this.currentMap;
            if(!map)
                return;
        }
        
        setTop()
        {
            return this;
        }
        
        setFront()
        {
            return this;
        }
        
        setSide()
        {
            return this;
        }
        
        setPerspective()
        {
            return this;
        }
        
        setOrthographic()
        {
            return this;
        }
    }
}
