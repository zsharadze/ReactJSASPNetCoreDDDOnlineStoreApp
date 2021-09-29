import React, { Component } from "react";
import Axios from "axios";
import { AuthContext } from "./AuthContext";
import { loginUrl, registerUrl } from "../data/Urls";
import { withRouter } from "react-router-dom";

export const AuthProviderImpl = withRouter(class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthenticated: false,
            token: null,
            tokenExpiration: "",
            userRole: "",
            userEmail: "",
        }
    }

    componentDidMount = () => {
        let isAuthenticated = localStorage.getItem('isAuthenticated');
        let tokenExpiration = localStorage.getItem('tokenExpiration');
        const currentDate = new Date();
        let tokenExpirationDate = new Date(tokenExpiration);
        if (tokenExpirationDate > currentDate && isAuthenticated != null)
            this.setState({
                isAuthenticated: isAuthenticated,
                userRole: localStorage.getItem('userRole'),
                token: localStorage.getItem('token'),
                tokenExpiration: tokenExpiration,
                userEmail: localStorage.getItem('userEmail'),
            });
    }

    authenticate = (credentials) => {
        return Axios.post(loginUrl, credentials).then(response => {
            if (response.data.success === true) {
                this.setState({
                    isAuthenticated: true,
                    token: response.data.token,
                    tokenExpiration: response.data.tokenExpiration,
                    userRole: response.data.userRole,
                    userEmail: response.data.userEmail
                })
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('tokenExpiration', response.data.tokenExpiration);
                localStorage.setItem('isAuthenticated', true);
                localStorage.setItem('userRole', response.data.userRole);
                localStorage.setItem('userEmail', response.data.userEmail);
            }

            return response.data;
        })
    }

    register = (credentials) => {
        return Axios.post(registerUrl, credentials).then(response => {
            return response.data;
        })
    }

    signout = () => {
        this.clearAuthCredentials(true);
    }

    clearAuthCredentials = (redirect) => {
        this.setState({ isAuthenticated: false, token: null, tokenExpiration: "", userRole: "" }, () => redirect ? this.props.history.push("/") : {});

        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiration');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
    }

    render = () =>
        <AuthContext.Provider value={{
            ...this.state,
            authenticate: this.authenticate, register: this.register, signout: this.signout, clearAuthCredentials: this.clearAuthCredentials
        }}>
            {this.props.children}
        </AuthContext.Provider>
})