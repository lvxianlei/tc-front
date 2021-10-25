
export function downLoadFile(path: string, fileName?: string | undefined) {
    const a = document.createElement("a");
    a.setAttribute("href", path);
    // fileName && a.setAttribute("download", fileName);
    a.setAttribute("target", "_blank");
    let clickEvent = document.createEvent("MouseEvents");
    clickEvent.initEvent("click", true, true);
    a.dispatchEvent(clickEvent);
}

export function formatPathToStringName(path: string, basepath?: string): string {
    const pathArr: string[] = (basepath ? path.replace(basepath, "") : path).split("/").filter((item: string) => !!item).map((pathItem: string, index: number) => {
        const item: string = pathItem.replace("{", "").replace("}", "").split("-").reduce((result: string, current: string) => {
            const tfNameArr: string[] = current.split("")
            return `${result}${tfNameArr[0]?.toUpperCase()}${tfNameArr.slice(1).join("")}`
        }, "")
        return item
    })
    return pathArr.reduce((result: string, current: string, index: number) => {
        const tfNameArr: string[] = current.split("")
        return `${result}${tfNameArr[0]?.toUpperCase()}${tfNameArr.slice(1).join("")}`
    }, "")
}