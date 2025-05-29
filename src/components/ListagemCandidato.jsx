import React, { useState, useEffect } from 'react';
import { Card, Button, Dropdown, ListGroup, Alert } from 'react-bootstrap';

const ListagemCandidato = ({ onSelectCandidate, onViewCandidadeInfo }) => {
    const [topics, setTopics] = useState([]); // guarda a lista de temas (id + nome)
    const [selectedTopic, setSelectedTopic] = useState(null); // guarda o tema selecionado
    const [candidatos, setCandidatos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Carrega os temas
    useEffect(() => {
        fetch('http://localhost:8080/api/research-topics/by-process/1')
            .then(res => res.json())
            .then(data => setTopics(data))
            .catch(err => console.error('Erro ao carregar temas', err));
    }, []);

    // Quando o tema é selecionado, carrega os candidatos
    useEffect(() => {
        if (selectedTopic) {
            setLoading(true);
            fetch(`http://localhost:8080/api/applications/homologated-candidates/by-research-topic/${selectedTopic.id}`)
                .then(res => res.json())
                .then(data => {
                    setCandidatos(data);
                    setLoading(false);
                })
                .catch(err => {
                    setError('Erro ao carregar os candidatos');
                    setLoading(false);
                });
        }
    }, [selectedTopic]);

    return (
        <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
                <h5>Candidatos</h5>
                <Dropdown>
                    <Dropdown.Toggle variant="primary" id="dropdown-topics">
                        {selectedTopic ? selectedTopic.name : 'Selecione um tema'}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {topics.map((topic) => (
                            <Dropdown.Item
                                key={topic.id}
                                onClick={() => setSelectedTopic(topic)}
                            >
                                {topic.name}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </Card.Header>
            <Card.Body style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                {loading ? (
                    <Alert variant="secondary" className="text-center">Carregando...</Alert>
                ) : error ? (
                    <Alert variant="danger" className="text-center">{error}</Alert>
                ) : candidatos.length === 0 ? (
                    <Alert variant="info" className="text-center">Nenhum candidato encontrado para este tema.</Alert>
                ) : (
                    <ListGroup>
                        {candidatos.map((candidate, index) => (
                            <ListGroup.Item key={index} className="d-flex flex-column">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>{candidate.name}</strong>
                                    </div>
                                    <div>
                                        <Button 
                                            variant="info"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => {
                                                onViewCandidadeInfo(true)
                                                onSelectCandidate(candidate)
                                            }}>
                                            Detalhes
                                        </Button>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => {
                                                onViewCandidadeInfo(false)
                                                onSelectCandidate(candidate)
                                            }}
                                        >
                                            Avaliar
                                        </Button>
                                    </div>
                                </div>
                                <div className="mt-1 text-muted small">
                                    {selectedTopic?.name}
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Card.Body>
        </Card>
    );
};

export default ListagemCandidato;
