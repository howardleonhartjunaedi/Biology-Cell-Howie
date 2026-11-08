uniform vec3 uShallow;
uniform vec3 uDeep;
uniform vec3 uUnderside;
uniform vec3 uSunDir;
uniform vec3 uFogColor;
uniform float uFogDensity;
varying vec3 vWorldPos;
varying vec3 vNormal;

void main() {
  vec3 toCamera = normalize(cameraPosition - vWorldPos);
  vec3 normal = normalize(vNormal);
  float dist = length(cameraPosition - vWorldPos);

  vec3 color;
  if (gl_FrontFacing) {
    float fresnel = pow(1.0 - max(dot(toCamera, normal), 0.0), 3.0);
    color = mix(uShallow, uDeep, fresnel);
    vec3 reflected = reflect(-toCamera, normal);
    float glint = pow(max(dot(reflected, uSunDir), 0.0), 600.0);
    float farOnly = smoothstep(6.0, 30.0, dist);
    color += vec3(1.0, 0.97, 0.88) * glint * farOnly * 1.6;
  } else {
    float window = pow(max(dot(toCamera, -normal), 0.0), 2.0);
    color = mix(uDeep, uUnderside, window);
  }

  float fog = 1.0 - exp(-uFogDensity * uFogDensity * dist * dist);
  gl_FragColor = vec4(mix(color, uFogColor, fog), 1.0);
  #include <colorspace_fragment>
}
