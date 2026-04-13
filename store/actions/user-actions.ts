export const USER_LOGIN_REQUEST = "user/USER_LOGIN_REQUEST";
export const USER_LOGOUT_REQUEST = "user/USER_LOGOUT_REQUEST";

export interface UserInfo {
    id?: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    [key: string]: unknown;
}

export const userLoginRequest = (payload: UserInfo) => ({
    type: USER_LOGIN_REQUEST,
    payload,
});

export const userLogoutRequest = () => ({
    type: USER_LOGOUT_REQUEST,
});
