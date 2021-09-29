import React, { Component } from "react";
import { Switch, Route } from "react-router-dom"
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

const mapStateToProps = (dataStore) => ({
    ...dataStore
})

const mapDispatchToProps = {
    getProducts, getCategories, getProduct, getOrdersByUser, getOrders, getPromoCodes
}

export const ProductConnector = connect(mapStateToProps, mapDispatchToProps)(
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
                    <Switch>
                        <Route path="/details"
                            render={(routeProps) =>
                                <ProductDetails {...this.props} getProduct={this.handleGetProduct} location={this.props.location} addToCart={this.handleAddToCart} />} />
                        <Route path="/shoppingcart"
                            render={(routeProps) =>
                                <ShoppingCart {...this.props} getProduct={this.handleGetProduct} changeQuantity={this.handleChangeQuantityInCart} deleteItem={this.handleDeleteItemFromCart} location={this.props.location} />} />
                        <Route path="/admin"
                            render={(routeProps) =>
                                <AdminMain {...this.props} getProducts={this.props.getProducts} getPromoCodes={this.props.getPromoCodes} pageIndexChangedOrders={this.handleGetOrdersByPage} pageIndexChangedPromoCodes={this.handleGetPromoCodesByPage} pageIndexChangedProducts={this.handleChangePageIndexProducts} />} />
                        <Route path="/login"
                            render={(routeProps) =>
                                <LoginPrompt />} />
                        <Route path="/register"
                            render={(routeProps) =>
                                <RegisterPrompt />} />
                        <Route path="/changepassword"
                            render={(routeProps) =>
                                <ChangePasswordPrompt />} />
                        <Route path="/orderplaced"
                            render={(routeProps) =>
                                <OrderPlaced />} />
                        <Route path="/myorders"
                            render={(routeProps) =>
                                <MyOrders {...this.props} />} />
                        <Route path={["/products", "/"]}
                            render={(routeProps) =>
                                <ProductList {...this.props} searchValue={this.state.searchValue} setSearchValue={this.handleSetSearchValue} selectedCategoryId={this.state.selectedCategoryId} changeFilterValues={this.handleChangeFilterValues} setSelectedCategoryId={this.handleSetSelectedCategoryId} />} />
                    </Switch>
                </CommonProvider>
            )
        }

        handleGoToOrders = () => {
            this.props.history.push("/myorders");
        }

        handleGoToChangePassword = () => {
            this.props.history.push("/changepassword");
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
            this.props.history.push("/");
            this.setState({
                selectedCategoryId: 0,
                searchValue: ""
            });
            this.props.getProducts(DataTypes.PRODUCTS, null, 1, null);
        }

        handleGoToShoppingCart = () => {
            this.props.history.push("/shoppingcart");
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
        handleGetPromoCodesByPage = (pageIndex) => {
            this.props.getPromoCodes(DataTypes.PROMOCODES, pageIndex);
        }

        //admin
        handleChangePageIndexProducts = (categoryId, pageIndex, searchText) => {
            this.props.getProducts(DataTypes.PRODUCTS, categoryId, pageIndex, searchText);
        }

        handleChangeFilterValues = (categoryId, pageIndex, searchText) => {
            this.props.getProducts(DataTypes.PRODUCTS, categoryId, pageIndex, searchText);
        }



        handleGetProduct = (id, callback) => {
            this.props.getProduct(DataTypes.PRODUCTS, id, callback);
        }

        handleSetSelectedCategoryId = (categoryId) => {
            this.setState(
                { selectedCategoryId: categoryId });
        }

    }
)
