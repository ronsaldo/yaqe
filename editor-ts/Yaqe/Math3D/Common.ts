interface Number {
	closeTo(o: number): boolean;
    roundTo(quantum: number): number;
    sign(): number;

    degreesToRadians(): number;
    radiansToDegrees(): number;
}

module Yaqe.Math3D {
	export var EPSILON = 0.000000001;

	Object.defineProperty(Number.prototype, "closeTo", {
		value: function(o: number) {
			let dif = this - o;
			return -EPSILON <= dif && dif <= EPSILON;
		}
	});

    Object.defineProperty(Number.prototype, "roundTo", {
		value: function(quantum: number) {
			return Math.round(this/quantum) * quantum;
		}
	});

    Object.defineProperty(Number.prototype, "degreesToRadians", {
		value: function() {
			return this * Math.PI / 180.0;
		}
	});

    Object.defineProperty(Number.prototype, "radiansToDegrees", {
		value: function() {
			return this * 180.0 / Math.PI;
		}
	});

    Object.defineProperty(Number.prototype, "sign", {
		value: function() {
            if(this < 0)
                return -1;
            else
                return 1;
		}
	});

	export function lerp(start, end, factor: number) {
		return start.mulScalar((1.0 - factor)).add(end.mulScalar(factor));
	}
}
