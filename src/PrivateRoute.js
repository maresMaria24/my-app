import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Home from './views/home';
import Login from './views/login';
import Classes from './views/classes';
import Profile from './views/profile';

const PrivateRoute = ({ element, ...props }) => {
    const { isLoggedIn } = useAuth();
  
    return isLoggedIn ? (
      // Verificăm dacă utilizatorul este autentificat și redirecționăm către pagina principală în cazul în care încearcă să acceseze pagina de autentificare
      props.path === '/login' ? <Navigate to="/home" /> : <Route {...props} element={element} />
    ) : (
      <Navigate to="/login" />
    );
  };

export default PrivateRoute;
