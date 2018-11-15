var fragment_shader = `
  #version 300 es
  precision highp float;

  layout(std140, column_major) uniform;

  uniform SceneUniforms {
    mat4 viewProj;
    vec4 eyePosition;
    vec4 lightPosition;
  } uScene;

  uniform sampler2D tex;

  in vec3 vecPosition;
  in vec2 vecUV;
  in vec3 vecNormal;

  out vec4 fragColor;
  void main() {
    vec3 color = texture(tex, vecUV).rgb;
    vec3 normal = normalize(vecNormal);
    vec3 eyeVec = normalize(uScene.eyePosition.xyz - vecPosition);
    vec3 incidentVec = normalize(vecPosition - uScene.lightPosition.xyz);
    vec3 lightVec = -incidentVec;

    float diffuse = max(dot(lightVec, normal), 0.0);
    float highlight = pow(max(dot(eyeVec, reflect(incidentVec, normal)), 0.0), 100.0);
    float ambient = 0.1;
    fragColor = vec4(color * (diffuse + highlight + ambient), 1.0);
  }
`
