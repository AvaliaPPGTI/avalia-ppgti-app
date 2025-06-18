import FormularioGenerico from './FormularioGenerico';

const FormularioEntrevista = ({
  onSubmit,
  avaliacaoExistente,
  criterios = [],
  scoresExistentes = [],
}) => {
  return (
    <FormularioGenerico
      titulo="Avaliação da Entrevista"
      classificatorio={false}
      onSubmit={onSubmit}
      avaliacaoExistente={avaliacaoExistente}
      criterios={criterios}
      scoresExistentes={scoresExistentes}
    />
  );
};

export default FormularioEntrevista;
