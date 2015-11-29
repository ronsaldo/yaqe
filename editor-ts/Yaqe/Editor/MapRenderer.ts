///<reference path='../Math3D/Color.ts'/>
///<reference path='../Math3D/Vector2.ts'/>
///<reference path='../Math3D/Vector3.ts'/>
///<reference path='../Math3D/Matrix3.ts'/>
///<reference path='../Math3D/Plane.ts'/>
///<reference path='../Rendering/GeometryBuilder.ts'/>
///<reference path='../Rendering/StateTracker.ts'/>
///<reference path='./View.ts'/>

module Yaqe.Editor {
    import Vector3 = Math3D.Vector3;
    import Vector2 = Math3D.Vector2;
    import Matrix3 = Math3D.Matrix3;
    import Matrix4 = Math3D.Matrix4;
    import Color = Math3D.Color;
	import Plane = Math3D.Plane;
    import Renderable = Rendering.Renderable;
    import GeometryBuilder = Rendering.GeometryBuilder;
	import StateTracker = Rendering.StateTracker;
	
	/**
	 * A map that contains entities.
	 */
	export class MapRenderer
	{
		stateTracker: StateTracker;
		
        gridSize: number;
        
        private primaryGrid: Renderable;
        private secondaryGrid: Renderable;
        
        
		constructor(stateTracker: StateTracker)
		{
			this.stateTracker = stateTracker;
            this.createSpecialMeshes();
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
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            gl.depthFunc(gl.LEQUAL);
            gl.lineWidth(2.0);
            
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
            
            this.drawGrid(view);
            this.drawMap(view);
		}
        
        private createSpecialMeshes() {
            this.createGrid();
        }
        
        private createGeometryBuilder() {
            return new GeometryBuilder<Rendering.StandardVertex3D> (Rendering.StandardVertex3D);
        }
        
        private createGrid() {
            this.gridSize = 1.0;
            
            let gl = this.stateTracker.gl;
            this.primaryGrid = this.createGeometryBuilder()
                .setColor(Color.Gray)
                .add3DLineGrid(20, 20, 21)
                .createMeshRenderable(gl);
            this.secondaryGrid = this.createGeometryBuilder()
                .setColor(Color.DarkGray)
                .add3DLineGrid(20, 20, 201)
                .createMeshRenderable(gl);
        }
        
        gridTranslationModule(position: number) {
            let mod = position - Math.floor(position / this.gridSize) * this.gridSize;
            return position - mod;
        }
        
        drawGrid(view: View) {
            let gl = this.stateTracker.gl;

            // Compute the grid transform.
            let gridDirection = view.gridCameraDirection;
            let gridModule = this.gridSize;
            let gridMovement = view.camera.position.mulElements(gridDirection);
            let gridPosition = new Vector3(this.gridTranslationModule(gridMovement.x), this.gridTranslationModule(gridMovement.y), this.gridTranslationModule(gridMovement.z));
            let gridTransform = Matrix4.fromMatrix3AndVector3(view.gridTransform.mul(Matrix3.scaleUniform(this.gridSize)), gridPosition)

            // Set the camera
            this.stateTracker.useCamera(view.camera);
            this.stateTracker.modelMatrix = gridTransform;

            // Use the solid color shader.            
            this.stateTracker.useProgram("Color3D");
            
            // Draw the secondary grid.
            this.secondaryGrid.draw(this.stateTracker);
            
            // Draw the primary grid.
            this.primaryGrid.draw(this.stateTracker);
        }
        
        private drawMap(view: View) {
            let map = view.currentMap;
            if(!map)
                return;
                
            // Set the camera
            this.stateTracker.useCamera(view.camera);
            this.stateTracker.modelMatrix = Matrix4.identity();
            
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
