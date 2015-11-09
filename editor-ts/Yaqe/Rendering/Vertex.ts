///<reference path='../Math3D/Vector3.ts'/>
///<reference path='../Math3D/Vector2.ts'/>
///<reference path='../Math3D/Color.ts'/>
///<reference path='../Serialization/BinarySerializable.ts'/>
///<reference path='./VertexLayout.ts'/>

module Yaqe.Rendering
{
	import Vector2 = Math3D.Vector2;
	import Vector3 = Math3D.Vector3;
	import Color = Math3D.Color;
	
	export interface Vertex extends Serialization.BinarySerializable{
	}
	
    export class StandardVertex3D implements Vertex {
        position: Vector3;
        normal: Vector3;
		texcoord: Vector2;
		color: Color;

        constructor(position: Vector3 = new Vector3(), normal: Vector3 = new Vector3(), texcoord: Vector2 = new Vector2(), color: Color = Color.White) {
			this.position = position;
			this.normal = normal;
			this.texcoord = texcoord;
			this.color = color;
        }
		
		static vertexSize() {
			return 12*4;
		}
        
        static get vertexLayout() {
            return new VertexLayout(StandardVertex3D.vertexSize(), [
               { buffer: 0, location: 0, offset: 0, type: VertexAttributeType.Float, components: 3, normalized: false },
               { buffer: 0, location: 1, offset: 12, type: VertexAttributeType.Float, components: 3, normalized: false },
               { buffer: 0, location: 2, offset: 24, type: VertexAttributeType.Float, components: 2, normalized: false },
               { buffer: 0, location: 3, offset: 32, type: VertexAttributeType.Float, components: 4, normalized: false }, 
            ]);
        }
		
		binaryWrite(output: Serialization.BinaryWriter) {
            output
                .writeObject(this.position)
                .writeObject(this.normal)
                .writeObject(this.texcoord)
                .writeObject(this.color);
        }

        binaryRead(input: Serialization.BinaryReader) {
          input
                .readObject(this.position)
                .readObject(this.normal)
                .readObject(this.texcoord)
                .readObject(this.color);
        }
    }
    
    export class StandardVertex2D implements Vertex {
        position: Vector2;
        texcoord: Vector2;
        color: Color;

        constructor(position: Vector2 = new Vector2(), color: Color = Color.White, texcoord: Vector2 = new Vector2()) {
			this.position = position;
            this.color = color;
			this.texcoord = texcoord;
        }

		static vertexSize() {
			return 8*4;
		}
		
        static get vertexLayout() {
            return new VertexLayout(StandardVertex2D.vertexSize(), [
               { buffer: 0, location: 0, offset: 0, type: VertexAttributeType.Float, components: 2, normalized: false },
               { buffer: 0, location: 2, offset: 8, type: VertexAttributeType.Float, components: 2, normalized: false },
               { buffer: 0, location: 3, offset: 16, type: VertexAttributeType.Float, components: 4, normalized: false },
            ]);
        }
        
		binaryWrite(output: Serialization.BinaryWriter) {
            output
                .writeObject(this.position)
                .writeObject(this.texcoord)
                .writeObject(this.color);
        }

        binaryRead(input: Serialization.BinaryReader) {
          input
                .readObject(this.position)
                .readObject(this.texcoord)
                .readObject(this.color);
        }
    }
}
