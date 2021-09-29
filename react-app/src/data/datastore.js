import { createStore, applyMiddleware } from "redux";
import { categoryReducer } from "../reducers/CategoryReducer";
import { productReducer } from "../reducers/ProductReducer";
import { orderReducer } from "../reducers/OrderReducer";
import { promoCodeReducer } from "../reducers/PromoCodeReducer";
import { asyncActions } from "./AsyncMiddleware";
import { CommonReducer } from "../reducers/CommonReducer";

export const dataStore
    = createStore(CommonReducer(productReducer, categoryReducer, orderReducer, promoCodeReducer), applyMiddleware(asyncActions));