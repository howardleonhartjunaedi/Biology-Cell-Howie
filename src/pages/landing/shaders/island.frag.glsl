uniform sampler2D uPhoto;
uniform vec4 uCrop;
uniform float uMirror;
uniform vec3 uHazeColor;
uniform float uHaze;
uniform float uOpacity;
varying vec2 vUv;

float skyAmount(vec3 c) {
  float brightness = max(c.r, max(c.g, c.b));
  float saturation = brightness > 0.0 ? (brightness - min(c.r, min(c.g, c.b))) / brightness : 0.0;
  float cloud = smoothstep(0.52, 0.66, brightness) * (1.0 - smoothstep(0.2, 0.34, saturation));
  float blue = smoothstep(0.04, 0.14, c.b - c.g) * smoothstep(0.15, 0.3, c.b - c.r) * smoothstep(0.4, 0.55, brightness);
  float haze = smoothstep(0.6, 0.75, brightness) * smoothstep(-0.03, 0.03, c.b - c.g);
  return clamp(max(max(cloud, blue), haze), 0.0, 1.0);
}

void main() {
  float u = mix(vUv.x, 1.0 - vUv.x, uMirror);
  vec2 uv = vec2(mix(uCrop.x, uCrop.z, u), mix(uCrop.w, uCrop.y, vUv.y));
  vec3 photo = texture2D(uPhoto, uv).rgb;

  float alpha = 1.0 - skyAmount(photo);
  alpha *= smoothstep(0.0, 0.12, vUv.x) * smoothstep(1.0, 0.88, vUv.x);
  if (alpha < 0.02) discard;

  vec3 color = mix(photo, uHazeColor, uHaze);
  gl_FragColor = vec4(color, alpha * uOpacity);
  #include <colorspace_fragment>
}
