///<reference path='../Math3D/Color.ts'/>
///<reference path='../Math3D/Vector2.ts'/>
///<reference path='../Math3D/Vector3.ts'/>
///<reference path='../Math3D/Matrix3.ts'/>
///<reference path='../Math3D/Plane.ts'/>
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
	import MeshRenderable = Rendering.MeshRenderable;
	import StateTracker = Rendering.StateTracker;
	
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

		buildWireModel() {
		}
		
		buildSolidModel() {
		}

		buildTexturedModel() {
		}
		
		getWireModel() {
			if(!this.wireModelMesh)
				this.buildWireModel();
			return this.wireModelMesh;
		}
		
		getSolidModel() {
			if(!this.solidModelMesh)
				this.buildSolidModel();
			return this.solidModelMesh;
		}
		
		getTexturedModel() {
			if(!this.texturedModelMesh)
				this.buildTexturedModel();
			return this.texturedModelMesh;
		}
	}
}
