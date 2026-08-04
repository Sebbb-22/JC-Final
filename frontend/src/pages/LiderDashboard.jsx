import { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

export default function LiderDashboard() {
  const { auth, logout } = useAuth();
  const token = auth?.token;

  const [grupo, setGrupo] = useState(null);
  const [miembros, setMiembros] = useState([]);
  const [nuevoMiembro, setNuevoMiembro] = useState({ nombre: '', direccion: '', edad: '', telefono: '' });
  const [ofrenda, setOfrenda] = useState({ fecha: '', monto: '' });
  const [mensaje, setMensaje] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [editForm, setEditForm] = useState({ nombre: '', direccion: '', edad: '', telefono: '' });

  const [fechaAsistencia, setFechaAsistencia] = useState('');
  const [marcas, setMarcas] = useState({}); // { [id_miembro]: { grupo: bool, domingo: bool } }

  useEffect(() => {
    api.listarGrupos(token).then((grupos) => {
      const propio = grupos[0];
      setGrupo(propio || null);
      if (propio) api.listarMiembros(token, propio.id).then(setMiembros);
    });
  }, [token]);

  async function refrescarMiembros() {
    if (grupo) setMiembros(await api.listarMiembros(token, grupo.id));
  }

  async function handleCrearMiembro(e) {
    e.preventDefault();
    await api.crearMiembro(token, { ...nuevoMiembro, edad: Number(nuevoMiembro.edad), id_grupo: grupo.id });
    setNuevoMiembro({ nombre: '', direccion: '', edad: '', telefono: '' });
    refrescarMiembros();
  }

  function iniciarEdicion(m) {
    setEditandoId(m.id);
    setEditForm({ nombre: m.nombre, direccion: m.direccion || '', edad: m.edad ?? '', telefono: m.telefono || '' });
  }

  async function handleGuardarEdicion(id) {
    await api.actualizarMiembro(token, id, { ...editForm, edad: Number(editForm.edad) });
    setEditandoId(null);
    refrescarMiembros();
  }

  async function handleEliminarMiembro(id) {
    if (!window.confirm('¿Eliminar este miembro? Esta acción no se puede deshacer.')) return;
    await api.eliminarMiembro(token, id);
    refrescarMiembros();
  }

  function toggleMarca(idMiembro, tipo) {
    setMarcas((prev) => ({
      ...prev,
      [idMiembro]: { ...prev[idMiembro], [tipo]: !prev[idMiembro]?.[tipo] },
    }));
  }

  async function handleGuardarAsistencia(e) {
    e.preventDefault();
    const registros = [];
    for (const [idMiembro, marca] of Object.entries(marcas)) {
      if (marca.grupo) registros.push({ id_miembro: Number(idMiembro), tipo: 'grupo' });
      if (marca.domingo) registros.push({ id_miembro: Number(idMiembro), tipo: 'domingo' });
    }
    if (registros.length === 0) {
      setMensaje('Marca al menos una asistencia antes de guardar.');
      return;
    }
    await Promise.all(
      registros.map((r) =>
        api.registrarAsistencia(token, {
          id_miembro: r.id_miembro,
          id_grupo: grupo.id,
          fecha: fechaAsistencia,
          tipo: r.tipo,
          asistio: true,
        })
      )
    );
    setMensaje(`Asistencia del ${fechaAsistencia} guardada (${registros.length} registro(s)).`);
    setMarcas({});
  }

  async function handleOfrenda(e) {
    e.preventDefault();
    await api.registrarOfrenda(token, { id_grupo: grupo.id, fecha: ofrenda.fecha, monto: Number(ofrenda.monto) });
    setOfrenda({ fecha: '', monto: '' });
    setMensaje('Ofrenda registrada.');
  }

  if (!grupo) {
    return (
      <div className="dashboard">
        <header>
          <h1>Panel de Líder — {auth.usuario.nombre}</h1>
          <button onClick={logout}>Cerrar sesión</button>
        </header>
        <p>No tienes un grupo asignado todavía. Pide al administrador que te asigne uno.</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header>
        <h1>Panel de Líder — {auth.usuario.nombre}</h1>
        <button onClick={logout}>Cerrar sesión</button>
      </header>

      <section>
        <h2>{grupo.nombre}</h2>
        <p>{grupo.dia_semana} {grupo.hora} — {grupo.ubicacion}</p>
      </section>

      {mensaje && <p className="ok">{mensaje}</p>}

      <section>
        <h2>Miembros</h2>
        <table>
          <thead>
            <tr>
              <th>Nombre</th><th>Dirección</th><th>Edad</th><th>Teléfono</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {miembros.map((m) => (
              editandoId === m.id ? (
                <tr key={m.id} className="edit-row">
                  <td><input value={editForm.nombre}
                    onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })} /></td>
                  <td><input value={editForm.direccion}
                    onChange={(e) => setEditForm({ ...editForm, direccion: e.target.value })} /></td>
                  <td><input type="number" value={editForm.edad}
                    onChange={(e) => setEditForm({ ...editForm, edad: e.target.value })} /></td>
                  <td><input value={editForm.telefono}
                    onChange={(e) => setEditForm({ ...editForm, telefono: e.target.value })} /></td>
                  <td className="actions">
                    <button className="btn-sm" onClick={() => handleGuardarEdicion(m.id)}>Guardar</button>
                    <button className="btn-sm btn-secondary" onClick={() => setEditandoId(null)}>Cancelar</button>
                  </td>
                </tr>
              ) : (
                <tr key={m.id}>
                  <td>{m.nombre}</td>
                  <td>{m.direccion}</td>
                  <td>{m.edad}</td>
                  <td>{m.telefono}</td>
                  <td className="actions">
                    <button className="btn-sm btn-secondary" onClick={() => iniciarEdicion(m)}>Editar</button>
                    <button className="btn-sm btn-danger" onClick={() => handleEliminarMiembro(m.id)}>Eliminar</button>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
        <form onSubmit={handleCrearMiembro} className="inline-form">
          <h3>Agregar miembro</h3>
          <input placeholder="Nombre" value={nuevoMiembro.nombre}
            onChange={(e) => setNuevoMiembro({ ...nuevoMiembro, nombre: e.target.value })} required />
          <input placeholder="Dirección" value={nuevoMiembro.direccion}
            onChange={(e) => setNuevoMiembro({ ...nuevoMiembro, direccion: e.target.value })} />
          <input placeholder="Edad" type="number" value={nuevoMiembro.edad}
            onChange={(e) => setNuevoMiembro({ ...nuevoMiembro, edad: e.target.value })} />
          <input placeholder="Teléfono" value={nuevoMiembro.telefono}
            onChange={(e) => setNuevoMiembro({ ...nuevoMiembro, telefono: e.target.value })} />
          <button type="submit">Agregar</button>
        </form>
      </section>

      <section>
        <div className="section-title">
          <h2>Registrar asistencia</h2>
          <span className="subtle">Marca a quién vio ese día y guarda una sola vez</span>
        </div>
        <form onSubmit={handleGuardarAsistencia}>
          <div className="inline-form">
            <label>
              Fecha:{' '}
              <input type="date" value={fechaAsistencia}
                onChange={(e) => setFechaAsistencia(e.target.value)} required />
            </label>
          </div>
          <table className="asistencia-table">
            <thead>
              <tr>
                <th>Miembro</th>
                <th>Grupo de amistad</th>
                <th>Reunión del domingo</th>
              </tr>
            </thead>
            <tbody>
              {miembros.map((m) => (
                <tr key={m.id}>
                  <td>{m.nombre}</td>
                  <td>
                    <input type="checkbox" checked={!!marcas[m.id]?.grupo}
                      onChange={() => toggleMarca(m.id, 'grupo')} />
                  </td>
                  <td>
                    <input type="checkbox" checked={!!marcas[m.id]?.domingo}
                      onChange={() => toggleMarca(m.id, 'domingo')} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="submit" style={{ marginTop: '0.75rem' }}>Guardar asistencia</button>
        </form>
      </section>

      <section>
        <h2>Registrar ofrenda del grupo</h2>
        <form onSubmit={handleOfrenda} className="inline-form">
          <input type="date" value={ofrenda.fecha}
            onChange={(e) => setOfrenda({ ...ofrenda, fecha: e.target.value })} required />
          <input type="number" step="0.01" placeholder="Monto" value={ofrenda.monto}
            onChange={(e) => setOfrenda({ ...ofrenda, monto: e.target.value })} required />
          <button type="submit">Registrar</button>
        </form>
      </section>
    </div>
  );
}
