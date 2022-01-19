import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withRouter } from "../common/withRouter";
import CommonContext from '../common/commonContext';
import { authWrapper } from "../auth/AuthWrapper";

export const TopMenuIcons = withRouter(authWrapper(class extends Component {
    static contextType = CommonContext;

    constructor(props) {
        super(props);

        this.state = {
            profileBtnShowClass: ""
        };
    }

    handleProfileBtnClick = () => {
        if (this.state.profileBtnShowClass === "") {
            this.setState({
                profileBtnShowClass: " profileDropdownShow"
            }
            );
        }
        else {
            this.setState({
                profileBtnShowClass: ""
            })
        }
    }

    componentWillUnmount() {
        this.setState({
            profileBtnShowClass: ""
        })
    }

    render() {
        return (
            <React.Fragment>
                <span className="topMenuIcons">
                    {!this.props.isAuthenticated &&
                        <Link to="/login" className="noLinkStyle">
                            <span className="float-end"><i title="Sign in" className="fa fa-sign-in signIcon"></i></span>
                        </Link>
                    }
                    {this.props.isAuthenticated &&
                        <span className="float-end"><i title={`${this.props.userRole !== "Admin" ? "User" : "Admin"} Profile - ` + this.props.userEmail} className="fa fa-user userProfileIcon" onClick={() => this.handleProfileBtnClick()} ></i>
                            <div className="profileDropdown">
                                <div className={"profileDropdown-content" + this.state.profileBtnShowClass}>
                                    <button className="profileDropdownMenuBtn" onClick={() => this.context.goToOrders()}>My Orders</button>
                                    <button className="profileDropdownMenuBtn" onClick={() => this.context.goToChangePassword()}>Change Password</button>
                                    <button className="profileDropdownMenuBtn" onClick={this.props.signout}>Sign Out</button>
                                </div>
                            </div>
                        </span>
                    }
                    <span className="float-end"><i title="Administration" className="fa fa-wrench adminIcon" onClick={() => this.props.history("/admin")}></i></span>
                    <span className="float-end"><Link to="/shoppingcart" className="noLinkStyle"><i title="Shopping Cart" className="fa fa-shopping-cart shoppingCartIcon"></i><span className='badge-sc badge-sc-warning' id='lblCartCount'> {this.context.shoppingCart.length}</span></Link></span>
                </span>

            </React.Fragment >
        )
    }
}))