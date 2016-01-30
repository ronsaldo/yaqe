interface String {
	asUnicode(): number;
}

Object.defineProperty(String.prototype, "asUnicode", {
	value: function() {
        this.assert(this.length == 1);
		return this.charCodeAt(0);
	}
});
