import React, { useState } from "react";
import { useStore } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
    const { actions } = useStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSignup = async () => {
        console.log("Attempting signup with:", email, password);
        const result = await actions.signup(email, password);
        if (result.success) {
            navigate("/api/login");
        } else {
            setMessage(result.message);
        }
    };

    return (
        <div>
            <h1>Sign Up</h1>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button onClick={handleSignup}>Sign Up</button>
            {message && <p>{message}</p>}
        </div>
    );
};
