import FormularioGenerico from './FormularioGenerico';

const FormularioEntrevista = ({
  onSubmit,
  avaliacaoExistente,
  criterios = []
}) => {
  return (
    <FormularioGenerico
      titulo="Avaliação da Entrevista"
      onSubmit={onSubmit}
      avaliacaoExistente={avaliacaoExistente}
      criterios={criterios}
    />
  );
};

export default FormularioEntrevista;
