import axios from "axios";
import { RestUrls, changePasswordUrl } from "../data/Urls";
import { DataTypes } from "./Types";

const pageSize = 10;

export const product = () => {
    let url = RestUrls[DataTypes.PRODUCTS];
    let token = localStorage.getItem('token');
    if (token != null) {
        axios.defaults.headers.common['Authorization'] = "Bearer " + token;
    }
    
    return {
        getAll: (categoryId, pageIndex, searchText) => axios.get(url + `getall?categoryId=${categoryId ? categoryId : ""}&pageSize=${pageSize}&pageIndex=${pageIndex ? pageIndex : ""}&searchText=${searchText ? searchText : ""}`),
        getById: id => axios.get(url + "details/?id=" + id),
        create: (newRecord) => {
            return axios({
                method: "post",
                url: url + "create",
                data: newRecord,
                headers: { "Content-Type": "application/json" }
            });
        },
        update: (updateRecord) => axios.put(url + "edit", updateRecord),
        delete: id => axios.delete(url + "delete/?id=" + id)
    }
}

export const category = () => {
    let url = RestUrls[DataTypes.CATEGORIES];
    let token = localStorage.getItem('token');
    if (token != null) {
        axios.defaults.headers.common['Authorization'] = "Bearer " + token;
    }

    return {
        getAll: () => axios.get(url + 'getall'),
        getById: id => axios.get(url + "details/?id=" + id),
        create: newRecord => axios.post(url + "create", newRecord),
        update: (updateRecord) => axios.put(url + "edit", updateRecord),
        delete: id => axios.delete(url + "delete/?id=" + id)
    }
}

export const order = () => {
    let url = RestUrls[DataTypes.ORDERS];
    let token = localStorage.getItem('token');
    if (token != null) {
        axios.defaults.headers.common['Authorization'] = "Bearer " + token;
    }

    return {
        getAll: (pageIndex) => axios.get(url + `getall?pageSize=${pageSize}&pageIndex=${pageIndex ? pageIndex : ""}`),
        getAllForCurrentUser: (pageIndex) => axios.get(url + `GetallforcurrentUser?pageSize=${pageSize}&pageIndex=${pageIndex ? pageIndex : ""}`),
        create: (orderItems, promoCode) => {
            return axios({
                method: "post",
                url: url + "createorder?promoCode=" + promoCode,
                data: orderItems,
                headers: { "Content-Type": "application/json" }
            });
        },
        ship: (id) => axios.post(url + 'shiporder/?id=' + id),
    }
}

export const promoCode = () => {
    let url = RestUrls[DataTypes.PROMOCODES];
    let token = localStorage.getItem('token');
    if (token != null) {
        axios.defaults.headers.common['Authorization'] = "Bearer " + token;
    }

    return {
        getAll: (pageIndex, searchText) => axios.get(url + `getall?pageSize=${pageSize}&pageIndex=${pageIndex ? pageIndex : ""}&searchText=${searchText ? searchText : ""}`),
        generate: (quantity, discount) => axios.post(url + 'generatepromocodes/?quantity=' + quantity + '&discount=' + discount),
        delete: (id) => axios.delete(url + 'delete/?id=' + id),
        getByPromoCodeText: (promoCodeText) => axios.get(url + 'getbypromocodetext/?promoCodeText=' + promoCodeText),
    }
}

export const changePassword = (changePasswordModel) => {
    let url = changePasswordUrl;
    let token = localStorage.getItem('token');
    if (token != null) {
        axios.defaults.headers.common['Authorization'] = "Bearer " + token;
    }

    return axios({
        method: "post",
        url: url,
        data: changePasswordModel,
        headers: { "Content-Type": "application/json" }
    });
}