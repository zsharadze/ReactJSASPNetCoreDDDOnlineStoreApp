import React, { Component } from "react";

export const AdminCategoryList = class extends Component {

    render() {
        return (
        <React.Fragment>
                <i title="Add Category" className="fa fa-plus addCategoryBtn" aria-hidden="true" onClick={() => this.props.AddCategoryClick()}></i>
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
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.categories && this.props.categories.map((item, i) => {
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
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </React.Fragment>
        )
    }
}
