interface Number {
	closeTo(o: number): boolean;
}

module Yaqe.Math3D {
	export var EPSILON = 0.000000001;

	Object.defineProperty(Number.prototype, "closeTo", {
		value: function(o: number) {
			let dif = this - o;
			return -EPSILON <= dif && dif <= EPSILON;
		}
	});

	export function lerp(start, end, factor: number) {
		return start.mulScalar((1.0 - factor)).add(end.mulScalar(factor));
	}
}
