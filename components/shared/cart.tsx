"use client"

import { useState } from "react"
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react"

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

const initialCart = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 1999,
        quantity: 1,
        image:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 2999,
        quantity: 2,
        image:
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    },
]

export function CartComponent() {
    const [cart, setCart] = useState(initialCart)
     const [open, setOpen] = useState(false)

    const increaseQty = (id: number) => {
        setCart((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        )
    }

    const decreaseQty = (id: number) => {
        setCart((prev) =>
            prev.map((item) =>
                item.id === id && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        )
    }

    const removeItem = (id: number) => {
        setCart((prev) => prev.filter((item) => item.id !== id))
    }

    const total = cart.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    )

    return (
        <div className="flex items-center justify-center bg-white ">
            <Sheet  open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="default" className="relative rounded-2xl px-6">
                        <Image src="/assets/images/cart.gif" height={30} width={30} className="h-[30px] w-[30px]" alt="" />
                        {
                            cart.length > 0 && <Badge className="bg-blue-600 text-white absolute -top-1 right-[6px]">{cart.length}</Badge>
                        }
                    </Button>
                </SheetTrigger>

                <SheetContent className="w-full sm:max-w-lg flex flex-col z-1000 bg-white border border-gay-200">
                    <SheetHeader>
                        <SheetTitle className="text-2xl font-bold">
                            Shopping Cart
                        </SheetTitle>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto mt-6 space-y-5 p-5">
                        {cart.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                <ShoppingCart className="w-14 h-14 mb-3" />
                                <p>Your cart is empty</p>
                            </div>
                        ) : (
                            cart.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex gap-4 border rounded-2xl border-gray-200 p-4 shadow-sm"
                                >
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-24 h-24 rounded-xl object-cover"
                                    />

                                    <div className="flex flex-1 flex-col justify-between">
                                        <div>
                                            <h3 className="font-semibold text-lg">
                                                {item.name}
                                            </h3>
                                            <p className="text-gray-500 text-sm">
                                                ₹{item.price}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between mt-3">
                                            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => decreaseQty(item.id)}
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </Button>

                                                <span className="px-4 text-sm">
                                                    {item.quantity}
                                                </span>

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => increaseQty(item.id)}
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </Button>
                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeItem(item.id)}
                                            >
                                                <Trash2 className="w-5 h-5 text-red-500" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {cart.length > 0 && (
                        <div className="p-5 border-t border-gray-200">
                            <Separator className="my-4" />

                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-lg font-semibold">
                                    <span>Total</span>
                                    <span>₹{total}</span>
                                </div>
                            </div>

                            <SheetFooter className="mt-6">
                                <Button onClick={() => setOpen(false)} className="w-full rounded-2xl h-12 text-base bg-blue-500 text-white hover:bg-blue-600 cursor-pointer" variant="outline" asChild>
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
