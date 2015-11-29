///<reference path='./GpuResource.ts'/>
///<reference path='../Math3D/Color.ts'/>
///<reference path='../Math3D/Vector2.ts'/>
///<reference path='../Math3D/Vector3.ts'/>
///<reference path='../Math3D/Vector4.ts'/>
///<reference path='../Math3D/Matrix3.ts'/>
///<reference path='../Math3D/Matrix4.ts'/>

module Yaqe.Rendering {
	import Vector2 = Math3D.Vector2;
	import Vector3 = Math3D.Vector3;
	import Vector4 = Math3D.Vector4;
	import Matrix3 = Math3D.Matrix3;
	import Matrix4 = Math3D.Matrix4;
	import Color = Math3D.Color;
	
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
		
		getUniformBinding(binding: string) {
			if(binding in this.uniformBindings[binding])
				return this.uniformBindings[binding];
			return -1;
		}

		setUniformVector2(binding: string, vector: Vector2) {
			var location = this.getUniformBinding(binding);
			this.gl.uniform2f(location, vector.x, vector.y);
		}

		setUniformVector3(binding: string, vector: Vector3) {
			var location = this.getUniformBinding(binding);
			this.gl.uniform3f(location, vector.x, vector.y, vector.z);
		}
		
		setUniformVector4(binding: string, vector: Vector4) {
			var location = this.getUniformBinding(binding);
			this.gl.uniform4f(location, vector.x, vector.y, vector.z, vector.w);
		}
		
		setUniformMatrix3(binding: string, matrix: Matrix3) {
			var location = this.getUniformBinding(binding);
			this.gl.uniformMatrix3fv(location, true, matrix.values);
		}
		
		setUniformMatrix4(binding: string, matrix: Matrix4) {
			var location = this.getUniformBinding(binding);
			this.gl.uniformMatrix4fv(location, true, matrix.values);
		}
	}
}