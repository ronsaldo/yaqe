precision mediump float;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

attribute vec3 vPosition;
attribute vec3 vNormal;
attribute vec4 vColor;

varying vec4 fColor;
varying vec3 fNormal;
varying vec3 fPosition;

void main()
{
	fColor = vColor;
	fNormal = (viewMatrix * modelMatrix * vec4(vNormal, 0.0)).xyz;

	vec4 viewPos4 = viewMatrix * modelMatrix * vec4(vPosition, 1.0);
	fPosition = viewPos4.xyz;
	
	gl_Position = projectionMatrix * viewPos4;
}
