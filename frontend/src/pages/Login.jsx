import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";

function Login() {

    const navigate = useNavigate();

    const { loginUser } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        setLoading(true);

        try {

            const result = await login(formData);

            loginUser(
                result.user,
                result.token
            );

            navigate("/dashboard");

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Login failed"
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">

            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">

                <h1 className="text-4xl font-bold text-white">
                    Welcome Back
                </h1>

                <p className="text-slate-400 mt-2">
                    Login to CareerPilot AI
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="mt-8 space-y-6"
                >

                    <div>

                        <label className="text-slate-300">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full mt-2 p-3 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-blue-500"
                        />

                    </div>

                    <div>

                        <label className="text-slate-300">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full mt-2 p-3 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-blue-500"
                        />

                        <div className="flex justify-end mt-2">

                            <button
                                type="button"
                                className="text-sm text-blue-500 hover:text-blue-400"
                            >
                                Forgot Password?
                            </button>

                        </div>

                    </div>

                    {error && (

                        <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 text-red-400 text-sm">

                            {error}

                        </div>

                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-xl py-3 text-white font-semibold transition"
                    >

                        {loading ? "Logging in..." : "Login"}

                    </button>

                </form>

                <p className="text-center text-slate-400 mt-6">

                    Don't have an account?{" "}

                    <Link
                        to="/signup"
                        className="text-blue-500 hover:text-blue-400 font-medium"
                    >
                        Sign Up
                    </Link>

                </p>

            </div>

        </div>

    );

}

export default Login;