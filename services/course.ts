import { gql } from "@apollo/client";
import { client } from "@/lib/apollo-client";
import { apiFetch } from "./http";
import moment from "moment";

let currentDate = moment().format('YYYY-MM-DD') + 'T00:00:00.000Z'

export async function getCourseDetailPage() {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL + "/api/pages?populate=deep&filters[slug][$eq]=course-detail";
  return await apiFetch(url)
}

export async function updateUserCourseApi(id: any, data: any) {
  if (!id) return null;

  const url = process.env.NEXT_PUBLIC_API_BASE_URL + `/api/user-courses/${id}`;

  return await apiFetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: data
  })
}

export async function getAllCourses(title?: any) {
  let search = title || '';

  if (search !== '') {
    const { data }: { data: any } = await client.query({
      query: getCoursesWithTitleGql(true, true, search),
      fetchPolicy: "network-only",
    });

    return data;
  } else {

    const { data }: { data: any } = await client.query({
      query: getCoursesGql(true, true),
      fetchPolicy: "network-only",
    });

    return data;
  }

}

export async function getcoursesBySlug(slug: any) {
  const { data }: { data: any } = await client.query({
    query: getCoursesDetail(slug),
    fetchPolicy: "network-only",
  });

  if (!data) return {};

  return data?.courses;
}

export async function getAllCourseForSearch(search: any) {
  const { data }: { data: any } = await client.query({
    query: getCourseSearchGql(search, true, true),
    fetchPolicy: "network-only",
  });

  if (!data) return {};

  return data?.courses;
}

export async function getReviewExamQuestion(slug: any) {
  const { data }: { data: any } = await client.query({
    query: getQuestionGqlReviewExam(slug),
    fetchPolicy: "network-only",
  });

  if (!data) return {};

  return data?.courses;
}

function getQuestionGqlReviewExam(slug: any) {
  return gql`query{
        reviewExams (pagination: { limit: -1 }, filters:
           { 
            course:
            { 
              slug :{ eq: "${slug}"} 
            }
          }) {
          data
          {
            id
            attributes
            {
              title
              desc
               questions (pagination: { limit: -1 }) {
                id
                isMCQ
                title
                durationInminute
                options{
                  option
                  id
                  displayOrder
                  isAnswer
                  hint
                }
              }
            }
            
          }
        }
    }
  `;
}


function getCourseSearchGql(keyword: any, isActive: boolean, forTaxLaw: true) {
  return gql`query {
      courses( 
        pagination: { limit: -1 }, 
        filters : {
          title: { contains : "${keyword}" },
          isActive: { eq: ${isActive}}, 
          forTaxLaw: { eq: ${forTaxLaw} },
            or:  [{
                      and: [{
                              endDate:   { gte:  "${currentDate}"}
                              ,
                              category: {
                                  title: {eq: "Live"}
                              }
                          }]
                    },
                    {
                        category: {
                            title: {ne: "Live"}
                        }
                    }],
  
         }
      )
    {
          data {
            id
            attributes {
              title
              forTaxLaw
              
              slug
            startDate
              
            }
          }
        }
      }`;
}

export async function getAllCoursesForLive() {
  const { data }: { data: any } = await client.query({
    query: getCoursesLiveTitleGql(true, true),
    fetchPolicy: "network-only",
  });

  if (!data) return {};

  return data?.courses;
}

export async function getAllCoursesForRecorded() {
  const { data }: { data: any } = await client.query({
    query: getCoursesRecordedTitleGql(true, true),
    fetchPolicy: "network-only",
  });

  if (!data) return {};

  return data?.courses;
}


export async function getAllCourseForEbook(title?: any) {
  const { data }: { data: any } = await client.query({
    query: getCourseBookTitleGql(true, true),
    fetchPolicy: "network-only",
  });

  if (!data) return {};

  return data?.courses;
}

export async function getAllPackages() {
  const { data }: { data: any } = await client.query({
    query: packagesonly,
    fetchPolicy: "network-only",
  });

  if (!data) return {};

  return data?.packages;
}

export async function GetUserSubscribedCourses(email: string) {
  const { data }: { data: any } = await client.query({
    query: getUserCourseGQL(email),
    fetchPolicy: "network-only",
  });

  if (!data) return {};

  return data?.userCourses;
}

