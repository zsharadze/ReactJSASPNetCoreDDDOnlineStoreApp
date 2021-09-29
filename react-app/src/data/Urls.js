import { DataTypes } from "./Types";

const protocol = "https";
const hostname = "localhost";
const port = 44383;
export const loginUrl = `${protocol}://${hostname}:${port}/api/authenticate/login`;
export const registerUrl = `${protocol}://${hostname}:${port}/api/authenticate/register`;
export const changePasswordUrl = `${protocol}://${hostname}:${port}/api/authenticate/changepassword`;

export const RestUrls = {
    [DataTypes.PRODUCTS]: `${protocol}://${hostname}:${port}/api/product/`,
    [DataTypes.CATEGORIES]: `${protocol}://${hostname}:${port}/api/category/`,
    [DataTypes.ORDERS]: `${protocol}://${hostname}:${port}/api/order/`,
    [DataTypes.PROMOCODES]: `${protocol}://${hostname}:${port}/api/promocode/`,
}

