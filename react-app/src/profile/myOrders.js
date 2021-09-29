import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { HomeBtn } from "../common/homeBtn";
import CommonContext from '../common/commonContext';
import { DataTypes } from "../data/Types";

export const MyOrders = withRouter(class extends Component {
    static contextType = CommonContext;

    componentDidMount = () => {
        this.props.getOrdersByUser(DataTypes.ORDERSBYUSER);
    }

    handlePageIndexChangedOrders = (pageIndex) => {
        this.props.getOrdersByUser(DataTypes.ORDERSBYUSER, pageIndex);
        window.scrollTo(0, 0);
    }

    getOrderItems = (orderItems, orderId) => {
        let trs = [];
        orderItems.forEach(element => {
            trs.push(<tr key={element.id}>
                <td onClick={() => this.props.history.push("details/?id=" + element.id)}><img className="orderItemProductImg" src={"data:image/jpeg;base64," + element.productImageSrc} alt={element.productId} style={{ cursor: "pointer" }} /></td>
                <td onClick={() => this.props.history.push("details/?id=" + element.id)} style={{ cursor: "pointer" }} className="shoppingCartDescription"><span className="productNameText">{element.name}</span><br />{element.description}</td>
                <td><h4>{element.price}$</h4></td>
                <td><h3>{element.quantity}</h3></td>
            </tr>);
        });

        return (
            <React.Fragment>
                <tr>
                    <td style={{ border: "0", paddingBottom: "0px" }}>
                        <h4 style={{ padding: "0px", margin: "0px" }}>#{orderId} Order Items</h4>
                    </td>
                </tr>
                <tr>
                    <td colSpan="4" style={{ paddingTop: "0px" }}>
                        <table className="table orderItemTable">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Description</th>
                                    <th>Price</th>
                                    <th>Qauntity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trs}
                            </tbody>
                        </table>
                    </td></tr>
            </React.Fragment>
        );
    }

    render() {

        let pagerIndexBtnsOrders = [];
        let previousPageIndexOrders = 0;
        let nextPageIndexOrders = 0;

        if (this.props.ordersbyuser && this.props.ordersbyuser.pager) {
            for (let pageIndex = this.props.ordersbyuser.pager.startPage; pageIndex <= this.props.ordersbyuser.pager.endPage; pageIndex++) {
                pagerIndexBtnsOrders.push(<li key={pageIndex} className={"paginate_button page-item nolabelselect" + (pageIndex === this.props.ordersbyuser.pager.currentPage ? " active" : "")}><button className="page-link" onClick={() => this.handlePageIndexChangedOrders(pageIndex)}>{pageIndex}</button></li>);
            }
            previousPageIndexOrders = this.props.ordersbyuser.pager.currentPage - 1;
            nextPageIndexOrders = this.props.ordersbyuser.pager.currentPage + 1;
        }

        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col bg-dark text-white">
                        <div className="loginRegisterHomeBtn"><HomeBtn /></div>
                        <div className="navbar-brand ms-5">React JS Online Store App - My Orders</div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 mx-auto">
                        <div className="text-center">
                            <h3>My Orders</h3>
                            {this.props.ordersbyuser && this.props.ordersbyuser.ordersByUserList && this.props.ordersbyuser.ordersByUserList.length > 0 && this.props.ordersbyuser.ordersByUserList.map((item, i) => {
                                return (
                                    <table key={item.id} className="table ordersTableUser">
                                        <thead>
                                            <tr>
                                                <th>Order #</th>
                                                <th>Date</th>
                                                <th>Is Shipped</th>
                                                <th>Promo Code Used</th>
                                                <th>Subtotal</th>
                                                <th style={{ width: "177px" }}>Subtotal with promo</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    #{item.id}
                                                </td>
                                                <td>
                                                    {item.createdDate}
                                                </td>
                                                <td className={item.isShipped ? "bg-success" : "bg-danger"} style={{ color: "white", fontWeight: "bold" }}>
                                                    {item.isShipped ? "Yes" : "No"}
                                                </td>
                                                <td>
                                                    {item.promoCodeUsed == null ? "Not Used" : item.promoCodeUsed}
                                                </td>
                                                <td>
                                                    ${item.subtotal}
                                                </td>
                                                <td>
                                                    {item.subtotalWithPromo != null ? "$" + item.subtotalWithPromo : ""}
                                                </td>
                                            </tr>
                                            {this.getOrderItems(item.orderItems, item.id)}
                                        </tbody>
                                    </table>
                                )
                            })}
                            <div className="ordersPagination">
                                {this.props.ordersbyuser && this.props.ordersbyuser.pager &&
                                    <div className="float-end">
                                        <div className="table_paginate paging_simple_numbers">
                                            <ul className="pagination">
                                                <li className={"paginate_button page-item previous" + (this.props.ordersbyuser.pager.currentPage === 1 ? " disabled" : "")}>
                                                    <button className="page-link nolabelselect" onClick={() => this.handlePageIndexChangedOrders(previousPageIndexOrders)}>Previous</button>
                                                </li>
                                                {pagerIndexBtnsOrders}
                                                {(this.props.ordersbyuser.pager.currentPage + 4) < this.props.ordersbyuser.pager.totalPages &&
                                                    <React.Fragment>
                                                        <li className={"paginate_button page-item next"}>
                                                            <button className="page-link nolabelselect" onClick={() => this.handlePageIndexChangedOrders(nextPageIndexOrders)}>Next</button>
                                                        </li>
                                                        <li className="paginate_button page-item nolabelselect">
                                                            <button className="page-link nolabelselect">...</button>
                                                        </li>
                                                        <li className="paginate_button page-item nolabelselect">
                                                            <button className="page-link nolabelselect" onClick={() => this.handlePageIndexChangedOrders(this.props.ordersbyuser.pager.totalPages)}>{this.props.ordersbyuser.pager.totalPages}</button>
                                                        </li>
                                                    </React.Fragment>
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                }
                                {this.props.ordersbyuser && this.props.ordersbyuser.pager &&
                                    <span style={{ fontStyle: "italic" }}>{this.props.ordersbyuser.pager.paginationSummary}</span>}
                            </div>
                            {
                                this.props.ordersbyuser && this.props.ordersbyuser.length === 0 &&
                                <h4>You don't have orders</h4>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
})