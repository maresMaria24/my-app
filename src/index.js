import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Home from './views/home';
import Login from './views/login';
import Register from './views/register';
import Classes from './views/classes';
import Profile from './views/profile'
import Forum from './views/forum'
import Curs from './views/course';
import Lectie from './views/lectie';
import Discussion from './views/discussion'
import RegisterTeacher from './views/registerTeacher';
import TeacherListPage from './views/teacherListPage';
import PrivateRoute from './PrivateRoute';
import { AuthProvider } from './AuthContext';

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to="/Login" />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/Classes" element={<Classes />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/Forum" element={<Forum />} />
            <Route path="/curs/:id" element={<Curs />} />
            <Route path="/lectie/:id" element={<Lectie />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/RegisterTeacher" element={<RegisterTeacher />} />
            <Route path="/TeacherListPage" element={<TeacherListPage />} />
            <Route path="/discussion/:id" element={<Discussion />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
