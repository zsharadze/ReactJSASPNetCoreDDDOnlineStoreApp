import { ACTION_TYPES } from "../data/Types";

export const productReducer = (storeData, action) => {

    switch (action.type) {
        case ACTION_TYPES.PRODUCT_GETALL:
            return {
                ...storeData, [action.payload.dataType]: action.payload.data
            }
        case ACTION_TYPES.PRODUCT_GET:
            return {
                ...storeData, [action.payload.dataType]: action.payload.data
            }
        case ACTION_TYPES.PRODUCT_CREATE:
            return {
                ...storeData, [action.payload.dataType]: action.payload.data
            }

        case ACTION_TYPES.PRODUCT_UPDATE:
            return {
                ...storeData, [action.payload.dataType]: action.payload.data
            }

        case ACTION_TYPES.PRODUCT_DELETE:
            return {
                ...storeData, [action.payload.dataType]: action.payload.data
            }
        default:
            return storeData || {};
    }
}
