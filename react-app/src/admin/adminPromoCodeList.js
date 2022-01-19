import React, { Component } from "react";
import moment from "moment";
import spinnerImg from '../img/spinner.gif';
import { promoCode } from "../data/api";
import { DataTypes } from "../data/Types";

export const AdminPromoCodeList = class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newPromoCodeGenerateQuantity: 1,
            hidePromoGenerateLodingImg: true,
            newPromoCodeDiscount: 10,
            showOnlyUsed: false
        };
    }

    handleGeneratePromoCodes = () => {
        this.setState({ hidePromoGenerateLodingImg: false });
        promoCode().generate(this.state.newPromoCodeGenerateQuantity, this.state.newPromoCodeDiscount).then((response) => {
            this.setState({
                newPromoCodeGenerateQuantity: 1,
                hidePromoGenerateLodingImg: true
            });
            this.props.getPromoCodes(DataTypes.PROMOCODES);
        });
    }

    handleDeletePromoCode = (id) => {
        promoCode().delete(id).then((response) => {
            this.props.getPromoCodes(DataTypes.PROMOCODES);
        });
    }

    handlePageIndexChangedPromoCodes = (pageIndex, showOnlyUsed) => {
        this.props.pageIndexChangedPromoCodes(pageIndex, showOnlyUsed);
        window.scrollTo(0, 0);
    }

    render() {

        let pagerIndexBtnsPromoCodes = [];
        let previousPageIndexPromoCodes = 0;
        let nextPageIndexPromoCodes = 0;

        if (this.props.promocodes && this.props.promocodes.pager) {
            for (let pageIndex = this.props.promocodes.pager.startPage; pageIndex <= this.props.promocodes.pager.endPage; pageIndex++) {
                pagerIndexBtnsPromoCodes.push(<li key={pageIndex} className={"paginate_button page-item nolabelselect" + (pageIndex === this.props.promocodes.pager.currentPage ? " active" : "")}><button className="page-link" onClick={() => this.handlePageIndexChangedPromoCodes(pageIndex)}>{pageIndex}</button></li>);
            }
            previousPageIndexPromoCodes = this.props.promocodes.pager.currentPage - 1;
            nextPageIndexPromoCodes = this.props.promocodes.pager.currentPage + 1;
        }

        return (
            <React.Fragment>
                <div className="generatePromoBtnWrapper">
                    <button className="btn btn-primary" onClick={() => this.handleGeneratePromoCodes()}>Generate New</button>
                    <span style={{ marginLeft: "4px" }}> Quantity: </span> <input type="number" min="1" step="1" className="promoCodeQuantity" value={this.state.newPromoCodeGenerateQuantity} onChange={e => this.setState({ newPromoCodeGenerateQuantity: e.target.value })} />
                    <span style={{ marginLeft: "4px" }}> Discount $: </span><input type="number" min="1" step="1" className="promoCodeDiscount" value={this.state.newPromoCodeDiscount} onChange={e => this.setState({ newPromoCodeDiscount: e.target.value })} />
                    <input type="checkbox" className="form-check-input showOnlyUsedPromoInput" id="showOnlyUsed" onChange={(e) => this.handlePageIndexChangedPromoCodes(1, e.target.checked)} />
                    <label className="form-check-label noselect showOnlyUsedPromoLabel" htmlFor="showOnlyUsed">Show Only Used</label>
                    <img className={"spinnerImg" + (this.state.hidePromoGenerateLodingImg ? " d-none" : "")} src={spinnerImg} alt="loading" />
                </div> <br />
                {this.props.promocodes && this.props.promocodes.promoCodeList.length > 0 && this.props.promocodes.promoCodeList.map((item, i) => {
                    return (
                        <table key={item.id} className="table promoCodesTable">
                            <thead>
                                <tr>
                                    <th>Promo Code</th>
                                    <th>Discount</th>
                                    <th>Created Date</th>
                                    <th>Used By User</th>
                                    <th>Used in Order #</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        {item.promoCodeText}
                                    </td>
                                    <td>
                                        {item.discount}$
                                    </td>
                                    <td>
                                        {moment(item.createdDate).format("DD/MM/YYYY")}
                                    </td>
                                    <td>
                                        {item.usedByUserEmail}
                                    </td>
                                    <td>
                                        {item.usedOnOrderId === 0 ? "" : item.usedOnOrderId}
                                    </td>
                                    <td>
                                        {item.usedOnOrderId === 0 &&
                                            <i title="delete" className="fa fa-trash promoDeleteBtn" aria-hidden="true" onClick={() => this.handleDeletePromoCode(item.id)}></i>
                                        }
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    )
                })}
                <div className="promoCodesPagination">
                    {this.props.promocodes && this.props.promocodes.pager &&
                        <div className="float-end">
                            <div className="table_paginate paging_simple_numbers">
                                <ul className="pagination">
                                    <li className={"paginate_button page-item previous" + (this.props.promocodes.pager.currentPage === 1 ? " disabled" : "")}>
                                        <button className="page-link nolabelselect" onClick={() => this.handlePageIndexChangedPromoCodes(previousPageIndexPromoCodes)}>Previous</button>
                                    </li>
                                    {pagerIndexBtnsPromoCodes}
                                    {(this.props.promocodes.pager.currentPage + 4) < this.props.promocodes.pager.totalPages &&
                                        <React.Fragment>
                                            <li className={"paginate_button page-item next"}>
                                                <button className="page-link nolabelselect" onClick={() => this.handlePageIndexChangedPromoCodes(nextPageIndexPromoCodes)}>Next</button>
                                            </li>
                                            <li className="paginate_button page-item nolabelselect">
                                                <button className="page-link nolabelselect">...</button>
                                            </li>
                                            <li className="paginate_button page-item nolabelselect">
                                                <button className="page-link nolabelselect" onClick={() => this.handlePageIndexChangedPromoCodes(this.props.promocodes.pager.totalPages)}>{this.props.promocodes.pager.totalPages}</button>
                                            </li>
                                        </React.Fragment>
                                    }
                                </ul>
                            </div>
                        </div>
                    }
                    {this.props.promocodes && this.props.promocodes.pager &&
                        <span style={{ fontStyle: "italic" }}>{this.props.promocodes.pager.paginationSummary}</span>}
                </div>
                {this.props.promocodes && this.props.promocodes.promoCodeList.length === 0 &&
                    <h4>There is no promo codes in database.</h4>
                }
            </React.Fragment>
        )
    }
}
