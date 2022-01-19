import React, { Component } from "react";
import CommonContext from '../common/commonContext';

export class HomeBtn extends Component {
    static contextType = CommonContext;

    render() {
        return (
            <button title="Home" className="home_btn float-start" onClick={() => this.context.goToHomePath()}></button>
        )
    }
}