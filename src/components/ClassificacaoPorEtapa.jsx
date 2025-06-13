import React, { useState, useEffect } from 'react';
import { Table, Tabs, Tab, Dropdown, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const mockApiResponse = [
    { nome: 'Alice Almeida', cota: true, nota: 80, status: 'Aprovado', linhaPesquisa: 'Linha A', temaPesquisa: 'Tema 1', etapa: 'preProjeto' },
    { nome: 'Alice Al', cota: true, nota: 60, status: 'Reprovado', linhaPesquisa: 'Linha A', temaPesquisa: 'Tema 2', etapa: 'preProjeto' },
    { nome: 'Bernardo Barbosa', cota: false, nota: 75, status: 'Reprovado', linhaPesquisa: 'Linha A', temaPesquisa: 'Tema 1', etapa: 'preProjeto' },
    { nome: 'Carla Correia', cota: true, nota: 60, status: 'Reprovado', linhaPesquisa: 'Linha B', temaPesquisa: 'Tema 3', etapa: 'preProjeto' },
    { nome: 'Alice Almeida', cota: true, nota: 85, status: 'Aprovado', linhaPesquisa: 'Linha A', temaPesquisa: 'Tema 1', etapa: 'entrevista' },
    { nome: 'Bernardo Barbosa', cota: false, nota: 70, status: 'Aprovado', linhaPesquisa: 'Linha A', temaPesquisa: 'Tema 1', etapa: 'entrevista' },
    { nome: 'Alice Almeida', cota: true, nota: 90, status: 'Classificado', linhaPesquisa: 'Linha A', temaPesquisa: 'Tema 1', etapa: 'curriculo' },
    { nome: 'Bernardo Barbosa', cota: false, nota: 88, status: 'Classificado', linhaPesquisa: 'Linha A', temaPesquisa: 'Tema 1', etapa: 'curriculo' },
];

const processApiData = (apiData) => {
    const stages = ['preProjeto', 'entrevista', 'curriculo'];
    const structuredData = {};

    stages.forEach((stage) => {
        const stageData = apiData.filter((item) => item.etapa === stage);
        const groupedByLineAndTheme = stageData.reduce((acc, item) => {
            const key = `${item.linhaPesquisa}|${item.temaPesquisa}`;
            if (!acc[key]) {
                acc[key] = {
                    linhaPesquisa: item.linhaPesquisa,
                    temaPesquisa: item.temaPesquisa,
                    candidatos: [],
                };
            }
            acc[key].candidatos.push({
                nome: item.nome,
                cota: item.cota,
                nota: item.nota,
                status: item.status,
            });
            return acc;
        }, {});

        structuredData[stage] = Object.values(groupedByLineAndTheme);
    });

    return structuredData;
};

const ClassificacaoPorEtapa = () => {
    const [activeTab, setActiveTab] = useState('preProjeto');
    const [data, setData] = useState({});
    const [filters, setFilters] = useState({
        linhaPesquisa: '',
        temaPesquisa: '',
        status: '',
    });

    useEffect(() => {
        const structuredData = processApiData(mockApiResponse);
        setData(structuredData);
    }, []);

    const handleFilterChange = (filterType, value) => {
        setFilters({ ...filters, [filterType]: value });
    };

    const getFilteredData = (stageData) => {
        if (!stageData) return [];
        return stageData
            .filter((item) =>
                filters.linhaPesquisa ? item.linhaPesquisa === filters.linhaPesquisa : true
            )
            .filter((item) =>
                filters.temaPesquisa ? item.temaPesquisa === filters.temaPesquisa : true
            )
            .map((item) => ({
                ...item,
                candidatos: item.candidatos.filter((candidato) =>
                    filters.status ? candidato.status === filters.status : true
                ),
            }))
            .filter((item) => item.candidatos.length > 0);
    };

   const exportToPDF = () => {
    const doc = new jsPDF();
    let yPos = 20; // Posição vertical inicial

    // Obtém os dados filtrados da aba ativa
    const filteredData = getFilteredData(data[activeTab]);

    // Verifica se há dados para exportar
    if (filteredData.length === 0) {
        alert('Nenhum dado filtrado para exportar!');
        return;
    }

    // Adiciona título da etapa
    doc.setFontSize(16);
    doc.text(`Etapa: ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`, 10, yPos);
    yPos += 10;

    // Adiciona informações sobre os filtros aplicados
    doc.setFontSize(10);
    let filterInfo = 'Filtros aplicados: ';
    if (filters.linhaPesquisa) filterInfo += `Linha: ${filters.linhaPesquisa} `;
    if (filters.temaPesquisa) filterInfo += `Tema: ${filters.temaPesquisa} `;
    if (filters.status) filterInfo += `Status: ${filters.status}`;
    
    if (filterInfo !== 'Filtros aplicados: ') {
        doc.text(filterInfo, 10, yPos);
        yPos += 7;
    }

    filteredData.forEach((group) => {
        // Verifica se precisa de nova página
        if (yPos > 250) {
            doc.addPage();
            yPos = 20;
        }

        // Adiciona informações do grupo
        doc.setFontSize(12);
        doc.text(`Linha de Pesquisa: ${group.linhaPesquisa}`, 10, yPos);
        yPos += 7;
        doc.text(`Tema de Pesquisa: ${group.temaPesquisa}`, 10, yPos);
        yPos += 10;

        // Prepara dados da tabela
        const tableData = group.candidatos.map((candidato) => [
            candidato.nome,
            candidato.cota ? 'Sim' : 'Não',
            candidato.nota.toString(),
            candidato.status
        ]);

        // Adiciona tabela
        autoTable(doc, {
            startY: yPos,
            head: [['Nome', 'Cota', 'Nota', 'Status']],
            body: tableData,
            margin: { top: 10 },
            styles: { overflow: 'linebreak', cellWidth: 'wrap' },
            columnStyles: {
                0: { cellWidth: 'auto' },
                1: { cellWidth: 20 },
                2: { cellWidth: 20 },
                3: { cellWidth: 'auto' }
            }
        });

        // Atualiza posição Y para a próxima tabela
        yPos = doc.lastAutoTable.finalY + 10;
    });

    doc.save('candidatos_filtrados.pdf');
};

    const renderTable = (stageData) => {
        return stageData.map((item, index) => (
            <div key={index} className="mb-4">
                <h5>Linha de Pesquisa: {item.linhaPesquisa}</h5>
                <h6>Tema de Pesquisa: {item.temaPesquisa}</h6>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Nome do Candidato</th>
                            <th>Optante por Cota</th>
                            <th>Nota</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {item.candidatos.map((candidato, idx) => (
                            <tr key={idx}>
                                <td>{candidato.nome}</td>
                                <td>{candidato.cota ? 'Sim' : 'Não'}</td>
                                <td>{candidato.nota}</td>
                                <td>{candidato.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        ));
    };

    const uniqueOptions = (key) => {
        const options = new Set();
        Object.values(data).forEach((stage) => {
            stage.forEach((item) => {
                if (key === 'status') {
                    item.candidatos.forEach((candidato) => options.add(candidato[key]));
                } else {
                    options.add(item[key]);
                }
            });
        });
        return Array.from(options);
    };

    return (
        <div className="container mt-4">
            <h2>Resultados Por Etapa</h2>
            <div className="d-flex justify-content-between align-items-center my-3">
                <Dropdown onSelect={(e) => handleFilterChange('linhaPesquisa', e)}>
                    <Dropdown.Toggle variant="primary">
                        {filters.linhaPesquisa || 'Linha de Pesquisa'}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item eventKey="">Todos</Dropdown.Item>
                        {uniqueOptions('linhaPesquisa').map((option, index) => (
                            <Dropdown.Item key={index} eventKey={option}>
                                {option}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>

                <Dropdown onSelect={(e) => handleFilterChange('temaPesquisa', e)}>
                    <Dropdown.Toggle variant="primary">
                        {filters.temaPesquisa || 'Tema de Pesquisa'}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item eventKey="">Todos</Dropdown.Item>
                        {uniqueOptions('temaPesquisa').map((option, index) => (
                            <Dropdown.Item key={index} eventKey={option}>
                                {option}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>

                <Dropdown onSelect={(e) => handleFilterChange('status', e)}>
                    <Dropdown.Toggle variant="primary">
                        {filters.status || 'Status'}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item eventKey="">Todos</Dropdown.Item>
                        {uniqueOptions('status').map((option, index) => (
                            <Dropdown.Item key={index} eventKey={option}>
                                {option}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>

              <Button variant="success" onClick={exportToPDF}>Exportar PDF</Button>

            </div>

            <Tabs
                id="candidate-tabs"
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-3"
            >
                <Tab eventKey="preProjeto" title="Pré-Projeto">
                    {renderTable(getFilteredData(data.preProjeto))}
                </Tab>
                <Tab eventKey="entrevista" title="Entrevista">
                    {renderTable(getFilteredData(data.entrevista))}
                </Tab>
                <Tab eventKey="curriculo" title="Currículo">
                    {renderTable(getFilteredData(data.curriculo))}
                </Tab>
            </Tabs>
        </div>
    );
};

export default ClassificacaoPorEtapa;