export async function getOrderDetailByUserEmail(email: string) {
  const { data }: { data: any } = await client.query({
    query: getOrderDetailByUserEmailGql(email),
    fetchPolicy: "network-only",
  });

  if (!data) return {};

  return data?.orders;
}

export async function getInvoicetemplate() {
  const { data }: { data: any } = await client.query({
    query: getInvoiceTemplateUrl,
    fetchPolicy: "network-only",
  });

  if (!data) return {};

  return data;
}


export async function getUpcomingCourse(IDarray: any) {
  const { data }: { data: any } = await client.query({
    query: getCourses(IDarray),
    fetchPolicy: "network-only",
  });


  if (!data) return {};

  return data?.courses;
}

export async function getOrderBySessinId(sessionId: string) {
  const { data }: { data: any } = await client.query({
    query: getOrdersBySeesionIdGql(sessionId),
    fetchPolicy: "network-only",
  });

  if (!data) return {};

  return data;
}

function getOrdersBySeesionIdGql(sessionId: string) {
  return gql`query{
      orders(filters:{stripeSessionId:{eq:"${sessionId}"}}){
       data{
         id,
         attributes{
           OrderItems{
            title
            courseId
            packageId
            price
            finalPrice
            Enrolls{
              email
            }
          }
          totalPrice 
          finalPrice
           orderStatus
           stripeSessionId,
           userId
           email
          
         }
       }
     }
       }`
}


export function getCourses(IDarray: any) {
  return gql`
    query {
      courses(
        pagination: { limit: -1 }
        filters: {
          id: { notIn: [${IDarray}] }
          isActive: { eq: true }
          forTaxLaw: { eq: true }
          or: [
            {
              and: [
                {
                  startDate: { gte: "${currentDate}" }
                  category: { title: { eq: "Live" } }
                }
              ]
            }
          ]
        }
      ) {
        data {
          id
          attributes {
            title
            forTaxLaw
            slug
            startDate
            endDate
            timezone
            price
            shortDesc
            isActive
            image {
              data {
                attributes {
                  url
                }
              }
            }
            instructors{
              data{
                attributes{
                  firstName
                  lastName
                  image {
                    data {
                      attributes {
                        url
                      }
                    }
                  }
                }
              }
            }
            category {
              data {
                attributes {
                  title
                }
              }
            }
          }
        }
      }
    }
    
    `;
}

function getCoursesGql(fortaxLaw: boolean, isActive: boolean) {

  return gql`query {
      courses( 
        pagination: { limit: -1 }, 
         sort: ["startDate:desc"],
        filters : {
          isActive: { eq: ${isActive}}, 
          forTaxLaw: { eq: ${fortaxLaw} },
            or:  [{
                      and: [{
                              endDate:   { gte:  "${currentDate}"}
                              ,
                              category: {
                                  title: {eq: "Live"}
                              }
                          }]
                    },
                    {
                        category: {
                            title: {eq: "Live"}
                        }
                    }],
  
         }
      )
    {
      data {
        id
         
        attributes {
          title
          forTaxLaw
          isActive
          shortDesc
         startDate
          endDate
          timezone
          price
          image {
            data  
            { 
          		attributes {
                name
                url
                 alternativeText
                 caption
                width
                height
                mime
                previewUrl
              }
          	}
          }
          keywords
          slug
          certificateTemplate{
            data{
              attributes{
                url
              }
            }
          }
           category{
            data{
              attributes{
                title
               faqs{
                  faq{
                    question
                    answer
                  }
              }
              }
            }
          }
            tabs {
            
            featureTitle
            content
            index
            image{
              data{
                attributes{
                  url
                }
              }
            }
          }
             instructors{
            data{
              attributes{
                firstName
                lastName
                bioData
                shortDesc
                image{
                  data{
                  attributes{
                    url
                  }
                }
              }
              
            }
          }
        }
          
        }
      }
    }
  }
  `;
}

