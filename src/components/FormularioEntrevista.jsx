import { useState, useEffect } from 'react';
import { Form, Button, Alert, Card, Spinner } from 'react-bootstrap';

const FormularioEntrevista = ({
  onSubmit,
  avaliacaoExistente: inicialAvaliacao,
  criterios = [],
}) => {
  const [emEdicao, setEmEdicao] = useState(!inicialAvaliacao);
  const [pontuacaoTotal, setPontuacaoTotal] = useState(0);
  const [avaliacao, setAvaliacao] = useState(!inicialAvaliacao);
  const [valores, setValores] = useState({});
  const [erros, setErros] = useState({});
  const [loading, setLoading] = useState(false);

  const calcularPontuacaoTotal = () => {
    const total = Object.values(valores).reduce(
      (sum, v) => sum + (parseFloat(v) || 0),
      0
    );
    setPontuacaoTotal(total);
  };

  useEffect(() => {
    calcularPontuacaoTotal();
  }, [valores]);

  useEffect(() => {
    setLoading(true);

    if (inicialAvaliacao) {
      const initialValues = {};
      const initialErrors = {};
      criterios.forEach(c => {
        initialValues[c.id] = inicialAvaliacao?.scores?.find(s => s.evaluationCriterionId === c.id)?.scoreValue || '';
        initialErrors[c.id] = false;
      });

      setValores(initialValues);
      setErros(initialErrors);
      setPontuacaoTotal(inicialAvaliacao?.totalStageScore || 0);
      setAvaliacao(false);
      setEmEdicao(false); // avaliação existente -> começa bloqueado
    } else {
      const initialValues = {};
      const initialErrors = {};
      criterios.forEach(c => {
        initialValues[c.id] = '';
        initialErrors[c.id] = false;
      });

      setValores(initialValues);
      setErros(initialErrors);
      setPontuacaoTotal(0);
      setAvaliacao(true);
      setEmEdicao(true); // 🔥 avaliação nova -> começa desbloqueado
    }

    setLoading(false);
  }, [inicialAvaliacao, criterios]);

  const handleChange = (id, value, max) => {
    const num = value === '' ? null : parseFloat(value);

    setValores(prev => ({ ...prev, [id]: value }));

    const erro =
      value !== '' &&
      (isNaN(num) ||
        num < 0 ||
        num > max ||
        !Number.isFinite(num));

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
      {criterios.map((criterio) => (
        <Card key={criterio.id} className="mb-3">
          <Card.Header>
            <strong>{criterio.description}</strong> (máx {criterio.maximumScore})
          </Card.Header>
          <Card.Body>
            <Form.Group className="mb-3">
              <Form.Control
                type="number"
                min={0}
                max={criterio.maximumScore}
                step="0.01"
                placeholder={`0 - ${criterio.maximumScore}`}
                value={valores[criterio.id] ?? ''}
                onChange={(e) =>
                  handleChange(
                    criterio.id,
                    e.target.value,
                    criterio.maximumScore
                  )
                }
                isInvalid={erros[criterio.id]}
                disabled={!emEdicao}
              />
              <Form.Control.Feedback type="invalid">
                Digite um valor entre 0 e {criterio.maximumScore}.
              </Form.Control.Feedback>
            </Form.Group>
          </Card.Body>
        </Card>
      ))}

      <Card className="mb-3">
        <Card.Body>
          <Card.Text>
            <strong>Pontuação Total:</strong> {pontuacaoTotal}
            <br />
            <strong>Status:</strong>{' '}
            {pontuacaoTotal >= 70 ? '✅ Aprovado' : '❌ Reprovado'}
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

export default FormularioEntrevista;
