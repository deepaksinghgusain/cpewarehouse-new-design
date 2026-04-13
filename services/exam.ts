import { client } from "@/lib/apollo-client";
import { gql } from "@apollo/client";

export async function getAllFinalExamQuestion(slug?: any) {

    const { data }: { data: any } = await client.query({
        query: getQuestionGql(slug),
        fetchPolicy: "network-only",
      });
    
      if (!data) return {};
    
      return data;
}

function getQuestionGql(slug: any) {
    return gql`query{
        exams (pagination: { limit: -1 }, filters:
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
                options{
                  option
                  id
                  displayOrder
                  isAnswer
                }
              }
            }
            
          }
        }
    }
  `;
  }
