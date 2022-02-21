import moment from "moment"
import * as XLSX from "xlsx"
export function downLoadFile(path: string, fileName?: string | undefined) {
    const a = document.createElement("a");
    a.setAttribute("href", path);
    fileName && a.setAttribute("download", fileName);
    a.setAttribute("target", "_blank");
    let clickEvent = document.createEvent("MouseEvents");
    clickEvent.initEvent("click", true, true);
    a.dispatchEvent(clickEvent);
}

export function downLoadTemplate(columns: any[], fileName: string) {
    const head = columns.map(item => item.title)
    const workbook: XLSX.WorkBook = XLSX.utils.book_new()
    const workSheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([head])
    XLSX.utils.book_append_sheet(workbook, workSheet)
    XLSX.writeFile(workbook, `${fileName}.xlsx`, { type: "binary", bookType: "xlsx" })
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
/**
 * 从身份证号获取出生日期、年龄
 * @param idNumber 
 */
export function fromIdNumberGetBirthday(idNumber: string): { birthday: string, age: number } {
    //15位身份证号-s
    const sReg = /(?<=\d{6})(\d{2})(\d{2})(\d{2})(?=\d{3})/
    //18位身份证号-l
    const lReg = /(?<=\d{6})(\d{4})(\d{2})(\d{2})(?=\d{3})/
    const returnData: { birthday: string, age: number } = {
        birthday: "",
        age: 0
    }
    if (idNumber.length === 15) {
        const regMatchData: string[] | null = idNumber.match(sReg)
        returnData.birthday = moment(regMatchData?.[0] || "").format("YYYY-MM-DD")
        returnData.age = moment().diff(moment(regMatchData?.[0] || ""), 'years')
    }
    if (idNumber.length === 18) {
        const regMatchData = idNumber.match(lReg)
        returnData.birthday = moment(regMatchData?.[0] || "").format("YYYY-MM-DD")
        returnData.age = moment().diff(moment(regMatchData?.[0] || ""), 'years')
    }
    return returnData
}