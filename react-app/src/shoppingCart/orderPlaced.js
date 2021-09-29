import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { HomeBtn } from "../common/homeBtn";
import CommonContext from '../common/commonContext';

export const OrderPlaced = withRouter(class extends Component {
    static contextType = CommonContext;

    handleBackToProducts = (event) => {
        this.context.clearShoppingCart();
        this.context.goToHomePath();
        
    };

    handleGoTOMyOrders = (event) => {
        this.context.clearShoppingCart();
        this.props.history.push("/myorders")
    };

    componentWillUnmount() {
        this.context.clearShoppingCart();
    }

    render = () =>
        <div className="container-fluid">
            <div className="row">
                <div className="col bg-dark text-white">
                    <div className="loginRegisterHomeBtn"><HomeBtn /></div>
                    <div className="navbar-brand ms-5">React JS Online Store App - Place Order</div>
                </div>
            </div>
            <div className="row">
                <div className="col m-2">
                    <h4 className="bg-success text-center text-white m-1 p-2">
                        Order Placed Successfully
                    </h4>
                    <div className="text-center text-white m-1 p-2">
                        <button type="button" className="btn btn-primary" onClick={() => this.handleBackToProducts()} >Back to products</button>
                        <br/>
                        <button type="button" className="btn btn-primary mt-1" onClick={() => this.handleGoTOMyOrders()}>My Orders</button>
                    </div>
                </div>
            </div>
        </div>
})