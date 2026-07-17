import api from "./api";

const authConfig = (token) => ({
    headers: { Authorization: `Bearer ${token}` }
});

export const startLiveInterview = async (data, token) => {
    const response = await api.post("/live-interview/start", data, authConfig(token));
    return response.data;
};

export const getLiveInterview = async (interviewId, token) => {
    const response = await api.get(
        `/live-interview/${encodeURIComponent(interviewId)}`,
        authConfig(token)
    );
    return response.data;
};

export const submitLiveAnswer = async (interviewId, answer, token) => {
    const response = await api.post(
        `/live-interview/${encodeURIComponent(interviewId)}/answer`,
        { answer },
        authConfig(token)
    );
    return response.data;
};

export const generateLiveFeedback = async (interviewId, token) => {
    const response = await api.post(
        `/live-interview/${encodeURIComponent(interviewId)}/feedback`,
        {},
        authConfig(token)
    );
    return response.data;
};
