import React, { useEffect, useState } from 'react';
import { Card, Button, Form, Row, Col, Container } from 'react-bootstrap';

const DetalhesCandidato = ({ selectedCandidate }) => {
    const [valores, setValores] = useState({
        nome: '',
        CPF: '',
        email: '',
        dataDeNascimento: '',
        cotista: '',
        modalidadeDaCota: '',
        endereco: '',
        numero: '',
        complemento: '',
        bairro: ''
    });

    const camposConfig = {
        nome: { label: 'Nome' },
        CPF: { label: 'CPF' },
        email: { label: 'Email' },
        dataDeNascimento: { label: 'Data de nascimento' },
        cotista: { label: 'É cotista' },
        modalidadeDaCota: { label: 'Modalidade da cota' },
        endereco: { label: 'Endereço' },
        numero: { label: 'Número' },
        complemento: { label: 'Complemento' },
        bairro: { label: 'Bairro' }
    };

    useEffect(() => {
        setValores({
            nome: selectedCandidate.nome || selectedCandidate.name || '',
            CPF: selectedCandidate.cpf || '',
            email: selectedCandidate.email || '',
            dataDeNascimento: selectedCandidate.dataNascimento || selectedCandidate.birthDate || '',
            cotista: selectedCandidate.cotista ? 'Sim' : 'Não' || '',
            modalidadeDaCota: selectedCandidate.cotista ? selectedCandidate.modalidadeCota : 'Não consta' || '',
            endereco: selectedCandidate.address || '',
            numero: selectedCandidate.addressNumber || '',
            complemento: selectedCandidate.addressComplement || '',
            bairro: selectedCandidate.addressNeighborhood || ''
        });
    }, [selectedCandidate]);

    return (
        <Card>
            <Card.Header>
                <h5>Detalhes</h5>
            </Card.Header>
            <Card.Body>
                <Form>
                    <Form.Group className="mb-3">
                        {Object.keys(camposConfig).map((key, index) => (
                            <Row key={index} className={index % 2 === 0 ? '' : 'mb-3'}>
                                <Col>
                                    <Form.Label className="mb-0">
                                        <h6><strong>{camposConfig[key].label}</strong></h6>
                                    </Form.Label>
                                    <Form.Control
                                        className="mb-3"
                                        type="text"
                                        placeholder=" "
                                        value={valores[key]}
                                        readOnly={true}
                                    />
                                </Col>
                            </Row>
                        ))}
                    </Form.Group>
                </Form>
                <Container>
                    <Button
                        variant="info"
                        size="sm"
                        className="me-2"
                        href={selectedCandidate.preProjeto}
                        target="_blank">
                        Pré-projeto
                    </Button>
                    <Button
                        variant="info"
                        size="sm"
                        className="me-2"
                        href={selectedCandidate.curriculo}
                        target="_blank">
                        Currículo
                    </Button>
                    <Button
                        variant="info"
                        size="sm"
                        className="me-2"
                        href={selectedCandidate.lattesLink}
                        target="_blank">
                        Lattes
                    </Button>
                </Container>
            </Card.Body>
        </Card>
    );
};

export default DetalhesCandidato;
