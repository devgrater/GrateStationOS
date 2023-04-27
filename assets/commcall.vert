precision highp float;
varying vec2 uv;
attribute vec3 aPosition;
void main() {
    gl_Position = vec4(aPosition,1.0);
    uv = (aPosition).xy * 0.5 + 0.5;
    uv.y = 1.0 - uv.y;
}