import { useState, useEffect } from 'react';
import { Form, Button, Alert, Card, Spinner } from 'react-bootstrap';
import { API_ENDPOINTS } from '../config';

const FormularioAvaliacaoPP = ({
  onSubmit,
  avaliacaoExistente: inicialAvaliacao,
  stageEvaluationId,
  processStageId,
  criterios = []
}) => {
  const [emEdicao, setEmEdicao] = useState(false);
  const [pontuacaoTotal, setPontuacaoTotal] = useState(0);
  const [avaliacao, setAvaliacao] = useState(false);
  const [valores, setValores] = useState({});
  const [erros, setErros] = useState({});
  const [loading, setLoading] = useState(!criterios.length);

  const calcularPontuacaoTotal = () => {
    const total = Object.values(valores).reduce((sum, v) => sum + (parseFloat(v) || 0), 0);
    setPontuacaoTotal(total);
  };

  useEffect(() => {
    calcularPontuacaoTotal();
  }, [valores]);

  useEffect(() => {
    const inicializaCampos = () => {
      const initialValues = {};
      const initialErrors = {};
      criterios.forEach(c => {
        initialValues[c.id] = inicialAvaliacao?.notas?.[c.id] ?? '';
        initialErrors[c.id] = false;
      });
      setValores(initialValues);
      setErros(initialErrors);
      setPontuacaoTotal(inicialAvaliacao?.pontuacaoTotal || 0);
      setAvaliacao(!inicialAvaliacao);
    };

    if (criterios.length) {
      inicializaCampos();
      setLoading(false);
    }
  }, [inicialAvaliacao, criterios]);

  const handleChange = (id, value, max) => {
    const num = value === '' ? null : parseFloat(value);
    setValores(prev => ({ ...prev, [id]: value }));

    const erro = value !== '' && (isNaN(num) || num < 0 || num > max);
    setErros(prev => ({ ...prev, [id]: erro }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const camposVazios = Object.values(valores).some(v => v === '');
    const camposComErro = Object.values(erros).some(e => e);

    if (camposVazios || camposComErro) {
      alert('Por favor, preencha todos os campos corretamente antes de enviar.');
      return;
    }

    if (onSubmit) {
      onSubmit(valores, avaliacao);
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" size="sm" /> Carregando critérios...
      </div>
    );
  }

  return (
    <Form onSubmit={handleSubmit}>
      {criterios.map((crit) => (
        <Form.Group key={crit.id} className="mb-3">
          <Form.Label>{crit.description}</Form.Label>
          <Form.Control
            type="number"
            min={0}
            max={crit.maximumScore}
            step="0.01"
            placeholder={`0 - ${crit.maximumScore}`}
            value={valores[crit.id] ?? ''}
            onChange={(e) => handleChange(crit.id, e.target.value, crit.maximumScore)}
            isInvalid={erros[crit.id]}
            disabled={!emEdicao}
          />
          <Form.Control.Feedback type="invalid">
            Digite um valor entre 0 e {crit.maximumScore}.
          </Form.Control.Feedback>
        </Form.Group>
      ))}

      <Card className="mb-3">
        <Card.Body>
          <Card.Text>
            <strong>Pontuação Total:</strong> {pontuacaoTotal}
            <br />
            <strong>Status:</strong> {pontuacaoTotal >= 70 ? '✅ Aprovado' : '❌ Reprovado'}
          </Card.Text>
        </Card.Body>
      </Card>

      <Button
        variant={emEdicao ? 'success' : 'primary'}
        onClick={(e) => {
          if (emEdicao) {
            setAvaliacao(false);
            handleSubmit(e);
            setEmEdicao(false);
          } else {
            setEmEdicao(true);
          }
        }}
      >
        {emEdicao ? 'Salvar Avaliação' : 'Editar Avaliação'}
      </Button>

      {Object.values(erros).some(e => e) && (
        <Alert variant="danger" className="mt-3">
          Corrija os campos destacados em vermelho antes de enviar.
        </Alert>
      )}
    </Form>
  );
};

export default FormularioAvaliacaoPP;
