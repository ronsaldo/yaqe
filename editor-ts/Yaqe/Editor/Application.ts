///<reference path='./MainView.ts'/>
module Yaqe.Editor {
    export class Application {
        mainView: MainView;

        constructor() {
        }

        createMainView(mainCanvas: HTMLCanvasElement) {
            this.mainView = new MainView(mainCanvas);
        }
        
        mainLoopIteration(currentTime : number) {
            this.mainView.mainLoopIteration(currentTime)
        }
        
        enterMainLoop() {
            var mainLoopBody = (currentTime : number) => {
                this.mainLoopIteration(currentTime);
                window.requestAnimationFrame(mainLoopBody)
            }

            window.requestAnimationFrame(mainLoopBody);
        }


    }
}
