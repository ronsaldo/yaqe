interface String {
	asKeyCode(): number;
}

Object.defineProperty(String.prototype, "asKeyCode", {
	value: function() {
        this.assert(this.length == 1);
		return this.charCodeAt(0);
	}
});

module Yaqe.Editor {
    export enum MouseButton {
        Left = 0,
        Middle = 1,
        Right = 2,
    }
}
