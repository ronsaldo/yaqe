///<reference path='../Math3D/Color.ts'/>
///<reference path='../Math3D/Vector2.ts'/>
///<reference path='../Math3D/Vector3.ts'/>
///<reference path='../Math3D/Matrix3.ts'/>
///<reference path='../Math3D/Plane.ts'/>
///<reference path='./Entity.ts'/>

module Yaqe.Level {
    import Vector3 = Math3D.Vector3;
    import Vector2 = Math3D.Vector2;
    import Color = Math3D.Color;
	import Plane = Math3D.Plane;
		
	/**
	 * A map that contains entities.
	 */
	export class Map
	{
		entities : Array<Entity>;
		
		constructor(entities : Array<Entity> = [])
		{
			this.entities = entities
		}
		
		mapEntity()
		{
			return this.entities[0];
		}
		
		static createEmpty()
		{
			return new Map([new Entity("map")]);
		}
	}
}
