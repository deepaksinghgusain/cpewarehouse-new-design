"use client";

import { checkAlreadyCoursePurchased } from '@/services/cart';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { addToCartRequest } from '@/store/actions/cart-actions';
import { toast } from 'react-toastify';

const EnrollNowCart = ({ course, quantity, type }: { course: any, quantity: number, type?: string }) => {
    console.log("EnrollNowCart rendered with course:", course, "and quantity:", quantity)

    const [isPurchased, setIsPurchased] = useState(false)
    const dispatch = useDispatch()
    const router = useRouter()

    async function enrollNow2(selectedCourse: any) {

        // if cart does not exist then create a cart
        const courseid = selectedCourse["id"] || 0;
        const price = selectedCourse['attributes']['price']
        const category = selectedCourse?.attributes['category']?.data?.attributes['title'] || '';

        if (new Date(selectedCourse.attributes['endDate']) < new Date() && category == 'Live') {

            toast.error("Course expired")
            return;
        }

        if (localStorage.getItem('token')) {

            const email = localStorage.getItem('email') || ''

            let res = await checkAlreadyCoursePurchased(courseid, email)

            const dts = res?.data?.userCourses?.data || []

            if (dts.length == 0) {
                setIsPurchased(false);  // no course found for the user
            }
            if (dts.length > 0 && dts[0].attributes?.course?.data.id == courseid) {
                setIsPurchased(true); // course already purchased
            }
            if (isPurchased) {
                toast.error("You have allready purchased our course")
                return;
            };

            let realPrice: any = (selectedCourse.attributes.discount != null && selectedCourse.attributes.discount != 0)
                ? selectedCourse.attributes.discount
                : selectedCourse.attributes.price;

            const totalprice = realPrice * quantity;

            const payload = {
                courseId: type === "package" ? 0 : Number(courseid),
                qty: quantity,
                course: selectedCourse.attributes,
                total: totalprice,
                packageId: Number(type === "package" ? selectedCourse.id : 0),
            }

            toast.success(`Item ${selectedCourse['title']} is add to cart successfully`)

            dispatch(addToCartRequest(payload))
        } else {
            // not logged in: save a local cart and redirect to login
            let realPrice: any = (selectedCourse.attributes.discount != null && selectedCourse.attributes.discount != 0)
                ? selectedCourse.attributes.discount
                : selectedCourse.attributes.price;

            const payload = {
                courseId: type === "package" ? 0 : Number(courseid),
                qty: quantity,
                course: selectedCourse.attributes,
                total: realPrice * quantity,
                packageId: Number(type === "package" ? selectedCourse.id : 0),
            }

            toast.error(`Please Login first`)

            localStorage.setItem('cartData', JSON.stringify(payload))
            router.push('/login')
        }
    }

    return (
        <div className="self-stretch pt-3 flex-col justify-start items-start flex w-[90%]">
            <div className="self-stretch px-6 pb-3 justify-start items-start gap-3 inline-flex" style={{ width: "100%", margin: "auto" }}>
                <div
                    onClick={() => enrollNow2(course)}
                    className="grow cursor-pointer shrink basis-0 h-[40px]  px-[18px] py-3 bg-[#2970fe] rounded-[10px]  shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] border-2 border-white justify-center items-center gap-1.5 flex overflow-hidden">
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