function getUserCourseGQL(email: string) {
  return gql`query{
     userCourses( sort: ["purchasedOn:desc"],pagination:{limit:-1},filters:{user:{email :{ eq: "${email}"}}}){
      data{
        id
          attributes{
            status
            completedOn
            purchasedOn
            joinUrl
            isReviewExamPassed
            lastVideoView
            course{
              data{
                id
                  attributes{
                    title
                    startDate
                    endDate
                    slug
                    webinarId
                    videoUrl
                    credit
                    medium
                    fieldOfStudy
                    programNumber
                    instructors{
                      data{
                        attributes{
                          firstName
                          lastName
                          image {
                            data {
                              attributes {
                                url
                              }
                            }
                          }
                        }
                      }
                    }
                    certificateTemplate {
                      data {
                        attributes {
                          url
                        }
                      }
                    }
                    handout {
                      data {
                        attributes {
                          url
                          name
                        }
                      }
                    }
                    category {
                      data {
                        attributes {
                          title
                        }
                      }
                    }
                    image {
                      data {
                        attributes {
                          url
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

function getCoursesWithTitleGql(
  fortaxLaw: boolean,
  isActive: boolean,
  title: string

) {


  return gql`query{
      courses( 
        
        pagination: { limit: -1 }, 
         sort: ["startDate:desc"],

        filters : {
          isActive: { eq: ${isActive}}, 
          forTaxLaw: { eq: ${fortaxLaw} },
          title: { contains : "${title}" },
          and: [{
                    endDate:   { gte:  "${currentDate}"
                    },
                    category: {
                        title: {eq: "Live"}
                    }
                }]
         }
      ){
        data {
                id
                attributes {
                  title
                  forTaxLaw
                  startDate
                  endDate
                  timezone
                  price
                  shortDesc
                  isActive
                  image {
                    data  
                    { 
                  		attributes {
                        name
                        url
                        alternativeText
                        caption
                        width
                        height
                        mime
                        previewUrl
                      }
                  	}
                  }
                  keywords
                  slug
                  certificateTemplate{
                    data{
                      attributes{
                        url
                      }
                    }
                  }
                   category{
                    data{
                      attributes{
                        title
                       faqs{
                          faq{
                            question
                            answer
                          }
                      }
                      }
                    }
                  }
                    tabs {
                    
                    featureTitle
                    content
                    index
                    image{
                      data{
                        attributes{
                          url
                        }
                      }
                    }
                  }
                  instructor{
                    data{
                      attributes{
                        firstName
                        lastName
                        bioData
                        shortDesc
                        image{
                          data{
                          attributes{
                            url
                          }
                        }
                      }
                      
                    }
                  }
                }
                  
                }
              }
      }
    }`;
}


function getCoursesDetail(slug: string) {
  return gql`query {
    courses(filters:{slug:{eq:"${slug}"}}) {
      data {
        id
         
        attributes {
          title
          credit 
          shortDesc
          startDate
          endDate
          programNumber
          medium
          fieldOfStudy
          price
          discount
          videoUrl
          webinarId
          image {
            data  
            { 
          		attributes {
                name
                url
                 alternativeText
                 caption
                width
                height
                mime
                previewUrl
              }
          	}
          }
          fieldOfStudy
          keywords
          slug
          redirection_Link
          reviews {
            title
            sub_title
            
            reviews {
              date
              message 
              by
            }
          }
          certificateTemplate{
            data{
              attributes{
                url
              }
            }
          }
           category{
            data{
              attributes{
                title
               faqs{
                  faq{
                    question
                    answer
                  }
              }
              }
            }
          }
            faqs {
              id
            title
            description
            list {
              question
              answer
            }
          
          }
            outline{
          id,
          title,
          list {
            value
          }
        }

        includes {
            title 
            list {
              image {
                 data{
                attributes{
                  url
                }
              }
              }
              title
            }
          }

           attend {
            title
            list {
              value
            }
          }
            
            tabs {
            title
            featureTitle
            content
            index
            image{
              data{
                attributes{
                  url
                }
              }
            }
          }
             instructors(	
              pagination: { limit: -1 }){
            data{
              attributes{
                firstName
                lastName
                bioData
                shortDesc
                image{
                  data{
                  attributes{
                    url
                  }
                }
              }
              
            }
          }
        }
          
        }
      }
    }
  }
  `;
}

function getCoursesLiveTitleGql(fortaxLaw: boolean, isActive: boolean) {

  return gql`query {
        courses(
            pagination: { limit: -1 },
             sort: ["startDate:desc"],
            filters: {
            isActive: { eq: ${isActive} }
            forTaxLaw: { eq: ${fortaxLaw} }
            or:  [{
                      and: [{
                              endDate:   { gte:  "${currentDate}"}
                              ,
                              category: {
                                  title: {eq: "Live"}
                              }
                          }]
                    },
                    {
                        category: {
                            title: {ne: "Live"}
                        }
                    }],
            }
        ) {
            data {
            id
            attributes {
                title
                forTaxLaw
                isActive
                startDate
                endDate
                credit
                fieldOfStudy
                price
                shortDesc
                slug
                creditsInfo

                image {
                data {
                    attributes {
                    name
                    url
                    alternativeText
                    caption
                    width
                    height
                    mime
                    previewUrl
                    }
                }
                }

                certificateTemplate {
                data {
                    attributes {
                    url
                    }
                }
                }

                category {
                data {
                    attributes {
                    title
                    }
                }
                }

                instructors {
                data {
                    attributes {
                    firstName
                    lastName
                    image {
                data {
                  attributes {
                    url
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}`;
}

function getCoursesRecordedTitleGql(fortaxLaw: boolean, isActive: boolean) {

  return gql`query{
      courses( 
        
        pagination: { limit: -1 }, 
         sort: ["startDate:desc"],
        filters : {
          isActive: { eq: ${isActive}}, 
          forTaxLaw: { eq: ${fortaxLaw} },
          and: [{
                    category: {
                        title: {eq: "Recorded"}
                    }
                }]
         }
      ){
        data {
              id
              attributes {
              title
              forTaxLaw
              isActive
              startDate
              endDate
              credit
              fieldOfStudy
                
              price
              shortDesc
                  
              image {
                data  
                  { 
                    attributes {
                      name
                      url
                      alternativeText
                      caption
                      width
                      height
                      mime
                      previewUrl
                    }
                  }
                }
                  
              slug
              certificateTemplate{
                data{
                  attributes{
                      url
                    }
                  }
                }
              category{
                data{
                  attributes{
                      title
                    }
                  }
                }
                creditsInfo
                instructors{
                  data{
                    attributes{
                         firstName
                    lastName
                      image {
                          data {
                            attributes {
                              url
                            }
                          }
                        }
                      }
                    }
                  }
              }
            }
      }
    }`;
}

function getCourseBookTitleGql(fortaxLaw: boolean, isActive: boolean) {

  return gql`query{
      courses( 
        
        pagination: { limit: -1 }, 
         sort: ["startDate:desc"],
        filters : {
          isActive: { eq: ${isActive}}, 
          forTaxLaw: { eq: ${fortaxLaw} },
          and: [{
                    category: {
                        title: {eq: "eBook"}
                    }
                }]
         }
      ){
        data {
              id
              attributes {
              title
              forTaxLaw
              isActive
              startDate
              endDate
              credit
              fieldOfStudy
              
                
              price
              shortDesc
                  
              image {
                data  
                  { 
                    attributes {
                      name
                      url
                      alternativeText
                      caption
                      width
                      height
                      mime
                      previewUrl
                    }
                  }
                }
                  
              slug
              certificateTemplate{
                data{
                  attributes{
                      url
                    }
                  }
                }
              category{
                data{
                  attributes{
                      title
                    }
                  }
                }
                creditsInfo
                instructors{
                  data{
                    attributes{
                         firstName
                    lastName
                      image {
                          data {
                            attributes {
                              url
                            }
                          }
                        }
                      }
                    }
                  }
              }
            }
      }
    }`;
}


const packagesonly = gql`
  query {
    packages {
      data {
      id
        attributes {
          title
          desc
          price
          slug
          discountedPrice

          
          category{
            data{
              attributes{
                title
              }
            }
          }

          image {
            data {
              attributes {
                name
                caption
                width
                height
                url
                previewUrl
                alternativeText
                formats
                ext
              }
            }
          }
        }
      }
    }
  }
`;

function getOrderDetailByUserEmailGql(email: string) {
  return gql`query{
      orders(filters:{email :{ eq: "${email}" },
      orderStatus :{ eq: "succeeded" }}
    sort: "id:DESC"
    )
    {
       data{
         id,
         attributes{
           OrderItems{
            title
            courseId
            packageId
            qty
            price
            finalPrice
            
            Enrolls{
              email
            }
          }
          totalPrice 
          finalPrice
          createdAt
           orderStatus
           stripeSessionId,
           userId
           email
           
          
         }
       }
     }
       }`
}



const getInvoiceTemplateUrl = gql`query {
  global {
    data {
      attributes {
        invoiceTemplate {
          data {
            attributes {
              url              
            }
          }
        }
      }
    }
  }
}`