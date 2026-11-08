#define MAX_RIPPLES 16
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

const float LENS_RADIUS = 90.0;
const float RING_SPEED = 120.0;
const float RING_WIDTH = 24.0;
const float RING_LIFE = 1.5;

void main() {
  vec2 frag = gl_FragCoord.xy / uDpr;
  frag.y = uViewport.y - frag.y;
  vec2 offset = vec2(0.0);

  vec2 toMouse = frag - uMouse;
  float mouseDist = length(toMouse);
  if (mouseDist < LENS_RADIUS && mouseDist > 0.001) {
    float falloff = 0.5 + 0.5 * cos(3.14159 * mouseDist / LENS_RADIUS);
    offset -= normalize(toMouse) * falloff * uLens;
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
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) discard;

  vec4 color = texture2D(uText, vec2(uv.x, 1.0 - uv.y));
  gl_FragColor = vec4(color.rgb, color.a * uOpacity);
  #include <colorspace_fragment>
}
