
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

export function currency(value: string | number = 0, currency = "¥", decimals = 2) {
    const digitsRE = /(\d{3})(?=\d)/g
    value = parseFloat(`${value}`)
    if (!isFinite(value) || (!value && value !== 0)) return ''
    currency = currency != null ? currency : '$'
    decimals = decimals != null ? decimals : 2
    const stringified = Math.abs(value).toFixed(decimals)
    const _int = decimals ? stringified.slice(0, -1 - decimals) : stringified
    const i = _int.length % 3
    const head = i > 0 ? (_int.slice(0, i) + (_int.length > 3 ? ',' : '')) : ''
    const _float = decimals ? stringified.slice(-1 - decimals) : ''
    var sign = value < 0 ? '-' : ''
    return sign + currency + head + _int.slice(i).replace(digitsRE, '$1,') + _float
}