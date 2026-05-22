"use client";

import { checkAlreadyCoursePurchased } from '@/services/cart';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const AddToCart = ({ course, quantity }: { course: any, quantity: number }) => {

    const [isPurchased, setIsPurchased] = useState(false)
    const [cartId, setIsCartId] = useState(0)
    const [cartData, setCartData] = useState<any>({})
    const router = useRouter()

    async function getcardCount() {
        if (cartId > 0) {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/carts/${cartId}?populate=deep`
                )

                const resp = await res.json()

                if (resp?.data != null) {
                    setIsCartId(resp.data.id)
                    setCartData(resp.data)

                    // set cart quantity
                    const cartQty =
                        resp?.data?.attributes?.CartItem?.length || 0

                    // optional localStorage update
                    localStorage.setItem("cartQty", String(cartQty))
                }
            } catch (error) {
                localStorage.setItem("cartId", "0")
                localStorage.setItem("cartQty", "0")
            }
        }
    }

    function updateTotal() {
        let total = 0;
        cartData.data.CartItem.map((ci: any, index: any) => {
            if (ci.course != undefined) {

                if (ci.courseId > 0) {
                    total += (ci.course.discount || ci.course.discountedPrice || ci.course.discounted_price) > 0 ? (ci.course.discount * ci.qty || ci.course.discountedPrice * ci.qty || ci.course.discounted_price * ci.qty) : (ci.course.price * ci.qty)
                } else {
                    if (ci.course.discounted_price != null && ci.course.discounted_price > 0) {
                        total += ci.course.discounted_price * ci.qty;
                    } else if (ci.course.price != null && ci.course.price >= 0) {
                        total += ci.course.price * ci.qty;
                    } else {
                        total += ci.course.includedCoursePrice * ci.qty;
                    }

                }
            }
        });
        cartData.data.total = total
        cartData.data.finalPrice = total;

        setCartData((prev: any) => ({ ...prev }))
    }

    async function updateCart() {
        try {

            let res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/carts/${cartId}`, {
                method: 'PUT',
                body: JSON.stringify(cartData),
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            res = await res.json();

            await getcardCount();
            router.push('/learner/shopping-cart');

        } catch (err: any) {
            if (err.error.error.status === 403) {
                router.push('/auth/login')
            }
        }
    }

    async function enrollNow2(selectedCourse: any) {

        console.log("selectedCourse", selectedCourse);

        // if cart does not exist then create a cart
        const courseid = selectedCourse.data[0]["id"] || 0;
        const price = selectedCourse.data[0]['attributes']['price']
        const category = selectedCourse?.data[0]?.attributes['category']?.data?.attributes['title'] || '';
        if (new Date(selectedCourse.data[0].attributes['endDate']) < new Date() && category == 'Live') {
            return;
        }

        if (localStorage.getItem('token')) {
            const email = localStorage.getItem('email') || ''


            let res = await checkAlreadyCoursePurchased(courseid, email)

            const dts = res?.data.userCourses.data
            if (dts.length == 0) {
                setIsPurchased(false);  // no course found for the user
            }
            if (dts.length > 0 && dts[0].attributes?.course?.data.id == courseid) {
                setIsPurchased(true); // course already purchased
            }
            if (isPurchased) {

            }
            else {

                if (cartId == 0 && courseid > 0) {

                    setCartData({
                        "courseId": Number(courseid),
                        "qty": quantity,
                        "packageId": 0,
                        "course": selectedCourse.data[0].attributes,
                        "Enrollment": []
                    });

                    console.log("Selected Course", selectedCourse);

                    // const totalprice = selectedCourse?.price * this.seats;
                    let realPrice: any;
                    if ((selectedCourse.data[0].attributes.discount != null && selectedCourse.data[0].attributes.discount != 0)) {
                        realPrice = selectedCourse.data[0].attributes.discount
                    } else {
                        realPrice = selectedCourse.data[0].attributes.price
                    }


                    const totalprice = realPrice * quantity;
                    setCartData((prev: any) => ({
                        ...prev,
                        total: totalprice,
                        finalPrice: prev.finalPrice + totalprice
                    }));

                    res = await fetch(`${process.env.NEXT_PUBLIC_API_END_POINT}/carts`, {
                        method: 'POST',
                        body: JSON.stringify(cartData),
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    })

                    const resp = await res.json();

                    if (resp.data != null) {

                        getcardCount();
                        // SHOW MESSAGE (COURSE ADD SUCCESSFULL)
                        localStorage.setItem('cartId', resp.data.id)
                        router.push('/learner/shopping-cart')
                    }
                    else {
                        // SHOW EROR MESSAGE (SOMETHING WENT WRONG)
                    }

                }

                if (cartId > 0) {
                    // check if item being selected already exists
                    let matchingCourse = cartData?.data?.CartItem.filter((data: any) => data.courseId == courseid)[0] || undefined;
                    if (matchingCourse != undefined || matchingCourse != null) {
                        // update quantity
                        matchingCourse.qty = quantity
                    }
                    else {
                        let realPrice: any;
                        if ((selectedCourse.data[0].attributes.discount != null && selectedCourse.data[0].attributes.discount != 0)) {
                            realPrice = selectedCourse.data[0].attributes.discount
                        } else {
                            realPrice = selectedCourse.data[0].attributes.price
                        }

                        // its new item to be added
                        setCartData((prev: any) => ({
                            ...prev,
                            "courseId": Number(courseid),
                            "qty": quantity,
                            "course": selectedCourse.data[0].attributes,
                            "packageId": 0,
                            "Enrollment": []
                        }))
                    }
                    updateTotal();
                }
                updateTotal();
                updateCart();
            }

        } else {
            setCartData((prev: any) => ({
                ...prev,
                "courseId": Number(courseid),
                "qty": quantity,
                "course": selectedCourse.data[0].attributes,
                "packageId": 0,
                "Enrollment": []
            }))

            updateTotal()
            localStorage.setItem('cartData', JSON.stringify(cartData));
            router.push('/auth/login')
        }
    }

    return (
        <div onClick={() => enrollNow2(course)} className="absolute bottom-1 h-10 ml-2 add-to-card inline-flex justify-center items-center gap-2 overflow-hidden cursor-pointer">
            <div className="justify-start text-[#156fee] text-base font-semibold font-['Inter'] leading-normal z-10 ">Add to cart
            </div>
            <div className="w-5 h-5 relative overflow-hidden">
                <div className=" h-full w-full absolute">
                    <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.33398 14.1667L14.6673 5.83337M14.6673 5.83337H6.33398M14.6673 5.83337V14.1667" stroke="#155EEF"
                            strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>
        </div>
    )
}

export default AddToCart