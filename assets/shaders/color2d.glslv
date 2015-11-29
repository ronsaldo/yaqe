precision mediump float;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

attribute vec2 vPosition;
attribute vec4 vColor;

varying vec4 fColor;

void main()
{
	fColor = vColor;
	
	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(vPosition, 0.0, 1.0);
}