import React, { Component } from "react";
import spinnerImg from '../img/spinner.gif';

export const AdminCategoryList = class extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hideLodingImg: true,
        };
    }


    handlePageIndexChangedCategories = (pageIndex) => {
        this.setState({ hideLodingImg: false });
        this.props.pageIndexChangedCategories(pageIndex, null, () => { this.setState({ hideLodingImg: true }); });
        window.scrollTo(0, 0);
    }

    render() {
        let pagerIndexBtnsCategories = [];
        let previousPageIndexCategories = 0;
        let nextPageIndexCategories = 0;

        if (this.props.categories && this.props.categories.pager) {
            for (let pageIndex = this.props.categories.pager.startPage; pageIndex <= this.props.categories.pager.endPage; pageIndex++) {
                pagerIndexBtnsCategories.push(<li key={pageIndex} className={"paginate_button page-item nolabelselect" + (pageIndex === this.props.categories.pager.currentPage ? " active" : "")}><button className="page-link" onClick={() => this.handlePageIndexChangedCategories(pageIndex)}>{pageIndex}</button></li>);
            }
            previousPageIndexCategories = this.props.categories.pager.currentPage - 1;
            nextPageIndexCategories = this.props.categories.pager.currentPage + 1;
        }


        return (
            <React.Fragment>
                <i title="Add Category" className="fa fa-plus addCategoryBtn" aria-hidden="true" onClick={() => this.props.AddCategoryClick()}></i>
                <img className={"float-end spinnerImgAdminPaging" + (this.state.hideLodingImg ? " d-none" : "")} src={spinnerImg} alt="loading" />
                <table className="table">
                    <thead>
                        <tr>
                            <th>
                                Name
                            </th>
                            <th>
                                Fa Class
                            </th>
                            <th>
                                Image
                            </th>
                            <th>
                                Products
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.categories && this.props.categories.categoryList && this.props.categories.categoryList.map((item, i) => {
                            return (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>{item.faClass}&nbsp;<i className={item.faClass}></i></td>
                                    <td style={{ maxWidth: "100px", maxHeight: "100px" }}>
                                        {item.imageSrc &&
                                            <img className="categoryImgAdmin" src={"data:image/jpeg;base64," + item.imageSrc} alt={item.name} />
                                        }
                                    </td>
                                    <td>
                                        <i title="Edit" className="fa fa-edit editCategoryBtn" onClick={() => this.props.StartEditCategory(item.id)}></i>
                                        <i title="Delete" className="fa fa-trash deleteCategoryBtn" onClick={() => this.props.ShowConfirm(item.id)}></i>
                                    </td>
                                    <td>
                                        {item.CategoriessCount}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <div className="categoriesPagination">
                    {this.props.categories && this.props.categories.pager &&
                        <div className="float-end">
                            <div className="table_paginate paging_simple_numbers">
                                <ul className="pagination">
                                    <li className={"paginate_button page-item previous" + (this.props.categories.pager.currentPage === 1 ? " disabled" : "")}>
                                        <button className="page-link nolabelselect" onClick={() => this.handlePageIndexChangedCategories(previousPageIndexCategories)}>Previous</button>
                                    </li>
                                    {pagerIndexBtnsCategories}
                                    {(this.props.categories.pager.currentPage + 4) < this.props.categories.pager.totalPages &&
                                        <React.Fragment>
                                            <li className={"paginate_button page-item next"}>
                                                <button className="page-link nolabelselect" onClick={() => this.handlePageIndexChangedCategories(nextPageIndexCategories)}>Next</button>
                                            </li>
                                            <li className="paginate_button page-item nolabelselect">
                                                <button className="page-link nolabelselect">...</button>
                                            </li>
                                            <li className="paginate_button page-item nolabelselect">
                                                <button className="page-link nolabelselect" onClick={() => this.handlePageIndexChangedCategories(this.props.categories.pager.totalPages)}>{this.props.categories.pager.totalPages}</button>
                                            </li>
                                        </React.Fragment>
                                    }
                                </ul>
                            </div>
                        </div>
                    }
                    {this.props.categories && this.props.categories.pager &&
                        <span style={{ fontStyle: "italic" }}>{this.props.categories.pager.paginationSummary}</span>}
                </div>
            </React.Fragment>
        )
    }
}
