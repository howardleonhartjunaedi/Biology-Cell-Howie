uniform float uTime;
varying vec3 vWorldPos;
varying vec3 vNormal;

float waveHeight(vec2 p) {
  float h = sin(p.x * 0.35 + uTime * 0.9) * 0.18;
  h += sin(p.y * 0.5 - uTime * 0.7) * 0.12;
  h += sin((p.x + p.y) * 1.1 + uTime * 1.6) * 0.05;
  return h;
}

void main() {
  vec3 p = position;
  vec2 flat2 = vec2(p.x, -p.y);
  float h = waveHeight(flat2);
  float e = 0.1;
  float hx = waveHeight(flat2 + vec2(e, 0.0)) - h;
  float hz = waveHeight(flat2 + vec2(0.0, e)) - h;
  vNormal = normalize(vec3(-hx / e, 1.0, -hz / e));
  vec4 world = modelMatrix * vec4(p.x, p.y, h, 1.0);
  vWorldPos = world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
