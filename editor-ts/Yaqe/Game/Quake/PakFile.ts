/// <reference path="../../Common/String.ts"/>
///<reference path="../../Serialization/BinaryFileReader.ts"/>

module Yaqe.Game.Quake
{
    import BinaryFileReader = Serialization.BinaryFileReader;

    let fs = require('fs');
    export class PakFile
    {
        private fileReader: BinaryFileReader;
        private fileEntries: PakFileEntry[];

        constructor(fileReader: BinaryFileReader, fileEntries: PakFileEntry[]) {
            this.fileReader = fileReader;
            this.fileEntries = fileEntries;
        }

        static open(filename: string) {
            let fd = fs.openSync(filename, "rb");
            let fileReader = new BinaryFileReader(fd);

            // Check the signature.
            if(fileReader.readUInt8() != 'P'.asUnicode() ||
                fileReader.readUInt8() != 'A'.asUnicode() ||
                fileReader.readUInt8() != 'C'.asUnicode() ||
                fileReader.readUInt8() != 'K'.asUnicode()) {
                throw "Invalid Quake Pak file";
            }

            // Read the header.
            let fileTableOffset = fileReader.readUInt32();
            let fileTableSize = fileReader.readUInt32();

            // Read the file table.
            fileReader.position = fileTableOffset;
            let numberOfFiles = fileTableSize / 64;
            let fileEntries = []
            for(let i = 0; i < numberOfFiles; ++i) {
                let name = fileReader.readFixedNullTerminatedString(56);
                let offset = fileReader.readUInt32();
                let size = fileReader.readUInt32();
                fileEntries.push(new PakFileEntry(name, offset, size));
            }
        }
    }

    /**
     * A pak file entry.
     */
    export class PakFileEntry
    {
        name: string;
        offset: number;
        size: number;

        constructor(name: string, offset: number, size: number) {
            this.name = name;
            this.offset = offset;
            this.size = size;
        }
    }
}
