///<reference path='./GpuResource.ts'/>
///<reference path='./GpuBuffer.ts'/>
///<reference path='./VertexArrayObject.ts'/>
///<reference path='./SubMesh.ts'/>
///<reference path='./Vertex.ts'/>
///<reference path='./Renderable.ts'/>
///<reference path='../Serialization/BinaryArrayBuffer.ts'/>
///<reference path='../Math3D/Vector3.ts'/>
///<reference path='../Math3D/Vector2.ts'/>
///<reference path='../Math3D/Color.ts'/>

module Yaqe.Rendering {
	import BinaryArrayBuffer = Serialization.BinaryArrayBuffer;
	import Vector3 = Math3D.Vector3;
	import Vector2 = Math3D.Vector2;
	import Color = Math3D.Color;
	
	export class GeometryBuilder<VertexType extends Vertex> {
		private vertexType: any;
		private vertices: VertexType[];
		private indices: number[];
		private submeshes: SubMesh[];
		private baseIndex: number;
		
		constructor(vertexType: any) {
			this.vertices = []
			this.indices = []
			this.submeshes = []
			this.baseIndex = 0;
			this.vertexType = vertexType;
		}
		
		addIndex(index: number) {
			this.indices.push(index + this.baseIndex);
			return this;
		}
		
		addVertex(vertex: VertexType) {
			this.vertices.push(vertex);
			return this;
		}
		
		get lastSubmesh() {
			if(this.submeshes.length == 0)
				return null;
				
			return this.submeshes[this.submeshes.length - 1]
		}
		
		beginTriangles() {
			return this.beginPrimitives(PrimitiveType.Triangles);
		}

		beginPoints() {
			return this.beginPrimitives(PrimitiveType.Point);
		}
		
		finishLastSubmesh() {
			var last = this.lastSubmesh;
			if(last != null)
			{
				last.indexCount = this.indices.length - last.startIndex;
			}
		}
		
		beginPrimitives(primitive: PrimitiveType ) {
			if(this.lastSubmesh == null || this.lastSubmesh.primitiveType != primitive) {
				this.finishLastSubmesh();
				var submesh = new SubMesh(primitive, this.indices.length, 0);
				this.submeshes.push(submesh);
			}
			
			this.baseIndex = this.vertices.length;
			return this;
		}
		
		addI123(i1: number, i2: number, i3: number) {
			return this
				.addIndex(i1)
				.addIndex(i2)
				.addIndex(i3);
		}
		
		addP3(position: Vector3)
		{
			var vertex = new this.vertexType();
			vertex.position = position;
			
			this.addVertex(vertex);
			return this;
		}

		addP3C(position: Vector3, color: Color)
		{
			var vertex = new this.vertexType();
			vertex.position = position;
			vertex.color = color;
			
			this.addVertex(vertex);
			return this;
		}

		addP2(position: Vector2)
		{
			var vertex = new this.vertexType();
			vertex.position = position;
			
			this.addVertex(vertex);
			return this;
		}

		addP2C(position: Vector2, color: Color)
		{
			var vertex = new this.vertexType();
			vertex.position = position;
			vertex.color = color;
			
			this.addVertex(vertex);
			return this;
		}

		addP3N(position: Vector3, normal: Vector3)
		{
			var vertex = new this.vertexType();
			vertex.position = position;
			vertex.normal = normal;
			
			this.addVertex(vertex);
			return this;
		}
		
		addP3NC(position: Vector3, normal: Vector3, color: Color)
		{
			var vertex = new this.vertexType();
			vertex.position = position;
			vertex.normal = normal;
			vertex.color = color;
			
			this.addVertex(vertex);
			return this;
		}

		addP3NCT(position: Vector3, normal: Vector3, color: Color, texcoord: Vector2)
		{
			var vertex = new this.vertexType();
			vertex.position = position;
			vertex.normal = normal;
			vertex.color = color;
			vertex.texcoord = texcoord;
			
			this.addVertex(vertex);
			return this;
		}
		
		getVertices(): VertexType[] {
			return this.vertices;
		}
		
		getIndices(): number[] {
			return this.indices;
		}
		
		encodeVertices(): BinaryArrayBuffer {
			var bufferSize = this.vertexType.vertexSize() * this.vertices.length;
			var binaryBuffer = new BinaryArrayBuffer(bufferSize);
			
			for(var i = 0; i < this.vertices.length; ++i)
				this.vertices[i].binaryWrite(binaryBuffer);

			return binaryBuffer; 
		}

		encodeIndices(): BinaryArrayBuffer {
			var bufferSize = 4 * this.indices.length;
			var binaryBuffer = new BinaryArrayBuffer(bufferSize);
			for(var i = 0; i < this.indices.length; ++i)
				binaryBuffer.writeUInt16(this.indices[i]);
				
			return binaryBuffer;
		}
		
		createVertexBuffer(gl: WebGLRenderingContext): GpuVertexBuffer {
			var vertexBuffer = new GpuVertexBuffer(gl);
			var vertices = this.encodeVertices();
			vertexBuffer.uploadData(vertices.buffer);
			return vertexBuffer;
		}

		createIndexBuffer(gl: WebGLRenderingContext): GpuIndexBuffer {
			var indexBuffer = new GpuIndexBuffer(gl);
			var indices = this.encodeIndices();
			indexBuffer.uploadData(indices.buffer);
			return indexBuffer;
		}
		
		createMeshRenderable(gl: WebGLRenderingContext): MeshRenderable {
			this.finishLastSubmesh();
			
			var vertexBuffer = this.createVertexBuffer(gl);
			var indexBuffer = this.createIndexBuffer(gl);
			var vertexLayout = <VertexLayout> this.vertexType.vertexLayout;
			var vao = new VertexArrayObject([vertexBuffer], vertexLayout);
			
			return new MeshRenderable(vao, indexBuffer, this.submeshes);
		}
	}
}
