import { ACTION_TYPES } from "./Types";
import { product, category, order, promoCode } from "./api";

export const getProducts = (dataType, categoryId, pageIndex, searchText, callback) => (
    {
        type: ACTION_TYPES.PRODUCT_GETALL,
        payload: product().getAll(categoryId, pageIndex, searchText)
            .then((response) => {
                if (callback) {
                    callback(response.data);
                }
                return ({
                    dataType,
                    data: response.data
                })
            })
    });

export const getProduct = (dataType, id, callback) => (
    {
        type: ACTION_TYPES.PRODUCT_GET,
        payload: product().getById(id)
            .then((response) => {
                if (callback) {
                    callback(response.data);
                }
                return ({
                    dataType,
                    data: response.data
                })
            })
    });

export const getCategories = (dataType, pageIndex, pageSize, searchText, callback) => (
    {
        type: ACTION_TYPES.CATEGORY_GETALL,
        payload: category().getAll(pageIndex, pageSize, searchText)
            .then((response) => {
                if (callback) {
                    callback(response.data);
                }
                return ({
                    dataType,
                    data: response.data
                })
            })
    });

export const getOrdersByUser = (dataType, pageIndex) => (
    {
        type: ACTION_TYPES.ORDER_GETALLBYUSER,
        payload: order().getAllForCurrentUser(pageIndex)
            .then((response) => {
                return ({
                    dataType,
                    data: response.data
                })
            })
    });

export const getOrders = (dataType, pageIndex) => (
    {
        type: ACTION_TYPES.ORDER_GETALL,
        payload: order().getAll(pageIndex)
            .then((response) => {
                return ({
                    dataType,
                    data: response.data
                })
            })
    });

export const getPromoCodes = (dataType, pageIndex, searchText, getOnlyUsed) => (
    {
        type: ACTION_TYPES.PROMOCODE_GETALL,
        payload: promoCode().getAll(pageIndex, searchText, getOnlyUsed).then(response =>
        ({
            dataType,
            data: response.data
        })
        )
    });
