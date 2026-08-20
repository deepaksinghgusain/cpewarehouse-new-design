import React, { Suspense } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getPackageDetailbByGql } from "@/services/package";
import PackageHeader from "@/components/packages/package-header";
import { getAllCourses } from "@/services/course";
import PackageCourses from "@/components/packages/package-courses";
import PackageTab from "@/components/packages/packagetab";

const page = async () => {

    let relatedCourses: any = [];
    let courses: any = [];
    let courseId: any = null;

    const res = await getPackageDetailbByGql("cpe-warehouse-annual-self-study-webinar-pass");

    const packageData = res?.packages?.data[0]?.attributes;

    
    const selectedCourse: any = {
        id: res?.packages?.data[0]?.id,
        attributes: packageData,
    };


    function getInstructorName(instructors: any) {
        const name: string[] = []
        instructors.data.forEach((element: any, index: number) => {
            name.push(element?.attributes?.firstName + ' ' + element?.attributes.lastName)
        })

        return name.join(',');
    }

    async function getAllRelatedCourses(keywords: string[]) {
        relatedCourses = []

        let res = await getAllCourses();

        const coursesArray = res.data.courses.data;

        if (keywords) {
            keywords?.forEach((element: any) => {
                const filteredResult = coursesArray.filter((item: any) => (item?.attributes?.title?.toString().toLowerCase().includes(element.toString().toLowerCase())))

                filteredResult.forEach((element: any, index: number) => {
                    const facultyname = getInstructorName(element?.attributes?.instructors)
                    relatedCourses.push({
                        attributes: {
                            'title': element?.attributes?.title,
                            'startDate': element?.attributes?.startDate,
                            'endDate': element?.attributes?.endDate,
                            'image': element?.attributes?.image?.data?.attributes?.url,
                            'shortDesc': element?.attributes?.shortDesc,
                            'credit': element?.attributes?.credit,
                            'slug': element?.attributes?.slug,
                            'price': element?.attributes?.price,
                            'instructors': element?.attributes?.instructors,
                        }
                    })
                })

                if (filteredResult) {
                    relatedCourses = relatedCourses.filter((item: any, index: number) => relatedCourses.indexOf(item) === index)

                    if (courseId)
                        relatedCourses = relatedCourses.filter((item: any) => item.id != courseId)
                }

            });

        } else {
            relatedCourses = [];
        }
    }

    if (res?.packages?.data[0]) {

        if (packageData.keywords) {
            let keywordsArray = packageData.keywords.split(",");

            getAllRelatedCourses(keywordsArray)
        }

        let name = ''
        packageData?.courses?.data.forEach((element: any) => {
            const facultyname = getInstructorName(element?.attributes?.instructors)
            courses.push(element);
        });
    }

    return (
        <Suspense fallback={<div className="flex min-h-[300px] items-center justify-center">Loading...</div>}>
            <section className="mx-auto">
                <PackageHeader packageData={packageData} selectedCourse={selectedCourse} />
            </section>

            <section className="mt-10 mx-auto w-[90%]">
                <PackageTab packageData={packageData} />
            </section>

            <section className="mx-auto w-[90%]">
                <PackageCourses courses={courses} />
            </section>
        </Suspense>
    );
};

export default page;
