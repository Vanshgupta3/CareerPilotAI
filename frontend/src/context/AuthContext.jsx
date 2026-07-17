import { createContext, useContext, useEffect, useState } from "react";
import { getProfile } from "../services/AuthService";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);

    const [token, setToken] = useState(
        localStorage.getItem("token") || null
    );

    const loginUser = (userData, jwtToken) => {

        setUser(userData);

        setToken(jwtToken);

        localStorage.setItem("token", jwtToken);

    };

    const logoutUser = () => {

        setUser(null);

        setToken(null);

        localStorage.removeItem("token");

    };
    useEffect(() => {

    const fetchProfile = async () => {

        if (!token) return;

        try {

            const result = await getProfile(token);

            setUser(result.user);

        } catch (err) {

            console.error(err);

            logoutUser();

        }

    };

    fetchProfile();

}, [token]);

    return (

        <AuthContext.Provider
            value={{
                user,
                token,
                loginUser,
                logoutUser
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}

export function useAuth() {

    return useContext(AuthContext);

}
