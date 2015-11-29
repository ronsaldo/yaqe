///<reference path='./Brush.ts'/>
///<reference path='../Math3D/Color.ts'/>
///<reference path='../Math3D/Vector2.ts'/>
///<reference path='../Math3D/Vector3.ts'/>
///<reference path='../Math3D/Plane.ts'/>
///<reference path='../Rendering/GeometryBuilder.ts'/>
///<reference path="../typings.d.ts" />

module Yaqe.Level {
    import Vector3 = Math3D.Vector3;
    import Vector2 = Math3D.Vector2;
    import Color = Math3D.Color;
	import Plane = Math3D.Plane;
	import GeometryBuilder = Rendering.GeometryBuilder;
	
	/**
	 * The face of a brush.
	 */
	export class BrushFace
	{
		plane : Plane;
		indices : number[];
		brush: Brush;
		center: Vector3;
		
		constructor(plane : Plane) {
			this.plane = plane;
			this.indices = []
		}
		
		clearGeometry() {
			this.indices = []
		}

		addIndex(index: number) {
			this.indices.push(index);
		}
		
		vertexAt(myIndex: number) {
			return this.brush.vertices[this.indices[myIndex]];
		}
		
		computeCenter() {
			let center = this.vertexAt(0);
			for(let i = 1; i < this.indices.length; ++i)
				center = center.add(this.vertexAt(i));
			return this.center = center.divScalar(this.indices.length);
		}
		
		getVertices() {
			return this.indices.map((index) => this.brush.vertices[index]);
		}
		
		sortCounterClockwise() {
			let center = this.computeCenter();
			let normal = this.plane.normal;
			this.indices.sort((first:number, second: number) => {
				let b = this.brush.vertices[first];
				let a = this.brush.vertices[second];
				let u = a.sub(center);
				let v = b.sub(center);
				let n = u.cross(v);
				return normal.dot(n);
			});
		}
		
		get currentColor() {
			return this.brush.currentDrawColor;
		}
		
		buildSolidModel(builder: GeometryBuilder<Rendering.StandardVertex3D>) {
			builder.beginTriangles();
			
			// Add the vertices
			let normal = this.plane.normal;
			let color = this.currentColor;
			for(let index of this.indices) {
				let position = this.brush.vertices[index];
				builder.addP3NC(position, normal, color);
			}
			
			// Add the indices.
			for(let i = 2; i < this.indices.length; ++i) {
				builder.addI123(0, i-1, i);
			}
		}
	}
}
