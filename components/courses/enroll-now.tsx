"use client";

import { checkAlreadyCoursePurchased } from '@/services/cart';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { addToCartRequest } from '@/store/actions/cart-actions';

const EnrollNowCart = ({ course, quantity }: { course: any, quantity: number }) => {
    console.log("EnrollNowCart rendered with course:", course, "and quantity:", quantity)

    const [isPurchased, setIsPurchased] = useState(false)
    const dispatch = useDispatch()
    const router = useRouter()

    async function enrollNow2(selectedCourse: any) {

        console.log("Add to cart clicked for course:", selectedCourse)

        // if cart does not exist then create a cart
        const courseid = selectedCourse["id"] || 0;
        const price = selectedCourse['price']
        const category = selectedCourse['category']?.data?.attributes['title'] || '';
        console.log(category)
        if (new Date(selectedCourse['endDate']) < new Date() && category == 'Live') {
            return;
        }

        if (localStorage.getItem('token')) {
            const email = localStorage.getItem('email') || ''

            let res = await checkAlreadyCoursePurchased(courseid, email)
            console.log("Already purchased response:", res);

            const dts = res?.data?.userCourses?.data || []
            if (dts.length == 0) {
                setIsPurchased(false);  // no course found for the user
            }
            if (dts.length > 0 && dts[0].course?.data.id == courseid) {
                setIsPurchased(true); // course already purchased
            }
            if (isPurchased) return;

            let realPrice: any = (selectedCourse.discount != null && selectedCourse.discount != 0)
                ? selectedCourse.discount
                : selectedCourse.price;

            const totalprice = realPrice * quantity;

            const payload = {
                courseId: Number(courseid),
                qty: quantity,
                course: selectedCourse,
                total: totalprice,
            }

            dispatch(addToCartRequest(payload))
        } else {
            // not logged in: save a local cart and redirect to login
            let realPrice: any = (selectedCourse.discount != null && selectedCourse.discount != 0)
                ? selectedCourse.discount
                : selectedCourse.price;

            const payload = {
                courseId: Number(courseid),
                qty: quantity,
                course: selectedCourse,
                total: realPrice * quantity,
            }

            localStorage.setItem('cartData', JSON.stringify(payload))
            router.push('/login')
        }
    }

    return (
        <div className="self-stretch pt-3 flex-col justify-start items-start flex">
            <div className="self-stretch px-6 pb-3 justify-start items-start gap-3 inline-flex" style={{ width: "100%", margin: "auto" }}>
                <div
                    onClick={() => enrollNow2(course)}
                    className="grow cursor-pointer shrink basis-0 h-[40px]  px-[18px] py-3 bg-[#2970fe] rounded-[28px]  shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] border-2 border-white justify-center items-center gap-1.5 flex overflow-hidden">
                    <div className="px-0.5 justify-center items-center flex">
                        <div className="text-white  font-bold font-['Inter'] leading-7" style={{ fontSize: "18px" }}>
                            {course?.category?.data?.attributes?.title == 'eBook' ? 'GET ACCESS' : 'Enroll now'}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default EnrollNowCart