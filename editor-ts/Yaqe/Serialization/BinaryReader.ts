module Yaqe.Serialization {
    export interface BinaryReader {
        readObject(object: BinarySerializable) : BinaryReader;
        readInt8(): number;
        readInt16(): number;
        readInt32(): number;
        readUInt8(): number;
        readUInt16(): number;
        readUInt32(): number;
        readFloat32(): number;
        readFloat64(): number;
    }
}
