import React, { Component } from "react";
import moment from "moment";
import spinnerImg from '../img/spinner.gif';


export const AdminProductList = class extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hideLodingImg: true,
        };
    }

    handlePageIndexChangedProducts = (pageIndex) => {
        this.setState({ hideLodingImg: false });
        this.props.pageIndexChangedProducts(null, pageIndex, null, () => { this.setState({ hideLodingImg: true }) });
        window.scrollTo(0, 0);
    }

    render() {

        let pagerIndexBtnsProduct = [];
        let previousPageIndexProduct = 0;
        let nextPageIndexProduct = 0;

        if (this.props.products && this.props.products.pager) {
            for (let pageIndex = this.props.products.pager.startPage; pageIndex <= this.props.products.pager.endPage; pageIndex++) {
                pagerIndexBtnsProduct.push(<li key={pageIndex} className={"paginate_button page-item nolabelselect" + (pageIndex === this.props.products.pager.currentPage ? " active" : "")}><button className="page-link" onClick={() => this.handlePageIndexChangedProducts(pageIndex)}>{pageIndex}</button></li>);
            }
            previousPageIndexProduct = this.props.products.pager.currentPage - 1;
            nextPageIndexProduct = this.props.products.pager.currentPage + 1;
        }

        return (
            <React.Fragment>
                <i title="Add Product" className="fa fa-plus addProductBtn" aria-hidden="true" onClick={() => this.props.AddProductClick()}></i>
                <img className={"float-end spinnerImgAdminPaging" + (this.state.hideLodingImg ? " d-none" : "")} src={spinnerImg} alt="loading" />
                <table className="table">
                    <thead>
                        <tr>
                            <th>
                                Image
                            </th>
                            <th>
                                Category
                            </th>
                            <th>
                                Name
                            </th>
                            <th>
                                Description
                            </th>
                            <th>
                                Price
                            </th>
                            <th>
                                Created Date
                            </th>
                            <th>
                                Used in orders
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.products && this.props.products.productList && this.props.products.productList.map((item, i) => {
                            return (
                                <tr key={item.id}>
                                    <td style={{ maxWidth: "100px", maxHeight: "100px" }}><img className="productImgAdmin" src={"data:image/jpeg;base64," + item.imageSrc} alt={item.name} /></td>
                                    <td>{item.category.name}</td>
                                    <td>{item.name}</td>
                                    <td>{item.description}</td>
                                    <td>{item.price}$</td>
                                    <td> {moment(item.createdDate).format("DD/MM/YYYY")}</td>
                                    <td> {item.orderItems.length}</td>
                                    <td>
                                        <i title="Edit" className="fa fa-edit editProductBtn" onClick={() => this.props.StartEditProduct(item.id)}></i>
                                        <i title="Delete" className="fa fa-trash deleteProductBtn" onClick={() => this.props.ShowConfirm(item.id)}></i>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <div className="productsPagination">
                    {this.props.products && this.props.products.pager &&
                        <div className="float-end">
                            <div className="table_paginate paging_simple_numbers">
                                <ul className="pagination">
                                    <li className={"paginate_button page-item previous" + (this.props.products.pager.currentPage === 1 ? " disabled" : "")}>
                                        <button className="page-link nolabelselect" onClick={() => this.handlePageIndexChangedProducts(previousPageIndexProduct)}>Previous</button>
                                    </li>
                                    {pagerIndexBtnsProduct}
                                    {(this.props.products.pager.currentPage + 4) < this.props.products.pager.totalPages &&
                                        <React.Fragment>
                                            <li className={"paginate_button page-item next"}>
                                                <button className="page-link nolabelselect" onClick={() => this.handlePageIndexChangedProducts(nextPageIndexProduct)}>Next</button>
                                            </li>
                                            <li className="paginate_button page-item nolabelselect">
                                                <button className="page-link nolabelselect">...</button>
                                            </li>
                                            <li className="paginate_button page-item nolabelselect">
                                                <button className="page-link nolabelselect" onClick={() => this.handlePageIndexChangedProducts(this.props.products.pager.totalPages)}>{this.props.products.pager.totalPages}</button>
                                            </li>
                                        </React.Fragment>
                                    }
                                </ul>
                            </div>
                        </div>
                    }
                    {this.props.products && this.props.products.pager &&
                        <span style={{ fontStyle: "italic" }}>{this.props.products.pager.paginationSummary}</span>}
                </div>
            </React.Fragment>
        )
    }
}
