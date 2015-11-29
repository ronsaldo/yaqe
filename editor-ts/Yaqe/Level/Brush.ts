///<reference path='../Math3D/Color.ts'/>
///<reference path='../Math3D/Vector2.ts'/>
///<reference path='../Math3D/Vector3.ts'/>
///<reference path='../Math3D/Plane.ts'/>
///<reference path='./BrushFace.ts'/>

module Yaqe.Level {
    import Vector3 = Math3D.Vector3;
    import Vector2 = Math3D.Vector2;
    import Color = Math3D.Color;
	import Plane = Math3D.Plane;
	
	/**
	 * A convex brush.
	 */
	export class Brush
	{
		faces: BrushFace[];
		color: Color;
		vertices: Vector3[];
		edges: number[][];
		
		constructor(faces : Array<BrushFace>, color : Color = Color.makeRandom()) {
			this.faces = faces;
			this.color = color;
			this.edges = []
			
			for(let face of this.faces)
				face.brush = this;

			if(this.faces.length > 0)
				this.computePolygons();
		}

		clearGeometry() {
			this.vertices = []
			for(let face of this.faces)
				face.clearGeometry();
		}
				
		computePolygons() {
			this.clearGeometry();

			// Compute the intersections between the faces.
			for(let i = 0; i < this.faces.length; ++i) {
				let first = this.faces[i];
				for(let j = i + 1; j < this.faces.length; ++j) {
					let second = this.faces[j];
					if(first == second)
						continue;
						
					for(let k = j + 1; k < this.faces.length; ++k) {
						let third = this.faces[k];
						if(first == third || second == third)
							continue;

						this.intersectFaces(first, second, third)
					}
				}
			}
			
			// Sort the face vertices
			for(let face of this.faces)
				face.sortCounterClockwise();
			this.extractEdges();
		}
		
		private containsEdge(i1: number, i2: number) {
			for(let edge of this.edges) {
				if(edge[0] == i1 && edge[1] == i2)
					return true;
			}
			
			return false;
		}
		
		private extractEdges() {
			this.edges = []
			for(let face of this.faces) {
				for(let i = 0; i < face.indices.length; ++i) {
					// Get the indices of the vertices.
					let ri1 = face.indices[i];
					let ri2 = face.indices[(i + 1) % face.indices.length];
					
					// Canonicalize the edge
					let i1 = Math.min(ri1, ri2);
					let i2 = Math.max(ri1, ri2);
					if(!this.containsEdge(i1, i2))
						this.edges.push([i1, i2]);
				}
			}
		}
		
		
		private intersectFaces(first: BrushFace, second: BrushFace, third: BrushFace) {
			let intersection = first.plane.intersectionWithAndWith(second.plane, third.plane);
			if(intersection == null)
				return;
			
			// push the vertex.
			let index = this.vertices.length;
			this.vertices.push(intersection);
			
			// Add the vertex index to the faces.
			first.addIndex(index);
			second.addIndex(index);
			third.addIndex(index);
		}
	}
}
