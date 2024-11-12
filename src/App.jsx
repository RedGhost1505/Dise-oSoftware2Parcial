import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';  // Importa la pantalla previa
import HomeUser from './HomeUser';  // Importa la pantalla de usuario
import HomeAdmin from './HomeAdmin';  // Importa la pantalla de administrador


function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta para la pantalla previa */}
        <Route path="/" element={<HomePage />} />

        {/* Ruta para la app principal */}
        <Route path="/app" element={<HomeUser />} />

        {/* Ruta para la pantalla de administrador */}
        <Route path="/admin" element={<HomeAdmin />} />


      </Routes>
    </Router>
  );
}

export default App;
