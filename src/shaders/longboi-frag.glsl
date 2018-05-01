#version 300 es

// This is a fragment shader. If you've opened this file first, please
// open and read lambert.vert.glsl before reading on.
// Unlike the vertex shader, the fragment shader actually does compute
// the shading of geometry. For every pixel in your program's output
// screen, the fragment shader is run for every bit of geometry that
// particular pixel overlaps. By implicitly interpolating the position
// data passed into the fragment shader by the vertex shader, the fragment shader
// can compute what color to apply to its pixel based on things like vertex
// position, light position, and vertex color.
precision highp float;

uniform vec4 u_Color; // The color with which to render this instance of geometry.
uniform vec3 u_Eye;
uniform float u_Time;

// These are the interpolated values out of the rasterizer, so you can't know
// their specific values without knowing the vertices that contributed to them
in vec4 fs_Nor;
in vec4 fs_LightVec;
in vec4 fs_Col;
in vec4 fs_Pos;

out vec4 out_Col; // This is the final output color that you will see on your
                  // screen for the pixel that is currently being processed.
//	Simplex 3D Noise 
//	by Ian McEwan, Ashima Arts
//

void main()
{
        vec4 diffuseColor = u_Color;
        float specularIntensity;        
        float ambientTerm = 0.4;

        float angle = dot(fs_LightVec, fs_Nor);
        if(angle < 0.5f) {
            specularIntensity = .1f;
            ambientTerm = 0.25;
        } else {
            vec4 norm = normalize(fs_Nor);
            vec4 fs_Light = normalize(fs_LightVec);
            float intensity = pow(dot(fs_Light, norm), 5.f);
            specularIntensity = max(intensity, 0.f);
            ambientTerm = 0.4;
        }
        
        // diffuse term for Lambert 
        float diffuseTerm = dot(normalize(fs_Nor), normalize(fs_LightVec));

        // Avoid negative lighting values
        diffuseTerm = min(diffuseTerm, 1.0);
        diffuseTerm = max(diffuseTerm, 0.0);

        float lightIntensity = diffuseTerm + ambientTerm;   //Add a small float value to the color multiplier
                                                            //to simulate ambient lighting. This ensures that faces that are not
                                                            //lit by our point light are not completely black.

        // Compute final shaded color
        vec3 color = vec3(0.5, 0.5, 0.7) + specularIntensity * 6.;
        vec3 color2 = diffuseColor.xyz;

        out_Col = vec4(color * lightIntensity, 1.);
}
