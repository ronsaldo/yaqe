module Yaqe.Rendering
{
	export enum VertexAttributeType {
		Float = 0,
		Byte,
		SByte,
		Short,
		UShort,
		Int,
		UInt,
	};
	
	export class VertexAttribute {
		buffer: number;
		location: number;
		offset: number;
		type: VertexAttributeType;
		components: number;
		normalized: boolean;
		
		constructor(data: any) {
			this.buffer = data.buffer;
			this.location = data.location;
			this.offset = data.offset;
			this.type = data.type;
			this.components = data.components;
			this.normalized = data.normalized;
		}
		
		glType(gl: WebGLRenderingContext) {
			switch(this.type) {
			case VertexAttributeType.Byte: return gl.UNSIGNED_BYTE;
			case VertexAttributeType.SByte: return gl.BYTE;
			case VertexAttributeType.Short: return gl.SHORT;
			case VertexAttributeType.UShort: return gl.UNSIGNED_SHORT;
			case VertexAttributeType.Int: return gl.INT;
			case VertexAttributeType.UInt: return gl.UNSIGNED_INT;
			case VertexAttributeType.Float: return gl.FLOAT;
			default: throw "unsupported";
			}
		}
	}
	
	export class VertexLayout {
		stride: number;
		attributes: VertexAttribute[];
		
		constructor(stride: number, attributes: any[]) {
			this.stride = stride;
			this.attributes = attributes.map((attribute: any) => {
				return new VertexAttribute(attribute);
			});
			this.attributes.sort((a: VertexAttribute, b: VertexAttribute) => {
				return a.buffer - b.buffer;
			});
		}
		
	}
}
