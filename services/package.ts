import { client } from "@/lib/apollo-client";
import { apiFetch } from "./http";
import { gql } from "@apollo/client";

export async function packageDetailPage() {
    const url = process.env.NEXT_PUBLIC_API_BASE_URL + `/api/pages?populate=deep&filters[slug][$eq]=package-detail`;
    return await apiFetch(url)
}

export async function getPackageDetailbByGql(slug: string) {
    const { data }: { data: any } = await client.query({
        query: getPackageDetailGql(slug),
        fetchPolicy: "network-only",
    });

    if (!data) return {};

    return data;
}

function getPackageDetailGql(slug: string) {
    return gql`query {
    packages(filters:{slug:{eq:"${slug}"}}){
  data{
    id
    attributes{
      title
      desc
      price
      slug
      discountedPrice
      outline
      createdAt
      image{
        data{
          attributes{
            url
          }
        }
      }
      faqs{
        title
        sub_title
        faq{
          answer
          question
        }
      }
      key_features {
        value
      }

      keywords

      cpe_info

      inclusion {
        heading
        title
        sub_title
        image{
        data{
            attributes{
              url
            }
          }
        }
        list {
          icon {
            data{
              attributes{
                url
              }
            }
          }
          title
          item {
            value
          }
        }
      }
      courses(filters:{isActive:{eq:true},forTaxLaw:{eq:true}},pagination: { limit: -1 }){
        data{
          id
          attributes{
            shortDesc
            title
            startDate
            endDate
            isActive
            slug
            price
            discount
            category{
              data{
                attributes{
                  title
                }
              }
            }
            image{
              data{
                attributes{
                  url
                }
              }
            }
            
            instructors(	
              pagination: { limit: -1 }){
              data{
                attributes{
                  firstName
                  lastName
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
