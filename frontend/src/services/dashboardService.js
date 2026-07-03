import axios from "axios";

const DASHBOARD_API =
    "http://localhost:5000/api/dashboard";

export const getDashboardStats = async (token) => {

    const response = await axios.get(

        `${DASHBOARD_API}/stats`,

        {

            headers: {

                Authorization: `Bearer ${token}`

            }

        }

    );

    return response.data;

};