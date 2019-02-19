precision mediump float;

uniform vec2 resolution;
uniform float time;

vec2 rotate(float theta, vec2 inp) 
{
    mat2 rotationMatrix = mat2(
        cos(theta), sin(theta),
        -sin(theta), cos(theta)
    );

    return rotationMatrix * inp;
}

void main()
{
    vec2 pos = gl_FragCoord.xy / resolution;
    vec2 half1 = vec2(0.5, 0.5);

    pos -= half1;
    pos = rotate(time * 0.3, pos);
    pos += half1;

    gl_FragColor = vec4(pos[0], 1.0, pos[1], 1.0);
}