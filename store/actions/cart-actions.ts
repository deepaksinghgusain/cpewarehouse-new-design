export const CART_ADD_REQUEST = "cart/CART_ADD_REQUEST" as const;
export const CART_ADD_SUCCESS = "cart/CART_ADD_SUCCESS" as const;
export const CART_SET = "cart/CART_SET" as const;
export const CART_REMOVE = "cart/CART_REMOVE" as const;
export const CART_UPDATE_REQUEST = "cart/CART_UPDATE_REQUEST" as const;
export const CART_GET_REQUEST = "cart/CART_GET_REQUEST" as const;

export const addToCartRequest = (payload: any) => ({
  type: CART_ADD_REQUEST,
  payload,
});

export const addToCartSuccess = (payload: any) => ({
  type: CART_ADD_SUCCESS,
  payload,
});

export const setCart = (payload: any) => ({
  type: CART_SET,
  payload,
});

export const removeFromCart = (payload: any) => ({
  type: CART_REMOVE,
  payload,
});

export const updateCartRequest = (payload: any) => ({
  type: CART_UPDATE_REQUEST,
  payload,
});

export const getCartRequest = (payload: any) => ({
  type: CART_GET_REQUEST,
  payload,
});
