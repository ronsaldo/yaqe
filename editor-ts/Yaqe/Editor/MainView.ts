﻿///<reference path='./View.ts'/>
///<reference path="./MapRenderer.ts" />
///<reference path='../Math3D/Vector3.ts'/>
///<reference path='../Rendering/StateTracker.ts'/>
///<reference path='../Rendering/GeometryBuilder.ts'/>
///<reference path='../Rendering/Vertex.ts'/>
///<reference path='../Rendering/Renderable.ts'/>
///<reference path="../Rendering/GpuProgram.ts" />
///<reference path="../Level/Map.ts" />
///<reference path="../Level/Brush.ts" />
///<reference path="../typings.d.ts" />

module Yaqe.Editor {
    import StateTracker = Rendering.StateTracker;
    import Vector3 = Math3D.Vector3;
    import Vector2 = Math3D.Vector2;
    import Color = Math3D.Color;
    import Map = Level.Map;
    import Brush = Level.Brush;
    
    export class MainView {
        canvas: HTMLCanvasElement;
        gl: WebGLRenderingContext;
        stateTracker: StateTracker;
        currentMap : Map;
        private views: View[];
        private renderable: Rendering.Renderable;
        private mapRenderer: MapRenderer;

        constructor(canvas: HTMLCanvasElement) {
            // Create an empty map.
            this.currentMap = Map.createEmpty();
            this.currentMap.mapEntity.addBrush(Brush.createPrism(new Vector3(1.0, 1.0, 1.0))),
            
            // Create the rendering context.
            this.canvas = canvas;
            
            this.gl = <WebGLRenderingContext>canvas.getContext("webgl");
            if (!this.gl)
                this.gl = <WebGLRenderingContext>canvas.getContext("experimental-webgl");
            this.initializeExtensions();
                
            // Create the state tracker.
            this.stateTracker = new StateTracker(this.gl);

            // Load the shader            
            this.loadShaders(() => {
                
                // Create the views
                this.createViews();
                
                // Create the map renderer.
                this.mapRenderer = new MapRenderer(this.stateTracker)
            });
        }
        
        mainLoopIteration(currentTime : number) {
            this.updateTime(currentTime);
            this.render();
        }
        
        initializeExtensions() {
            this.enableRequiredExtension("OES_element_index_uint")
        }
        
        enableRequiredExtension(extensionName: string) {
            var enabled = this.gl.getExtension(extensionName);
            if(!enabled)
                throw "Unsupported required extension "            
        }
        
        createViews() {
            this.views = [new View(this, this.stateTracker), new View(this, this.stateTracker), new View(this, this.stateTracker), new View(this, this.stateTracker)]
            
            // Top view
            this.views[0]
                .setTop()
                .setOrthographic()
                .setWireMode();
                
            // Perspective
            this.views[1]
                .setPerspective()
                .setSolidMode();
            this.views[1].camera.position = new Vector3(0.0, 0.5, 3.0);
                
            // Front view
            this.views[2]
                .setFront()
                .setOrthographic()
                .setWireMode();
                
            // Side view
            this.views[3]
                .setSide()
                .setOrthographic()
                .setWireMode();
                
            this.updateCanvasSize();
        }
        
        checkCanvasSize() {
            var parentWidth = this.canvas.parentElement.clientWidth;
            var parentHeight = this.canvas.parentElement.clientHeight;
            
            if(this.canvas.width == parentWidth &&
                this.canvas.height == parentHeight)
                return;
                
            this.updateCanvasSize();
        }

        updateTime(currentTime : number) {
            
        }
        
        updateCanvasSize() {
            var parentWidth = this.canvas.parentElement.clientWidth;
            var parentHeight = this.canvas.parentElement.clientHeight;
            this.canvas.width = parentWidth;
            this.canvas.height = parentHeight;
            this.updateViewLayout();
        }
       
