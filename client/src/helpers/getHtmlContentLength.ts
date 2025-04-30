export const getHtmlContentLength = (htmlContent: string): number => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    const plainText = doc.body.textContent?.trim() || "";
  
    return plainText.length;
  };
  