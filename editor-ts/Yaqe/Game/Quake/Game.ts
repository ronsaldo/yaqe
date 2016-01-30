/// <reference path="../Game.ts"/>

module Yaqe.Game.Quake
{
    export class QuakeGameDefinition extends GameDefinition {
        constructor() {
            super();
        }

        getName() {
            return "Quake";
        }
    }

    GameDefinition.Games['Quake'] = new QuakeGameDefinition();
}
