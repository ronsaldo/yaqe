///<reference path='../Math3D/Color.ts'/>
///<reference path='../Math3D/Vector2.ts'/>
///<reference path='../Math3D/Vector3.ts'/>
///<reference path='../Math3D/Matrix3.ts'/>
///<reference path='../Math3D/Plane.ts'/>
///<reference path='../Math3D/Ray.ts'/>
///<reference path='./Entity.ts'/>

module Yaqe.Level {
    import Vector3 = Math3D.Vector3;
    import Vector2 = Math3D.Vector2;
    import Color = Math3D.Color;
	import Plane = Math3D.Plane;
    import Ray = Math3D.Ray;

	/**
	 * A map that contains entities.
	 */
	export class Map
	{
		entities : Entity[];

		constructor(entities : Entity[] = [])
		{
			this.entities = entities
		}

		get mapEntity() : Entity
		{
			return this.entities[0];
		}

		static createEmpty()
		{
			return new Map([new Entity("map")]);
		}

        pickFaceWithRay(ray: Ray) {
            let bestDistance = Number.POSITIVE_INFINITY;
            let bestFace = null;
            for(let entity of this.entities) {
                let distanceCandidate = entity.pickFaceWithRay(ray);
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
