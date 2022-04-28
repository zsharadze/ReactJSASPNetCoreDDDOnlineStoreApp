import React, { Component } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { connect } from "react-redux";
import { getProducts, getCategories, getProduct, getOrdersByUser, getOrders, getPromoCodes } from "../data/ActionCreators";
import { DataTypes } from "../data/Types";
import { ProductList } from "./ProductList";
import { ProductDetails } from "./ProductDetails"
import { ShoppingCart } from "../shoppingCart/shoppingCart"
import { AdminMain } from "../admin/adminMain"
import { CommonProvider } from '../common/commonContext'
import { LoginPrompt } from "../auth/loginPrompt";
import { RegisterPrompt } from "../auth/registerPrompt";
import { ChangePasswordPrompt } from "../auth/changePasswordPrompt";
import { OrderPlaced } from "../shoppingCart/orderPlaced";
import { MyOrders } from "../profile/myOrders";
import { withRouter } from "../common/withRouter";
import { authWrapper } from "../auth/AuthWrapper";

const mapStateToProps = (dataStore) => ({
    ...dataStore
})

const mapDispatchToProps = {
    getProducts, getCategories, getProduct, getOrdersByUser, getOrders, getPromoCodes
}

export const ProductConnector = authWrapper(withRouter(connect(mapStateToProps, mapDispatchToProps)(
    class extends Component {
        constructor(props) {
            super(props);
            this.state = {
                selectedCategoryId: 0,
                searchValue: '',
                shoppingCart: [],
                clearShoppingCart: this.clearShoppingCart,
                goToHomePath: this.handleGoToHome,
                goToShoppingCart: this.handleGoToShoppingCart,
                goToOrders: this.handleGoToOrders,
                goToChangePassword: this.handleGoToChangePassword,
            }
        }

        clearShoppingCart = () => {
            this.setState({
                shoppingCart: []
            });
        }

        render() {
            return (
                <CommonProvider value={this.state}>
                    <Routes>
                        <Route path="/details"
                            element={<ProductDetails {...this.props} location={this.props.location} addToCart={this.handleAddToCart} />} />
                        <Route path="/shoppingcart"
                            element={
                                <ShoppingCart {...this.props} changeQuantity={this.handleChangeQuantityInCart} deleteItem={this.handleDeleteItemFromCart} location={this.props.location} />} />
                        <Route
                            path="/admin"
                            element={
                                <RequireAuth redirectTo="/login?needAdminLogin=true" copyProps={this.props}>
                                    <AdminMain {...this.props} getProducts={this.props.getProducts} getPromoCodes={this.props.getPromoCodes} pageIndexChangedOrders={this.handleGetOrdersByPage} pageIndexChangedPromoCodes={this.handleGetPromoCodesByPage} pageIndexChangedProducts={this.handleChangePageIndexProducts} pageIndexChangedCategories={this.handleChangePageIndexCategories} />
                                </RequireAuth>
                            }
                        />
                        <Route path="/login"
                            element={
                                <LoginPrompt {...this.props} />} />
                        <Route path="/register"
                            element={
                                <RegisterPrompt />} />
                        <Route path="/changepassword"
                            element={
                                <ChangePasswordPrompt />} />
                        <Route path="/orderplaced"
                            element={
                                <OrderPlaced />} />
                        <Route path="/myorders"
                            element={<MyOrders {...this.props} />} />
                        {["/products/*", "/*"].map((path, index) =>
                            <Route key={index} path={path} element={<ProductList {...this.props} searchValue={this.state.searchValue} setSearchValue={this.handleSetSearchValue} selectedCategoryId={this.state.selectedCategoryId} changeFilterValues={this.handleChangeFilterValues} setSelectedCategoryId={this.handleSetSelectedCategoryId} />} />
                        )}
                    </Routes>
                </CommonProvider>
            )
        }

        handleGoToOrders = () => {
            this.props.history("/myorders");
        }

        handleGoToChangePassword = () => {
            this.props.history("/changepassword");
        }

        handleAddToCart = (id, quantity) => {
            var productInCart = this.state.shoppingCart.find(x => x.id === id);
            var productIdQuantityArray = this.state.shoppingCart;

            if (productInCart == null) {
                productIdQuantityArray.push({
                    id: id,
                    quantity: quantity
                })
                this.setState({
                    shoppingCart: productIdQuantityArray
                });
            }
            else {
                productInCart.quantity += quantity;
                var index = productIdQuantityArray.findIndex(el => el.id === id)
                productIdQuantityArray[index] = productInCart;

                this.setState({
                    shoppingCart: productIdQuantityArray
                });
            }
        }

        handleChangeQuantityInCart = (id, quantity) => {
            var productInCart = this.state.shoppingCart.find(x => x.id === id);
            if (productInCart == null)
                return;
            var productIdQuantityArray = this.state.shoppingCart;

            productInCart.quantity = quantity;
            var index = productIdQuantityArray.findIndex(el => el.id === id)
            productIdQuantityArray[index] = productInCart;

            this.setState({
                shoppingCart: productIdQuantityArray
            });
        }

        handleDeleteItemFromCart = (id) => {
            let products = this.state.shoppingCart;
            products = products.filter(function (item) {
                return item.id !== id;
            });

            this.setState({
                shoppingCart: products
            });
        }

        handleGoToHome = () => {
            this.props.history("/");
            this.setState({
                selectedCategoryId: 0,
                searchValue: ""
            });
            this.props.getProducts(DataTypes.PRODUCTS, null, 1, null);
        }

        handleGoToShoppingCart = () => {
            this.props.history("/shoppingcart");
        }

        handleSetSearchValue = (value) => {
            this.setState(
                { searchValue: value });
        }

        //admin
        handleGetOrdersByPage = (pageIndex) => {
            this.props.getOrders(DataTypes.ORDERS, pageIndex);
        }

        //admin
        handleGetPromoCodesByPage = (pageIndex, showOnlyUsed) => {
            this.props.getPromoCodes(DataTypes.PROMOCODES, pageIndex, "", showOnlyUsed);
        }

        //admin
        handleChangePageIndexProducts = (categoryId, pageIndex, searchText, callback) => {
            this.props.getProducts(DataTypes.PRODUCTS, categoryId, pageIndex, searchText, callback);
        }

        //admin
        handleChangePageIndexCategories = (pageIndex, searchText, callback) => {
            this.props.getCategories(DataTypes.CATEGORIES, pageIndex, 10, searchText, callback);
        }

        handleChangeFilterValues = (categoryId, pageIndex, searchText, callback) => {
            this.props.getProducts(DataTypes.PRODUCTS, categoryId, pageIndex, searchText, callback);
        }

        handleSetSelectedCategoryId = (categoryId) => {
            this.setState(
                { selectedCategoryId: categoryId });
        }
    }
)))

function RequireAuth({ children, redirectTo, props }) {
    let isAdminAuthenticated = localStorage.getItem('isAuthenticated') && localStorage.getItem('userRole') === "Admin";
    return isAdminAuthenticated ? children : <Navigate to={redirectTo} {...props} />;
}