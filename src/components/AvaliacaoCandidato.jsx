import React, { useEffect, useState } from 'react';
import { Card, Button, Alert, Spinner } from 'react-bootstrap';
import FormularioAvaliacaoPP from './FormularioAvaliacaoPP';
import FormularioEntrevista from './FormularioEntrevista';
import FormularioCurriculo from './FormularioCurriculo';
import { API_ENDPOINTS } from '../config';

const AvaliacaoCandidato = ({ selectedCandidate }) => {
  const [activeEvaluationTab, setActiveEvaluationTab] = useState(null);
  const [applicationId, setApplicationId] = useState(null);
  const [applicationError, setApplicationError] = useState(null);
  const [loadingApplicationId, setLoadingApplicationId] = useState(false);

  const [stageEvaluation, setStageEvaluation] = useState(null);
  const [stageEvaluationId, setStageEvaluationId] = useState(null);
  const [criterios, setCriterios] = useState([]);
  const [selectedStage, setSelectedStage] = useState(null);

  const processStageMap = {
    resume: 1,
    preProject: 2,
    interview: 3,
  };

  useEffect(() => {
    if (selectedCandidate?.id) {
      setLoadingApplicationId(true);
      fetch(API_ENDPOINTS.APLICATIONS_BY_CANDIDATE_ID(selectedCandidate.id))
        .then(res => {
          if (!res.ok) throw new Error('Erro ao buscar application');
          return res.json();
        })
        .then(data => {
          setApplicationId(data.id);
          setApplicationError(null);
        })
        .catch(err => {
          console.error(err);
          setApplicationError('Falha ao buscar aplicação do candidato.');
        })
        .finally(() => setLoadingApplicationId(false));
    }
  }, [selectedCandidate?.id]);

  const handleStageSelection = (stage) => {
    if (!applicationId) return;

    const processStageId = processStageMap[stage];
    setSelectedStage(stage);
    setActiveEvaluationTab(stage);
    setCriterios([]);
    setStageEvaluation(null);
    setStageEvaluationId(null);

    const urlFind = `${API_ENDPOINTS.ALL_STAGE_EVALUATIONS}/find?applicationId=${applicationId}&processStageId=${processStageId}&committeeMemberId=1`;

    fetch(urlFind)
      .then(res => {
        if (res.status === 404) return null;
        if (!res.ok) throw new Error('Erro ao buscar Stage Evaluation');
        return res.json();
      })
      .then(data => {
        if (data) {
          setStageEvaluationId(data.id);
          setStageEvaluation(data);
        } else {
          fetch(API_ENDPOINTS.EVALUATION_CRITERIA_BY_PROCESS_STAGE(processStageId))
            .then(res => {
              if (!res.ok) throw new Error('Erro ao buscar critérios');
              return res.json();
            })
            .then(data => {
              setCriterios(data);
            })
            .catch(err => {
              console.error('Erro ao buscar critérios:', err);
            });
        }
      })
      .catch(err => {
        console.error('Erro ao buscar Stage Evaluation:', err);
      });
  };

  const enviarScores = (valores, isNew) => {
    const processStageId = processStageMap[selectedStage];
    const scores = Object.entries(valores).map(([criterioId, scoreValue]) => ({
      evaluationCriterionId: parseInt(criterioId),
      scoreValue: parseFloat(scoreValue),
    }));

    const criarStageEvaluation = () => {
      const payload = {
        applicationId,
        processStageId,
        committeeMemberId: 1,
        evaluationDate: new Date().toISOString(),
      };

      return fetch(API_ENDPOINTS.ALL_STAGE_EVALUATIONS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).then(res => {
        if (!res.ok) throw new Error('Erro ao criar Stage Evaluation');
        return res.json();
      });
    };

    const enviarNotas = (stageEvalId) => {
      return fetch(API_ENDPOINTS.CRITERION_SCORE_BY_STAGE_EVALUATION_ID(stageEvalId), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scores }),
      });
    };

    const executar = async () => {
      try {
        let id = stageEvaluationId;
        if (isNew) {
          const newStage = await criarStageEvaluation();
          id = newStage.id;
          setStageEvaluationId(id);
        }
        await enviarNotas(id);
        alert('Pontuações enviadas com sucesso!');
      } catch (err) {
        console.error(err);
        alert('Erro ao enviar pontuações.');
      }
    };

    executar();
  };

  return (
    <Card>
      <Card.Header>
        <h5>Avaliação</h5>
      </Card.Header>
      <Card.Body>
        {selectedCandidate ? (
          <>
            <div className="mb-4">
              <h6>Candidato: {selectedCandidate.name}</h6>
              <p className="text-muted">Tema: {selectedCandidate.topicName}</p>
            </div>

            {loadingApplicationId ? (
              <div className="text-center">
                <Spinner animation="border" size="sm" /> Carregando dados da aplicação...
              </div>
            ) : applicationError ? (
              <Alert variant="danger">{applicationError}</Alert>
            ) : (
              <>
                <div className="d-flex mb-4">
                  <Button
                    variant={activeEvaluationTab === 'preProject' ? 'primary' : 'outline-primary'}
                    className="me-2"
                    onClick={() => handleStageSelection('preProject')}
                  >
                    Pré Projeto
                  </Button>
                  <Button
                    variant={activeEvaluationTab === 'interview' ? 'primary' : 'outline-primary'}
                    className="me-2"
                    onClick={() => handleStageSelection('interview')}
                  >
                    Entrevista
                  </Button>
                  <Button
                    variant={activeEvaluationTab === 'resume' ? 'primary' : 'outline-primary'}
                    onClick={() => handleStageSelection('resume')}
                  >
                    Currículo
                  </Button>
                </div>

                {activeEvaluationTab === 'preProject' && (
                  <FormularioAvaliacaoPP
                    onSubmit={enviarScores}
                    avaliacaoExistente={stageEvaluation}
                    criterios={criterios}
                  />
                )}

                {activeEvaluationTab === 'interview' && (
                  <FormularioEntrevista
                    onSubmit={enviarScores}
                    avaliacaoExistente={stageEvaluation}
                    criterios={criterios}
                  />
                )}

                {activeEvaluationTab === 'resume' && (
                  <FormularioCurriculo
                    onSubmit={enviarScores}
                    avaliacaoExistente={stageEvaluation}
                    criterios={criterios}
                  />
                )}

                {!activeEvaluationTab && (
                  <div className="text-center text-muted">
                    <p>Selecione um tipo de avaliação para começar</p>
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <div className="text-center text-muted">
            <p>Selecione um candidato para avaliar</p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default AvaliacaoCandidato;
