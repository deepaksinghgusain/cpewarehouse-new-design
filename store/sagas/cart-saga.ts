import { call, put, select, takeLatest } from "redux-saga/effects";
import { CART_ADD_REQUEST, CART_UPDATE_REQUEST, CART_GET_REQUEST, CART_CLEAR_REQUEST } from "../actions/cart-actions";
import { createCart, updateCartAPI, getCart } from "@/services/cart";
import { setCart, clearCart } from "../reducers/cart-reducer";

function buildCartRequestBody(payload: any) {
  const courseId = payload.courseId || 0;
  const qty = payload.qty || 0;
  const packageId = payload.packageId || 0;
  const email = typeof window !== "undefined" ? localStorage.getItem("email") || "" : "";
  const userId = typeof window !== "undefined" ? Number(localStorage.getItem("userId") || 0) : 0;
  const total = payload.total || 0;
  const finalPrice = payload.finalPrice ?? total;

  return {
    data: {
      userId,
      total,
      CartItem: [
        {
          courseId,
          qty,
          packageId,
          Enrollment: payload.Enrollment || [
            {
              courseId,
              email,
              name: payload.name || "",
              lastname: payload.lastname || "",
              ptin: payload.ptin || "",
              packageId,
            },
          ],
        },
      ],
      discountCode: payload.discountCode || "",
      discountPrice: payload.discountPrice || 0,
      finalPrice,
    },
  };
}

function* handleAddToCart(action: any): Generator<any, any, any> {
  try {
    const payload = action.payload;
    const cartId = typeof window !== "undefined" ? localStorage.getItem("cartId") : null;
    const body = buildCartRequestBody(payload);

    console.log("Cart request body:", body);

    if (!cartId || cartId === "0") {
      // create new cart
      const resp = yield call(createCart, body);      
      if (resp && resp.data) {
        localStorage.setItem("cartId", String(resp.data.id));
        const full = yield call(getCart, resp.data.id);
        console.log({full})
        yield put(setCart(full));
      }
    } else {
      const cartState = yield select((state: any) => state.cart);
      const updateBody = buildFullCartBody(cartState, { item: payload, qty: payload.qty });
      const resp = yield call(updateCartAPI, cartId, updateBody);
      if (resp && resp.data) {
        console.log("Cart updated:", resp.data);
        const full = yield call(getCart, cartId);
        console.log({full});
        yield put(setCart(full));
      }
    }
  } catch (err) {
    console.error("cart saga error", err);
  }
}

function getCartItemIdentity(item: any) {
  return {
    courseId: Number(item?.courseId ?? item?.id ?? 0) || 0,
    packageId: Number(item?.packageId ?? 0) || 0,
  };
}

function isSameCartItem(item: any, target: any) {
  const left = getCartItemIdentity(item);
  const right = getCartItemIdentity(target);

  if (left.packageId && right.packageId) {
    return left.packageId === right.packageId;
  }

  if (left.courseId && right.courseId) {
    return left.courseId === right.courseId;
  }

  return left.courseId === right.courseId && left.packageId === right.packageId;
}

function buildFullCartBody(cartState: any, payload: any) {
  const courseId = payload.item?.courseId || 0;
  const packageId = payload.item?.packageId || 0;
  const qty = payload.qty ?? payload.item?.qty ?? payload.item?.quantity ?? 0;
  const remove = payload.remove === true;
  let found = false;

  const items = cartState.items
    .map((item: any) => {
      if (remove && isSameCartItem(item, payload.item)) {
        found = true;
        return null;
      }

      if (isSameCartItem(item, payload.item)) {
        found = true;
        return {
          courseId: item.courseId,
          qty,
          packageId: item.packageId || 0,
          Enrollment: item.Enrollment || [
            {
              courseId: item.courseId || item.id,
              email: typeof window !== "undefined" ? localStorage.getItem("email") || "" : "",
              name: item.name || item.course?.data?.attributes?.name || "",
              lastname: item.lastname || "",
              ptin: item.ptin || "",
              packageId: item.packageId || 0,
            },
          ],
        };
      }

      return {
        courseId: item.courseId,
        qty: item.qty || item.quantity || 1,
        packageId: item.packageId || 0,
        Enrollment: item.Enrollment || [
          {
            courseId: item.courseId,
            email: typeof window !== "undefined" ? localStorage.getItem("email") || "" : "",
            name: item.name || item.course?.data?.attributes?.name || "",
            lastname: item.lastname || "",
            ptin: item.ptin || "",
            packageId: item.packageId || 0,
          },
        ],
      };
    })
    .filter(Boolean) as any[];

  if (!remove && payload.item && !found) {
    items.push({
      courseId,
      qty,
      packageId,
      Enrollment: payload.item?.Enrollment || [
        {
          courseId,
          email: typeof window !== "undefined" ? localStorage.getItem("email") || "" : "",
          name: payload.item?.name || payload.item?.course?.data?.attributes?.name || "",
          lastname: payload.item?.lastname || "",
          ptin: payload.item?.ptin || "",
          packageId,
        },
      ],
    });
  }

  const total = items.reduce((acc: number, item: any) => {
    const price = item.course?.data?.attributes?.price || item.course?.price || item.price || 0;
    const quantity = item.qty || item.quantity || 1;
    return acc + price * quantity;
  }, 0);

  return {
    data: {
      userId: typeof window !== "undefined" ? Number(localStorage.getItem("userId") || 0) : 0,
      total,
      CartItem: items,
      discountCode: payload.discountCode || "",
      discountPrice: payload.discountPrice ?? 0,
      finalPrice: payload.finalPrice ?? total,
    },
  };
}

function* handleUpdateCart(action: any): Generator<any, any, any> {
  try {
    const payload = action.payload;
    const cartState = yield select((state: any) => state.cart);
    const cartId = payload.cartId || cartState.cartId;
    if (!cartId) return;


    const body = buildFullCartBody(cartState, payload);
    const resp = yield call(updateCartAPI, cartId, body);
    if (resp && resp.data) {
      const full = yield call(getCart, cartId);
      yield put(setCart(full));
    }
  } catch (err) {
    console.error("update cart error", err);
  }
}

function* handleGetCart(action: any): Generator<any, any, any> {
  try {
    const payload = action.payload;
    const cartId = payload?.cartId || (typeof window !== "undefined" ? localStorage.getItem("cartId") : null);
    
    if (!cartId) {
      console.warn("No cart ID found");
      return;
    }

    const full = yield call(getCart, cartId);
    if (full && full.data) {
      yield put(setCart(full));
    }
  } catch (err) {
    console.error("get cart error", err);
  }
}

function* handleClearCart(): Generator<any, any, any> {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem("cartId");
    }
    yield put(clearCart());
  } catch (err) {
    console.error("clear cart error", err);
  }
}

export function* watchCart(): Generator {
  yield takeLatest(CART_ADD_REQUEST as any, handleAddToCart as any);
  yield takeLatest(CART_UPDATE_REQUEST as any, handleUpdateCart as any);
  yield takeLatest(CART_GET_REQUEST as any, handleGetCart as any);
  yield takeLatest(CART_CLEAR_REQUEST as any, handleClearCart as any);
}
