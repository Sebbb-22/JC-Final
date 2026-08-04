import { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { auth, logout } = useAuth();
  const token = auth?.token;

  const [grupos, setGrupos] = useState([]);
  const [nuevoGrupo, setNuevoGrupo] = useState({ nombre: '', id_lider: '', dia_semana: 'Lunes', hora: '19:00', ubicacion: '' });
  const [editandoId, setEditandoId] = useState(null);
  const [editForm, setEditForm] = useState({ nombre: '', dia_semana: 'Lunes', hora: '19:00', ubicacion: '' });

  const [inicio, setInicio] = useState('');
  const [fin, setFin] = useState('');
  const [reporte, setReporte] = useState([]);
  const [asistenciaBaja, setAsistenciaBaja] = useState([]);

  useEffect(() => {
    api.listarGrupos(token).then(setGrupos).catch(() => {});
  }, [token]);

  async function handleCrearGrupo(e) {
    e.preventDefault();
    await api.crearGrupo(token, { ...nuevoGrupo, id_lider: Number(nuevoGrupo.id_lider) });
    setGrupos(await api.listarGrupos(token));
    setNuevoGrupo({ nombre: '', id_lider: '', dia_semana: 'Lunes', hora: '19:00', ubicacion: '' });
  }

  function iniciarEdicion(grupo) {
    setEditandoId(grupo.id);
    setEditForm({ nombre: grupo.nombre, dia_semana: grupo.dia_semana, hora: grupo.hora, ubicacion: grupo.ubicacion });
  }

  async function handleGuardarEdicion(id) {
    await api.actualizarGrupo(token, id, editForm);
    setGrupos(await api.listarGrupos(token));
    setEditandoId(null);
  }

  async function handleEliminarGrupo(id) {
    if (!window.confirm('¿Eliminar este grupo? Esta acción no se puede deshacer.')) return;
    await api.eliminarGrupo(token, id);
    setGrupos(await api.listarGrupos(token));
  }

  async function handleReporteSemanal(e) {
    e.preventDefault();
    setReporte(await api.reporteSemanal(token, inicio, fin));
  }

  async function cargarAsistenciaBaja() {
    setAsistenciaBaja(await api.asistenciaBaja(token));
  }

  return (
    <div className="dashboard">
      <header>
        <h1>Panel de Administrador — {auth.usuario.nombre}</h1>
        <button onClick={logout}>Cerrar sesión</button>
      </header>

      <section>
        <h2>Grupos</h2>
        <table>
          <thead>
            <tr>
              <th>Nombre</th><th>Líder</th><th>Día</th><th>Hora</th><th>Ubicación</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {grupos.map((g) => (
              editandoId === g.id ? (
                <tr key={g.id} className="edit-row">
                  <td><input value={editForm.nombre}
                    onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })} /></td>
                  <td>{g.lider?.nombre}</td>
                  <td>
                    <select value={editForm.dia_semana}
                      onChange={(e) => setEditForm({ ...editForm, dia_semana: e.target.value })}>
                      {['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'].map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </td>
                  <td><input type="time" value={editForm.hora}
                    onChange={(e) => setEditForm({ ...editForm, hora: e.target.value })} /></td>
                  <td><input value={editForm.ubicacion}
                    onChange={(e) => setEditForm({ ...editForm, ubicacion: e.target.value })} /></td>
                  <td className="actions">
                    <button className="btn-sm" onClick={() => handleGuardarEdicion(g.id)}>Guardar</button>
                    <button className="btn-sm btn-secondary" onClick={() => setEditandoId(null)}>Cancelar</button>
                  </td>
                </tr>
              ) : (
                <tr key={g.id}>
                  <td>{g.nombre}</td>
                  <td>{g.lider?.nombre}</td>
                  <td>{g.dia_semana}</td>
                  <td>{g.hora}</td>
                  <td>{g.ubicacion}</td>
                  <td className="actions">
                    <button className="btn-sm btn-secondary" onClick={() => iniciarEdicion(g)}>Editar</button>
                    <button className="btn-sm btn-danger" onClick={() => handleEliminarGrupo(g.id)}>Eliminar</button>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>

        <form onSubmit={handleCrearGrupo} className="inline-form">
          <h3>Nuevo grupo</h3>
          <input placeholder="Nombre" value={nuevoGrupo.nombre}
            onChange={(e) => setNuevoGrupo({ ...nuevoGrupo, nombre: e.target.value })} required />
          <input placeholder="ID del líder" type="number" value={nuevoGrupo.id_lider}
            onChange={(e) => setNuevoGrupo({ ...nuevoGrupo, id_lider: e.target.value })} required />
          <select value={nuevoGrupo.dia_semana}
            onChange={(e) => setNuevoGrupo({ ...nuevoGrupo, dia_semana: e.target.value })}>
            {['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'].map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <input type="time" value={nuevoGrupo.hora}
            onChange={(e) => setNuevoGrupo({ ...nuevoGrupo, hora: e.target.value })} />
          <input placeholder="Ubicación" value={nuevoGrupo.ubicacion}
            onChange={(e) => setNuevoGrupo({ ...nuevoGrupo, ubicacion: e.target.value })} />
          <button type="submit">Crear grupo</button>
        </form>
      </section>

      <section>
        <h2>Reporte semanal por grupo</h2>
        <form onSubmit={handleReporteSemanal} className="inline-form">
          <input type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} required />
          <input type="date" value={fin} onChange={(e) => setFin(e.target.value)} required />
          <button type="submit">Generar reporte</button>
        </form>
        {reporte.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Grupo</th><th>Líder</th><th>Ubicación</th><th>Día/Hora</th>
                <th>Asist. Grupo</th><th>Asist. Domingo</th><th>Ofrenda</th>
              </tr>
            </thead>
            <tbody>
              {reporte.map((r) => (
                <tr key={r.id_grupo}>
                  <td>{r.grupo}</td><td>{r.lider}</td><td>{r.ubicacion}</td>
                  <td>{r.dia_semana} {r.hora}</td>
                  <td>{r.asistentes_grupo}</td><td>{r.asistentes_domingo}</td>
                  <td>${r.total_ofrenda}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h2>Grupos con menor asistencia (últimos 7 días)</h2>
        <button onClick={cargarAsistenciaBaja}>Consultar</button>
        {asistenciaBaja.length > 0 && (
          <table>
            <thead>
              <tr><th>Grupo</th><th>Total miembros</th><th>Asistieron</th></tr>
            </thead>
            <tbody>
              {asistenciaBaja.map((r) => (
                <tr key={r.id_grupo}>
                  <td>{r.grupo}</td><td>{r.total_miembros}</td><td>{r.asistieron_ultima_semana}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
