const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

//TODO: tornar o id do processo dinamico
export const API_ENDPOINTS = {
    RESEARCH_TOPICS: `${BASE_URL}/api/research-topics/by-process/3`,
    HOMOLOGATED_CANDIDATES_BY_TOPIC: (topicId) =>
        `${BASE_URL}/api/applications/homologated-candidates/by-research-topic/${topicId}`,
};