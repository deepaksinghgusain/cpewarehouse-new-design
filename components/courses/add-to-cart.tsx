"use client";

import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { addToCartRequest } from '@/store/actions/cart-actions';
import { toast } from 'react-toastify';
import { ApolloClient, ApolloLink, gql, HttpLink, InMemoryCache } from '@apollo/client';

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_API_BASE_URL + "/graphql",
});

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem("token");

  console.log(token);

  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  }));

  return forward(operation);
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export async function checkAlreadyCoursePurchased(id: number, email: string) {
    const { data }: { data: any } = await client.query({
        query: getAlreadyCoursePurchasedGQL(id, email),
        fetchPolicy: "network-only",
    });

    if (!data) return {};

    return data;
}

function getAlreadyCoursePurchasedGQL(id: number, email: string) {
    return gql`query{
      userCourses( sort: ["purchasedOn:desc"],
       pagination:{limit:-1},
       filters:
       {
         user:{email :{ eq: "${email}" }}
         course:{id :{ eq: ${id}}}
       }){
        data{
         id
           attributes{
             status
             completedOn
             joinUrl
             course{
               data{
                 id
                   attributes{
                     title
                     startDate
                     slug
                     webinarId
                     videoUrl
                     
                       category{
                         data{
                           attributes{
                             title
                           }
                         }
                       }
                   }
               }
             }
             user{
               data{
                 id
                 attributes{
                   username
                 }
               }
             }
            }
           }  
         }
       }`;
}

const AddToCart = ({ course, quantity, type, absolute = true }: { course: any, quantity: number, type?: string, absolute?: boolean }) => {

    const [isPurchased, setIsPurchased] = useState(false)
    const dispatch = useDispatch()
    const router = useRouter()

    async function enrollNow2(selectedCourse: any) {

        console.log(selectedCourse)

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
        <div
            onClick={() => enrollNow2(course)}
            className={
                absolute
                    ? "absolute bottom-1 h-10 ml-2 add-to-card inline-flex justify-center items-center gap-2 overflow-hidden cursor-pointer"
                    : "group add-to-card w-[200px] inline-flex items-center cursor-pointer border border-blue-500 h-10 justify-center gap-2 rounded-lg bg-white text-blue-500 hover:bg-blue-500 hover:text-white transition duration-300 ease-in-out"
            }
        >
            <div
                className={`text-base font-semibold ${absolute
                        ? "text-[#156fee]"
                        : "text-blue-500 group-hover:text-white"
                    }`}
            >
                Add to cart
            </div>

            <div
                className={`w-5 h-5 ${absolute
                        ? "text-[#156fee]"
                        : "text-blue-500 group-hover:text-white"
                    }`}
            >
                <svg width="21" height="20" viewBox="0 0 21 20" fill="none">
                    <path
                        d="M6.33398 14.1667L14.6673 5.83337M14.6673 5.83337H6.33398M14.6673 5.83337V14.1667"
                        stroke="currentColor"
                        strokeWidth="1.66667"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
        </div>
    )
}

export default AddToCart