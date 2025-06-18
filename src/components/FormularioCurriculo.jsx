import FormularioGenerico from './FormularioGenerico';

const FormularioCurriculo = ({
  onSubmit,
  avaliacaoExistente,
  criterios = [],
  scoresExistentes = []
}) => {
  return (
    <FormularioGenerico
      titulo="Análise Curricular"
      classificatorio={true}
      onSubmit={onSubmit}
      avaliacaoExistente={avaliacaoExistente}
      criterios={criterios}
      scoresExistentes={scoresExistentes}
    />
  );
};

export default FormularioCurriculo;
