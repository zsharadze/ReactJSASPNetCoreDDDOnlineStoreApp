import { ACTION_TYPES } from "../data/Types";

export const categoryReducer = (storeData, action) => {

    switch (action.type) {
        case ACTION_TYPES.CATEGORY_GETALL:
            return {
                ...storeData, [action.payload.dataType]: action.payload.data
            }
        default:
            return storeData || {};
    }
}
