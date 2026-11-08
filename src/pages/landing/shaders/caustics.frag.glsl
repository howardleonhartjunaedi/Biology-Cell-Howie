uniform float uTime;
uniform vec3 uSand;
uniform vec3 uLight;
uniform vec3 uFogColor;
uniform float uFogDensity;
varying vec2 vUv;
varying vec3 vWorldPos;

float causticLayer(vec2 p, float t) {
  vec2 q = p;
  for (int i = 0; i < 3; i++) {
    q += vec2(sin(q.y * 1.3 + t), cos(q.x * 1.1 - t * 0.8));
  }
  return pow(abs(sin(q.x) * sin(q.y)), 6.0);
}

void main() {
  vec2 p = vWorldPos.xz * 0.6;
  float light = causticLayer(p, uTime * 0.6) + causticLayer(p * 1.7 + 3.0, uTime * 0.45) * 0.6;
  vec3 color = uSand + uLight * light * 0.55;
  float dist = length(cameraPosition - vWorldPos);
  float fog = 1.0 - exp(-uFogDensity * uFogDensity * dist * dist);
  gl_FragColor = vec4(mix(color, uFogColor, fog), 1.0);
  #include <colorspace_fragment>
}
