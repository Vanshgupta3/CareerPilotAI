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