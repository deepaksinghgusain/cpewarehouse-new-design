import { gql } from "@apollo/client";
import { client } from "@/lib/apollo-client";
import { apiFetch } from "./http";
import moment from "moment";

let currentDate = moment().format('YYYY-MM-DD') + 'T00:00:00.000Z'

export async function getCourseDetailPage() {
    const url = process.env.NEXT_PUBLIC_API_BASE_URL + "/api/pages?populate=deep&filters[slug][$eq]=course-detail";
    return await apiFetch(url)
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

    console.log(data);

    if (!data) return {};

    return data?.courses;

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

function getCoursesGql(fortaxLaw: boolean, isActive: boolean) {

    // var currentDate = JSON.parse(stringified);
    return gql`query {
      courses( 
        pagination: { limit: -1 }, 
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

function getCoursesWithTitleGql(
    fortaxLaw: boolean,
    isActive: boolean,
    title: string

) {


    return gql`query{
      courses( 
        
        pagination: { limit: -1 }, 
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
            pagination: { limit: -1 }
            filters: {
            isActive: { eq: ${isActive} }
            forTaxLaw: { eq: ${fortaxLaw} }
            and: [
                {
                category: {
                    title: { eq: "Live" }
                }
                }
            ]
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
                sub_title
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
              sub_title
                
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
              sub_title
                
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