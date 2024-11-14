import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useStore } from "./store/appContext";  
import ScrollToTop from "./component/scrollToTop";
//import { BackendURL } from "./component/backendURL";
import { Home } from "./pages/home";
import { Signup } from "./pages/signup";
import { Login } from "./pages/login";
import { Private } from "./pages/private";
import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import injectContext from "./store/appContext";

const Layout = () => {
    const { actions } = useStore();

    useEffect(() => {
        actions.verifyToken();
    }, [actions]);

    const basename = process.env.BASENAME || "";

    if (!process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_BACKEND_URL === "") return <BackendURL />;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Signup />} path="api/signup" />
                        <Route element={<Login />} path="api/login" />
                        <Route element={<Private />} path="api/private" />
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
