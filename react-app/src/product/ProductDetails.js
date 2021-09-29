import React, { Component } from "react";
import { TopMenuIcons } from "../common/topmenuicons";
import { HomeBtn } from "../common/homeBtn";

export class ProductDetails extends Component {
    constructor(props) {
        super(props);
        const queryString = require('query-string');
        let parsed = queryString.parse(this.props.location.search);

        this.state = {
            id: parsed.id,
            name: "",
            description: "",
            price: "",
            imageSrc: "",
            quantity: 1,
        };
    }

    componentDidMount = () => {
        if (this.state.id) {
            this.props.getProduct(this.state.id, this.afterProductGetById);
        }
    }

    afterProductGetById = (product) => {
        if (product) {
            this.setState({
                name: product.name,
                description: product.description,
                price: product.price,
                imageSrc: product.imageSrc,
                quantity: 1,
            });
        }
    }

    addToCart = () => {
        this.props.addToCart(Number(this.state.id), this.state.quantity);
    }

    quantityChange = (event) => {
        this.setState({ quantity: Number(event.target.value) });
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12 text-center">
                        <HomeBtn />
                        <TopMenuIcons />
                    </div>
                </div>
                <div className="row flex-nowrap">
                    {this.state.id ?
                        <div className="col-12-md detailsName"><h4>{this.state.name}</h4></div>
                        : <div></div>
                    }
                </div>
                <div className="row">
                    {this.state.id ?
                        <React.Fragment>
                            <div className="col-sm-12 col-md-6 col-lg-6">
                                <img className="detailsImg" src={"data:image/jpeg;base64," + this.state.imageSrc} alt={this.state.name} />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6">
                                <span className="inStockText">In Stock</span>
                                <h5>Price: ${this.state.price}</h5>
                                <h5>Description</h5>
                                <span className="detailsDescription">{this.state.description}</span>
                                <br />
                                <div className="addToCartWrapper">
                                    <input type="number" min="1" step="1" className="quantitySelector" onKeyDown={(evt) => evt.key === 'e' && evt.preventDefault()} onChange={this.quantityChange} value={this.state.quantity} />
                                    <button className="btn btn-primary addToCartBtn" onClick={() => this.addToCart()}>Add To Cart</button>
                                    <span className="shipsForFreeText">Ships for free</span>
                                </div>
                            </div>
                        </React.Fragment>
                        : <div>No product to display</div>
                    }
                </div>
            </div>
        )
    }
}