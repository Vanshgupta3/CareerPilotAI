import api from "./api";

// Start Interview
export const startInterview = async (data, token) => {

    const response = await api.post(

        "/interview/start",

        data,

        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

    );

    return response.data;

};

// Get Interview Questions
export const getInterviewQuestions = async (

    interviewId,
    token

) => {

    const response = await api.get(

        `/interview/${encodeURIComponent(interviewId)}/questions`,

        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

    );

    return response.data;

};

// Submit All Answers
export const submitAnswers = async (

    answers,
    token

) => {

    const response = await api.post(

        "/answer/submit",

        {
            answers
        },

        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

    );

    return response.data;

};

// Generate Interview Feedback
export const generateInterviewFeedback = async (

    interviewId,
    token

) => {

    const response = await api.post(

        "/interview/feedback",

        {
            interviewId
        },

        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

    );

    return response.data;

};

// Get Interview Feedback
export const getInterviewFeedback = async (

    interviewId,
    token

) => {

    const response = await api.get(

        `/interview/feedback/${encodeURIComponent(interviewId)}`,

        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

    );

    return response.data;

};

// Get Latest Feedback
export const getLatestFeedback = async (token) => {

    const response = await api.get(

        "/interview/latest-feedback",

        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

    );

    return response.data;

};
export const getInterviewHistory = async (token) => {

    const response = await api.get(

        "/interview/history",

        {

            headers: {

                Authorization: `Bearer ${token}`

            }

        }

    );

    return response.data;

};

export const downloadInterviewReport = async (interviewId, token) => {

    const response = await api.get(

        `/report/interview/${encodeURIComponent(interviewId)}`,

        {
            headers: {
                Authorization: `Bearer ${token}`
            },
            responseType: "blob"
        }

    );

    return response.data;

};
