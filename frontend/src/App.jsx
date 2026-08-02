import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import LiderDashboard from './pages/LiderDashboard';
import { useAuth } from './context/AuthContext';

function RutaProtegida({ children, rolRequerido }) {
  const { auth } = useAuth();
  if (!auth) return <Navigate to="/" replace />;
  if (rolRequerido && auth.usuario.rol !== rolRequerido) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/admin"
        element={
          <RutaProtegida rolRequerido="admin">
            <AdminDashboard />
          </RutaProtegida>
        }
      />
      <Route
        path="/lider"
        element={
          <RutaProtegida rolRequerido="lider">
            <LiderDashboard />
          </RutaProtegida>
        }
      />
    </Routes>
  );
}
