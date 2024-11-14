const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            authentication: false
        },
        actions: {
            //LOGIN//
            login: async (email, password) => {
                const requestOptions = {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                };
                try {
                    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/login`, requestOptions);
                    const data = await response.json();
                    if (response.status === 200) {
                        localStorage.setItem("token", data.access_token);
                        setStore({ authentication: true });
                        return { success: true };
                    }
                    return { success: false, message: data.msg };
                } catch (error) {
                    console.error('Error during login:', error);
                    return { success: false, message: "Error connecting to server" };
                }
            },
            //LOGOUT//
            logout: () => {
                localStorage.removeItem("token");
                setStore({ authentication: false });
            },
            //SIGNUP//
            signup: async (email, password) => {
                const requestOptions = {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                };
                console.log("Sending signup request to:", `${process.env.REACT_APP_BACKEND_URL}/api/signup`);
                try {
                    // Make the request
                    console.log("Backend url:", process.env.REACT_APP_BACKEND_URL);
                    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/signup`, requestOptions);
                 
                    // Capture the raw response text
                    const responseText = await response.text();
                    console.log("Signup raw response:", responseText);
            
                    // Try to parse as JSON and log the parsed response
                    const data = JSON.parse(responseText);
                    console.log("Signup response parsed:", data);
            
                    if (response.status === 200) {
                        return { success: true, message: data.msg };
                    }
                    return { success: false, message: data.msg };
                } catch (error) {
                    console.error('Error during signup:', error);
                    return { success: false, message: "Error connecting to server" };
                }
            },
            //VERIFY TOKEN//
            verifyToken: async () => {
                const token = sessionStorage.getItem("token");
                if (!token) return { success: false, message: "No token found" };
            
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/verify-token`, {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    });
                    return response.status === 200 
                        ? { success: true } 
                        : { success: false, message: "Token is invalid or expired" };
                } catch (error) {
                    console.error("Token verification error:", error);
                    return { success: false, message: "Error verifying token" };
                }
            }
            
        }
    };
};

export default getState;
