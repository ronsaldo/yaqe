///<reference path='./BinaryWriter.ts'/>
///<reference path='./BinaryReader.ts'/>
///<reference path='./BinarySerializable.ts'/>

module Yaqe.Serialization {
	export class BinaryArrayBuffer implements BinaryReader, BinaryWriter {
		buffer: ArrayBuffer;
		private int8View: Int8Array;
		private int16View: Int16Array;
		private int32View: Int32Array;
		private uint8View: Uint8Array;
		private uint16View: Uint16Array;
		private uint32View: Uint32Array;
		private float32View: Float32Array;
		private float64View: Float64Array;
		
		private position: number;
		private capacity: number;
		private size: number;
		
		constructor(initialCapacity: number = 32) {
			initialCapacity = (initialCapacity + 7) & (~7);
			this.buffer = new ArrayBuffer(initialCapacity);
			this.capacity = initialCapacity;
			this.size = 0;
			this.position = 0;
			
			this.createViews();
		}
		
		private createViews() {
			this.int8View = new Int8Array(this.buffer);
			this.int16View = new Int16Array(this.buffer);
			this.int32View = new Int32Array(this.buffer);
			this.uint8View = new Uint8Array(this.buffer);
			this.uint16View = new Uint16Array(this.buffer);
			this.uint32View = new Uint32Array(this.buffer);
			this.float32View = new Float32Array(this.buffer);
			this.float64View = new Float64Array(this.buffer);
		}
		
		private increaseCapacity() {
			var newCapacity = this.capacity*2;
			if(newCapacity == 0)
				newCapacity = 32;
				
			// Copy the old data.
			console.log("increase capacity\n")
			var newBuffer = new ArrayBuffer(newCapacity);
			for(var i = 0; i < this.size; ++i)
				newBuffer[i] = this.buffer[i];
			 
			// Store the new buffer and its capacity.
			this.capacity = newCapacity;
			this.buffer = newBuffer;
			this.createViews();
		}
		
		private ensureCapacity(amount: number) {
			if(this.size + amount > this.capacity) {
				this.increaseCapacity();
			}
			
			this.size += amount;
		}

		private checkRemainingSize(amount: number) {
			if(this.position + amount > this.size) {
				throw "invalid read operation";
			}
		}
		
        writeObject(object: BinarySerializable): BinaryWriter {
			object.binaryWrite(this);
			return this;
		}
		
        writeInt8(value: number): BinaryWriter {
			this.ensureCapacity(1);
			this.int8View[this.position] = value;
			this.position += 1;
			return this;
		}
		
        writeInt16(value: number): BinaryWriter {
			this.ensureCapacity(2);
			this.int16View[this.position / 2] = value;
			this.position += 2;
			return this;
		}
		
        writeInt32(value: number): BinaryWriter {
			this.ensureCapacity(1);
			this.int32View[this.position / 4] = value;
			this.position += 4;
			return this;
		}
		
        writeUInt8(value: number): BinaryWriter {
			this.ensureCapacity(1);
			this.uint8View[this.position] = value;
			this.position += 1;
			return this;
		}
		
        writeUInt16(value: number): BinaryWriter {
			this.ensureCapacity(2);
			this.uint16View[this.position / 2] = value;
			this.position += 2;
			return this;
		}
		
        writeUInt32(value: number): BinaryWriter {
			this.ensureCapacity(4);
			this.uint32View[this.position / 4] = value;
			this.position += 4;
			return this;
		}
		
        writeFloat32(value: number): BinaryWriter {
			this.ensureCapacity(4);
			this.float32View[this.position / 4] = value;
			this.position += 4;
			return this;
		}
		
        writeFloat64(value: number): BinaryWriter {
			this.ensureCapacity(8);
			this.float64View[this.position / 8] = value;
			this.position += 8;
			return this;
		}
		
        readObject(object: BinarySerializable) : BinaryReader {
			object.binaryRead(this);
			return this;
		}
		
        readInt8(): number {
			this.checkRemainingSize(1);
			var value = this.int8View[this.position];
			this.position += 1;
			return value;
		}
		
        readInt16(): number {
			this.checkRemainingSize(2);
			var value = this.int16View[this.position];
			this.position += 2;
			return value;
		}
		
        readInt32(): number {
			this.checkRemainingSize(4);
			var value = this.int32View[this.position];
			this.position += 4;
			return value;
		}
		
        readUInt8(): number {
			this.checkRemainingSize(1);
			var value = this.uint8View[this.position];
			this.position += 1;
			return value;
		}
		
        readUInt16(): number {
			this.checkRemainingSize(2);
			var value = this.uint16View[this.position];
			this.position += 2;
			return value;
		}
		
        readUInt32(): number {
			this.checkRemainingSize(4);
			var value = this.uint32View[this.position];
			this.position += 4;
			return value;
		}
		
        readFloat32(): number {
			this.checkRemainingSize(4);
			var value = this.float32View[this.position];
			this.position += 4;
			return value;
		}
		
        readFloat64(): number {
			this.checkRemainingSize(8);
			var value = this.float32View[this.position];
			this.position += 8;
			return value;
		} 
	}
}