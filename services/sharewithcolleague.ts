import { apiFetch } from "./http";

export async function sharewithcolleagueSend(data: any, courseSlug: string) {

    data.message = `
      <table border='1' cellspacing='0' cellpadding='10' style='width: 500px'> 
        <tr> 
          <td><b>First Name:</b></td> <td> ${data.colleague_first_name}</td> 
        </tr> 
        <tr> 
          <td><b>Last Name::</b></td> <td>${data.colleague_last_name}</td> 
        </tr> 
        <tr> 
          <td><b>Firm Name:</b></td> <td>${data.firm_name}</td> 
        </tr> 
        <tr> 
          <td><b>Your First Name:</b></td> <td>${data.sender_first_name}</td> 
        </tr> 
        <tr> 
          <td><b>Your Last Name:</b></td> <td>${data.sender_last_name}</td> 
        </tr> 
        <tr> 
          <td style='vertical-align: top; padding-top:25px'><b>MESSAGE:</b></td> 
          <td> 
            <p>Hello ${data.colleague_first_name} ${data.colleague_last_name},</p> 
            <p>Check out this course from CPE Warehouse.</p> 
            <p><a href="${courseSlug}"></a></p> 
            <p>if you are interested.</p> 
            <p>Thanks,</p> <p>${data.sender_first_name} ${data.sender_last_name}</p> 
            <p>${data.firm_name}</p> 
          </td> 
        </tr> 
      </table>`


    const url = process.env.NEXT_PUBLIC_API_BASE_URL + `/api/sharewithcolleagues`;

    return await apiFetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: {data : data}
    })
}
