
precision highp float;
varying vec2 uv;
uniform vec2 offset;
uniform vec3 colorCenter;
uniform vec3 colorBackground;
uniform sampler2D uSampler;

void main() {

    // color1 = vec3(1.0,0.55,0);
    // color2 = vec3(0.226,0.000,0.615);

    //float mixValue = distance(st,vec2(0,1));
    //vec3 color = mix(colorCenter,colorBackground,mixValue);

    gl_FragColor = vec4(uv, 0.0, 1.0);
}