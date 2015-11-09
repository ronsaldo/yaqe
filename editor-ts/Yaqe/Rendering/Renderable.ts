///<reference path='./GpuBuffer.ts'/>
///<reference path='./SubMesh.ts'/>
///<reference path='./StateTracker.ts'/>
///<reference path='./VertexArrayObject.ts'/>

module Yaqe.Rendering {
	export interface Renderable {
		draw(stateTracker: StateTracker);
	}
	
	export class MeshRenderable implements Renderable {
		gl: WebGLRenderingContext;
		vertexData: VertexArrayObject;
		indexBuffer: GpuIndexBuffer;
		submeshes: SubMesh[];
		
		constructor(vertexData: VertexArrayObject, indexBuffer: GpuIndexBuffer, submeshes: SubMesh[]) {
			this.gl = indexBuffer.gl;
			this.vertexData = vertexData;
			this.indexBuffer = indexBuffer;
			this.submeshes = submeshes;
		}
		
		draw(stateTracker: StateTracker) {
			this.vertexData.activate(stateTracker);
			stateTracker.bindIndexBuffer(this.indexBuffer);
			
			for(var i = 0; i < this.submeshes.length; ++i)
				this.submeshes[i].draw(this.gl);
		}
	}
}
