///<reference path='../Math3D/Color.ts'/>
///<reference path='../Math3D/Vector2.ts'/>
///<reference path='../Math3D/Vector3.ts'/>
///<reference path='../Math3D/Matrix3.ts'/>
///<reference path='../Math3D/Plane.ts'/>
///<reference path='../Rendering/Vertex.ts'/>
///<reference path='../Rendering/GeometryBuilder.ts'/>
///<reference path='../Rendering/Renderable.ts'/>
///<reference path='../Rendering/StateTracker.ts'/>
///<reference path='./Brush.ts'/>

module Yaqe.Level {
    import Vector3 = Math3D.Vector3;
    import Vector2 = Math3D.Vector2;
    import Color = Math3D.Color;
	import Plane = Math3D.Plane;
	import Matrix3 = Math3D.Matrix3;
	import GeometryBuilder = Rendering.GeometryBuilder;
	import StateTracker = Rendering.StateTracker;
	import MeshRenderable = Rendering.MeshRenderable;
	
	/**
	 * An entity in the level.
	 */
	export class Entity
	{
		className : string;
		position : Vector3;
		orientation : Matrix3;
		brushes : Array<Brush>;
		color : Color;
		private wireModelMesh: MeshRenderable;
		private solidModelMesh: MeshRenderable;
		private texturedModelMesh: MeshRenderable;
		
		constructor(className : string, position : Vector3 = Vector3.zeros(), orientation : Matrix3 = Matrix3.identity(), brushes : Array<Brush> = [], color : Color = Color.makeRandom())
		{
			this.className = className;
			this.brushes = brushes
			this.position = position;
			this.orientation = orientation;
			this.color = color;
		}
		
		addBrush(brush: Brush) {
			this.brushes.push(brush);
			this.invalidateGeometry();
		}
		
		invalidateGeometry() {
			this.wireModelMesh = null;
			this.solidModelMesh = null;
			this.texturedModelMesh = null;
		}

		private buildWireModel(stateTracker: StateTracker) {
			let builder = new GeometryBuilder<Rendering.StandardVertex3D> (Rendering.StandardVertex3D);
			for(let brush of this.brushes) {
				brush.buildWireModel(builder);
			}
			
			this.wireModelMesh = builder.createMeshRenderable(stateTracker.gl);
		}
		
		private buildSolidModel(stateTracker: StateTracker) {
			let builder = new GeometryBuilder<Rendering.StandardVertex3D> (Rendering.StandardVertex3D);
			for(let brush of this.brushes) {
				brush.buildSolidModel(builder);
			}
			
			this.solidModelMesh = builder.createMeshRenderable(stateTracker.gl);
		}

		private buildTexturedModel(stateTracker: StateTracker) {
		}
		
		getWireModel(stateTracker: StateTracker) {
			if(!this.wireModelMesh)
				this.buildWireModel(stateTracker);
			return this.wireModelMesh;
		}
		
		getSolidModel(stateTracker: StateTracker) {
			if(!this.solidModelMesh)
				this.buildSolidModel(stateTracker);
			return this.solidModelMesh;
		}
		
		getTexturedModel(stateTracker: StateTracker) {
			if(!this.texturedModelMesh)
				this.buildTexturedModel(stateTracker);
			return this.texturedModelMesh;
		}
	}
}
