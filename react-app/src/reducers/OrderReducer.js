import { ACTION_TYPES } from "../data/Types";

export const orderReducer = (storeData, action) => {

    switch (action.type) {
        case ACTION_TYPES.ORDER_GETALLBYUSER:
            return {
                ...storeData, [action.payload.dataType]: action.payload.data
            }
            case ACTION_TYPES.ORDER_GETALL:
                return {
                    ...storeData, [action.payload.dataType]: action.payload.data
                }
        default:
            return storeData || {};
    }
}
