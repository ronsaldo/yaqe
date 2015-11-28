///<reference path='Yaqe/Editor/Application.ts'/>
///<reference path='Yaqe/Math3D/Vector3.ts'/>


var yaqeApp = null;

window.onload = () => {
    yaqeApp = new Yaqe.Editor.Application()
    var mainCanvas = <HTMLCanvasElement>document.getElementById('mainCanvas');
    yaqeApp.createMainView(mainCanvas);
    yaqeApp.enterMainLoop();
};
