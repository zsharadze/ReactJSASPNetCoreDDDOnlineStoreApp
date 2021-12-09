import React, { Component } from "react";
import moment from "moment";
import { order } from "../data/api";

export const AdminOrderList = class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedPageIndex: 1,
        };
    }

    shipOrder = (id) => {
        order().ship(id)
            .then(() => {
                this.handlePageIndexChangedOrders(this.state.selectedPageIndex, false);
            });
    }
    
    handlePageIndexChangedOrders = (pageIndex, scroll) => {
        this.props.pageIndexChangedOrders(pageIndex);
        if (scroll == null) {
            window.scrollTo(0, 0);
        }

        if (scroll == null) {
            this.setState(
                { selectedPageIndex: pageIndex });
        }
    }

    getOrderItems = (orderItems, orderId) => {
        let trs = [];
        orderItems.forEach(element => {
            trs.push(<tr key={element.id}>
                <td onClick={() => this.props.history.push("details/?id=" + element.id)}><img className="orderItemProductImg" src={"data:image/jpeg;base64," + element.product.imageSrc} alt={element.productId} style={{ cursor: "pointer" }} /></td>
                <td onClick={() => this.props.history.push("details/?id=" + element.id)} style={{ cursor: "pointer" }} className="shoppingCartDescription"><span className="productNameText">{element.product.name}</span><br />{element.product.description}</td>
                <td><h4>{element.product.price}$</h4></td>
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


        if (this.props.orders && this.props.orders.pager) {
            for (let pageIndex = this.props.orders.pager.startPage; pageIndex <= this.props.orders.pager.endPage; pageIndex++) {
                pagerIndexBtnsOrders.push(<li key={pageIndex} className={"paginate_button page-item nolabelselect" + (pageIndex === this.props.orders.pager.currentPage ? " active" : "")}><button className="page-link" onClick={() => this.handlePageIndexChangedOrders(pageIndex)}>{pageIndex}</button></li>);
            }
            previousPageIndexOrders = this.props.orders.pager.currentPage - 1;
            nextPageIndexOrders = this.props.orders.pager.currentPage + 1;
        }

        return (
            <React.Fragment>
                {this.props.orders && this.props.orders.orderList.length > 0 && this.props.orders.orderList.map((item, i) => {
                    return (
                        <table key={item.id} className="table ordersTable">
                            <thead>
                                <tr>
                                    <th>Order #</th>
                                    <th>Date</th>
                                    <th>Is Shipped</th>
                                    <th>Promo Code Used</th>
                                    <th>Subtotal</th>
                                    <th style={{ width: "177px" }}>Subtotal with promo</th>
                                    <th>User</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        #{item.id}
                                    </td>
                                    <td>
                                        {moment(item.createdDate).format("DD/MM/YYYY")}
                                    </td>
                                    <td>
                                        {item.isShipped ? "Order is shipped" : <button className="btn btn-success" onClick={() => this.shipOrder(item.id)}>Ship Order</button>}
                                    </td>
                                    <td>
                                        {item.promoCode?.promoCodeText}
                                    </td>
                                    <td>
                                        ${item.subtotal}
                                    </td>
                                    <td>
                                        {item.subtotalWithPromo != null ? "$" + item.subtotalWithPromo : ""}
                                    </td>
                                    <td>
                                        {item.userEmail}
                                    </td>
                                </tr>
                                {this.getOrderItems(item.orderItems, item.id)}
                            </tbody>
                        </table>
                    )
                })}
                <div className="ordersPagination">
                    {this.props.orders && this.props.orders.pager &&
                        <div className="float-end">
                            <div className="table_paginate paging_simple_numbers">
                                <ul className="pagination">
                                    <li className={"paginate_button page-item previous" + (this.props.orders.pager.currentPage === 1 ? " disabled" : "")}>
                                        <button className="page-link nolabelselect" onClick={() => this.handlePageIndexChangedOrders(previousPageIndexOrders)}>Previous</button>
                                    </li>
                                    {pagerIndexBtnsOrders}
                                    {(this.props.orders.pager.currentPage + 4) < this.props.orders.pager.totalPages &&
                                        <React.Fragment>
                                            <li className={"paginate_button page-item next"}>
                                                <button className="page-link nolabelselect" onClick={() => this.handlePageIndexChangedOrders(nextPageIndexOrders)}>Next</button>
                                            </li>
                                            <li className="paginate_button page-item nolabelselect">
                                                <button className="page-link nolabelselect">...</button>
                                            </li>
                                            <li className="paginate_button page-item nolabelselect">
                                                <button className="page-link nolabelselect" onClick={() => this.handlePageIndexChangedOrders(this.props.orders.pager.totalPages)}>{this.props.orders.pager.totalPages}</button>
                                            </li>
                                        </React.Fragment>
                                    }
                                </ul>
                            </div>
                        </div>
                    }
                    {this.props.orders && this.props.orders.pager &&
                        <span style={{ fontStyle: "italic" }}>{this.props.orders.pager.paginationSummary}</span>}
                </div>
                {this.props.orders && this.props.orders.orderList.length === 0 &&
                    <h4>There is no active orders</h4>
                }
            </React.Fragment>
        )
    }
}
