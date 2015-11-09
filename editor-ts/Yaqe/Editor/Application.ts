///<reference path='./MainView.ts'/>
module Yaqe.Editor {
    export class Application {
        mainView: MainView;

        constructor() {
        }

        createMainView(mainCanvas: HTMLCanvasElement) {
            this.mainView = new MainView(mainCanvas);
        }
        
        canvasResized() {
            this.mainView.canvasResized();
        }
        
    }
}
