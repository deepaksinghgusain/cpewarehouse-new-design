"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCartRequest } from "@/store/actions/cart-actions";
import { toast } from "react-toastify";
import {
  ApolloClient,
  ApolloLink,
  gql,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";

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

const EnrollNowCart = ({
  course,
  quantity,
  type,
  className
}: {
    course: any;
    quantity: number;
    type?: string;
    className?: string;
  }) => {
  const [isPurchased, setIsPurchased] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const normalizeCourse = (selectedCourse: any) => {
    const attributes = selectedCourse?.attributes ?? selectedCourse ?? {};
    return {
      id: selectedCourse?.id ?? attributes?.id ?? 0,
      title: selectedCourse?.title ?? attributes?.title ?? "",
      price: attributes?.price ?? selectedCourse?.price ?? 0,
      discount: attributes?.discount ?? selectedCourse?.discount ?? 0,
      discountedPrice:
        attributes?.discountedPrice ?? selectedCourse?.discountedPrice ?? 0,
      categoryTitle:
        attributes?.category?.data?.attributes?.title ||
        selectedCourse?.category?.data?.attributes?.title ||
        "",
      endDate: attributes?.endDate ?? selectedCourse?.endDate,
      attributes,
    };
  };

  async function enrollNow2(selectedCourse: any) {
    const normalized = normalizeCourse(selectedCourse);

    const courseid = normalized.id;
    const category = normalized.categoryTitle;
    const isPackage = type === "package";

    if (category === "Live" && normalized.endDate) {
      const endDate = new Date(normalized.endDate);
      if (endDate < new Date()) {
        toast.error("Course expired");
        return;
      }
    }

    const price = isPackage
      ? normalized.discountedPrice || normalized.price
      : normalized.discount || normalized.price;

    if (localStorage.getItem("token")) {
      const email = localStorage.getItem("email") || "";
      let alreadyPurchased = false;

      if (isPackage && courseid > 0) {
        const res = await checkAlreadyCoursePurchased(courseid, email);
        const dts = res?.data?.userCourses?.data || [];
        alreadyPurchased =
          dts.length > 0 && dts[0].attributes?.course?.data?.id == courseid;
        setIsPurchased(alreadyPurchased);
      }

      if (alreadyPurchased) {
        toast.error("You have already purchased our course");
        return;
      }

      const totalprice = price * quantity;
      const payload = {
        courseId: isPackage ? 0 : Number(courseid),
        qty: quantity,
        course: normalized.attributes,
        total: totalprice,
        packageId: Number(isPackage ? courseid : 0),
      };

      console.log("payload", payload);

      toast.success(`Item ${normalized.title} is add to cart successfully`);
      dispatch(addToCartRequest(payload));

      setTimeout(() => {
        router.push("/checkout");
      }, 5000);
    } else {
      const totalprice = price * quantity;
      const payload = {
        courseId: isPackage ? 0 : Number(courseid),
        qty: quantity,
        course: normalized.attributes,
        total: totalprice,
        packageId: Number(isPackage ? courseid : 0),
      };

      toast.error(`Please Login first`);
      localStorage.setItem("cartData", JSON.stringify(payload));
      router.push("/login");
    }
  }

  return (
    <div className={className ? "item-center" : "self-stretch pt-3 flex-col justify-start items-start flex w-[90%]"}>
      <div
        className={className ? "item-center" : "self-stretch px-6 pb-3 justify-start items-start gap-3 inline-flex"}
        style={{ width: "100%", margin: "auto" }}
      >
        <div
          onClick={() => enrollNow2(course)}
          className={className ? className : "grow cursor-pointer shrink basis-0 h-[40px]  px-[18px] py-3 bg-[#2970fe] rounded-[10px]  shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] border-2 border-white justify-center items-center gap-1.5 flex overflow-hidden"}
        >
          <div className="px-0.5 justify-center items-center flex">
            <div
              className="text-white  font-bold font-['Inter'] leading-7"
              style={{ fontSize: "18px" }}
            >
              {course?.category?.data?.attributes?.title == "eBook"
                ? "GET ACCESS"
                : "Enroll now"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollNowCart;
