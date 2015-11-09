///<reference path='./PrimitiveType.ts'/>

module Yaqe.Rendering {
	export class SubMesh {
		primitiveType: PrimitiveType;
		startIndex: number;
		indexCount: number;
		
		constructor(primitiveType: PrimitiveType, startIndex: number, indexCount: number) {
			this.primitiveType = primitiveType;
			this.startIndex = startIndex;
			this.indexCount = indexCount;
		}
		
		draw(gl: WebGLRenderingContext) {
			gl.drawElements(this.getPrimitiveMode(gl), this.indexCount, gl.UNSIGNED_INT, this.startIndex*4);
		}
		
		private getPrimitiveMode(gl: WebGLRenderingContext) {
			switch(this.primitiveType)
			{
			case PrimitiveType.Point: return gl.POINTS;
			case PrimitiveType.Lines: return gl.LINES;
			case PrimitiveType.Triangles: return gl.TRIANGLES;
			default: throw "unsupported primitive mode"	
			}
		}
	}
}
