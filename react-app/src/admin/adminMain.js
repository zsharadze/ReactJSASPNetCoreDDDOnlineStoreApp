import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { authWrapper } from "../auth/AuthWrapper";
import { DataTypes } from "../data/Types";
import { HomeBtn } from "../common/homeBtn";
import { TopMenuIcons } from "../common/topmenuicons";
import CommonContext from '../common/commonContext';
import { product } from "../data/api";
import { category } from "../data/api";
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { AlertPopupConfirm } from '../common/alertPopupConfirm';
import { AdminProductList } from './adminProductsList';
import { AdminPromoCodeList } from './adminPromoCodeList';
import { AdminOrderList } from './adminOrderList';
import { AdminCategoryList } from './adminCategoryList';
import { AlertPopupOk } from "../common/alertPopupOk";

export const AdminMain = withRouter(authWrapper(class extends Component {
    static contextType = CommonContext;

    constructor(props) {
        super(props);
        this.state = {
            addProductShow: false,
            alertConfirmDeleteProductShow: false,
            deleteProductIdAfterConfirm: null,
            alertConfirmDeleteCategoryShow: false,
            deleteCategoryIdAfterConfirm: null,
            alertCantDeleteCategoryShow: false,
            addEditProduct: {
                id: 0,
                name: "",
                description: "",
                categoryId: 0,
                price: 1,
                imageSrc: "",
                errorMessages: [],
            },
            addEditCategory: {
                id: 0,
                name: "",
                faClass: "",
                imageSrc: "",
                faClassSelected: true,
                errorMessages: [],
            }
        };
    }

    componentDidMount() {
        if (!this.props.isAuthenticated || this.props.userRole !== "Admin") {
            this.props.history.push("/login/?needAdminLogin=true");
        }
        else {
            this.props.pageIndexChangedOrders(1);
        }
    }

    handleAddProductChangeName = (event) => {
        let addProduct = this.state.addEditProduct;
        addProduct.name = event.target.value;
        this.setState({ addEditProduct: addProduct });
    }

    handleAddProductChangeDescription = (event) => {
        let addProduct = this.state.addEditProduct;
        addProduct.description = event.target.value;
        this.setState({ addEditProduct: addProduct });
    }

    handleAddProductChangePrice = (event) => {
        let addProduct = this.state.addEditProduct;
        addProduct.price = Number(event.target.value);
        this.setState({ addEditProduct: addProduct });
    }

    addProductCategoryChange = (event) => {
        let addProduct = this.state.addEditProduct;
        addProduct.categoryId = Number(event.target.value);
        this.setState({ addEditProduct: addProduct });
    }

    handleAddProductClick = () => {
        if (this.props.categories.length > 0) {
            let addProduct = this.state.addEditProduct;
            addProduct.categoryId = Number(this.props.categories[0].id);
            this.setState({ addEditProduct: addProduct });
        }
        this.setState({ addProductShow: true });
    }

    handleAddEditProduct = () => {
        let errorMessages = [];
        if (this.state.addEditProduct.name === "") {
            errorMessages.push("Name is required");
        }
        if (this.state.addEditProduct.description === "") {
            errorMessages.push("Description is required");
        }
        if (this.state.addEditProduct.imageSrc === "") {
            errorMessages.push("Please choose image");
        }

        let addProduct = this.state.addEditProduct;
        addProduct.errorMessages = errorMessages;
        this.setState({
            addEditProduct: addProduct
        });

        if (errorMessages.length > 0) {
            return;
        }

        let productToAdd = {
            Id: this.state.addEditProduct.id,
            CategoryId: this.state.addEditProduct.categoryId,
            Name: this.state.addEditProduct.name,
            Description: this.state.addEditProduct.description,
            Price: this.state.addEditProduct.price,
            ImageSrc: this.state.addEditProduct.imageSrc
        }

        if (this.state.addEditProduct.id === 0) {
            product().create(productToAdd).then((res) => {
                if (res.data !== 0) {
                    this.handleCancelAddProduct();
                    this.props.getProducts(DataTypes.PRODUCTS);
                }
            }).catch(err => console.log(err));
        }
        else {
            product().update(productToAdd).then((res) => {
                if (res.data !== "") {
                    this.handleCancelAddProduct();
                    this.props.getProducts(DataTypes.PRODUCTS);
                }
            }).catch(err => console.log(err));
        }
    }

    setAddProductImageFile = (event) => {
        if (event.target.files && event.target.files[0]) {
            let reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = () => {
                let addProduct = this.state.addEditProduct;
                let base64Str = reader.result;
                base64Str = base64Str.replace('data:image/png;base64,', '')
                    .replace('data:image/jpeg;base64,', '')
                    .replace('data:image/gif;base64,', '');
                addProduct.imageSrc = base64Str;
                this.setState({ addEditProduct: addProduct });
            };
            reader.onerror = function (error) {
                console.log('Error: ', error);
            };
        }
    }

    handleCancelAddProduct = () => {
        let addProduct = this.state.addEditProduct;
        addProduct.id = 0;
        addProduct.name = "";
        addProduct.description = "";
        addProduct.categoryId = 0;
        addProduct.price = 1;
        addProduct.imageSrc = "";
        this.setState({
            addEditProduct: addProduct,
            addProductShow: false
        })
    }

    handleSelectTab = (key) => {
        if (key === "orders") {
            this.props.pageIndexChangedOrders(1);
        }
        else if (key === "promoCodes") {
            this.props.getPromoCodes(DataTypes.PROMOCODES);
        }
        else if (key === "products") {
            this.props.getProducts(DataTypes.PRODUCTS);
            this.props.getCategories(DataTypes.CATEGORIES);
        }
    }

    handleShowConfirmDeleteProduct = (id) => {
        this.setState({
            alertConfirmDeleteProductShow: true,
            deleteProductIdAfterConfirm: id
        });
    }

    handleDeleteProduct = () => {
        if (this.state.deleteProductIdAfterConfirm != null) {
            product().delete(this.state.deleteProductIdAfterConfirm).then((res) => {
                this.props.getProducts(DataTypes.PRODUCTS);
            }).catch((err) => console.log(err));
            this.setState({
                alertConfirmDeleteProductShow: false,
                deleteProductIdAfterConfirm: null
            });
        }
    }

    handleCancelDeleteProductClick = () => {
        this.setState({ alertConfirmDeleteProductShow: false });
    }

    handleStartEditProduct = (id) => {
        product().getById(id).then((res) => {
            let productToEdit = this.state.addEditProduct;
            productToEdit.id = res.data.id;
            productToEdit.name = res.data.name;
            productToEdit.description = res.data.description;
            productToEdit.categoryId = res.data.categoryId;
            productToEdit.price = res.data.price;
            productToEdit.imageSrc = res.data.imageSrc;

            this.setState({
                addProductShow: true,
                addEditProduct: productToEdit
            })
        })
    }

    handleAddCategoryChangeName = (event) => {
        let addCategory = this.state.addEditCategory;
        addCategory.name = event.target.value;
        this.setState({ addEditCategory: addCategory });
    }

    handleAddCategoryClick = () => {
        this.setState({ addCategoryShow: true });
    }

    handleStartEditCategory = (id) => {
        category().getById(id).then((res) => {
            let categoryToEdit = this.state.addEditCategory;
            categoryToEdit.id = res.data.id;
            categoryToEdit.name = res.data.name;
            categoryToEdit.faClass = res.data.faClass;
            categoryToEdit.imageSrc = res.data.imageSrc;
            if (!categoryToEdit.faClass) {
                categoryToEdit.faClassSelected = false;
            }
            this.setState({
                addCategoryShow: true,
                addEditCategory: categoryToEdit
            })
        })
    }

    handleAddEditCategory = () => {
        let errorMessages = [];
        if (this.state.addEditCategory.name === "") {
            errorMessages.push("Name is required");
        }
        if (this.state.addEditCategory.faClassSelected && this.state.addEditCategory.faClass === "") {
            errorMessages.push("Enter font awsome class");
        }
        if (!this.state.addEditCategory.faClassSelected && this.state.addEditCategory.imageSrc === "") {
            errorMessages.push("Please choose image");
        }

        let addCategory = this.state.addEditCategory;
        addCategory.errorMessages = errorMessages;
        this.setState({
            addEditCategory: addCategory
        });

        if (errorMessages.length > 0) {
            return;
        }

        let categoryToAdd = {
            Id: this.state.addEditCategory.id,
            Name: this.state.addEditCategory.name,
            FaClass: this.state.addEditCategory.faClassSelected ? this.state.addEditCategory.faClass : "",
            ImageSrc: !this.state.addEditCategory.faClassSelected ? this.state.addEditCategory.imageSrc : ""
        }

        if (this.state.addEditCategory.id === 0) {
            category().create(categoryToAdd).then((res) => {
                if (res.data !== 0) {
                    this.handleCancelAddCategory();
                    this.props.getCategories(DataTypes.CATEGORIES);
                }
            }).catch(err => console.log(err));
        }
        else {
            category().update(categoryToAdd).then((res) => {
                if (res.data !== "") {
                    this.handleCancelAddCategory();
                    this.props.getCategories(DataTypes.CATEGORIES);
                }
            }).catch(err => console.log(err));
        }
    }

    handleShowConfirmDeleteCategory = (id) => {
        this.setState({
            alertConfirmDeleteCategoryShow: true,
            deleteCategoryIdAfterConfirm: id
        });
    }

    handleCancelAddCategory = () => {
        let addCategory = this.state.addEditCategory;
        addCategory.id = 0;
        addCategory.name = "";
        addCategory.faClass = "";
        addCategory.imageSrc = "";
        this.setState({
            addEditCategory: addCategory,
            addCategoryShow: false
        })
    }

    handleCancelDeleteCategoryClick = () => {
        this.setState({ alertConfirmDeleteCategoryShow: false });
    }

    handleDeleteCategory = () => {
        if (this.state.deleteCategoryIdAfterConfirm != null) {
            category().delete(this.state.deleteCategoryIdAfterConfirm).then((res) => {
                if (!res.data) {
                    this.setState({ alertCantDeleteCategoryShow: true });
                }
                else {
                    this.props.getCategories(DataTypes.CATEGORIES);
                }
            }).catch((err) => console.log(err));
            this.setState({
                alertConfirmDeleteCategoryShow: false,
                deleteCategoryIdAfterConfirm: null
            });
        }
    }

    handleAddEditCategoryImageRadioChange = (event) => {
        let addCategory = this.state.addEditCategory;
        addCategory.faClassSelected = event.target.value === "faclass" ? true : false
        this.setState({
            addEditCategory: addCategory
        })
    }

    handleAddEditCategoryFaClassTextChange = (event) => {
        let addCategory = this.state.addEditCategory;
        addCategory.faClass = event.target.value;
        this.setState({
            addEditCategory: addCategory
        })
    }

    setAddCategoryImageFile = (event) => {
        if (event.target.files && event.target.files[0]) {
            let reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = () => {
                let addCategory = this.state.addEditCategory;
                let base64Str = reader.result;
                base64Str = base64Str.replace('data:image/png;base64,', '')
                    .replace('data:image/jpeg;base64,', '')
                    .replace('data:image/gif;base64,', '');
                addCategory.imageSrc = base64Str;
                this.setState({ addEditCategory: addCategory });
            };
            reader.onerror = function (error) {
                console.log('Error: ', error);
            };
        }
    }

    render() {
        return (
            <React.Fragment>
                <AlertPopupConfirm alertShow={this.state.alertConfirmDeleteProductShow} headerText="Delete" text="Are you sure to want to delete? This will delete all orders associated with this product." alertCloseClick={this.handleCancelDeleteProductClick} alertOkClick={this.handleDeleteProduct} alertCancelClick={this.handleCancelDeleteProductClick} />
                <AlertPopupConfirm alertShow={this.state.alertConfirmDeleteCategoryShow} headerText="Delete" text="Are you sure to want to delete?" alertCloseClick={this.handleCancelDeleteCategoryClick} alertOkClick={this.handleDeleteCategory} alertCancelClick={this.handleCancelDeleteCategoryClick} />
                <AlertPopupOk alertShow={this.state.alertCantDeleteCategoryShow} headerText="Delete" text="Can't delete category because there are products attached to it." alertCloseClick={() => this.setState({ alertCantDeleteCategoryShow: false })} alertOkClick={() => this.setState({ alertCantDeleteCategoryShow: false })} okBtnVariant="danger" />
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 text-center">
                            <HomeBtn />
                            <TopMenuIcons />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-3 p-2">
                            <h4>Administration</h4>
                        </div>
                        <div className="col-12 p-2">
                            <Tabs defaultActiveKey="orders" onSelect={(key) => this.handleSelectTab(key)}>
                                <Tab eventKey="orders" title="Orders">
                                    <AdminOrderList {...this.props} />
                                </Tab>
                                <Tab eventKey="products" title="Products">
                                    {this.state.addProductShow &&
                                        <div>
                                            <table className="m-2" style={{ width: "350px" }}>
                                                <tbody>
                                                    <tr>
                                                        <td colSpan="2">
                                                            <span style={{ color: "red" }}>
                                                                {this.state.addEditProduct.errorMessages.length > 0 && this.state.addEditProduct.errorMessages.map((item, i) => {
                                                                    return (
                                                                        <React.Fragment key={i}>
                                                                            <span>{item} {(i < this.state.addEditProduct.errorMessages.length - 1) &&
                                                                                <br />
                                                                            }</span>

                                                                        </React.Fragment>
                                                                    );
                                                                })}

                                                            </span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <label>Category:&nbsp;</label>
                                                        </td>
                                                        <td className="td2AddProduct">
                                                            <select className="form-select" onChange={this.addProductCategoryChange} value={this.state.addEditProduct.categoryId}>
                                                                {this.props.categories && this.props.categories.map((item, i) => {
                                                                    return (
                                                                        <option key={item.id} value={item.id}>{item.name}</option>
                                                                    );
                                                                })}
                                                            </select>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ width: "100px" }}>
                                                            <label>Name:&nbsp;</label>
                                                        </td>
                                                        <td className="td2AddProduct">
                                                            <input type="text" className={"form-control" + (this.state.addEditProduct.name.length ? '' : ' errorInput')} onChange={(event) => { this.handleAddProductChangeName(event) }} value={this.state.addEditProduct.name} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ width: "90px", verticalAlign: "top" }}>
                                                            <label>Description:&nbsp;</label>
                                                        </td>
                                                        <td className="td2AddProduct">
                                                            <textarea type="textarea" className={"form-control" + (this.state.addEditProduct.description ? '' : ' errorInput')} onChange={(event) => { this.handleAddProductChangeDescription(event) }} value={this.state.addEditProduct.description} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ width: "90px" }}>
                                                            <label>Price $:&nbsp;</label>
                                                        </td>
                                                        <td className="td2AddProduct">
                                                            <input type="number" min="1" step="1" className="form-control" onChange={(event) => { this.handleAddProductChangePrice(event) }} value={this.state.addEditProduct.price} style={{ width: "110px" }} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ width: "90px", verticalAlign: "top" }}>
                                                            <label>Image:&nbsp;</label>
                                                        </td>
                                                        <td className="td2AddProduct">
                                                            <label htmlFor="imageUploadAddEditProduct" className="custom-file-upload">
                                                                <i className="fa fa-cloud-upload"></i> Upload Image
                                                            </label>
                                                            <input accept="image/png, image/gif, image/jpeg" id="imageUploadAddEditProduct" type="file" onChange={e => this.setAddProductImageFile(e)} />
                                                            <img className="addProductShowImg" src={"data:image/jpeg;base64," + this.state.addEditProduct.imageSrc} alt="productImage" />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan="2">
                                                            <button type="button" className="btn btn-primary float-end ms-2 mt-2" onClick={() => this.handleAddEditProduct()}>{this.state.addEditProduct.id !== 0 ? "Save" : "Add"}</button>
                                                            <button type="button" className="btn btn-danger float-end mt-2" onClick={() => { this.handleCancelAddProduct() }}>Cancel</button>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    }
                                    {!this.state.addProductShow &&
                                        <AdminProductList {...this.props} AddProductClick={this.handleAddProductClick} StartEditProduct={this.handleStartEditProduct} ShowConfirm={this.handleShowConfirmDeleteProduct} />
                                    }
                                </Tab>
                                <Tab eventKey="categories" title="Categories">
                                    {this.state.addCategoryShow &&
                                        <div>
                                            <table className="m-2" style={{ width: "450px" }}>
                                                <tbody>
                                                    <tr>
                                                        <td colSpan="2">
                                                            <span style={{ color: "red" }}>
                                                                {this.state.addEditCategory.errorMessages.length > 0 && this.state.addEditCategory.errorMessages.map((item, i) => {
                                                                    return (
                                                                        <React.Fragment key={i}>
                                                                            <span>{item} {(i < this.state.addEditCategory.errorMessages.length - 1) &&
                                                                                <br />
                                                                            }</span>

                                                                        </React.Fragment>
                                                                    );
                                                                })}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ width: "127px" }}>
                                                            <label>Name:&nbsp;</label>
                                                        </td>
                                                        <td className="td2AddCategory">
                                                            <input type="text" className={"form-control" + (this.state.addEditCategory.name.length ? '' : ' errorInput')} onChange={(event) => { this.handleAddCategoryChangeName(event) }} value={this.state.addEditCategory.name} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ width: "127px", verticalAlign: "top" }}>
                                                            Category image:
                                                        </td>
                                                        <td className="td2AddCategory">
                                                            <input type="radio" name="categoryImage" id="AddCategoryFontAwsomeClassRadio" value="faclass" checked={this.state.addEditCategory.faClassSelected} onChange={(event) => this.handleAddEditCategoryImageRadioChange(event)} />
                                                            <label htmlFor="AddCategoryFontAwsomeClassRadio" className="nolabelselect">&nbsp;Font awsome class</label>&nbsp;&nbsp;
                                                            <input type="radio" name="categoryImage" id="AddCategoryUploadImageRadio" value="image" checked={!this.state.addEditCategory.faClassSelected} onChange={(event) => this.handleAddEditCategoryImageRadioChange(event)} />
                                                            <label htmlFor="AddCategoryUploadImageRadio" className="nolabelselect">&nbsp;Upload Image</label>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ width: "90px" }}>
                                                            {this.state.addEditCategory.faClassSelected &&
                                                                <span>Fa class name</span>
                                                            }
                                                        </td>
                                                        <td className="td2AddCategory">
                                                            {this.state.addEditCategory.faClassSelected &&
                                                                <input type="text" className={"form-control" + (this.state.addEditCategory.faClass.length ? '' : ' errorInput')} placeholder="example: fa fa-desktop" value={this.state.addEditCategory.faClass} onChange={(event) => this.handleAddEditCategoryFaClassTextChange(event)} />
                                                            }
                                                            {!this.state.addEditCategory.faClassSelected &&
                                                                <React.Fragment>
                                                                    <label htmlFor="imageUploadAddEditCategory" className="custom-file-upload">
                                                                        <i className="fa fa-cloud-upload"></i> Upload Image
                                                                    </label>
                                                                    <input accept="image/png, image/gif, image/jpeg" id="imageUploadAddEditCategory" type="file" onChange={e => this.setAddCategoryImageFile(e)} />
                                                                    <br />
                                                                    <img className="addCategoryShowImg" src={"data:image/jpeg;base64," + this.state.addEditCategory.imageSrc} alt="categoryImage" />
                                                                </React.Fragment>
                                                            }
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan="2">
                                                            <button type="button" className="btn btn-primary float-end ms-2 mt-2" onClick={() => this.handleAddEditCategory()}>{this.state.addEditCategory.id !== 0 ? "Save" : "Add"}</button>
                                                            <button type="button" className="btn btn-danger float-end mt-2" onClick={() => { this.handleCancelAddCategory() }}>Cancel</button>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    }
                                    {!this.state.addCategoryShow &&
                                        <AdminCategoryList {...this.props} AddCategoryClick={this.handleAddCategoryClick} StartEditCategory={this.handleStartEditCategory} ShowConfirm={this.handleShowConfirmDeleteCategory} />
                                    }
                                </Tab>
                                <Tab eventKey="promoCodes" title="Promo Codes">
                                    <AdminPromoCodeList {...this.props} />
                                </Tab>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}))