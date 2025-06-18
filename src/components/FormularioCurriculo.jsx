import FormularioGenerico from './FormularioGenerico';

const FormularioCurriculo = ({
  onSubmit,
  avaliacaoExistente,
  criterios = []
}) => {
  return (
    <FormularioGenerico
      titulo="Análise Curricular"
      classificatorio={true} // Currículo é etapa classificatória, sem status de aprovado/reprovado
      onSubmit={onSubmit}
      avaliacaoExistente={avaliacaoExistente}
      criterios={criterios}
    />
  );
};

export default FormularioCurriculo;
