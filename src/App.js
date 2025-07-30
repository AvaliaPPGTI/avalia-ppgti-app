import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Interfacevaliacao from './components/InterfaceAvaliacao';
import InterfaceResultadoPorEtapa from './components/InterfaceResultadoPorEtapa';
import InterfaceClassificacao from './components/InterfaceClassificacao';
import InterfaceLogin from './components/InterfaceLogin';
import InterfacePesos from './components/InterfacePesoEtapas';

const App = () => {
  const [logado, setLogado] = useState(false);

  // Verifica se há um token JWT salvo
  useEffect(() => {
    const token = localStorage.getItem('token');
    setLogado(!!token); // true se o token existir
  }, []);

  const handleLoginSucesso = () => {
    setLogado(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLogado(false);
  };

  return (
    <Router>
      {logado && (
        <Navbar bg="light" variant="light" expand="lg">
          <Container>
            <Navbar.Brand href="/">AVALIA PPGTI</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar-nav" />
            <Navbar.Collapse id="navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/">Avaliação</Nav.Link>
                <Nav.Link as={Link} to="/resultado">Resultado por Etapa</Nav.Link>
                <Nav.Link as={Link} to="/classificacao">Classificação</Nav.Link>
                <Nav.Link as={Link} to="/pesos">Configurações do processo</Nav.Link>
                <Nav.Link onClick={handleLogout}>Sair</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}

      <Container className="mt-4">
        <Routes>
          {!logado ? (
            <>
              <Route path="/login" element={<InterfaceLogin onLogin={handleLoginSucesso} />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Interfacevaliacao />} />
              <Route path="/resultado" element={<InterfaceResultadoPorEtapa />} />
              <Route path="/classificacao" element={<InterfaceClassificacao />} />
              <Route path="/pesos" element={<InterfacePesos />} />
              <Route path="/login" element={<Navigate to="/" />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
