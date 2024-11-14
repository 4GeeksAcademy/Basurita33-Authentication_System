import React, { useState } from "react";
import { useStore } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const Login = () => {
    const { actions } = useStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        const result = await actions.login(email, password);
        if (result.success) {
            navigate("/api/private");
        } else {
            setMessage(result.message);
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <button onClick={handleLogin}>Login</button>
            {message && <p>{message}</p>}
        </div>
    );
};
