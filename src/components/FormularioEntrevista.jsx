import FormularioGenerico from './FormularioGenerico';

const FormularioEntrevista = ({
  onSubmit,
  avaliacaoExistente,
  isNovaAvaliacao,
  criterios = [],
  scoresExistentes = [],
  observacaoInicial,
}) => {
  return (
    <FormularioGenerico
      titulo="Avaliação da Entrevista"
      classificatorio={false}
      onSubmit={onSubmit}
      avaliacaoExistente={avaliacaoExistente}
      isNovaAvaliacao={isNovaAvaliacao}
      criterios={criterios}
      scoresExistentes={scoresExistentes}
      observacaoInicial={observacaoInicial}
    />
  );
};

export default FormularioEntrevista;
