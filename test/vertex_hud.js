var vertex_hud = `
  #version 300 es

  layout(std140, column_major) uniform;

  layout(location=0) in vec4 position;

  uniform mat4 uViewProj;
  uniform mat4 uModel;

  void main() {
    gl_Position = uViewProj * uModel * position;
  }`
