import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "font-awesome/css/font-awesome.min.css";
import { TopMenuIcons } from "../common/topmenuicons";
import { HomeBtn } from "../common/homeBtn";
import CommonContext from '../common/commonContext';
import { authWrapper } from "../auth/AuthWrapper";
import { order, promoCode } from "../data/api";
import { AlertPopupOk } from '../common/alertPopupOk';

export const ShoppingCart = authWrapper(class extends Component {
    static contextType = CommonContext;

    constructor(props) {
        super(props);

        this.state = {
            items: [],
            subtotal: 0,
            promoCode: "",
            promoCodeDiscount: 0,
            subtotalWithPromo: null,
            appliedPromoCode: null,
            alertHeaderText: "",
            alertText: "",
            alertBtnVariant: "",
            alertShow: false,
        };
    }

    componentDidMount = () => {
        if (this.context.shoppingCart.length > 0) {
            this.context.shoppingCart.forEach(element => {
                this.props.getProduct(element.id, (product) => {
                    product.quantity = element.quantity;
                    let products = this.state.items;
                    products.push(product)
                    this.setState({
                        items: products,
                        subtotal: this.state.subtotal + (product.price * product.quantity)
                    });
                });
            });
        }
    }

    componentWillUnmount() {
        this.setState({
            promoCode: "",
            promoCodeDiscount: 0,
            subtotalWithPromo: null,
            appliedPromoCode: null
        })
    }

    changeQuantity = (event, item) => {
        let product = this.state.items.find(x => x.id === item.id);
        let products = this.state.items;

        product.quantity = Number(event.target.value);
        let index = products.findIndex(el => el.id === item.id)
        products[index] = product;

        this.setState({
            items: products
        });

        this.calculateSubtotal();
        this.props.changeQuantity(item.id, Number(event.target.value));
    }

    deleteItem = (id) => {
        let products = this.state.items;
        products = products.filter(function (item) {
            return item.id !== id;
        });

        this.setState({
            items: products
        }, () => { this.calculateSubtotal() });


        this.props.deleteItem(id);
    }

    calculateSubtotal = () => {
        let products = this.state.items;
        let subtotal = products.reduce((accumulator, product) => accumulator + (product.price * product.quantity), 0);
        this.setState({
            subtotal: subtotal,
        });

        if (this.state.appliedPromoCode != null) {
            this.setState({ subtotalWithPromo: subtotal - this.state.promoCodeDiscount });
        }
    }

    placeOrder = () => {
        if (!this.props.isAuthenticated) {
            this.props.history.push("/login/?fromOrder=true");
        }
        else {
            let orderItems = [];
            this.state.items.forEach(element => {
                let orderItem = {
                    ProductId: element.id, Quantity: element.quantity
                };
                orderItems.push(orderItem);
            });

            order().create(orderItems, this.state.promoCode).then((res) => {
                this.props.history.push("/orderplaced");
            })
                .catch((err) => {
                    console.log("error occured " + err);
                });
        }
    }



    handleApplyPromoCode = () => {
        promoCode().getByPromoCodeText(this.state.promoCode).then((res) => {
            if (res.data === "") {
                this.setState({
                    alertHeaderText: "Promo",
                    alertText: "Invalid Promo Code",
                    alertBtnVariant: "danger",
                    alertShow: true,
                    promoCode: "",
                });
            }
            else {
                this.setState({
                    alertHeaderText: "Promo",
                    alertText: "Promo Code Applied",
                    alertBtnVariant: "success",
                    alertShow: true,
                    appliedPromoCode: res.data.promoCodeText,
                    promoCodeDiscount: res.data.discount,
                    subtotalWithPromo: (this.state.subtotal - res.data.discount) > 0 ? (this.state.subtotal - res.data.discount) : 0
                });
            }
        }).catch((err) => {
            console.log("error occured " + err);
        });

    }

    handleAlertOkCloseClick = () => {
        this.setState({
            alertHeaderText: "",
            alertText: "",
            alertBtnVariant: "",
            alertShow: false
        })
    }

    render() {
        return (
            <React.Fragment>
                <AlertPopupOk alertShow={this.state.alertShow} headerText={this.state.alertHeaderText} text={this.state.alertText} okBtnVariant={this.state.alertBtnVariant} alertCloseClick={this.handleAlertOkCloseClick} alertOkClick={this.handleAlertOkCloseClick} />
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 text-center">
                            <HomeBtn />
                            <TopMenuIcons />
                        </div>
                    </div>
                    <div className="row flex-nowrap">
                        {this.context.shoppingCart.length > 0 ?
                            <div className="col-12-md detailsName"><h4>Your shopping cart items:</h4></div>
                            : <h3>You have no items in your shopping cart</h3>
                        }
                    </div>
                    <div className="row">
                        {this.context.shoppingCart.length > 0 ?
                            <React.Fragment>
                                <div className="col-sm-12 col-md-8 col-lg-8">
                                    <table className="table shoppingCartTable">
                                        <thead>
                                            <tr>
                                                <th>Product</th>
                                                <th>Description</th>
                                                <th>Price</th>
                                                <th>Quantity</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.items.length > 0 && this.state.items.map((item, i) => {
                                                return (
                                                    <tr key={item.id}>
                                                        <td><img className="shoppingCartProductImg" src={"data:image/jpeg;base64," + item.imageSrc} alt={item.name} /></td>
                                                        <td className="shoppingCartDescription"><span className="productNameText">{item.name}</span><br />{item.description}</td>
                                                        <td><h4>{item.price}$</h4></td>
                                                        <td><input type="number" min="1" step="1" className="cartQuantitySelector" value={item.quantity} onChange={e => this.changeQuantity(e, item)} /></td>
                                                        <td><i className="fa fa-trash cartDeleteItem" aria-hidden="true" onClick={() => this.deleteItem(item.id)}></i></td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="col-sm-12 col-md-4 col-lg-4">
                                    <h5>Order Summary</h5>
                                    <hr />
                                    <div className="orderSummaryWrapper">
                                        {this.state.appliedPromoCode == null &&
                                            <React.Fragment>
                                                <div style={{ textAlign: "center" }}>
                                                    <span>Do you have promo code?</span>
                                                </div>
                                                <div className="input-group promoCodeApplyWrapper">
                                                    <input type="text" className="form-control" placeholder="Promo Code" value={this.state.promoCode} onChange={(e) => this.setState({ promoCode: e.target.value })} />
                                                    <button className="btn btn-outline-primary" onClick={() => this.handleApplyPromoCode()}>Apply</button>
                                                </div>
                                            </React.Fragment>
                                        }
                                        {this.state.appliedPromoCode != null &&
                                            <div style={{ textAlign: "center" }}>
                                                <span className="btn btn-warning">Promo Code Applied</span>
                                            </div>
                                        }
                                        <span className="orderSubtotalText">Shipping:</span>
                                        <span className="float-end orderSubtotalText">$0</span>
                                        <br />
                                        <span className="orderSubtotalText">Subtotal:</span>
                                        <span className="float-end orderSubtotalText">
                                            {this.state.subtotalWithPromo == null &&
                                                "$" + this.state.subtotal
                                            }
                                            {this.state.subtotalWithPromo != null &&
                                                <s>${this.state.subtotal}</s>
                                            }
                                        </span>
                                        {this.state.subtotalWithPromo != null &&
                                            <React.Fragment>
                                                <br />
                                                <span className="orderSubtotalText">Subtotal with promo:</span>
                                                <span className="float-end orderSubtotalText">${this.state.subtotalWithPromo}</span>
                                            </React.Fragment>
                                        }
                                        <br />
                                        <div className="text-center">
                                            <button className="btn btn-success placeOrderBtn" onClick={() => this.placeOrder()}>Place Order</button>
                                        </div>
                                    </div>
                                </div>
                            </React.Fragment>
                            : ""
                        }
                    </div>
                </div>
            </React.Fragment>
        )
    }
})