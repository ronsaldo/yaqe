///<reference path='../Math3D/Color.ts'/>
///<reference path='../Math3D/Vector2.ts'/>
///<reference path='../Math3D/Vector3.ts'/>
///<reference path='../Math3D/Plane.ts'/>
///<reference path="../Math3D/AABox3.ts"/>
///<reference path='../Rendering/GeometryBuilder.ts'/>
///<reference path='../Rendering/StateTracker.ts'/>
///<reference path='./BrushFace.ts'/>
///<reference path='./Entity.ts'/>
///<reference path="../typings.d.ts" />

module Yaqe.Level {
    import Vector3 = Math3D.Vector3;
    import Vector2 = Math3D.Vector2;
    import AABox3 = Math3D.AABox3;
    import Color = Math3D.Color;
	import Plane = Math3D.Plane;
    import Ray = Math3D.Ray;
	import GeometryBuilder = Rendering.GeometryBuilder;
	import StateTracker = Rendering.StateTracker;

	/**
	 * A convex brush.
	 */
	export class Brush
	{
		faces: BrushFace[];
		color: Color;
		vertices: Vector3[];
		edges: number[][];
        entity: Entity;
        isRounding: boolean;
        private selected_: boolean;
        private center_: Vector3;
        private boundingBox_: AABox3;

		constructor(faces : Array<BrushFace>, color : Color = Color.makeRandom(), isRounding: boolean = true) {
			this.faces = faces;
			this.color = color;
			this.edges = []
            this.selected_ = false;
            this.isRounding = isRounding;

			for(let face of this.faces)
				face.brush = this;

			if(this.faces.length > 0)
				this.computePolygons();
		}

        isEntity() {
            return false;
        }

        isBrush() {
            return true;
        }

        isBrushFace() {
            return false;
        }

		static createPrism(extent: Vector3) {
			let hw = extent.x / 2.0;
			let hh = extent.y / 2.0;
			let hd = extent.z / 2.0;

			return new Brush([
				new BrushFace(new Plane(new Vector3(-1, 0, 0), hw)),
				new BrushFace(new Plane(new Vector3(1, 0, 0), hw)),
				new BrushFace(new Plane(new Vector3(0, -1, 0), hh)),
				new BrushFace(new Plane(new Vector3(0, 1, 0), hh)),
				new BrushFace(new Plane(new Vector3(0, 0, -1), hd)),
				new BrushFace(new Plane(new Vector3(0, 0, 1), hd)),
			]);
		}

        createMemento() {
            return {
                faces: this.faces.map(face => face.copy()),
                isRounding: this.isRounding
            };
        }

        rebuildPlanes() {
            for(let face of this.faces)
                face.rebuildPlane();
        }

        restoreFromMemento(memento) {
            this.isRounding = memento.isRounding;
            this.faces = memento.faces.map(face => face.copy())
            this.computePolygons();
        }

        get parent() {
            return this.entity;
        }

        get selected() {
            return this.selected_;
        }

        set selected(selected: boolean) {
            if(this.selected_ != selected)
                this.invalidateModels();
            this.selected_ = selected;
        }

		clearGeometry() {
			this.vertices = [];
            this.invalidateModels();
			for(let face of this.faces)
				face.clearGeometry();
		}

        invalidateModels() {
            if(this.entity != null)
                this.entity.invalidateModels();
        }

        get center() {
            return this.center_;
        }

        get boundingBox() {
            return this.boundingBox_;
        }

        computeCenter() {
            let center = Vector3.zeros();
            for(let vertex of this.vertices)
                center = center.add(vertex),
            this.center_ = center.divScalar(this.vertices.length);
        }

        computeBoundingBox() {
            this.boundingBox_ = AABox3.fromPoints(this.vertices);
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
            this.computeBoundingBox();
            this.computeCenter();
		}

        modifyVerticesApplying(transform: (Vector3) => Vector3) {
            for(let i = 0;i < this.vertices.length; ++i) {
                let newVertex = transform(this.vertices[i]);
                this.vertices[i] = this.roundPosition(newVertex);
            }

            this.rebuildPlanes();
            if(this.isRounding)
                this.computePolygons();
            this.invalidateModels();
        }

        modifyVerticesNotRoundingApplying(transform: (Vector3) => Vector3) {
            this.isRounding = false;
            this.modifyVerticesApplying(transform)
        }

        translateBy(delta: Vector3) {
            this.modifyVerticesApplying(vertex => vertex.add(delta));
        }

        private get vertexQuantum() {
            return 0.001;
        }

