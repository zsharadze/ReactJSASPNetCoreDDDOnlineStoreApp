import { DataTypes } from "./Types";

const protocol = "https";
const hostname = "localhost:44383";
export const loginUrl = `${protocol}://${hostname}/authenticate/login`;
export const registerUrl = `${protocol}://${hostname}/authenticate/register`;
export const changePasswordUrl = `${protocol}://${hostname}/authenticate/changepassword`;

export const RestUrls = {
    [DataTypes.PRODUCTS]: `${protocol}://${hostname}/product/`,
    [DataTypes.CATEGORIES]: `${protocol}://${hostname}/category/`,
    [DataTypes.ORDERS]: `${protocol}://${hostname}/order/`,
    [DataTypes.PROMOCODES]: `${protocol}://${hostname}/promocode/`,
}