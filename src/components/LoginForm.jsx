import { useState } from 'react';
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap';

const LoginForm = ({ onLogin }) => {
  const [ifRegistration, setIfRegistration] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!ifRegistration || !password) {
      setErro('Preencha todos os campos.');
      return;
    }

    setErro('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // mantém JSESSIONID se necessário
        body: JSON.stringify({ ifRegistration, password })
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('token', data.token); // salva o token no localStorage
        onLogin?.(); // callback para atualizar o estado de login
      } else {
        setErro(data.message || 'Erro ao tentar logar.');
      }
    } catch (err) {
      setErro('Erro na conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleLogin} className="mx-auto" style={{ maxWidth: '400px', marginTop: '80px' }}>
      <Card className="p-4">
        <h4 className="mb-3 text-center">Login</h4>

        <Form.Group className="mb-3">
          <Form.Label>Usuário (IF Registration)</Form.Label>
          <Form.Control
            type="text"
            value={ifRegistration}
            onChange={(e) => setIfRegistration(e.target.value)}
            placeholder="Digite seu registro"
            required
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Senha</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
            required
          />
        </Form.Group>

        {erro && <Alert variant="danger">{erro}</Alert>}

        <Button variant="primary" type="submit" disabled={loading} className="w-100">
          {loading ? <><Spinner size="sm" animation="border" /> Entrando...</> : 'Entrar'}
        </Button>
      </Card>
    </Form>
  );
};

export default LoginForm;