        private roundPosition(position: Vector3) {
            if(this.isRounding)
                return position.roundTo(this.vertexQuantum);
            return position;
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

		get currentDrawColor() {
            if(this.selected)
                return Color.Red;
			return this.color;
		}

		buildWireModel(builder: GeometryBuilder<Rendering.StandardVertex3D>) {
			builder.beginLines();
			let color = this.currentDrawColor;
			for(let vertex of this.vertices) {
				builder.addP3C(vertex, color);
			}

			for(let edge of this.edges) {
				builder.addI12(edge[0], edge[1]);
			}
		}

		buildSolidModel(builder: GeometryBuilder<Rendering.StandardVertex3D>) {
			for(let face of this.faces)
				face.buildSolidModel(builder);
		}

        pickFaceWithRay(ray: Ray) {
            let bestDistance = Number.POSITIVE_INFINITY;
            let bestFace = null;
            for(let face of this.faces) {
                let distance = ray.intersectionDistanceForPlane(face.plane);
                if(distance != null && distance < bestDistance) {
                    let point = ray.pointAtDistance(distance);
                    if(point != null && this.isPointBehindOtherFaces(point, face)) {
                        bestDistance = distance;
                        bestFace = face;
                    }
                }
            }

            return [bestDistance, bestFace];
        }

        isPointBehindOtherFaces(point: Vector3, face: BrushFace) {
            for(let otherFace of this.faces) {
                if(otherFace != face && otherFace.plane.inFront(point)) {
                    return false;
                }
            }

            return true;
        }

        containsPointInside(point: Vector3) {
            for(let face of this.faces) {
                if(!face.plane.isBehind(point))
                    return false;
            }

            return true;
        }

        containsPoint(point: Vector3) {
            for(let face of this.faces) {
                if(face.plane.inFront(point))
                    return false;
            }

            return true;
        }

        intersectsWithEdgeProperly(start: Vector3, end: Vector3) {
            if(start.closeTo(end))
                return this.containsPointInside(start);
            if(this.containsPointInside(start) || this.containsPointInside(end))
                return true;

            for(let face of this.faces) {
                let intersection = face.plane.intersectWithSegment(start, end);
                let inside = true;
                if(intersection != null) {
                    if(this.isPointBehindOtherFaces(intersection, face))
                        return true;
                }
            }

            return false;
        }

        intersectsWithBrushProperly(brush: Brush) {
            // Make sure we don't share a face.
            for(let myface of this.faces) {
                let plane = myface.plane.negated();
                for(let face of brush.faces) {
                    if(face.plane.closeTo(plane))
                        return false;
                }
            }

            return this.intersectsWithBrushProperlyInternal(brush) || brush.intersectsWithBrushProperlyInternal(this);
        }

        intersectsWithFaceProperly(testFace: BrushFace) {
            let reversedPlane = testFace.plane.negated();
            for(let myFace of this.faces) {
                if(myFace.plane.closeTo(testFace.plane) || myFace.plane.closeTo(reversedPlane))
                    return false;
            }

            for(let vertex of testFace.getVertices()) {
                if(this.containsPointInside(vertex))
                    return true;
            }

            for(let edge of testFace.getEdges()) {
                let first = testFace.vertexAt(edge[0]);
                let second = testFace.vertexAt(edge[1]);
                if(this.intersectsWithEdgeProperly(first, second))
                    return true;
            }

            return false;
        }

        private intersectsWithBrushProperlyInternal(brush: Brush) {
            for(let vertex of this.vertices) {
                if(brush.containsPointInside(vertex))
                    return true;
            }

            for(let edge of this.edges) {
                let first = this.vertices[edge[0]];
                let second = this.vertices[edge[1]];
                if(brush.intersectsWithEdgeProperly(first, second))
                    return true;
            }

            return false;
        }

        intersectsWithPlane(plane: Plane) {
            let front = false;
            let back = false;
            for(let vertex of this.vertices) {
                if(plane.inFront(vertex))
                    front = true;
                else
                    back = true;
                if(front && back)
                    return true;
            }

            return false;
        }

        containsBrush(brush: Brush)  {
            for(let vertex of brush.vertices) {
                if(!this.containsPoint(vertex))
                    return false;
            }
            return true;
        }

        subtractBrush(brush: Brush) {
            let result = []
            this.subtractBrushInto(brush, result);
            return result;
        }

        subtractBrushInto(brush: Brush, result: Brush[]) {
            if(brush.containsBrush(this))
                return;

            let remaining : Brush = this;
            let newRounding = this.isRounding && brush.isRounding;
            for(let face of brush.faces) {
                if(this.intersectsWithFaceProperly(face)) {
                    let clipResult = remaining.clipWithPlane(face.plane, newRounding);
                    if(clipResult != null) {
                        result.push(clipResult[1])
                        remaining = clipResult[0]
                    }
                }
            }

        	// Check if nothing was subtracted.
            if(result.length == 0)
                result.push(this)
        }

        clipWithPlane(plane: Plane, rounding: boolean = false) {
            let negatedPlane = plane.negated();
            for(let face of this.faces) {
                if(face.plane.closeTo(plane) || face.plane.closeTo(negatedPlane))
                    return null;
            }

            if(!this.intersectsWithPlane(plane))
                return null;

            let frontFaces = []
            let backFaces = []
            for(let face of this.faces) {
                let side = face.sideOfPlane(plane);
                console.log(side);
                if(side == 0) {
                    frontFaces.push(face.copy());
                    backFaces.push(face.copy());
                }
                else if(side < 0) {
                    backFaces.push(face.copy());
                }
                else {
                    frontFaces.push(face.copy());
                }
            }

            this.assert(frontFaces.length != 0)
            this.assert(backFaces.length != 0)
            backFaces.push(new BrushFace(plane));
            frontFaces.push(new BrushFace(negatedPlane));

            let backBrush = new Brush(backFaces, Color.makeRandom(), rounding);
            let frontBrush = new Brush(frontFaces, Color.makeRandom(), rounding);
            return [ backBrush , frontBrush ]
        }
	}
}
