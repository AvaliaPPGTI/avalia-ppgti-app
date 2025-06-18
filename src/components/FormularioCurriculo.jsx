import FormularioGenerico from './FormularioGenerico';

const FormularioCurriculo = ({
  onSubmit,
  avaliacaoExistente,
  criterios = []
}) => {
  return (
    <FormularioGenerico
      titulo="Análise Curricular"
      classificatorio={true}
      onSubmit={onSubmit}
      avaliacaoExistente={avaliacaoExistente}
      criterios={criterios}
    />
  );
};

export default FormularioCurriculo;
