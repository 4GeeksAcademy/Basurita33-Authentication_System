import React, { useEffect } from "react";
import { useStore } from "../store/appContext";

export const Private = () => {
    const { store, actions } = useStore();

    useEffect(() => {
        if (!store.authentication) {
            window.location.href = "/login"; 
        }
    }, [store.authentication]);

    return (
        <div>
            <h1>Private Page</h1>
            {store.authentication ? (
                <div>
                    <p>Welcome, you are logged in!</p>
                    <button onClick={actions.logout}>Logout</button>
                </div>
            ) : (
                <p>Redirecting...</p>
            )}
        </div>
    );
};
