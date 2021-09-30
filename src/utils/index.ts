
export function downLoadFile(path: string) {
    const a = document.createElement("a");
    a.setAttribute("href", path);
    a.setAttribute("target", "_blank");
    let clickEvent = document.createEvent("MouseEvents");
    clickEvent.initEvent("click", true, true);
    a.dispatchEvent(clickEvent);
}