
module Yaqe.Rendering {
	export class GpuResource {
		gl: WebGLRenderingContext;
		
		constructor(gl: WebGLRenderingContext) {
			this.gl = gl;
		}
	}
}