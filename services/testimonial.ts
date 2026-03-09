import { gql } from "@apollo/client";
import { client } from "@/lib/apollo-client";

export async function getTestimonial() {
    const { data }: { data: any } = await client.query({
        query: testimonialListGql(),
        fetchPolicy: "network-only",
    });

    if (!data) return {};

    return data?.testimonials;

}

function testimonialListGql() {
    return gql`
    query GetTestimonials {
      testimonials {
        data {
          id
          attributes {
            name
            designation
            message
            rating
            profile_image {
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
  `;
}