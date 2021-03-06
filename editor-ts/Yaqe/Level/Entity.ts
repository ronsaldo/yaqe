///<reference path='../Math3D/AABox3.ts'/>
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
    import AABox3 = Math3D.AABox3;
    import Vector3 = Math3D.Vector3;
    import Vector2 = Math3D.Vector2;
    import Color = Math3D.Color;
	import Plane = Math3D.Plane;
	import Matrix3 = Math3D.Matrix3;
    import Ray = Math3D.Ray;
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
        private selected_: boolean;

		constructor(className : string, position : Vector3 = Vector3.zeros(), orientation : Matrix3 = Matrix3.identity(), brushes : Array<Brush> = [], color : Color = Color.makeRandom())
		{
			this.className = className;
			this.brushes = brushes
			this.position = position;
			this.orientation = orientation;
			this.color = color;
            this.selected_ = false;

            for(let brush of brushes)
                brush.entity = this;
		}

        isEntity() {
            return true;
        }

        isBrush() {
            return false;
        }

        isBrushFace() {
            return false;
        }

		addBrush(brush: Brush) {
            brush.entity = this;
			this.brushes.push(brush);
			this.invalidateModels();
		}

        addBrushes(brushes: Brush[]) {
            this.brushes = this.brushes.concat(brushes);
            for(let brush of brushes)
                brush.entity = this;
            this.invalidateModels();
        }

		invalidateModels() {
			this.wireModelMesh = null;
			this.solidModelMesh = null;
			this.texturedModelMesh = null;
		}

        findBrushesIntersectingBoxInto(box: AABox3, destination: Brush[]) {
            for(let brush of this.brushes) {
                if(brush.boundingBox.intersectsWithBox(box))
                    destination.push(brush);
            }
        }

        removeBrush(element: Brush) {
            let index = this.brushes.indexOf(element);
            if(index >= 0) {
                this.brushes.splice(index, 1);
                this.invalidateModels();
            }
        }

        removeElement(element) {
            if(element.isBrush())
                this.removeBrush(element);
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

        pickFaceWithRay(ray: Ray) {
            let bestDistance = Number.POSITIVE_INFINITY;
            let bestFace = null;
            for(let brush of this.brushes) {
                let distanceCandidate = brush.pickFaceWithRay(ray);
                let distance = distanceCandidate[0];
                let candidate = distanceCandidate[1];
                if(distance < bestDistance && candidate != null) {
                    bestDistance = distance;
                    bestFace = candidate;
                }
            }

            return [bestDistance, bestFace];
        }
	}
}
