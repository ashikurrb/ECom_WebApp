import { useState, useEffect, useContext, createContext } from "react";
import axios from 'axios';
import Cookies from 'js-cookie';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        user: null,
        token: "",
    });

    axios.defaults.headers.common["Authorization"] = auth?.token;

    useEffect(() => {
        const data = Cookies.get("auth")
        if (data) {
            const parseData = JSON.parse(data);
            setAuth({
                ...auth,
                user: parseData.user,
                token: parseData.token
            });
        }
        //eslint-disable-next-line
    }, [])
    return (
        <AuthContext.Provider value={[auth, setAuth]}>
            {children}
        </AuthContext.Provider>
    )
}

//custom Hook
const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };