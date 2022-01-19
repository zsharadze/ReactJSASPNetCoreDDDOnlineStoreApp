import React, { Component } from "react";
import { Link } from "react-router-dom";
import { authWrapper } from "./AuthWrapper";
import { HomeBtn } from "../common/homeBtn";
import CommonContext from '../common/commonContext';

export const LoginPrompt = authWrapper(class extends Component {
    static contextType = CommonContext;

    constructor(props) {
        super(props);
        const queryString = require('query-string');
        let parsed = queryString.parse(this.props.location.search);
        let registerSuccess = false;
        if (parsed.fromReg) {
            registerSuccess = true;
        }
        let defaulterrorMessage = null;
        if (parsed.fromOrder) {
            defaulterrorMessage = "To place order please login."
        }

        if (parsed.needAdminLogin) {
            defaulterrorMessage = "You need to login with administrator in order to access that area"
        }

        this.state = {
            errorMessage: defaulterrorMessage,
            email: "",
            password: "",
            emailPristine: true,
            passwordPristine: true,
            registerSuccess: registerSuccess
        }


    }

    onSubmit(event) {
        event.preventDefault();
    }

    authenticate = () => {
        let credentials = {
            Username: this.state.email,
            Password: this.state.password
        };

        if (credentials.Username === "") {
            this.setState({
                emailPristine: false
            });
        }
        if (credentials.Password === "") {
            this.setState({
                passwordPristine: false
            });
        }

        if (credentials.Username === "" || credentials.Password === "") {
            return;
        }

        this.setState({
            errorMessage: null
        });

        this.props.authenticate(credentials)
            .then(res => {
                if (res.success) {
                    this.context.goToHomePath();
                }
                else {
                    this.setState({ errorMessage: "Invalid credentials" });
                }
            })
            .catch((err) => {
                this.setState({ errorMessage: err.message })
            });
    }

    handleEnterKey = (event) => {
        if (event.key === 'Enter') {
            this.authenticate();
        }
    };

    render = () =>
        <div className="container-fluid">
            <div className="row">
                <div className="col bg-dark text-white">
                    <div className="loginRegisterHomeBtn"><HomeBtn /></div>
                    <div className="navbar-brand ms-5">React JS Online Store App - Login</div>
                </div>
            </div>
            <div className="row">
                <div className="col m-2">
                    {this.state.registerSuccess &&
                        <h4 className="bg-success text-center text-white m-1 p-2">
                            Registration successfull. Please login
                        </h4>
                    }
                    {this.state.errorMessage != null &&
                        <h4 className="bg-danger text-center text-white m-1 p-2">
                            {this.state.errorMessage}
                        </h4>
                    }

                    <div className="col-md-12 loginForm">
                        <h3>Login</h3>
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <input type="text" className={"form-control" + (this.state.email.length || this.state.emailPristine ? '' : ' errorInput')} placeholder="Email" value={this.state.email} onKeyPress={this.handleEnterKey} onChange={(event) => { this.setState({ email: event.target.value, emailPristine: false }) }} />
                            </div>
                            <div className="form-group" style={{ marginTop: "8px" }}>
                                <input type="password" className={"form-control" + (this.state.password.length || this.state.passwordPristine ? '' : ' errorInput')} placeholder="Password" value={this.state.password} onKeyPress={this.handleEnterKey} onChange={(event) => { this.setState({ password: event.target.value, passwordPristine: false }) }} />
                            </div>
                            <div className="form-group" style={{ marginTop: "8px" }}>
                                <button type="button" className="btn btn-primary" onClick={() => this.authenticate()} >Login</button>
                            </div>
                            <div className="form-group">
                                <Link to="/register">Need registration?</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
})