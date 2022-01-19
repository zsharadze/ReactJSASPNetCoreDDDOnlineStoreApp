import React, { Component } from "react";
import { withRouter } from "../common/withRouter";
import { Link } from "react-router-dom";
import { authWrapper } from "./AuthWrapper";
import { HomeBtn } from "../common/homeBtn";

export const RegisterPrompt = withRouter(authWrapper(class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: null,
            email: "",
            password: "",
            confirmPassword: "",
            registerAsAdmin: false
        }
    }

    onSubmit(event) {
        event.preventDefault();
    }

    register = () => {
        if (this.state.email === "") {
            this.setState({
                errorMessage: "Please enter email"
            });
            return;
        }

        if (this.state.password === "") {
            this.setState({
                errorMessage: "Please enter password"
            });
            return;
        }

        if (this.state.password !== this.state.confirmPassword) {
            this.setState({
                errorMessage: "Passwords does not match"
            });
            return;
        }

        this.setState({
            errorMessage: null
        });

        let credentials = {
            Email: this.state.email,
            Password: this.state.password,
            RegisterAsAdmin: this.state.registerAsAdmin
        };

        this.props.register(credentials)
            .then(res => {
                if (res.success) {
                    this.props.clearAuthCredentials(false);
                    this.props.history("/login/?fromReg=true");
                }
                else {
                    this.setState({ errorMessage: res.message });
                }
            })
            .catch(err => this.setState({ errorMessage: err.message }));
    }

    render = () =>
        <div className="container-fluid">
            <div className="row">
                <div className="col bg-dark text-white">
                    <div className="loginRegisterHomeBtn"><HomeBtn /></div>
                    <div className="navbar-brand ms-5">React JS Online Store App - Register</div>
                </div>
            </div>
            <div className="row">
                <div className="col m-2">
                    {this.state.errorMessage != null &&
                        <h4 className="bg-danger text-center text-white m-1 p-2">
                            {this.state.errorMessage}
                        </h4>
                    }

                    <div className="col-md-12 registerForm">
                        <h3>Register</h3>
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="Email" value={this.state.email} onChange={(event) => { this.setState({ email: event.target.value }) }} />
                            </div>
                            <div className="form-group" style={{ marginTop: "8px" }}>
                                <input type="password" className="form-control" placeholder="Password" value={this.state.password} onChange={(event) => { this.setState({ password: event.target.value }) }} />
                            </div>
                            <div className="form-group" style={{ marginTop: "8px" }}>
                                <input type="password" className="form-control" placeholder="Confirm Password" value={this.state.confirmPassword} onChange={(event) => { this.setState({ confirmPassword: event.target.value }) }} />
                            </div>
                            <div className="form-check" style={{ marginTop: "8px" }}>
                                <input type="checkbox" className="form-check-input" id="registerAsAdmin" onChange={() => { this.setState({ registerAsAdmin: !this.state.registerAsAdmin }) }} value={this.state.registerAsAdmin} />
                                <label className="form-check-label noselect" htmlFor="registerAsAdmin">Register as admin</label>
                            </div>
                            <div className="form-group" style={{ marginTop: "8px" }}>
                                <button type="button" className="btn btn-primary" onClick={(e) => this.register()} >Register</button>
                            </div>
                            <div className="form-group">
                                <Link to="/login">Need login?</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
}))