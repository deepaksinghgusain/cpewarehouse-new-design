import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartState {
	items: any[];
	cartId?: number | string | null;
	total?: number;
	discountCode: string;
	discountPrice: number;
	finalPrice: number;
}

const initialState: CartState = {
	items: [],
	cartId: null,
	total: 0,
	discountCode: "",
	discountPrice: 0,
	finalPrice: 0
};

const cartSlice = createSlice({
	name: "cart",
	initialState,
	reducers: {
		setCart(state, action: PayloadAction<any>) {
			const payload = action.payload;
			// normalize payloads from different API shapes
			let items: any[] = [];
			if (payload?.data?.attributes?.CartItem) {
				items = payload.data.attributes.CartItem;
			} else if (payload?.attributes?.CartItem) {
				items = payload.attributes.CartItem;
			} else if (payload?.data?.CartItem) {
				items = payload.data.CartItem;
			} else if (Array.isArray(payload?.items)) {
				items = payload.items;
			} else if (payload?.courseId) {
				items = [payload];
			} else {
				items = [];
			}

			state.items = items;
			state.cartId = payload?.data?.id || payload?.id || payload.cartId || state.cartId;

			state.discountCode = payload?.data?.attributes?.discountCode;
			state.discountPrice = payload?.data?.attributes?.discountPrice;
			state.finalPrice = payload?.data?.attributes?.finalPrice;

			if (state.finalPrice === 0) {
				let finalPrice = items.reduce((acc: number, item: any) => {
					const price = item.course?.data?.attributes?.price || item.course?.price || item.price || 0;
					const qty = item.qty || item.quantity || 1;
					return acc + price * qty;
				}, 0);
				if(finalPrice) {
					state.finalPrice = Number(finalPrice);
				}
			}

			const payloadTotal =
				payload?.data?.attributes?.total ??
				payload?.data?.total ??
				payload?.attributes?.total ??
				payload?.total;

			const computedTotal = items.reduce((acc: number, item: any) => {
				const price = item.course?.data?.attributes?.price || item.course?.price || item.price || 0;
				const qty = item.qty || item.quantity || 1;
				return acc + price * qty;
			}, 0);

			state.total = payloadTotal != null ? payloadTotal : computedTotal;
		},
		addItem(state, action: PayloadAction<any>) {
			const item = action.payload;
			const existing = state.items.find((i: any) => i.courseId === item.courseId || i.id === item.id);
			if (existing) {
				existing.qty = item.qty;
			} else {
				state.items.push(item);
			}
			state.total = state.items.reduce((acc: number, item: any) => {
				const price = item.course?.data?.attributes?.price || item.course?.price || item.price || 0;
				const qty = item.qty || item.quantity || 1;
				return acc + price * qty;
			}, 0);
		},
		removeItem(state, action: PayloadAction<number>) {
			state.items = state.items.filter((i: any) => i.courseId !== action.payload && i.id !== action.payload);
			state.total = state.items.reduce((acc: number, item: any) => {
				const price = item.course?.data?.attributes?.price || item.course?.price || item.price || 0;
				const qty = item.qty || item.quantity || 1;
				return acc + price * qty;
			}, 0);
		},
		clearCart(state) {
			state.items = [];
			state.cartId = null;
			state.total = 0;
			state.discountCode = "";
			state.discountPrice = 0;
			state.finalPrice = 0;
		}
	},
});

export const { setCart, addItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

