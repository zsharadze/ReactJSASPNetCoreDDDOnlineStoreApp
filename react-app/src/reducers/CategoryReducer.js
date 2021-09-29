import { ACTION_TYPES } from "../data/Types";

export const categoryReducer = (storeData, action) => {

    switch (action.type) {
        case ACTION_TYPES.CATEGORY_GETALL:
            return {
                ...storeData, [action.payload.dataType]: action.payload.data
            }
        case ACTION_TYPES.CATEGORY_GET:
            return {
                ...storeData, [action.payload.dataType]: action.payload.data
            }
        case ACTION_TYPES.CATEGORY_CREATE:
            return {
                ...storeData, [action.payload.dataType]: action.payload.data
            }
        case ACTION_TYPES.CATEGORY_UPDATE:
            return {
                ...storeData, [action.payload.dataType]: action.payload.data
            }
        case ACTION_TYPES.CATEGORY_DELETE:
            return {
                ...storeData, [action.payload.dataType]: action.payload.data
            }
        default:
            return storeData || {};
    }
}
