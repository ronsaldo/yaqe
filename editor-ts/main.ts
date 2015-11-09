///<reference path='Yaqe/Editor/Application.ts'/>
///<reference path='Yaqe/Math3D/Vector3.ts'/>

var yaqeApp = null;

window.onresize = () => {
    var mainCanvas = <HTMLCanvasElement>document.getElementById('mainCanvas');
    mainCanvas.width = window.innerWidth;
    mainCanvas.height = window.innerHeight;
    if(yaqeApp)
        yaqeApp.canvasResized();
}

window.onload = () => {
    yaqeApp = new Yaqe.Editor.Application()
    var mainCanvas = <HTMLCanvasElement>document.getElementById('mainCanvas');
    mainCanvas.width = window.innerWidth;
    mainCanvas.height = window.innerHeight;
    yaqeApp.createMainView(mainCanvas);
};
