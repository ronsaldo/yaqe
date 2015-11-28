///<reference path='./MainView.ts'/>
module Yaqe.Editor {
    export class Application {
        mainView: MainView;

        constructor() {
        }

        createMainView(mainCanvas: HTMLCanvasElement) {
            this.mainView = new MainView(mainCanvas);
        }
        
        mainLoopIteration(currentTime) {
            this.mainView.mainLoopIteration(currentTime)
        }
        
        enterMainLoop() {
            var self = this;
            var mainLoopBody = (currentTime) => {
                this.mainLoopIteration(currentTime);
                window.requestAnimationFrame(mainLoopBody)
            }

            window.requestAnimationFrame(mainLoopBody);
        }


    }
}
