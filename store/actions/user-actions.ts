export const USER_LOGIN_REQUEST: string = "user/USER_LOGIN_REQUEST" as const;
export const USER_LOGOUT_REQUEST : string = "user/USER_LOGOUT_REQUEST" as const;

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
