import jsPDF from "jspdf";

interface CertificateCourse {
  title?: string;
  credit?: string | number;
  medium?: string;
  fieldOfStudy?: string;
  programNumber?: string | number;
  certificateTemplate?: {
    data?: {
      attributes?: {
        url?: string;
      } | null;
    } | null;
  } | null;
}

export function prepareCertificateHtml(
  templateHtml: string,
  templateUrl: string,
  replacements: Record<string, string>
) {
  const html = Object.entries(replacements).reduce(
    (result, [key, value]) => result.replace(new RegExp(`{{${key}}}`, "g"), value),
    templateHtml
  );

  const document = new DOMParser().parseFromString(html, "text/html");
  document.querySelectorAll("img[src]").forEach((image) => {
    const source = image.getAttribute("src");
    if (!source || source.startsWith("data:") || source.startsWith("blob:")) return;

    image.setAttribute("src", new URL(source, templateUrl).href);
    image.setAttribute("crossorigin", "anonymous");
  });

  document.querySelectorAll("[style]").forEach((element) => {
    const style = element.getAttribute("style");
    if (!style) return;

    element.setAttribute("style", style.replace(/url\((['"]?)(.*?)\1\)/gi, (match, quote, source) => {
      if (!source || source.startsWith("data:") || source.startsWith("blob:")) return match;
      return `url(${quote}${new URL(source, templateUrl).href}${quote})`;
    }));
  });

  document.querySelectorAll("style").forEach((styleElement) => {
    styleElement.textContent = styleElement.textContent?.replace(/url\((['"]?)(.*?)\1\)/gi, (match, quote, source) => {
      if (!source || source.startsWith("data:") || source.startsWith("blob:")) return match;
      return `url(${quote}${new URL(source, templateUrl).href}${quote})`;
    }) || "";
  });

  return document.documentElement.outerHTML;
}

export async function downloadCertificatePdf(
  course: CertificateCourse,
  completedOn: string | null | undefined,
  username: string
) {
  const templatePath = course.certificateTemplate?.data?.attributes?.url;
  if (!templatePath) {
    throw new Error("Certificate template is not configured for this course.");
  }

  const title = course.title || "course";
  const date = completedOn ? new Date(completedOn) : null;
  const formattedDate = date && !Number.isNaN(date.getTime())
    ? date.toLocaleDateString("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
      })
    : "";
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const templateUrl = `${baseUrl}${templatePath}`;
  const response = await fetch(templateUrl);

  if (!response.ok) {
    throw new Error("Unable to load the certificate template.");
  }

  const templateHtml = await response.text();
  const html = prepareCertificateHtml(templateHtml, templateUrl, {
    username,
    username_alt: username,
    course: title,
    credit: String(course.credit || ""),
    medium: course.medium || "",
    fieldStudy: course.fieldOfStudy || "",
    completedOn: formattedDate,
    program: String(course.programNumber || ""),
  });

  const doc = new jsPDF("p", "pt", [745, 745]);
  await new Promise<void>((resolve) => {
    doc.html(html, {
      html2canvas: { useCORS: true, allowTaint: false, imageTimeout: 15000 },
      callback: (pdfDoc) => {
        pdfDoc.save(`certificate_${title}.pdf`);
        resolve();
      },
    });
  });
}
