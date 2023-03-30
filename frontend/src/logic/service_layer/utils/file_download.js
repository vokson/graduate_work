import { get_extension_of_file } from "./filename";

const js_download_file = ({ data, filename, mime, bom, inline = false }) => {
  const is_pdf =
    mime === "application/pdf" ||
    get_extension_of_file(filename).toLowerCase() == "pdf";

  const is_html =
    mime === "text/html" ||
    get_extension_of_file(filename).toLowerCase() === "html";

  const blobData = typeof bom !== "undefined" ? [bom, data] : [data];

  if (!mime && is_pdf) mime = "application/pdf";
  if (!mime && is_html) mime = "text/html";

  const blob = new Blob(blobData, { type: mime });

  if (typeof window.navigator.msSaveBlob !== "undefined") {
    // IE workaround for "HTML7007: One or more blob URLs were
    // revoked by closing the blob for which they were created.
    // These URLs will no longer resolve as the data backing
    // the URL has been freed."
    window.navigator.msSaveBlob(blob, filename);
  } else {
    var blobURL =
      window.URL && window.URL.createObjectURL
        ? window.URL.createObjectURL(blob)
        : window.webkitURL.createObjectURL(blob);

    const tempLink = document.createElement("a");
    tempLink.style.display = "none";
    tempLink.href = blobURL;

    const title = document.createElement("title");
    title.innerText = filename;

    // Safari thinks _blank anchor are pop ups. We only want to set _blank
    // target if the browser does not support the HTML5 download attribute.
    // This allows you to download files in desktop safari if pop up blocking
    // is enabled.
    if (typeof tempLink.download === "undefined") {
      tempLink.setAttribute("target", "_blank");
    }
    if (inline === true && (is_pdf || is_html))
      tempLink.addEventListener("click", function (event) {
        event.preventDefault();
        let new_window = window.open(blobURL, "_blank");
        new_window.onload = () => new_window.document.head.appendChild(title);
      });
    else tempLink.setAttribute("download", filename);

    document.body.appendChild(tempLink);
    tempLink.click();

    // Fixes "webkit blob resource error 1"
    setTimeout(function () {
      document.body.removeChild(tempLink);
      window.URL.revokeObjectURL(blobURL);
    }, 5000);
  }
};

export { js_download_file };
