
precision highp float;
varying vec2 uv;
uniform float time;
uniform vec3 tint;
uniform sampler2D uSampler;
uniform float windowHeight;

void main() {

    // color1 = vec3(1.0,0.55,0);
    // color2 = vec3(0.226,0.000,0.615);

    //float mixValue = distance(st,vec2(0,1));
    //vec3 color = mix(colorCenter,colorBackground,mixValue);
    float flickerPhase1 = sin(time * 90.0);
    float flickerPhase2 = sin(time * 40.1 + 35.3);
    flickerPhase1 = (flickerPhase1 + 1.0) * 0.5;
    flickerPhase2 = (flickerPhase2 + 1.0) * 0.5;
    float flickerPhase = (flickerPhase1 * 0.3 + flickerPhase2 * 0.7);
    flickerPhase = flickerPhase * 0.3 + 0.7;
    vec4 texSample = texture2D(uSampler, uv);
    float gradient = (sin(uv.y * windowHeight + time * 40.0) + 1.0) * 0.5;
    gradient = (gradient + 1.0) * 0.5;
    texSample.xyz = gradient * flickerPhase * texSample.xyz;
    texSample.x *= tint.x;
    texSample.y *= tint.y;
    texSample.z *= tint.z;

    gl_FragColor = texSample;
}