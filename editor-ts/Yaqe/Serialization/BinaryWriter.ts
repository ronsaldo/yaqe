///<reference path='./BinarySerializable.ts'/>

module Yaqe.Serialization {
    export interface BinaryWriter {
        writeObject(object: BinarySerializable) : BinaryWriter;
        writeInt8(value: number) : BinaryWriter;
        writeInt16(value: number) : BinaryWriter;
        writeInt32(value: number) : BinaryWriter;
        writeUInt8(value: number) : BinaryWriter;
        writeUInt16(value: number) : BinaryWriter;
        writeUInt32(value: number) : BinaryWriter;
        writeFloat32(value: number) : BinaryWriter;
        writeFloat64(value: number) : BinaryWriter; 
    }
}
