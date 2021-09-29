import { ACTION_TYPES } from "./Types";
import { product, category, order, promoCode } from "./api";

export const getProducts = (dataType, categoryId, pageIndex, searchText) => (
    {
        type: ACTION_TYPES.PRODUCT_GETALL,
        payload: product().getAll(categoryId, pageIndex, searchText).then(response =>
        ({
            dataType,
            data: response.data
        })
        )
    });

export const getProduct = (dataType, id, callback) => (
    {
        type: ACTION_TYPES.PRODUCT_GET,
        payload: product().getById(id, callback)
            .then((response) => {
                callback(response.data);
                return ({
                    dataType,
                    data: response.data
                })
            })
    });

export const addProduct = (dataType, productObject, callback) => (
    {
        type: ACTION_TYPES.PRODUCT_CREATE,
        payload: product().create(productObject, callback)
            .then((response) => {
                callback();
                return ({
                    dataType,
                    data: response.data
                })
            })
    });

export const updateProduct = (dataType, productObject, callback) => (
    {
        type: ACTION_TYPES.PRODUCT_UPDATE,
        payload: product().update(productObject, callback)
            .then((response) => {
                callback();
                return ({
                    dataType,
                    data: response.data
                })
            })
    });

export const deleteProduct = (dataType, productId, callback) => (
    {
        type: ACTION_TYPES.PRODUCT_DELETE,
        payload: product().delete(productId, callback)
            .then((response) => {
                callback();
                return ({
                    dataType,
                    data: response.data
                })
            })
    });

export const getCategories = (dataType) => (
    {
        type: ACTION_TYPES.CATEGORY_GETALL,
        payload: category().getAll().then(response =>
        ({
            dataType,
            data: response.data
        })
        )
    });

export const getCategory = (dataType, categoryId, callback) => (
    {
        type: ACTION_TYPES.CATEGORY_GET,
        payload: category().getById(categoryId).then((response) => {
            callback(response.data);
            return ({
                dataType,
                data: response.data
            })
        })
    });

export const addCategory = (dataType, newCategory, callback) => (
    {
        type: ACTION_TYPES.CATEGORY_CREATE,
        payload: category().create(newCategory).then((response) => {
            callback();
            return ({
                dataType,
                data: response.data
            })
        }
        )
    });

export const updateCategory = (dataType, categoryObject, callback) => (
    {
        type: ACTION_TYPES.CATEGORY_UPDATE,
        payload: category().update(categoryObject).then((response) => {
            callback();
            return ({
                dataType,
                data: response.data
            })
        }
        )
    });

export const deleteCategory = (dataType, categoryId, callback) => (
    {
        type: ACTION_TYPES.CATEGORY_DELETE,
        payload: category().delete(categoryId, callback)
            .then((response) => {
                callback();
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

export const getPromoCodes = (dataType, pageIndex, searchText) => (
    {
        type: ACTION_TYPES.PROMOCODE_GETALL,
        payload: promoCode().getAll(pageIndex, searchText).then(response =>
        ({
            dataType,
            data: response.data
        })
        )
    });
