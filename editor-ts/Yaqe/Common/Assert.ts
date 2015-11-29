///<reference path='./Error.ts'/>

interface Object {
	assert(condition: boolean, message?: string): void;
}

Object.defineProperty(Object.prototype, "assert", {
	value: function(condition: boolean, message?: string) {
		if(!condition) {
			if(!message)
				this.throwError("Assertion Failure")
			this.throwError("Assertion Failure: " + message)
		}
	}
});
