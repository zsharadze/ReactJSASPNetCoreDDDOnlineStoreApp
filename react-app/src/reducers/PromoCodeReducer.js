import { ACTION_TYPES } from "../data/Types";

export const promoCodeReducer = (storeData, action) => {
    switch (action.type) {
        case ACTION_TYPES.PROMOCODE_GETALL:
            return {
                ...storeData, [action.payload.dataType]: action.payload.data
            }
        default:
            return storeData || {};
    }
}
