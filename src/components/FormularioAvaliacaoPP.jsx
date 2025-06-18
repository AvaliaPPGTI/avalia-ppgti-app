import FormularioGenerico from './FormularioGenerico';

const FormularioAvaliacaoPP = ({
  onSubmit,
  avaliacaoExistente,
  criterios = [],
  scoresExistentes = []
}) => {
  return (
    <FormularioGenerico
      titulo="Avaliação do Pré-Projeto"
      classificatorio={false}
      onSubmit={onSubmit}
      avaliacaoExistente={avaliacaoExistente}
      criterios={criterios}
      scoresExistentes={scoresExistentes}
    />
  );
};

export default FormularioAvaliacaoPP;
