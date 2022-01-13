import React, { Component } from "react";
import { Link } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.css";
import "font-awesome/css/font-awesome.min.css";
import { TopMenuIcons } from "../common/topmenuicons";
import { HomeBtn } from "../common/homeBtn";
import { DataTypes } from "../data/Types";

export class ProductList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchPlaceHolder: "Search products..."
        };
    }

    componentDidMount = () => {
        this.props.getProducts(DataTypes.PRODUCTS);
        this.props.getCategories(DataTypes.CATEGORIES);
    }

    handleChangeCategory = (event) => {
        this.props.setSelectedCategoryId(event.target.value);
        this.props.changeFilterValues(event.target.value, 1, this.props.searchValue);
    }

    handlePageIndexChanged = (pageIndex) => {
        this.props.changeFilterValues(this.props.selectedCategoryId, pageIndex, this.props.searchValue);
        window.scrollTo(0, 0);
    }

    handleSearchChange = (event) => {
        this.props.setSearchValue(event.target.value);
        this.props.changeFilterValues(this.props.selectedCategoryId, 1, event.target.value);
    }

    handleSearch = () => {
        this.props.changeFilterValues(this.props.selectedCategoryId, 1, this.props.searchValue);
    }

    handleEnterKey = (event) => {
        if (event.key === 'Enter') {
            this.handleSearch();
        }
    };

    changeCategory = (categoryid, categoryName) => {
        this.props.setSelectedCategoryId(categoryid);
        if (categoryid !== 0) {
            this.props.history.push("/?category=" + categoryid);
            this.props.changeFilterValues(categoryid, 1, null);
        }
        else {
            this.props.changeFilterValues(null, 1, null);
            this.props.history.push("/");
        }

        this.setState(
            { searchPlaceHolder: "Search " + categoryName + "..." });
            this.props.setSearchValue("");
    }

    render() {
        let pagerIndexBtns = [];
        let previousPageIndex = 0;
        let nextPageIndex = 0;

        if (this.props.products && this.props.products.pager) {
            for (let pageIndex = this.props.products.pager.startPage; pageIndex <= this.props.products.pager.endPage; pageIndex++) {
                pagerIndexBtns.push(<li key={pageIndex} className={"paginate_button page-item nolabelselect" + (pageIndex === this.props.products.pager.currentPage ? " active" : "")}><button className="page-link" onClick={() => this.handlePageIndexChanged(pageIndex)}>{pageIndex}</button></li>);
            }
            previousPageIndex = this.props.products.pager.currentPage - 1;
            nextPageIndex = this.props.products.pager.currentPage + 1;
        }

        return (

            <div className="container">
                <div className="row">
                    <div className="col-md-12 text-center">
                        <HomeBtn />
                        <input className="form-control searchInput" type="search" placeholder={this.state.searchPlaceHolder} aria-label="Search" onKeyPress={this.handleEnterKey} onChange={this.handleSearchChange} value={this.props.searchValue} />
                        <span className="input-group-btn searchBtn">
                            <button className="btn btn-outline-success" type="button" onClick={this.handleSearch}>Search</button>
                        </span>
                        <TopMenuIcons />
                    </div>
                </div>
                <div className="row flex-nowrap">
                    <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-secondary">
                        <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
                            <span className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                                <span className="fs-5 d-none d-sm-inline">Categories</span>
                            </span>
                            <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start leftMenu" id="menu">

                                <li className="nav-item">
                                    <button href="#" className="nav-link align-middle px-0 catLink">
                                        <span className={"ms-1 d-none d-sm-inline" + (this.props.selectedCategoryId === 0 ? " active" : "")} onClick={() => this.changeCategory(0, "products")}>All Products</span>
                                    </button>
                                </li>

                                {this.props.categories && this.props.categories.map((item, i) => {
                                    return (
                                        <li key={item.id} className="nav-item">
                                            <button href="#" className="nav-link align-middle px-0 catLink">
                                                {item.faClass &&
                                                    <React.Fragment>
                                                        <i className={item.faClass + " menuIcon"} onClick={() => this.changeCategory(item.id, item.name)}></i><span className={"ms-1 d-none d-sm-inline" + (this.props.selectedCategoryId === item.id ? " active" : "")} onClick={() => this.changeCategory(item.id, item.name)}>{item.name}</span>
                                                    </React.Fragment>
                                                }
                                                {item.imageSrc &&
                                                    <React.Fragment>
                                                        <img src={"data:image/jpeg;base64," + item.imageSrc}  style={{ border: "1", width: "40px", height: "40px" }} alt="productImage" onClick={() => this.changeCategory(item.id, item.name)}/> <span className={"ms-1 d-none d-sm-inline" + (this.props.selectedCategoryId === item.id ? " active" : "")} onClick={() => this.changeCategory(item.id, item.name)}>{item.name}</span>
                                                    </React.Fragment>
                                                }
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                    <div className="col py-3">
                        <div id="product-list">
                            {this.props.products && this.props.products.productList && this.props.products.productList.map((item, i) => {
                                return (
                                    <Link key={item.id} to={"details/?id=" + item.id} className="noLinkStyle">
                                        <div className="product">
                                            <div className="productItemImage"><img src={"data:image/jpeg;base64," + item.imageSrc} alt={item.name} /></div>
                                            <span className="productNameText">{item.name}</span>
                                            <span className="productDescriptionText">{item.description}</span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                        <div className="productsPagination">
                            {this.props.products && this.props.products.pager &&
                                <div className="float-end">
                                    <div className="table_paginate paging_simple_numbers">
                                        <ul className="pagination">
                                            <li className={"paginate_button page-item previous" + (this.props.products.pager.currentPage === 1 ? " disabled" : "")}>
                                                <button className="page-link nolabelselect" onClick={() => this.handlePageIndexChanged(previousPageIndex)}>Previous</button>
                                            </li>
                                            {pagerIndexBtns}
                                            {(this.props.products.pager.currentPage + 4) < this.props.products.pager.totalPages &&
                                                <React.Fragment>
                                                    <li className={"paginate_button page-item next"}>
                                                        <button className="page-link nolabelselect" onClick={() => this.handlePageIndexChanged(nextPageIndex)}>Next</button>
                                                    </li>
                                                    <li className="paginate_button page-item nolabelselect">
                                                        <button className="page-link nolabelselect">...</button>
                                                    </li>
                                                    <li className="paginate_button page-item nolabelselect">
                                                        <button className="page-link nolabelselect" onClick={() => this.handlePageIndexChanged(this.props.products.pager.totalPages)}>{this.props.products.pager.totalPages}</button>
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
                    </div>
                </div>
            </div>
        )
    }
}
