#define MAX_RIPPLES 24
uniform sampler2D uText;
uniform vec2 uTextSize;
uniform vec2 uViewport;
uniform float uDpr;
uniform float uScroll;
uniform float uTime;
uniform vec2 uMouse;
uniform float uLens;
uniform float uStrength;
uniform float uOpacity;
uniform vec4 uRipples[MAX_RIPPLES];
uniform vec2 uTilt;
uniform vec2 uTiltCenter;
uniform float uPerspective;
uniform float uScrimOpacity;
uniform vec3 uScrimColor;

const float LENS_RADIUS = 90.0;
const float RING_SPEED = 120.0;
const float RING_WIDTH = 24.0;
const float RING_LIFE = 2.4;

void main() {
  vec2 frag = gl_FragCoord.xy / uDpr;
  frag.y = uViewport.y - frag.y;

  // Perspektif: sisi yang dekat kursor menjauh (mengecil), sisi lain mendekat.
  vec2 fromCenter = frag + vec2(0.0, uScroll) - uTiltCenter;
  float depth = 1.0 - dot(fromCenter, uTilt) / uPerspective;
  frag = uTiltCenter - vec2(0.0, uScroll) + fromCenter / depth;
  vec2 offset = vec2(0.0);

  vec2 toMouse = frag - uMouse;
  float mouseDist = length(toMouse);
  if (mouseDist < LENS_RADIUS && mouseDist > 0.001) {
    float falloff = 0.5 + 0.5 * cos(3.14159 * mouseDist / LENS_RADIUS);
    offset -= normalize(toMouse) * falloff * uLens;
    vec2 tangent = vec2(-toMouse.y, toMouse.x) / mouseDist;
    offset += tangent * sin(mouseDist * 0.07 - uTime * 5.0) * falloff * uLens * 0.35;
  }

  for (int i = 0; i < MAX_RIPPLES; i++) {
    vec4 ripple = uRipples[i];
    float age = uTime - ripple.z;
    if (ripple.w <= 0.0 || age < 0.0 || age > RING_LIFE) continue;
    vec2 toCenter = frag - ripple.xy;
    float dist = length(toCenter);
    float ring = dist - age * RING_SPEED;
    float band = exp(-(ring * ring) / (2.0 * RING_WIDTH * RING_WIDTH));
    float fade = 1.0 - age / RING_LIFE;
    offset -= normalize(toCenter + 0.0001) * sin(ring * 0.25) * band * ripple.w * fade;
  }

  vec2 samplePos = frag + offset * uStrength;
  samplePos.y += uScroll;
  vec2 uv = samplePos / uTextSize;
  vec4 color = vec4(0.0);
  if (uv.x >= 0.0 && uv.y >= 0.0 && uv.x <= 1.0 && uv.y <= 1.0) {
    color = texture2D(uText, vec2(uv.x, 1.0 - uv.y));
  }

  // Scrim: elips gelap lembut di belakang judul supaya krem kontras dengan langit terang.
  vec2 scrimPos = (gl_FragCoord.xy / uDpr) * vec2(1.0, -1.0) + vec2(0.0, uViewport.y) + vec2(0.0, uScroll);
  vec2 scrimUv = (scrimPos - (uTiltCenter - vec2(0.0, uViewport.y * 0.12))) / (uViewport * vec2(0.55, 0.58));
  float scrim = uScrimOpacity * (1.0 - smoothstep(0.15, 1.0, length(scrimUv)));

  float alpha = color.a + scrim * (1.0 - color.a);
  if (alpha < 0.002) discard;
  vec3 rgb = (color.rgb * color.a + uScrimColor * scrim * (1.0 - color.a)) / alpha;
  gl_FragColor = vec4(rgb, alpha * uOpacity);
  #include <colorspace_fragment>
}
