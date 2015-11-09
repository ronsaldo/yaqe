///<reference path='./GpuBuffer.ts'/>
///<reference path='./GpuProgram.ts'/>

module Yaqe.Rendering {

	export class StateTracker {
		static MaxVertexLocations = 16;
		static AttributeBindings = {
			"Position" : 0,
			"Normal" : 1,
			"Texcoord" : 2,
			"Color" : 3
		}
		
		gl: WebGLRenderingContext;
		private enabledVertexLocations: boolean[];
		private programs: Object;
		private currentProgram: GpuProgram;
		
		constructor(gl: WebGLRenderingContext) {
			this.gl = gl;
			this.enabledVertexLocations = new Array(StateTracker.MaxVertexLocations);
			this.programs = {}
			this.currentProgram = null;
			for(var i = 0; i < StateTracker.MaxVertexLocations; ++i)
				this.enabledVertexLocations[i] = false;
		}
		
		bindIndexBuffer(indexBuffer: GpuIndexBuffer) {
			indexBuffer.bind();
		}
		
		bindVertexBuffer(vertexBuffer: GpuVertexBuffer) {
			vertexBuffer.bind();
		}
		
		enableVertexLocation(location: number) {
			if(!this.enabledVertexLocations[location]) {
				this.gl.enableVertexAttribArray(location);
				this.enabledVertexLocations[location] = true;
			}
		}
		
		disableVertexLocations() {
			for(var i = 0; i < StateTracker.MaxVertexLocations; ++i) {
				if(this.enabledVertexLocations[i])
				{
					this.gl.disableVertexAttribArray(i);
					this.enabledVertexLocations[i] = false;
				}
			}
		}
		
		getAttributeBindingLocation(bindingName: string) {
			return StateTracker.AttributeBindings[bindingName];
		}
		
		addProgram(name: string, program: GpuProgram) {
			this.programs[name] = program;
		}
		
		useProgram(name: string) {
			var program = this.programs[name];
			if(this.currentProgram == program)
				return;
				
			this.currentProgram = program;
			this.currentProgram.use();
		}
	}
}
