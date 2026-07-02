import api from "./api";

export const uploadResume = async (formData, token) => {

    const response = await api.post(
        "/resume-analysis/upload",
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;

};

export const analyzeResume = async (token) => {

    const response = await api.post(
        "/resume-analysis/analyze",
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;

};
export const getLatestAnalysis = async (token) => {

    const response = await api.get(
        "/resume-analysis/latest",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;

};