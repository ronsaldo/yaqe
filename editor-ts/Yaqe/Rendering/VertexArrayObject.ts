///<reference path='./GpuBuffer.ts'/>
///<reference path='./VertexLayout.ts'/>
///<reference path='./StateTracker.ts'/>
module Yaqe.Rendering
{
	export class VertexArrayObject {
		private vertexBuffers: GpuVertexBuffer[];
		private vertexLayout: VertexLayout;
		
		constructor(vertexBuffers: GpuVertexBuffer[], vertexLayout: VertexLayout) {
			this.vertexBuffers = vertexBuffers;
			this.vertexLayout = vertexLayout;
		}
		
		activate(stateTracker: StateTracker) {
			var gl = stateTracker.gl;
			var lastBufferIndex = -1;
			stateTracker.disableVertexLocations();
			for(var i = 0; i < this.vertexLayout.attributes.length; ++i) {
				var attribute = this.vertexLayout.attributes[i];
				
				// Bind the vertex buffer
				if(attribute.buffer != lastBufferIndex) {
					var vertexBuffer = this.vertexBuffers[attribute.buffer];
					stateTracker.bindVertexBuffer(vertexBuffer);
					lastBufferIndex = attribute.buffer;
				}
				
				// Activate the vertex attribute
				stateTracker.enableVertexLocation(attribute.location);
				gl.vertexAttribPointer(attribute.location, attribute.components, attribute.glType(gl), attribute.normalized, this.vertexLayout.stride, attribute.offset);
			}
		}
	}
}
