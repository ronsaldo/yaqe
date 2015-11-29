///<reference path='../Math3D/Matrix4.ts'/>
///<reference path='./GpuBuffer.ts'/>
///<reference path='./GpuProgram.ts'/>
///<reference path='./Camera.ts'/>

module Yaqe.Rendering {
	import Matrix4 = Math3D.Matrix4;
	
	export class StateTracker {
		static MaxVertexLocations = 16;
		static AttributeBindings = {
			"Position" : 0,
			"Normal" : 1,
			"Texcoord" : 2,
			"Color" : 3
		}
		
		gl: WebGLRenderingContext;
		screenWidth: number;
		screenHeight: number;
		
		private enabledVertexLocations: boolean[];
		private programs: Object;
		private currentProgram: GpuProgram;
		private currentCamera: Camera;
		
		private modelMatrix_: Matrix4;
		private viewMatrix_: Matrix4;
		private projectionMatrix_: Matrix4;
		
		constructor(gl: WebGLRenderingContext) {
			this.gl = gl;
			this.enabledVertexLocations = new Array(StateTracker.MaxVertexLocations);
			this.programs = {}
			this.currentProgram = null;
			this.modelMatrix_ = Matrix4.identity();
			this.viewMatrix_ = Matrix4.identity();
			this.projectionMatrix_ = Matrix4.identity();
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
			this.setTransformationUniforms();
		}
		
		useCamera(camera : Camera) {
			this.currentCamera = camera;
			
			if(camera) {
				this.viewMatrix = camera.viewMatrix;
				this.projectionMatrix = camera.projectionMatrix;
			}
		}
		
		get modelMatrix() {
			return this.modelMatrix_;
		}
		
		set modelMatrix(matrix: Matrix4) {
			this.modelMatrix_ = matrix;
			
			if(this.currentProgram)
				this.currentProgram.setUniformMatrix4("Transformation.Model", this.modelMatrix_);
		}
		
		get viewMatrix() {
			return this.viewMatrix_;
		}
		
		set viewMatrix(matrix: Matrix4) {
			this.viewMatrix_ = matrix;
			
			if(this.currentProgram)
				this.currentProgram.setUniformMatrix4("Transformation.View", this.viewMatrix_);
		}
		
		get projectionMatrix() {
			return this.projectionMatrix_;
		}
		
		set projectionMatrix(matrix: Matrix4) {
			this.projectionMatrix_ = matrix;
			
			if(this.currentProgram)
				this.currentProgram.setUniformMatrix4("Transformation.Projection", this.projectionMatrix_);
		}
		
		private setTransformationUniforms() {
			if(!this.currentProgram)
				return;
				
			this.currentProgram.setUniformMatrix4("Transformation.Model", this.modelMatrix);
			this.currentProgram.setUniformMatrix4("Transformation.View", this.viewMatrix);
			this.currentProgram.setUniformMatrix4("Transformation.Projection", this.projectionMatrix);
		}
	}
}
