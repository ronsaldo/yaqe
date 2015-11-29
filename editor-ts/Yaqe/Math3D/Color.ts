///<reference path='./Vector4.ts'/>

module Yaqe.Math3D
{
    export class Color extends Vector4 {
		static get Red() {
			return new Color(1.0, 0.0, 0.0, 1.0);
		}

		static get Green() {
			return new Color(0.0, 1.0, 0.0, 1.0);
		}

		static get Blue() {
			return new Color(0.0, 0.0, 1.0, 1.0);
		}

		static get White() {
			return new Color(1.0, 1.0, 1.0, 1.0);
		}
		
		static get Black() {
			return new Color(0.0, 0.0, 0.0, 1.0);
		}

		static get Gray() {
			return new Color(0.5, 0.5, 0.5, 1.0);
		}
		
		static get DarkGray() {
			return new Color(0.2, 0.2, 0.2, 1.0);
		}


		static makeRandom()
		{
			return Color.Green;
		}
		
		get r() {
			return this.x;
		}
		
		set r(value: number) {
			this.x = value;
		}

		get g() {
			return this.y;
		}

		set g(value: number) {
			this.y = value;
		}
		
		get b() {
			return this.z;
		}
		
		set b(value: number) {
			this.z = value;
		}
		
		get a() {
			return this.w;
		}

		set a(value: number) {
			this.w = value;
		}

	}
}
