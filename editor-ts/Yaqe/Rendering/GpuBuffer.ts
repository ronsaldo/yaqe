///<reference path='./GpuResource.ts'/>

module Yaqe.Rendering {
	export class GpuBuffer extends GpuResource {
		handle: WebGLBuffer;
		private usage: number;
		
		constructor(gl: WebGLRenderingContext) {
			super(gl);
			
			this.handle = gl.createBuffer();
			this.usage = gl.STATIC_DRAW;
		}
		
		setDynamic() {
			this.usage = this.gl.DYNAMIC_DRAW;
		}

		setStream() {
			this.usage = this.gl.STREAM_DRAW;
		}
		
		destroy() {
			this.gl.bindBuffer(this.bindTarget, null);
			this.gl.deleteBuffer(this.handle);
		}
		
		bind() {
			this.gl.bindBuffer(this.bindTarget, this.handle);
		}
		
		uploadData(buffer: ArrayBuffer) {
			this.bind();
			this.gl.bufferData(this.bindTarget, buffer, this.usage);
		}
		
		protected get bindTarget(): number {
			throw "unimplemented"
		}
	}
	
	export class GpuVertexBuffer extends GpuBuffer {
		constructor(gl: WebGLRenderingContext) {
			super(gl);
		}
		
		protected get bindTarget() {
			return this.gl.ARRAY_BUFFER;
		}
	}
	
	export class GpuIndexBuffer extends GpuBuffer {
		constructor(gl: WebGLRenderingContext) {
			super(gl);
		}

		protected get bindTarget() {
			return this.gl.ELEMENT_ARRAY_BUFFER;
		}

	}

}