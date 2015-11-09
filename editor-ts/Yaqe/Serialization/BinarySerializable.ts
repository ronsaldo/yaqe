///<reference path='./BinaryWriter.ts'/>
///<reference path='./BinaryReader.ts'/>

module Yaqe.Serialization {
    export interface BinarySerializable {
		binaryWrite(output: BinaryWriter): void;
        binaryRead(input: BinaryReader): void;
    }
}
