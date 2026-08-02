import { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

export default function LiderDashboard() {
  const { auth, logout } = useAuth();
  const token = auth?.token;

  const [grupo, setGrupo] = useState(null);
  const [miembros, setMiembros] = useState([]);
  const [nuevoMiembro, setNuevoMiembro] = useState({ nombre: '', direccion: '', edad: '', telefono: '' });
  const [asistencia, setAsistencia] = useState({ id_miembro: '', fecha: '', tipo: 'grupo', asistio: true });
  const [ofrenda, setOfrenda] = useState({ fecha: '', monto: '' });
  const [mensaje, setMensaje] = useState('');

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

  async function handleAsistencia(e) {
    e.preventDefault();
    await api.registrarAsistencia(token, {
      id_miembro: Number(asistencia.id_miembro),
      id_grupo: grupo.id,
      fecha: asistencia.fecha,
      tipo: asistencia.tipo,
      asistio: asistencia.asistio,
    });
    setMensaje('Asistencia registrada.');
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
        <ul>
          {miembros.map((m) => (
            <li key={m.id}>{m.nombre} — {m.edad} años — {m.telefono}</li>
          ))}
        </ul>
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
        <h2>Registrar asistencia</h2>
        <form onSubmit={handleAsistencia} className="inline-form">
          <select value={asistencia.id_miembro}
            onChange={(e) => setAsistencia({ ...asistencia, id_miembro: e.target.value })} required>
            <option value="">Selecciona miembro</option>
            {miembros.map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
          </select>
          <input type="date" value={asistencia.fecha}
            onChange={(e) => setAsistencia({ ...asistencia, fecha: e.target.value })} required />
          <select value={asistencia.tipo}
            onChange={(e) => setAsistencia({ ...asistencia, tipo: e.target.value })}>
            <option value="grupo">Grupo de amistad</option>
            <option value="domingo">Reunión del domingo</option>
          </select>
          <label>
            <input type="checkbox" checked={asistencia.asistio}
              onChange={(e) => setAsistencia({ ...asistencia, asistio: e.target.checked })} />
            Asistió
          </label>
          <button type="submit">Registrar</button>
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
