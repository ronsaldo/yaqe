///<reference path='./GpuResource.ts'/>

module Yaqe.Rendering {
	export class GpuProgram extends GpuResource {
		program: WebGLProgram;
		uniformBindings: Object;
		
		constructor(gl: WebGLRenderingContext, program: WebGLProgram, uniforms: Object[]) {
			super(gl);
			
			this.program = program;
			var uniformBindings = {}
			this.uniformBindings = uniformBindings;
			
			uniforms.forEach((uniformBinding: Object) => {
				var varName = uniformBinding["variable"]
				var binding = uniformBinding["binding"]
				var location = gl.getUniformLocation(program, varName);
				uniformBindings[binding] = location;
			});
		}
		
		use() {
			this.gl.useProgram(this.program);
		}
	}
}