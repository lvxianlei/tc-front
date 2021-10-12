
export function downLoadFile(path: string, fileName?: string | undefined) {
    const a = document.createElement("a");
    a.setAttribute("href", path);
    // fileName && a.setAttribute("download", fileName);
    a.setAttribute("target", "_blank");
    let clickEvent = document.createEvent("MouseEvents");
    clickEvent.initEvent("click", true, true);
    a.dispatchEvent(clickEvent);
}