import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Produtores } from './pages/Produtores';
import { Propriedades } from './pages/Propriedades';
import {Culturas} from './pages/Culturas';
import {Lotes} from './pages/Lotes';
import {Sensores} from './pages/Sensores';
import {LeiturasIoT} from './pages/LeiturasIoT';
import {Mercado} from './pages/Mercado';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirecionamento inicial */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Rotas principais */}
        
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/produtores" element={<Produtores />} />
        <Route path="/Propriedades" element={<Propriedades />} />
        <Route path="/Culturas" element={<Culturas />} />
        <Route path="/Lotes" element={<Lotes />} />
        <Route path="/Sensores" element={<Sensores />} />
        <Route path="/LeiturasIoT" element={<LeiturasIoT />} />
        <Route path="/Mercado" element={<Mercado />} />

        {/* Fallback para páginas não encontradas */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;