module Yaqe.Game.Quake
{
    /**
     * Game definition
     */
    export abstract class GameDefinition
    {
        static Games = {};

        abstract getName() : string;
    }
}