        updateViewLayout() {
            var width = this.canvas.width;
            var height = this.canvas.height;
            var gapSize = 4;
            
            var viewWidth = width / 2 - gapSize / 2;
            var viewHeight = height / 2 - gapSize / 2;
            var viewSize = new Vector2(viewWidth, viewHeight);
            
            var topLeft = this.views[0];
            var topRight = this.views[1];
            var bottomLeft = this.views[2];
            var bottomRight = this.views[3];
            
            bottomLeft.size = viewSize;
            bottomLeft.position = new Vector2(0.0, 0.0);

            bottomRight.size = viewSize;
            bottomRight.position = new Vector2(viewWidth + gapSize, 0.0);

            topLeft.size = viewSize;
            topLeft.position = new Vector2(0.0, viewHeight + gapSize);

            topRight.size = viewSize;
            topRight.position = new Vector2(viewWidth + gapSize, viewHeight + gapSize);
        }
        
        loadShaders(continuation: () => void ) {
            var remote = require('remote')
            var app = <GitHubElectron.App>remote.require('app')
            var shaderBasePath = app.getAppPath() + "/assets/shaders/";
            var fs = require("fs");
            var shaderDescriptions = JSON.parse(fs.readFileSync(shaderBasePath + "shaders.json", "utf8"))
            for(var shaderName in shaderDescriptions) {
                var shaderDesc = shaderDescriptions[shaderName]

                var vertexFileName = shaderDesc["vertex"];
                var fragmentFileName = shaderDesc["fragment"];

                var vertexSource = fs.readFileSync(shaderBasePath + vertexFileName, "utf8")
                var fragmentSource = fs.readFileSync(shaderBasePath + fragmentFileName, "utf8")
                
                var attributes = shaderDesc["attributes"]
                var uniforms = shaderDesc["uniforms"]
                
                this.createShader(shaderName, vertexFileName, vertexSource, fragmentFileName, fragmentSource, attributes, uniforms)
            }
            
            
            continuation()
        }
        
        createShader(name: string, vertexFileName: string, vertexSource: string, fragmentFileName: string, fragmentSource: string, attributes: Object[], uniforms: Object[]) {
            var gl = this.gl;
            var vertexShader = this.compileShader(name, vertexFileName, vertexSource, gl.VERTEX_SHADER);
            var fragmentShader = this.compileShader(name, fragmentFileName, fragmentSource, gl.FRAGMENT_SHADER);
            
            var program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            
            for(var i = 0; i < attributes.length; ++i) {
                var attribute = attributes[i];
                var varName = attribute["variable"]
                var bindingName = attribute["binding"]
                var bindingLocation = this.stateTracker.getAttributeBindingLocation(bindingName);
                gl.bindAttribLocation(program, bindingLocation, varName);
            }
            
            gl.linkProgram(program);
            var status = gl.getProgramParameter(program, gl.LINK_STATUS);
            var message = "Program linking of " + name + ":\n" + gl.getProgramInfoLog(program) + '\n';
            process.stdout.write(message);
            if(!status)
                throw message;
                
            this.stateTracker.addProgram(name, new Rendering.GpuProgram(gl, program, uniforms))
        }
        
        compileShader(name: string, filename:string, source: string, type: number) {
            var gl = this.gl;
            var shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            var status = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
            var message = "Shader compilation of '" + filename + "':\n" + gl.getShaderInfoLog(shader) + '\n';
            process.stdout.write(message)
            if(!status) {
                 throw message
            }
            
            return shader;
        }
        
        initializeScene() {
            var builder = new Rendering.GeometryBuilder<Rendering.StandardVertex3D> (Rendering.StandardVertex3D);
            this.renderable = builder
                .beginTriangles()
                .addP3C(new Vector3(0.9, -0.9, 0.1), Color.Red)
                .addP3C(new Vector3(0.0, 0.9, 0.1), Color.Green)
                .addP3C(new Vector3(-0.9, -0.9, 0.1), Color.Blue)
                .addI123(0, 1, 2)
                .createMeshRenderable(this.gl);
        }
        
        render() {
            this.checkCanvasSize();
            this.stateTracker.screenWidth = this.canvas.width;
            this.stateTracker.screenHeight = this.canvas.height;
            this.mapRenderer.renderViews(this.views);
        }
    }
}
