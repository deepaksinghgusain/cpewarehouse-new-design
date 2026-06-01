"use client";

import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/store/store'
import { updateCartRequest } from '@/store/actions/cart-actions'
import moment from 'moment'
import Image from 'next/image'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { imageUrl as imageUrlConstant } from '@/lib/constants'
import { addOrderApi, applyCouponApi, getCheckoutUrl, updateOrderStatus } from '@/services/cart';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const CheckoutPage = () => {
    const dispatch = useDispatch<AppDispatch>()
    const cart = useSelector((s: RootState) => s.cart);
    const user = useSelector((s: RootState) => s.user);
    const currentUser = user?.user || {};
    const resolveText = (val: any) => {
        if (val == null) return '';
        if (typeof val === 'string' || typeof val === 'number') return val;
        if (typeof val === 'object') {
            // GraphQL responses sometimes wrap values: { __typename, data }
            if (val.data && (typeof val.data === 'string' || typeof val.data === 'number')) return val.data;
            if (val.data && val.data.attributes) return val.data.attributes.title || val.data.attributes.name || '';
            if (val.attributes) return val.attributes.title || val.attributes.name || '';
        }
        return '';
    }
    console.log("Cart data in checkout page:", cart);
    const items = cart?.items || [];
    const enrollments = items.reduce((acc: number, it: any) => acc + (it.qty || it.quantity || 1), 0);
    const subtotal = items.reduce((acc: number, it: any) => acc + ((it.course?.price || 0) * (it.qty || 1)), 0);
    const [agreeTerms, setAgreeTerms] = React.useState(false);
    const [couponValue, setCouponValue] = React.useState('');
    const [couponErrMsg, setCouponErrMsg] = React.useState('');
    const [couponRes, setCouponRes] = React.useState(false);
    const [couponType, setCouponType] = React.useState('');
    const [couponValueOFF, setCouponValueOFF] = React.useState<number>(0);
    const [finalPrice, setFinalPrice] = React.useState<number | string>(Number(cart?.total ?? subtotal) || 0);
    const [formSubmitError, setFormSubmitError] = React.useState('');
    const [participantDetailsByItem, setParticipantDetailsByItem] = React.useState<{
        enrolls: {
            courseId: string,
            name: string
            lastname: string
            email: string
            ptin: string
        }[]
    }[]>([])
    const [participantErrorsByItem, setParticipantErrorsByItem] = React.useState<{
        enrolls: {
            courseId?: string,
            name?: string
            lastname?: string
            email?: string
            ptin?: string
        }[]
    }[]>([])
    const displayedTotal = couponRes ? Number(finalPrice) : Number(cart?.total ?? subtotal);
    const couponLabel = couponType === 'amountOff' ? `- $ ${couponValueOFF.toFixed(2)}` : couponType === 'percentOff' ? `- ${couponValueOFF}%` : '';

    React.useEffect(() => {
        const itemsArr = cart.items || [];
        const rebuiltDetails = itemsArr.map((it: any, idx: number) => {
            const qty = it.qty || it.quantity || 1;
            const existingEnrolls = participantDetailsByItem?.[idx]?.enrolls || [];
            const enrolls = Array.from({ length: qty }, (_, i) => {
                const existing = existingEnrolls[i] || { name: '', lastname: '', email: '', ptin: '', courseId: it.courseId };
                return {
                    name: existing.name || String(currentUser.firstName || ''),
                    lastname: existing.lastname || String(currentUser.lastName || ''),
                    email: existing.email || String(currentUser.email || ''),
                    ptin: existing.ptin || String((currentUser as any).ptin || ''),
                    courseId: existing.courseId || it.courseId,
                };
            });
            return { enrolls };
        });

        const rebuiltErrors = itemsArr.map((it: any, idx: number) => {
            const qty = it.qty || it.quantity || 1;
            const existingErrors = participantErrorsByItem?.[idx]?.enrolls || [];
            return { enrolls: Array.from({ length: qty }, (_, i) => existingErrors[i] || {}) };
        });

        setParticipantDetailsByItem(rebuiltDetails as any);
        setParticipantErrorsByItem(rebuiltErrors as any);
    }, [cart.items, currentUser.firstName, currentUser.lastName, currentUser.email, (currentUser as any).ptin]);

    // participantCourseTitles can be derived from cart.items when rendering

    const updateParticipantDetail = (itemIndex: number, enrollIndex: number, field: string, value: string) => {
        setParticipantDetailsByItem((current) =>
            current.map((it, idx) => {
                if (idx !== itemIndex) return it;
                return {
                    enrolls: it.enrolls.map((en, ei) => (ei === enrollIndex ? { ...en, [field]: value } : en)),
                };
            })
        );
        // clear corresponding error for field
        setParticipantErrorsByItem((current) =>
            current.map((it, idx) => {
                if (idx !== itemIndex) return it;
                return {
                    enrolls: it.enrolls.map((er, ei) => (ei === enrollIndex ? { ...er, [field]: undefined } : er)),
                };
            })
        );
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        checkout(agreeTerms, addOrder);
    }

    const addToCalendar = (course: any) => {
        const calendarData = [
            'data:text/calendar;charset=utf8,',
            'BEGIN:VCALENDAR',
            'PRODID:-//Syncfusion Inc//Scheduler//EN',
            'VERSION:2.0',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH',
            'X-WR-CALNAME:Calendar',
            'X-WR-TIMEZONE:Asia/Calcutta',
            'BEGIN:VEVENT',
            `LOCATION:${course?.venue_location || ''}`,
            `SUMMARY:${course?.title || ''}`,
            `UID:${course?.id || ''}`,
            'TRANSP:TRANSPARENT',
            `DTSTART;TZID=America/New_York:${moment(course?.start_Date).format('YYYYMMDDTHHmmss')}`,
            `DTEND;TZID=America/New_York:${moment(course?.end_Date).format('YYYYMMDDTHHmmss')}`,
            `DESCRIPTION:${course?.short_desc || ''}`,
            'ISREADONLY:false',
            'END:VEVENT',
            'END:VCALENDAR',
        ];

        const calendarString = calendarData.filter((value) => typeof value !== 'undefined' && value !== null).join('\n');
        window.open(calendarString.trim());
    }

    const getImage = (data: any) => {
        const format = JSON.parse(data?.formats || 'null');
        if (!format) {
            return imageUrlConstant + (data?.url || '');
        }

        return imageUrlConstant + format.thumbnail.url;
    }

    const checkout = (agreeTerms: boolean, addOrder: () => void) => {
        setFormSubmitError('');
        if (!agreeTerms) {
            setFormSubmitError('Please agree to the terms and conditions before placing your order.');
            return;
        }

        // remove focus from any active input (robust)
        try {
            if (typeof document !== 'undefined') {
                const els = Array.from(document.querySelectorAll('input, textarea, select')) as HTMLElement[];
                els.forEach((el) => {
                    try { el.blur(); } catch (err) { /* ignore */ }
                });
            }
        } catch (err) {
            console.warn('blur failed', err);
        }

        // validate nested participant details
        const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i;
        const errorsByItem = participantDetailsByItem.map((it) => ({ enrolls: it.enrolls.map(() => ({})) }));
        let foundFirstError: { itemIndex: number; enrollIndex: number; field: string } | null = null;

        participantDetailsByItem.forEach((it, itemIndex) => {
            it.enrolls.forEach((p, enrollIndex) => {
                const e: any = {};
                if (!p.name || !String(p.name).trim()) e.name = 'First name is required';
                if (!p.lastname || !String(p.lastname).trim()) e.lastname = 'Last name is required';
                if (!p.email || !String(p.email).trim()) e.email = 'Email is required';
                else if (!emailPattern.test(String(p.email).trim())) e.email = 'Please enter a valid email address';
                errorsByItem[itemIndex].enrolls[enrollIndex] = e;
                if (!foundFirstError && Object.keys(e).length > 0) {
                    const field = Object.keys(e)[0];
                    foundFirstError = { itemIndex, enrollIndex, field };
                }
            });
        });

        const hasError = errorsByItem.some((it) => it.enrolls.some((er) => Object.keys(er).length > 0));
        setParticipantErrorsByItem(errorsByItem as any);

        if (hasError) {
            setFormSubmitError('Please fill all required participant fields before placing your order.');
            try {
                if (foundFirstError && typeof document !== 'undefined') {
                    const { itemIndex, enrollIndex, field } = foundFirstError;
                    const selector = `[data-item-index="${itemIndex}"][data-enroll-index="${enrollIndex}"][data-field="${field}"]`;
                    const el = document.querySelector(selector) as HTMLElement | null;
                    if (el && typeof el.focus === 'function') {
                        el.focus();
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
            } catch (err) {
                console.warn('focus first error failed', err);
            }
            return;
        }

        // build filtered enrolls (flattened) if needed and proceed
        const filteredEnrolls: any[] = [];
        participantDetailsByItem.forEach((it) => it.enrolls.forEach((e) => { if (e.name || e.email) filteredEnrolls.push(e); }));

        console.log('enrolls ', filteredEnrolls);
        
        addOrder();
    }

    const buildCartItemsWithParticipantEnrolls = (items: any[]) => {
        return (items || []).map((item: any, idx: number) => {
            const itemCourseId = item.courseId || item.id || item.course?.id || item.course?.data?.id || 0;
            const qty = item.qty || item.quantity || 1;
            const Enrolls = (participantDetailsByItem?.[idx]?.enrolls || Array.from({ length: qty }, () => ({ name: '', lastname: '', email: '', ptin: '', courseId: itemCourseId }))).map((p: any) => ({
                name: p.name,
                lastname: p.lastname,
                email: p.email,
                ptin: p.ptin,
                courseId: p.courseId || itemCourseId,
                packageId: item.packageId || 0,
            }));
            return { ...item, Enrolls, Enrollment: Enrolls };
        });
    }

    const applyCoupon = async () => {
        const trimmedCoupon = couponValue.trim();
        if (!trimmedCoupon) {
            setCouponErrMsg('Please enter a coupon code.');
            setCouponRes(false);
            return;
        }

        setCouponErrMsg('');
        try {
            const couponResp = await applyCouponApi(trimmedCoupon);
            const fp = Number(cart?.finalPrice ?? subtotal) || 0;

            if (couponResp?.statusCode !== 200) {
                setCouponErrMsg(couponResp?.message || 'Invalid Coupon.');
                setCouponRes(false);
                return;
            }

            if (couponResp.amount_off != null) {
                if (couponResp.amount_off >= fp) {
                    setCouponErrMsg('Invalid Coupon.');
                    setCouponRes(false);
                    return;
                }

                const updatedPrice = Number((fp - couponResp.amount_off).toFixed(2) ?? 0);
                setCouponType('amountOff');
                setCouponValueOFF(couponResp.amount_off);
                setFinalPrice(updatedPrice);
                setCouponRes(true);
                dispatch(updateCartRequest({ discountCode: trimmedCoupon, discountPrice: couponResp.amount_off, finalPrice: updatedPrice }));
                return;
            }

            if (couponResp.percent_off != null) {
                const discountAmount = Number(((fp * couponResp.percent_off) / 100).toFixed(2) ?? 0);
                const updatedPrice = Number((fp - discountAmount).toFixed(2) ?? 0);
                setCouponType('percentOff');
                setCouponValueOFF(couponResp.percent_off);
                setFinalPrice(updatedPrice);
                setCouponRes(true);
                dispatch(updateCartRequest({ discountCode: trimmedCoupon, discountPrice: couponResp.percent_off, finalPrice: updatedPrice }));
                return;
            }

            setCouponErrMsg('Invalid Coupon.');
            setCouponRes(false);
        } catch (error) {
            console.error('applyCoupon error', error);
            setCouponErrMsg('Failed to validate coupon. Please try again.');
            setCouponRes(false);
        }
    }

    const addOrder = async () => {

        try {

            const originalCartItems: any[] = cart.items || [];

            // CLONE ITEMS TO AVOID IMMUTABLE OBJECT ERRORS
            const cartItems: any[] = buildCartItemsWithParticipantEnrolls(originalCartItems).map((item: any) => ({
                ...item,
                course: { ...item.course },
                Enrolls: item.Enrolls ? item.Enrolls.map((en: any) => ({ ...en })) : [],
                Enrollment: item.Enrollment ? item.Enrollment.map((en: any) => ({ ...en })) : item.Enrolls ? item.Enrolls.map((en: any) => ({ ...en })) : [],
            }));

            const cartData: any = cart;

            const couponType: string = cart.discountCode;

            const couponValue: string =
                Number(cart.discountPrice) > 0
                    ? cart.discountCode
                    : '';

            const finalPrice: number = cart.finalPrice;

            const gtagData: any[] = [];
            const checkoutData: any[] = [];

            let checkPTIN = false;
            let checkName = false;
            let checklastname = false;
            let checkEmail = false;
            let errorText = false;
            let emailMessage = '';

            let freeEvents = 0;
            let lengthOfCartItems = cartItems.length;

            cartItems.map((data: any, index: number) => {

                // FREE EVENT CHECK
                if (data.course.price === 0 && data.courseId > 0) {

                    freeEvents++;

                } else {

                    if (
                        data.course.price != null &&
                        data.course.price == 0
                    ) {

                        freeEvents++;

                    } else {

                        if (
                            data.course.price == null &&
                            data.course.includedCoursePrice == 0
                        ) {
                            freeEvents++;
                        }
                    }
                }

                // PRICE
                const eachPrice: any =
                    (data?.course?.discounted_price ||
                        data?.course?.discount) > 0
                        ? (
                            data?.course?.discounted_price ||
                            data?.course?.discount
                        )
                        : (
                            data?.course?.price >= 0 &&
                            data?.course?.price != null
                        )
                            ? data?.course?.price
                            : data?.course?.includedCoursePrice;

                let couponDiscountedPrice: any = eachPrice;

                if (couponType == 'percentOff') {

                    const discountedAmount: any = (
                        (eachPrice * couponValueOFF) / 100
                    ).toFixed(2);

                    couponDiscountedPrice = (
                        eachPrice - discountedAmount
                    ).toFixed(2);

                } else if (couponType == 'amountOff') {

                    const discountedAmount: any = (
                        couponValueOFF /
                        (lengthOfCartItems * data.qty)
                    ).toFixed(2);

                    couponDiscountedPrice = (
                        eachPrice - discountedAmount
                    ).toFixed(2);
                }

                const priceIncents: any = (
                    Number(couponDiscountedPrice) * 100
                ).toFixed(0);

                // CHECKOUT DATA
                checkoutData.push({
                    name: data.course.title,
                    default_price_data: {
                        currency: 'USD',
                        unit_amount_decimal:
                            couponDiscountedPrice == null
                                ? 0
                                : priceIncents,
                    },
                    images: [imageUrlConstant + data.course.url],
                    qty: data.qty,
                    coupon: '',
                    orderId: 0,
                    discountCoupon:
                        couponRes == true
                            ? {
                                name: couponValue || '',
                                value: couponValueOFF || '',
                                type: couponType || '',
                                email: localStorage.getItem('email'),
                            }
                            : {},
                });

                // GTAG
                gtagData.push({
                    id: data.course.id,
                    name: data.course.title,
                    quantity: data.qty,
                    price: couponDiscountedPrice,
                    category: 'TaxCourse',
                    brand: 'CPE',
                });

                // IMAGE
                let imageURL = '';

                try {

                    const format = JSON.parse(
                        cartItems[index]?.course?.formats || '{}'
                    );

                    imageURL = format?.thumbnail?.url || '';

                } catch (err) {

                    console.log('Image parse error', err);
                }

                // TITLE
                cartItems[index]['title'] =
                    cartItems[index]['course']['title'];

                // REMOVE ID
                delete cartItems[index]['id'];

                // PARTICULAR PRICE
                let particularPrice;

                if (
                    cartItems[index]['course']['discount'] > 0 ||
                    cartItems[index]['course']['discounted_price'] > 0
                ) {

                    particularPrice =
                        cartItems[index]['course']['discount'] ||
                        cartItems[index]['course']['discounted_price'];

                } else if (
                    cartItems[index]['course']['price']
                ) {

                    particularPrice =
                        cartItems[index]['course']['price'];

                } else {

                    particularPrice =
                        cartItems[index]['course']['includedCoursePrice'];
                }

                cartItems[index]['price'] = particularPrice;

                let noOfEnroll =
                    cartItems[index]?.Enrolls?.length || 1;

                // FINAL PRICE
                if (
                    couponValue != null &&
                    couponType == 'amountOff'
                ) {

                    cartItems[index]['finalPrice'] = (
                        particularPrice -
                        (
                            couponValueOFF /
                            (lengthOfCartItems * noOfEnroll)
                        )
                    ).toFixed(2);

                } else if (
                    couponValue != null &&
                    couponType == 'percentOff'
                ) {

                    cartItems[index]['finalPrice'] = (
                        particularPrice -
                        ((couponValueOFF * particularPrice) / 100)
                    ).toFixed(2);

                } else {

                    cartItems[index]['finalPrice'] =
                        particularPrice;
                }

                cartItems[index]['category'] =
                    cartItems[index]['course']['category'];

                cartItems[index]['imageUrl'] = imageURL;

                // ENROLLS
                data?.Enrolls?.map((en: any, i: number) => {

                    delete cartItems[index]['Enrollment'];

                    delete cartItems[index]['id'];

                    if (
                        cartItems[index]['Enrolls'][i]?.ptin === ''
                    ) {
                        checkPTIN = true;
                    }

                    if (
                        cartItems[index]['Enrolls'][i]?.email === ''
                    ) {

                        checkEmail = true;

                    } else {

                        let emailPattern =
                            /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

                        const result = emailPattern.test(
                            cartItems[index]['Enrolls'][i]?.email
                        );

                        if (!result) {
                            emailMessage =
                                'please enter valid email address';
                        }
                    }

                    if (
                        cartItems[index]['Enrolls'][i]?.name === ''
                    ) {
                        checkName = true;
                    }

                    if (
                        cartItems[index]['Enrolls'][i]?.lastname === ''
                    ) {
                        checklastname = true;
                    }
                });
            });


            // ORDER DATA
            const orderData = {
                data: {
                    OrderItems: cartItems,
                    userId: user?.user?.id,
                    totalPrice: cart?.finalPrice,
                    discountCode:
                        couponRes == true ? couponValue : '',
                    discountPrice:
                        couponRes == true ? couponValueOFF : 0,
                    finalPrice,
                    stripeOrderId: '',
                    orderStatus: 'pending',
                    discountType:
                        couponRes == true ? couponType : '',
                    userName: localStorage.getItem('username'),
                    email: localStorage.getItem('email'),
                    receiptUrl: '',
                },
            };

            console.log('ORDER DATA', orderData);

            // PAID EVENTS
            if (lengthOfCartItems !== freeEvents) {

                let od: any = await addOrderApi(orderData);

                if (errorText) {
                    return;
                }

                // SAFE CHECK
                if (!od || !od.data || !od.data.id) {

                    console.error(
                        'Invalid order response',
                        od
                    );

                    return;
                }

                const orderId = od.data.id;

                checkoutData.forEach((cd: any) => {

                    cd.orderId = orderId;

                    cd.customerid =
                        localStorage.getItem('cid') || '';

                    cd.email =
                        localStorage.getItem('email') || '';
                });

                checkoutUrl(checkoutData);

            } else {

                // FREE EVENT FLOW
                const uniqueStripeId =
                    Date.now().toString();

                orderData.data.orderStatus = 'succeeded';

                orderData.data.stripeOrderId =
                    uniqueStripeId;

                let od: any = await addOrderApi(orderData);

                console.log(
                    'FREE ORDER RESPONSE',
                    JSON.stringify(od, null, 2)
                );

                if (
                    od &&
                    od.data &&
                    od.data.attributes &&
                    od.data.attributes.orderStatus ===
                    'succeeded'
                ) {

                    const eventData = {
                        type: 'payment_intent.succeeded',
                        data: {
                            object: {
                                id: uniqueStripeId,
                            },
                        },
                    };

                    let res =
                        await updateOrderStatus(eventData);

                    if (res) {

                        window.location.href = '/success';

                        window.location.reload();
                    }
                }
            }

        } catch (error) {

            console.error('ADD ORDER ERROR', error);
        }
    };

    const checkoutUrl = async (data: any) => {
        let ckData: any = await getCheckoutUrl(data);
        window.open(ckData.url, '_self');
    }

    return (
        <>
            <section className="container mx-auto ">
                <div className="justify-center flex py-20">
                    <div className="flex">
                        <div className="flex-col justify-start items-center gap-4 inline-flex">
                            <div className="w-8 h-8 bg-[#f9f5ff] rounded-full justify-center items-center inline-flex overflow-hidden">
                                <div className="w-8 h-8 relative bg-[#15b69e] rounded-2xl flex-col justify-start items-start flex">

                                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g id="Content">
                                            <path
                                                d="M0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16Z"
                                                fill="#15B79E" />
                                            <path id="Tick" fillRule="evenodd" clipRule="evenodd"
                                                d="M22.7934 9.85346L13.2467 19.0668L10.7134 16.3601C10.2467 15.9201 9.51339 15.8935 8.98005 16.2668C8.46005 16.6535 8.31338 17.3335 8.63338 17.8801L11.6334 22.7601C11.9267 23.2135 12.4334 23.4935 13.0067 23.4935C13.5534 23.4935 14.0734 23.2135 14.3667 22.7601C14.8467 22.1335 24.0067 11.2135 24.0067 11.2135C25.2067 9.9868 23.7534 8.9068 22.7934 9.84013V9.85346Z"
                                                fill="white" />
                                        </g>
                                    </svg>

                                </div>
                            </div>
                            <div className="self-stretch h-6 flex-col justify-start items-center gap-0.5 flex">
                                <div className="self-stretch text-center text-[#344054] text-base font-semibold font-['Inter'] leading-normal">
                                    Enrollment</div>
                            </div>
                        </div>

                        <div className="w-[400px] h-0.5 mt-4 bg-[#155dee]" style={{ marginLeft: "-25px", marginRight: "-50px" }}></div>

                        <div className="flex-col justify-start items-center gap-4 inline-flex">
                            <div className="w-8 h-8 bg-[#f9f5ff] rounded-full justify-center items-center inline-flex overflow-hidden">
                                <div className="w-8 h-8 relative bg-[#15b69e] rounded-2xl flex-col justify-start items-start flex">
                                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g id="Content">
                                            <path
                                                d="M0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16Z"
                                                fill="#15B79E" />
                                            <circle id="Dot" cx="16" cy="16" r="5" fill="white" />
                                        </g>
                                    </svg>
                                </div>
                            </div>
                            <div className="self-stretch h-6 flex-col justify-start items-center gap-0.5 flex">
                                <div className="self-stretch text-center text-[#344054] text-base font-semibold font-['Inter'] leading-normal">
                                    Participants details</div>
                            </div>
                        </div>

                        <div className="w-[400px] h-0.5 mt-4 bg-[#e4e7ec]" style={{ marginLeft: "-50px", marginRight: "-25px" }}></div>

                        <div className="flex-col justify-start items-center gap-4 inline-flex">
                            <div className="w-8 h-8 bg-[#f9f5ff] rounded-full justify-center items-center inline-flex overflow-hidden">
                                <div className="w-8 h-8 relative rounded-2xl flex-col justify-start items-start flex">

                                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g id="Content">
                                            <path
                                                d="M1 16C1 7.71573 7.71573 1 16 1C24.2843 1 31 7.71573 31 16C31 24.2843 24.2843 31 16 31C7.71573 31 1 24.2843 1 16Z"
                                                stroke="#E4E7EC" strokeWidth="2" />
                                            <circle id="Dot" cx="16" cy="16" r="5" fill="#D0D5DD" />
                                        </g>
                                    </svg>


                                </div>
                            </div>
                            <div className="self-stretch h-6 flex-col justify-start items-center gap-0.5 flex">
                                <div className="self-stretch text-center text-[#344054] text-base font-semibold font-['Inter'] leading-normal">
                                    Paymment</div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <section className="mb-20">

                <div className="px-1 h-auto rounded-lg justify-start items-start">
                    <div className="mb-12 px-8 flex-col justify-start items-start gap-6 inline-flex">
                        <div className="justify-center items-center gap-3 inline-flex overflow-hidden">
                            <div className="w-6 h-6 relative  overflow-hidden">

                                <Link href="/course-catalog">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g id="arrow-circle-left">
                                            <path id="Icon"
                                                d="M12 8L8 12M8 12L12 16M8 12H16M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                                                stroke="#004EEB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </g>
                                    </svg>
                                </Link>
                            </div>
                            <div className="text-[#475467] text-lg font-semibold font-['Inter'] leading-7">Back to Catalogue</div>
                        </div>
                        <div className="self-stretch h-[38px] flex-col justify-start items-start gap-5 flex">
                            <div className="self-stretch justify-start items-start gap-4 inline-flex">
                                <div className="grow shrink basis-0 flex-col justify-start items-start gap-1 inline-flex">
                                    <div className="self-stretch text-[#101828] text-3xl font-semibold font-['Inter'] leading-[38px]">Checkout</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="px-4 flex-col justify-start items-start inline-flex">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="w-full">
                            <table className="w-full">
                                <thead className="self-stretch h-11 px-6 py-3 bg-[#eff4ff] border-b border-[#e4e7ec]">
                                    <th
                                        className="text-[#101828] text-lg font-semibold font-['Inter'] leading-7 text-left w-[60%] border-r-4 border-white pl-4">
                                        Order Summary</th>
                                    <th className="text-[#101828] text-lg font-semibold font-['Inter'] leading-7 text-left pl-4">Enrollments</th>
                                    <th className="text-[#101828] text-lg font-semibold font-['Inter'] leading-7 text-left pl-4">Price</th>
                                </thead>
                                <tbody>
                                    {items.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-4 text-sm text-gray-500">Your cart is empty.</td>
                                        </tr>
                                    ) : (
                                        items.map((item: any, idx: number) => {
                                            const qty = item.qty || item.quantity || 1;
                                            const rawTitle = item.course?.data?.attributes?.title || item.course?.data?.attributes?.name || item.course?.attributes?.title || item.title || item.name || item.course?.title;
                                            const title = resolveText(rawTitle) || 'Untitled Course';
                                            const date = item.course?.data?.attributes?.date || item.date || '';
                                            const price = item.course?.data?.attributes?.price || item.course?.price || item.price || 0;
                                            const lineTotal = price * qty;

                                            const increaseQty = () => dispatch(updateCartRequest({ item, qty: qty + 1 }))
                                            const decreaseQty = () => {
                                                if (qty <= 1) return
                                                dispatch(updateCartRequest({ item, qty: qty - 1 }))
                                            }
                                            const removeItem = () => dispatch(updateCartRequest({ item, remove: true }))

                                            const imageUrl = (imageUrlConstant || '') + (item.course?.data?.attributes?.image?.data?.attributes?.url || item.course?.url || item.image || '')

                                            return (
                                                <tr key={item.id || item.courseId || idx} className="border-b border-[#e4e7ec]">
                                                    <td>
                                                        <div className="self-stretch h-[194px] px-6 py-4 flex-col justify-start items-start gap-2 flex">
                                                            <div className="self-stretch justify-start items-start gap-2 inline-flex">
                                                                <div className="flex items-start gap-4">
                                                                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100">
                                                                        {imageUrl ? (
                                                                            <Image src={imageUrl} alt={title} width={96} height={96} className="w-full h-full object-cover" />
                                                                        ) : (
                                                                            <Image src="/assets/images/cart.gif" alt={title} width={96} height={96} className="w-full h-full object-cover" />
                                                                        )}
                                                                    </div>
                                                                    <div className={"pl-2 pr-2.5 py-0.5 rounded-full justify-start items-center gap-1.5 flex " + (item.type === 'Self Study' ? 'bg-[#fdf1f9] border border-[#fbceee]' : 'bg-[#ecfcf2] border border-[#aaefc6]')}
                                                                    >
                                                                        <div className="w-2 h-2 relative">
                                                                            <div className="w-1.5 h-1.5 left-[1px] top-[1px] absolute bg-[#17b169] rounded-full"></div>
                                                                        </div>
                                                                        <div className="text-center text-[#057647] text-sm font-medium font-['Inter'] leading-tight">{item.type || 'Live webinar'}</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="self-stretch h-[88px] flex-col justify-start items-start gap-2 flex">
                                                                <div className="self-stretch text-[#101828] text-lg font-semibold font-['Inter'] leading-7">{title}</div>
                                                                <div className="self-stretch text-[#475467] text-sm font-normal font-['Inter'] leading-normal">{date}</div>
                                                            </div>
                                                            <div className="justify-center items-center gap-2 inline-flex overflow-hidden">
                                                                <div className="text-[#156fee] text-base font-semibold font-['Inter'] leading-normal">Add to my Calendar</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="self-stretch h-[194px] px-6 py-4 flex-col justify-center items-start gap-2 flex">
                                                            <div className="self-stretch h-[57px] py-3 flex-col justify-center items-start gap-5 flex">
                                                                <div className="grow shrink basis-0 flex-col justify-start items-start gap-3 flex">
                                                                    <div className="self-stretch grow shrink basis-0 justify-center items-center gap-4 inline-flex">
                                                                        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                                                                            <button onClick={decreaseQty} className="px-3 py-2 cursor-pointer"><Minus className="w-4 h-4" /></button>
                                                                            <span className="px-4 text-sm">{qty}</span>
                                                                            <button onClick={increaseQty} className="px-3 py-2 cursor-pointer"><Plus className="w-4 h-4" /></button>
                                                                        </div>
                                                                        <button onClick={removeItem} className="ml-4 cursor-pointer"><Trash2 className="w-5 h-5 text-red-500" /></button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="self-stretch h-6 py-3 justify-start items-center gap-2 inline-flex">
                                                                <div className="w-5 h-5 relative  overflow-hidden"></div>
                                                                <div className="text-[#475467] text-base font-semibold font-['Inter'] leading-normal">&nbsp;</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="self-stretch py-2 justify-start items-center gap-4 inline-flex">
                                                            <div className="grow shrink basis-0 h-[38px] justify-start items-center gap-4 flex">
                                                                <div className="grow shrink basis-0 flex-col justify-start items-start gap-0.5 inline-flex"></div>
                                                            </div>
                                                            <div className="justify-end items-center gap-4 flex">
                                                                <div className="justify-end flex-col items-center gap-1.5 flex overflow-hidden">
                                                                    <div className="text-right text-[#0d9383] text-lg font-medium font-['Inter']  leading-7">{`$ ${lineTotal}`}</div>
                                                                    {item.originalPrice && (
                                                                        <div className="justify-start text-[#667085] text-xl font-normal font-['Inter'] line-through leading-9">{`$ ${item.originalPrice}`}</div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>

                            <div className="py-1 justify-start items-start gap-6 inline-flex">
                                <div className=" px-6 py-4 flex-col justify-start items-start gap-2 inline-flex">
                                    <div className="py-2.5 rounded-lg justify-center items-center gap-1.5 inline-flex overflow-hidden">
                                        <div className="px-0.5 justify-center items-center flex">
                                            <div className="text-[#475467] text-base font-semibold font-['Inter'] leading-normal">Apply Coupon Code
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-[361px] justify-start items-center gap-4 inline-flex">
                                        <div className="w-[253px] flex-col justify-start items-start gap-1.5 inline-flex">
                                            <div className="self-stretch h-12 flex-col justify-start items-start gap-1.5 flex">
                                                <div className="self-stretch py-3 bg-white rounded-lg gap-2 inline-flex">
                                                    <div className="grow shrink basis-0 h-6 justify-start items-center gap-2 flex">
                                                        <Input 
                                                            value={couponValue} 
                                                            onChange={(e: any) => setCouponValue(e?.target?.value || '')}
                                                            className="border border-gray-200 focus:border-blue-500 focus:outline-none"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => applyCoupon()}
                                            className="px-4 py-1.5 bg-[#7f98f9] rounded-lg  gap-1.5 flex overflow-hidden"
                                            disabled={!couponValue}
                                        >
                                            <div className="px-0.5 justify-center items-center flex">
                                                <div className="text-white text-base font-semibold font-['Inter'] leading-normal">Apply</div>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                                {couponErrMsg && (
                                    <div className="text-sm text-red-600 px-6 pt-2">{couponErrMsg}</div>
                                )}

                            </div>
                            <div className="px-6 py-4 flex-col justify-start items-start gap-1 flex">
                                <div className="self-stretch py-2 border-b border-[#e4e7ec] justify-start items-center gap-4 inline-flex">
                                    <div className="grow shrink basis-0 h-[38px] justify-start items-center gap-4 flex">
                                        <div className="grow shrink basis-0 flex-col justify-start items-start gap-0.5 inline-flex">
                                            <div className="self-stretch text-[#101828] text-3xl font-bold font-['Inter'] leading-[38px]">Sub Total</div>
                                        </div>
                                    </div>
                                    <div className="justify-end items-center gap-4 flex">
                                        <div className="justify-end items-center gap-1.5 flex overflow-hidden">
                                            <div className="text-right text-[#0d9383] text-lg font-medium font-['Inter']  leading-7">{`$ ${subtotal ? subtotal.toFixed(2) : 0.00}`}</div>
                                        </div>
                                    </div>
                                </div>
                                {(couponRes || cart.discountCode) && (
                                    <div className="self-stretch py-2 border-b border-[#e4e7ec] justify-start flex items-center gap-4">
                                        <div className="grow shrink basis-0 h-[38px] justify-start items-center gap-4 flex">
                                            <div className="grow shrink basis-0 flex-col justify-start items-start gap-0.5 inline-flex">
                                                <div className="self-stretch text-[#101828] text-base font-medium font-['Inter'] leading-5">Coupon: {couponValue || cart.discountCode}</div>
                                            </div>
                                        </div>
                                        <div className="justify-start items-center gap-4 flex">
                                            <div className="justify-center items-center gap-1.5 flex overflow-hidden">
                                                <div className="text-[#ef4444] text-base font-semibold font-['Inter'] leading-6">{couponLabel || cart.discountPrice ? `$ ${cart.discountPrice ? cart.discountPrice.toFixed(2) : 0.00}` : ''}</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="self-stretch py-2 border-b border-[#e4e7ec] justify-start items-center gap-4 inline-flex">
                                    <div className="grow shrink basis-0 h-[38px] justify-start items-center gap-4 flex">
                                        <div className="grow shrink basis-0 flex-col justify-start items-start gap-0.5 inline-flex">
                                            <div className="self-stretch text-[#101828] text-3xl font-bold font-['Inter'] leading-[38px]">Total</div>
                                        </div>
                                    </div>
                                    <div className="justify-start items-center gap-4 flex">
                                        <div className="justify-center items-center gap-1.5 flex overflow-hidden">
                                            <div className="text-[#101828] text-3xl font-bold font-['Inter'] leading-[38px]">{`$ ${cart.finalPrice ? cart.finalPrice.toFixed(2) : 0.00}`}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="self-stretch justify-center items-center gap-2 inline-flex overflow-hidden">
                                    <div className="justify-center items-center flex">
                                        <Checkbox
                                            id="agree_terms"
                                            checked={agreeTerms}
                                            onCheckedChange={(v) => setAgreeTerms(Boolean(v))}
                                            className="w-5 h-5 border-2 border-blue-500 rounded-[#30px] data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-white"
                                        />
                                    </div>
                                    <div className="grow shrink basis-0">
                                        <label htmlFor="agree_terms" className="cursor-pointer">
                                            <span className="text-[#475467] text-base font-normal font-['Inter'] leading-normal">By placing this order, I
                                                acknowledge that I have read and agree to the&nbsp;</span>
                                            <span className="text-[#475467] text-base font-normal font-['Inter'] underline leading-normal">purchase terms
                                                and
                                                conditions</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className=" w-full px-6 py-4 flex-col justify-start items-start gap-1 flex">
                                <div className="self-stretch  pt-3 flex-col justify-start items-start flex">
                                    <div className="self-stretch px-6 pb-3 justify-start items-start gap-3 inline-flex">
                                        <button
                                            type="submit"
                                            className="grow shrink basis-0 px-[18px] py-3 bg-[#2970fe] rounded-[28px] shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] border-2 border-white justify-center items-center gap-1.5 flex overflow-hidden"
                                        >
                                            <div className="px-0.5 justify-center items-center flex">
                                                <div className="text-white text-lg font-semibold font-['Inter'] leading-7 cursor-pointer">Pay Now</div>
                                            </div>
                                        </button>
                                    </div>
                                    {formSubmitError && (
                                        <div className="px-6 pt-2 text-sm text-red-600">{formSubmitError}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="min-w-[480px] w-full px-8 pb-8 inline-flex flex-col justify-start items-center gap-3">
                                <div className="self-stretch flex flex-col justify-start items-start gap-6">
                                    <div className="self-stretch h-16 px-8 flex flex-col justify-start items-start gap-6">
                                        <div className="self-stretch flex flex-col justify-start items-start gap-5">
                                            <div className="self-stretch inline-flex justify-start items-start gap-4 flex-wrap content-start">
                                                <div className="flex-1 min-w-80 inline-flex flex-col justify-start items-start gap-1">
                                                    <div className="self-stretch justify-start"><span
                                                        className="text-Colors-Text-text-primary-(900) text-lg font-bold font-['Inter'] leading-7">Add
                                                        participants details </span><span
                                                            className="text-Colors-Text-text-primary-(900) text-lg font-medium font-['Inter'] leading-7">(Enrollments {enrollments})</span></div>
                                                    <div
                                                        className="self-stretch justify-start text-Colors-Text-text-tertiary-(600) text-base font-normal font-['Inter'] leading-normal">
                                                        First & last name will appear on CPE certificate.</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {(cart.items || []).map((item: any, itemIndex: number) => (
                                    <Card key={itemIndex} className="w-full border-gray-200">
                                        <CardHeader>
                                            <div className="text-[#101828] text-base font-bold mb-2">{item.course?.title || item.title || 'Course'}</div>
                                        </CardHeader>
                                        <CardContent>
                                            {(participantDetailsByItem?.[itemIndex]?.enrolls || Array.from({ length: item.qty || item.quantity || 1 })).map((participant: any, enrollIndex: number) => {
                                                const err = participantErrorsByItem?.[itemIndex]?.enrolls?.[enrollIndex] || {};
                                                return (
                                                    <div key={enrollIndex} className="self-stretch h-52 p-6 flex flex-col justify-start items-start gap-6">
                                                        <div className="w-full flex flex-col gap-1">
                                                            <div className="text-[#344054] text-sm font-medium">Participant {enrollIndex + 1}</div>
                                                        </div>
                                                        <div className="grid grid-cols-2 h-11 w-full gap-6 mb-4">
                                                            <div className="flex-1 self-stretch inline-flex flex-col justify-start items-start gap-1.5">
                                                                <div className="self-stretch inline-flex justify-start items-center gap-0.5">
                                                                    <div className="justify-start text-[#344054] text-sm font-medium">First name</div>
                                                                    <div className="justify-start text-[#7E56D8] text-sm font-medium">*</div>
                                                                </div>
                                                                <div className={"self-stretch pb-1 " + (err?.name ? 'border-b border-red-500' : 'border-b border-[#D0D5DD]')}>
                                                                    <Input
                                                                        data-item-index={itemIndex}
                                                                        data-enroll-index={enrollIndex}
                                                                        data-field="name"
                                                                        value={participant?.name || ''}
                                                                        onChange={(e) => updateParticipantDetail(itemIndex, enrollIndex, 'name', e.target.value)}
                                                                        placeholder="Enter first name"
                                                                        className="border-none bg-transparent px-0 py-1 text-sm focus:outline-none focus:ring-0"
                                                                    />
                                                                    {err?.name && <div className="text-red-500 text-sm mt-1">{err.name}</div>}
                                                                </div>
                                                            </div>
                                                            <div className="flex-1 self-stretch inline-flex flex-col justify-start items-start gap-1.5">
                                                                <div className="self-stretch inline-flex justify-start items-center gap-0.5">
                                                                    <div className="justify-start text-[#344054] text-sm font-medium">Last name</div>
                                                                    <div className="justify-start text-[#7E56D8] text-sm font-medium">*</div>
                                                                </div>
                                                                <div className={"self-stretch pb-1 " + (err?.lastname ? 'border-b border-red-500' : 'border-b border-[#D0D5DD]')}>
                                                                    <Input
                                                                        data-item-index={itemIndex}
                                                                        data-enroll-index={enrollIndex}
                                                                        data-field="lastname"
                                                                        value={participant?.lastname || ''}
                                                                        onChange={(e) => updateParticipantDetail(itemIndex, enrollIndex, 'lastname', e.target.value)}
                                                                        placeholder="Enter last name"
                                                                        className="border-none bg-transparent px-0 py-1 text-sm"
                                                                    />
                                                                    {err?.lastname && <div className="text-red-500 text-sm mt-1">{err.lastname}</div>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-2 w-full gap-6">
                                                            <div className="flex-1 self-stretch inline-flex flex-col justify-start items-start gap-1.5">
                                                                <div className="self-stretch inline-flex justify-start items-center gap-0.5">
                                                                    <div className="justify-start text-[#344054] text-sm font-medium">Email address</div>
                                                                    <div className="justify-start text-[#7E56D8] text-sm font-medium">*</div>
                                                                </div>
                                                                <div className={"self-stretch pb-1 " + (err?.email ? 'border-b border-red-500' : 'border-b border-[#D0D5DD]')}>
                                                                    <Input
                                                                        data-item-index={itemIndex}
                                                                        data-enroll-index={enrollIndex}
                                                                        data-field="email"
                                                                        value={participant?.email || ''}
                                                                        onChange={(e) => updateParticipantDetail(itemIndex, enrollIndex, 'email', e.target.value)}
                                                                        placeholder="Enter email address"
                                                                        className="border-none bg-transparent px-0 py-1 text-sm"
                                                                    />
                                                                    {err?.email && <div className="text-red-500 text-sm mt-1">{err.email}</div>}
                                                                </div>
                                                            </div>
                                                            <div className="flex-1 self-stretch inline-flex flex-col justify-start items-start gap-1.5">
                                                                <div className="self-stretch inline-flex justify-start items-center gap-0.5">
                                                                    <div className="justify-start text-[#344054] text-sm font-medium">PTIN (For Enrolled Agents only)</div>
                                                                </div>
                                                                <div className="self-stretch border-b border-[#D0D5DD] pb-1">
                                                                    <Input
                                                                        data-item-index={itemIndex}
                                                                        data-enroll-index={enrollIndex}
                                                                        data-field="ptin"
                                                                        value={participant?.ptin || ''}
                                                                        onChange={(e) => updateParticipantDetail(itemIndex, enrollIndex, 'ptin', e.target.value)}
                                                                        placeholder="Enter PTIN"
                                                                        className="border-none bg-transparent px-0 py-1 text-sm"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </form>
            </section >
        </>
    )
}

export default CheckoutPage
