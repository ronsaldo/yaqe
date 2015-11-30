precision highp float;

varying vec3 fNormal;
varying vec4 fColor;
varying vec3 fPosition;

void main()
{
	vec4 ambientLighting = vec4(0.2, 0.2, 0.2, 0.0);
	vec4 diffuseLighting = vec4(0.8, 0.8, 0.8, 0.0);
	vec3 V = normalize(-fPosition);
	vec3 L = V; // Put a light on the camera.
	vec3 N = normalize(fNormal);
	vec4 color = ambientLighting*fColor;

	// Diffuse lighting.
	float NdotL = max(0.0, dot(N, L));
	if(NdotL > 0.0)
		color += NdotL * diffuseLighting*fColor;

	gl_FragColor = vec4(color.rgb, fColor.a);
}
