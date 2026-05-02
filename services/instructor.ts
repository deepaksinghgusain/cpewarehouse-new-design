import { client } from "@/lib/apollo-client";
import { gql } from "@apollo/client";


export async function getInstructorsForHome() {
    const { data }: { data: any } = await client.query({
        query: getInstructorSimplegql(),
        fetchPolicy: "network-only",
    });

    if (!data) return {};
    
    return data;
}


function getInstructorSimplegql() {
    return gql`query {
        instructors(filters:{IsActive:{eq:true}}){
          data{
            id
            attributes{
              firstName
              lastName
              shortDesc
              bioData
              topics
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
      }`
}
