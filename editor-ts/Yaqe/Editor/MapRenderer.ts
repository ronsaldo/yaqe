///<reference path='../Math3D/Color.ts'/>
///<reference path='../Math3D/Vector2.ts'/>
///<reference path='../Math3D/Vector3.ts'/>
///<reference path='../Math3D/Matrix3.ts'/>
///<reference path='../Math3D/Plane.ts'/>
///<reference path='../Rendering/StateTracker.ts'/>
///<reference path='./View.ts'/>

module Yaqe.Editor {
    import Vector3 = Math3D.Vector3;
    import Vector2 = Math3D.Vector2;
    import Color = Math3D.Color;
	import Plane = Math3D.Plane;
	import StateTracker = Rendering.StateTracker;
	
	/**
	 * A map that contains entities.
	 */
	export class MapRenderer
	{
		stateTracker: StateTracker;
		
		constructor(stateTracker: StateTracker)
		{
			this.stateTracker = stateTracker;
		}

		renderViews(views: View[]) {
			let gl = this.stateTracker.gl;
			let screenWidth = this.stateTracker.screenWidth;
			let screenHeight = this.stateTracker.screenHeight;

            gl.viewport(0, 0, screenWidth, screenHeight);
            gl.scissor(0, 0, screenWidth, screenHeight);
            gl.enable(gl.SCISSOR_TEST);
            
            gl.clearColor(0.8, 0.8, 0.8, 1);
            gl.clearDepth(1.0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);
            
			for(let view of views)
				this.renderView(view);
		}
		
		renderView(view: View) {
            let gl = this.stateTracker.gl;
			view.updateCameraProjection();
			
            gl.viewport(view.position.x, view.position.y, view.size.x, view.size.y);
            gl.scissor(view.position.x, view.position.y, view.size.x, view.size.y);
            gl.enable(gl.SCISSOR_TEST);
            
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            
            view.updateCameraProjection();
            
            this.drawGrid();
            this.drawMap(view);

		}
        
        drawGrid() {
            
        }
        
        private drawMap(view: View) {
            let map = view.currentMap;
            if(!map)
                return;
                
            // Set the camera
            this.stateTracker.useCamera(view.camera);
            
            // Draw the wire models.
            switch(view.renderMode)
            {
            case ViewRenderMode.Wireframe:
                this.stateTracker.useProgram("Color3D");
                this.drawWire(view);
                break;
            case ViewRenderMode.Solid:
                this.stateTracker.useProgram("Color3D");
                this.drawSolid(view);
                break;
            case ViewRenderMode.Textured:
                this.stateTracker.useProgram("Color3D");
                this.drawTextured(view);
                break;
            default:
                break;
            }
        }
        
        private drawWire(view: View) {
            let map = view.currentMap;
            for(let entity of map.entities) {
                let model = entity.getWireModel(this.stateTracker);
                if(model) {
                    model.draw(this.stateTracker);
                }
            }
        }
		
        private drawSolid(view: View) {
            let map = view.currentMap;
            for(let entity of map.entities) {
                let model = entity.getSolidModel(this.stateTracker);
                if(model) {
                    model.draw(this.stateTracker);
                }
            }
        }
		
        private drawTextured(view: View) {
            let map = view.currentMap;
            for(let entity of map.entities) {
                let model = entity.getTexturedModel(this.stateTracker);
                if(model) {
                    model.draw(this.stateTracker);
                }
            }
        }
	}
}
