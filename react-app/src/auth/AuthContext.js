import React from "react";

export const AuthContext = React.createContext({
    isAuthenticated: false,
    token: null,
    tokenExpiration: "",
    userRole: "",
    userEmail: ""
})