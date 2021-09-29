import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { authWrapper } from "./AuthWrapper";
import { HomeBtn } from "../common/homeBtn";
import { changePassword } from '../data/api';

export const ChangePasswordPrompt = withRouter(authWrapper(class extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMessage: null,
            oldPasswordPristine: true,
            newPasswordPristine: true,
            confirmPasswordPristine: true,
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
            passwordChangeSuccess: false,
        }
    }

    onSubmit(event) {
        event.preventDefault();
    }

    handleChangePassword = () => {
        if (this.state.oldPassword === "") {
            this.setState({ errorMessage: "Enter old password." })
            return;
        }
        if (this.state.newPassword === "") {
            this.setState({ errorMessage: "Enter new password." })
            return;
        }
        if (this.state.confirmPassword === "") {
            this.setState({ errorMessage: "Enter confirm password." })
            return;
        }

        if (this.state.newPassword !== this.state.confirmPassword) {
            this.setState({ errorMessage: "Confirm password does not match." });
            return;
        }

        let changePasswordModel = {
            OldPassword: this.state.oldPassword,
            NewPassword: this.state.newPassword,
            ConfirmPassword: this.state.confirmPassword
        }

        changePassword(changePasswordModel).then((res) => {
            if (!res.data.success) {
                this.setState({
                    errorMessage: res.data.message
                })
            }
            else {
                this.setState({
                    errorMessage: null,
                    passwordChangeSuccess: true
                })
            }
        }).catch((err) => console.log(err));
    }

    handleEnterKey = (event) => {
        if (event.key === 'Enter') {
            this.handleChangePassword();
        }
    };

    render = () =>
        <div className="container-fluid">
            <div className="row">
                <div className="col bg-dark text-white">
                    <div className="loginRegisterHomeBtn"><HomeBtn /></div>
                    <div className="navbar-brand ms-5">React JS Online Store App - Change Password</div>
                </div>
            </div>
            <div className="row">
                <div className="col m-2">
                    <div className="col-md-12 changePasswordTop">
                        {this.state.passwordChangeSuccess &&
                            <h4 className="bg-success text-center text-white m-1 p-2">
                                Password Changed Successfully
                            </h4>
                        }
                        {this.state.errorMessage != null &&
                            <h4 className="bg-danger text-center text-white m-1 p-2">
                                {this.state.errorMessage}
                            </h4>
                        }
                        {!this.state.passwordChangeSuccess &&
                            <h3>Change Password - {this.props.userEmail}</h3>
                        }
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col m-2">
                    {!this.state.passwordChangeSuccess &&
                        <div className="col-md-12 changePasswordForm">
                            <form onSubmit={this.onSubmit}>
                                <div className="form-group" style={{ marginTop: "8px" }}>
                                    <input type="password" className={"form-control" + (this.state.oldPassword.length || this.state.oldPasswordPristine ? '' : ' errorInput')} placeholder="Old Password" value={this.state.oldPassword} onKeyPress={this.handleEnterKey} onChange={(event) => { this.setState({ oldPassword: event.target.value, oldPasswordPristine: false }) }} />
                                </div>
                                <div className="form-group" style={{ marginTop: "8px" }}>
                                    <input type="password" className={"form-control" + (this.state.newPassword.length || this.state.newPasswordPristine ? '' : ' errorInput')} placeholder="New Password" value={this.state.newPassword} onKeyPress={this.handleEnterKey} onChange={(event) => { this.setState({ newPassword: event.target.value, newPasswordPristine: false }) }} />
                                </div>
                                <div className="form-group" style={{ marginTop: "8px" }}>
                                    <input type="password" className={"form-control" + (this.state.confirmPassword.length || this.state.confirmPasswordPristine ? '' : ' errorInput')} placeholder="Confirm Password" value={this.state.confirmPassword} onKeyPress={this.handleEnterKey} onChange={(event) => { this.setState({ confirmPassword: event.target.value, confirmPasswordPristine: false }) }} />
                                </div>
                                <div className="form-group" style={{ marginTop: "8px" }}>
                                    <button type="button" className="btn btn-primary" onClick={() => this.handleChangePassword()} >Save</button>
                                </div>
                            </form>
                        </div>
                    }
                </div>
            </div>
        </div>
}))