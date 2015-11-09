///<reference path='../Math3D/Vector3.ts'/>
///<reference path='../Rendering/StateTracker.ts'/>
///<reference path='../Rendering/GeometryBuilder.ts'/>
///<reference path='../Rendering/Vertex.ts'/>
///<reference path='../Rendering/Renderable.ts'/>
///<reference path="../typings.d.ts" />

module Yaqe.Editor {
    import StateTracker = Rendering.StateTracker;
    import Vector3 = Math3D.Vector3;
    import Vector2 = Math3D.Vector2;
    import Color = Math3D.Color;
    
    export class View {
		position: Vector2;
		size: Vector2;
        stateTracker: StateTracker;
        private renderable: Rendering.Renderable;

        constructor(stateTracker) {
            // Create the rendering context.
            this.stateTracker = stateTracker;
        }
        
        render() {
            var gl = this.stateTracker.gl;

            gl.viewport(this.position.x, this.position.y, this.size.x, this.size.y);
            gl.scissor(this.position.x, this.position.y, this.size.x, this.size.y);
            gl.enable(gl.SCISSOR_TEST);
            
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            
            this.drawGrid();
        }
        
        drawGrid() {
            
        }
    }
}
