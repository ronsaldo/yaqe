///<reference path='./BinaryReader.ts'/>
///<reference path="../typings.d.ts"/>

module Yaqe.Serialization {
    let fs = require('fs');

    /**
     * File read buffer
     */
	export class BinaryFileReader implements BinaryReader {
        static BufferSize = 2048;
        private fd: number;
		private buffer: Buffer;
		private bufferSize: number;
        private bufferPosition: number;
        private castBuffer: ArrayBuffer;
        private position_: number;

        private int8View: Int8Array;
        private int16View: Int16Array;
        private int32View: Int32Array;
        private uint8View: Uint8Array;
        private uint16View: Uint16Array;
        private uint32View: Uint32Array;
        private float32View: Float32Array;
        private float64View: Float64Array;

		constructor(fd: number) {
            this.fd = fd;
            this.buffer = new Buffer(BinaryFileReader.BufferSize);
            this.castBuffer = new ArrayBuffer(8);
		}

        private createViews() {
			this.int8View = new Int8Array(this.castBuffer);
			this.int16View = new Int16Array(this.castBuffer);
			this.int32View = new Int32Array(this.castBuffer);
			this.uint8View = new Uint8Array(this.castBuffer);
			this.uint16View = new Uint16Array(this.castBuffer);
			this.uint32View = new Uint32Array(this.castBuffer);
			this.float32View = new Float32Array(this.castBuffer);
			this.float64View = new Float64Array(this.castBuffer);
		}

        set position(newPosition: number) {
            this.position_ = newPosition;
            this.bufferSize = 0;

        }
        fillBuffer() {
            this.bufferPosition = 0;
            this.bufferSize = fs.readSync(this.fd, this.buffer, 0, BinaryFileReader.BufferSize, this.position_);
            this.position_ += this.bufferSize;
        }

        readFixedNullTerminatedString(size: number) {
            let result = '';
            let done = false;
            for(let i = 0; i < size; ++i) {
                let val = this.readUInt8();
                if(val == 0)
                    done = true;
                if(!done)
                    result += String.fromCharCode(val);
            }

            return result;
        }

        readByte() {
            if(this.bufferPosition >= this.bufferSize && this.bufferSize > 0)
                this.fillBuffer();

            if(this.bufferPosition < this.bufferSize)
                return this.buffer.readUInt8[this.bufferPosition++]
            else
                return -1;
        }

        readObject(object: BinarySerializable) : BinaryReader {
            object.binaryRead(this);
            return this;
        }

        readUInt8() {
            let value = this.readByte();
            if(value < 0)
                throw "Unexpected EOF reached";
            return value;
        }

        readUInt16() {
            return this.readUInt8() | (this.readUInt8() << 8);
        }

        readUInt32() {
            return this.readUInt8() |
                (this.readUInt8() << 8) |
                (this.readUInt8() << 16) |
                (this.readUInt8() << 24);
        }

        readInt8() {
            this.uint8View[0] = this.readUInt8();
            return this.int8View[0];
        }

        readInt16() {
            this.uint16View[0] = this.readUInt16();
            return this.int16View[0];
        }

        readInt32() {
            this.uint32View[0] = this.readUInt32();
            return this.int32View[0];
        }

        readFloat32() {
            this.uint32View[0] = this.readUInt32();
            return this.float32View[0];
        }

        readFloat64() {
            for(let i = 0; i < 8; ++i)
                this.uint8View[i] = this.readUInt8();
            return this.float64View[0];
        }
	}
}
