// Menggambar satu frame walkthrough memenuhi layar (seperti object-fit: cover),
// ditambah riak halus di sekitar kursor, vignette (tepi lebih gelap), dan grain (bintik film).
uniform sampler2D uFrame;
uniform vec2 uCoverScale;
uniform float uAspect;
uniform float uTime;
uniform vec2 uMouse;
uniform float uRipple;
uniform float uVignette;
uniform float uGrain;
varying vec2 vUv;

void main() {
  vec2 uv = (vUv - 0.5) * uCoverScale + 0.5;

  vec2 toMouse = (vUv - uMouse) * vec2(uAspect, 1.0);
  float dist = length(toMouse);
  float wave = sin(dist * 42.0 - uTime * 3.5) * exp(-dist * 7.0) * uRipple;
  uv += normalize(toMouse + 1e-5) * wave * 0.004;

  vec3 color = texture2D(uFrame, uv).rgb;

  float edge = smoothstep(0.9, 0.3, length(vUv - 0.5));
  color *= mix(1.0 - uVignette, 1.0, edge);

  float noise = fract(sin(dot(vUv * vec2(1280.0, 720.0) + uTime * 61.0, vec2(12.9898, 78.233))) * 43758.5453);
  color += (noise - 0.5) * uGrain;

  gl_FragColor = vec4(color, 1.0);
}
