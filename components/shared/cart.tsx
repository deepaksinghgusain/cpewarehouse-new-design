"use client"

import { useState } from "react"
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"

import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { Badge } from "../ui/badge"
import Link from "next/link"
import { RootState, AppDispatch } from "@/store/store"
import { updateCartRequest } from "@/store/actions/cart-actions"
import { imageUrl as imageUrlConstant } from "@/lib/constants"

export function CartComponent() {
    const dispatch = useDispatch<AppDispatch>()

    const cartItems = useSelector((state: RootState) => state.cart.items)
    const cart = useSelector((state: RootState) => state.cart)

    console.log("Cart :", cart);

    const cartTotal = useSelector((state: RootState) => state.cart.total || 0)
    const [open, setOpen] = useState(false)

    const subtotal = cartItems.reduce((acc: number, it: any) => acc + ((it.course?.price || 0) * (it.qty || 1)), 0);

    const increaseQty = (item: any) => {
        const qty = (item.qty || item.quantity || 1) + 1
        dispatch(updateCartRequest({ item, qty }))
    }

    const decreaseQty = (item: any) => {
        const currentQty = item.qty || item.quantity || 1
        if (currentQty <= 1) return
        dispatch(updateCartRequest({ item, qty: currentQty - 1 }))
    }

    const removeCartItem = (item: any) => {
        dispatch(updateCartRequest({ item, remove: true }))
    }

    const total = cartTotal || cartItems.reduce((acc: number, item: any) => {
        const price = item.course?.data?.attributes?.price || item.course?.price || item.price || 0
        const qty = item.qty || item.quantity || 1
        return acc + price * qty
    }, 0)

    return (
        <div className="flex items-center justify-center bg-white ">
            <Sheet  open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="default" className="relative rounded-2xl px-6">
                        <Image src="/assets/images/cart.gif" height={30} width={30} className="h-[30px] w-[30px]" alt="" />
                        {cartItems.length > 0 && (
                            <Badge className="bg-blue-600 text-white absolute -top-1 right-[6px]">
                                {cartItems.length}
                            </Badge>
                        )}
                    </Button>
                </SheetTrigger>

                <SheetContent className="w-full sm:max-w-lg flex flex-col z-1000 bg-white border border-gay-200">
                    <SheetHeader>
                        <SheetTitle className="text-2xl font-bold">
                            Shopping Cart
                        </SheetTitle>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto mt-6 space-y-5 p-5">
                        {cartItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                <ShoppingCart className="w-14 h-14 mb-3" />
                                <p>Your cart is empty</p>
                            </div>
                        ) : (
                            cartItems.map((item: any) => {
                                console.log("Cart item:", item);
                                const title =
                                    item.course?.data?.attributes?.title ||
                                    item.course?.title ||
                                    item.name ||
                                    "Course"
                                const slug =
                                    item.course?.slug ||
                                    item.slug ||
                                    null
                                const category =
                                    item.course?.data?.attributes?.category?.data?.attributes?.title ||
                                    item.course?.category ||
                                    item.category ||
                                    null
                                const price =
                                    item.course?.data?.attributes?.price ||
                                    item.course?.price ||
                                    item.price ||
                                    0
                                const qty = item.qty || item.quantity || 1
                                const imageUrl =
                                    imageUrlConstant + item.course?.url ||
                                    "/assets/images/cart.gif"

                                return (
                                    <div
                                        key={item.courseId || item.id || title}
                                        className="flex gap-4 border rounded-2xl border-gray-200 p-4 shadow-sm"
                                    >
                                        <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100">
                                            <Image
                                                src={imageUrl}
                                                alt={title}
                                                width={96}
                                                height={96}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div className="flex flex-1 flex-col justify-between">
                                            <div>
                                                <h3 className="font-semibold text-lg">
                                                    {slug ? (
                                                        <Link href={`/course/${slug}`} className="hover:text-blue-600 transition">
                                                            {title}
                                                        </Link>
                                                    ) : (
                                                        title
                                                    )}
                                                </h3>
                                                {category && (
                                                    <p className="text-gray-500 text-sm">
                                                        Category: {category}
                                                    </p>
                                                )}
                                                <p className="text-gray-500 text-sm">
                                                    {price} each
                                                </p>
                                                <p className="text-gray-700 text-sm mt-1">
                                                    {price * qty} total
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between mt-3">
                                                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => decreaseQty(item)}
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </Button>

                                                    <span className="px-4 text-sm">{qty}</span>

                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => increaseQty(item)}
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </Button>
                                                </div>

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeCartItem(item)}
                                                >
                                                    <Trash2 className="w-5 h-5 text-red-500" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>

                    {cartItems.length > 0 && (
                        <div className="p-5 border-t border-gray-200">
                            <Separator className="my-4" />

                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-lg font-semibold">
                                    <span>Sub Total</span>
                                    <span>${subtotal}</span>
                                </div>
                            </div>

                            {cart.discountCode && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-lg font-semibold">
                                        <span>Discount Code</span>
                                        <span>{cart.discountCode}</span>
                                    </div>
                                    <div className="flex items-center text-red-500 justify-between text-lg font-semibold">
                                        <span>Discount Price</span>
                                        <span>- ${cart.discountPrice}</span>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-lg font-semibold">
                                    <span>Total</span>
                                    <span>${cart.finalPrice}</span>
                                </div>
                            </div>

                            <SheetFooter className="mt-6">
                                <Button
                                    onClick={() => setOpen(false)}
                                    className="w-full rounded-2xl h-12 text-base bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                                    variant="outline"
                                    asChild
                                >
                                    <Link href="/checkout">Checkout</Link>
                                </Button>
                            </SheetFooter>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}
