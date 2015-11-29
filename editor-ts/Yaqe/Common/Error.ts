interface Object {
	throwError(message: string): void;
}

Object.defineProperty(Object.prototype, "throwError", {
	value: function(message: string) {
		throw new Error(message);
	}
});
