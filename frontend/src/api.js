const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function request(path, { method = 'GET', body, token } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Error en la solicitud');
  return data;
}

export const api = {
  login: (username, password) => request('/auth/login', { method: 'POST', body: { username, password } }),
  listarGrupos: (token) => request('/grupos', { token }),
  crearGrupo: (token, grupo) => request('/grupos', { method: 'POST', body: grupo, token }),
  actualizarGrupo: (token, id, grupo) => request(`/grupos/${id}`, { method: 'PUT', body: grupo, token }),
  eliminarGrupo: (token, id) => request(`/grupos/${id}`, { method: 'DELETE', token }),
  listarMiembros: (token, idGrupo) => request(`/grupos/${idGrupo}/miembros`, { token }),
  crearMiembro: (token, miembro) => request('/miembros', { method: 'POST', body: miembro, token }),
  actualizarMiembro: (token, id, miembro) => request(`/miembros/${id}`, { method: 'PUT', body: miembro, token }),
  eliminarMiembro: (token, id) => request(`/miembros/${id}`, { method: 'DELETE', token }),
  listarAsistencias: (token, idGrupo) => request(`/grupos/${idGrupo}/asistencias`, { token }),
  registrarAsistencia: (token, asistencia) => request('/asistencias', { method: 'POST', body: asistencia, token }),
  listarOfrendas: (token, idGrupo) => request(`/grupos/${idGrupo}/ofrendas`, { token }),
  registrarOfrenda: (token, ofrenda) => request('/ofrendas', { method: 'POST', body: ofrenda, token }),
  reporteSemanal: (token, inicio, fin) =>
    request(`/reportes/semanal?inicio=${inicio}&fin=${fin}`, { token }),
  asistenciaBaja: (token) => request('/reportes/asistencia-baja', { token }),
};
