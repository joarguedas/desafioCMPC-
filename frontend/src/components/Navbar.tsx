import { useNavigate } from 'react-router-dom';

export function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return <button onClick={handleLogout}>Cerrar sesión</button>;
}