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
        private selected_: boolean;

		constructor(plane : Plane) {
			this.plane = plane;
			this.indices = [];
            this.selected_ = false;
		}

        copy() {
            let copy = new BrushFace(this.plane.copy());
            copy.indices = this.indices.slice();
            copy.selected_ = this.selected;
            copy.brush = this.brush;
            return copy;
        }

        isEntity() {
            return false;
        }

        isBrush() {
            return false;
        }

        isBrushFace() {
            return true;
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

        getEdges() {
			let edges = [];
            let N = this.indices.length;
            for(let i = 0; i < this.indices.length; ++i) {
                edges.push([i, (i + 1) % N])
            }
            return edges;
		}

        sideOfPlane(plane: Plane) {
            let front = false;
            let back = false;
            let vertices = this.getVertices();
            for(let vertex of vertices) {
                if(plane.inFront(vertex))
                    front = true;
                else
                    back = true;
            }

            if(front && back)
                return 0;
            else if(front)
                return 1;
            else
                return -1;
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
            if(this.selected)
                return Color.Red;
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

        invalidateModels() {
            this.brush.invalidateModels();
        }

        get entity() {
            return this.brush.entity;
        }

        get parent() {
            return this.brush;
        }

        get selected() {
            return this.selected_;
        }

        set selected(selected: boolean) {
            if(this.selected_ != selected)
                this.invalidateModels();
            this.selected_ = selected;
        }

        rebuildPlane() {
            let v1 = this.vertexAt(0);
            let v2 = this.vertexAt(1);
            let v3 = this.vertexAt(2);
            let u = v2.sub(v1);
            let v = v3.sub(v2);
            let n = u.cross(v).normalized();
            let d = n.dot(v1);
            this.plane = new Plane(n, d);
        }
	}
}
