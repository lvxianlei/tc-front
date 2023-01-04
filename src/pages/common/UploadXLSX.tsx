import React from "react"
import { Button, message, Upload } from "antd"
import * as XLSX from "xlsx"

export function readWorkbookFromLocalFile(file: Blob, callback?: (workbook: XLSX.WorkBook) => any) {
    let reader = new FileReader()
    reader.onload = function (e) {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: "binary" })
        callback && callback(workbook)
    }
    reader.readAsBinaryString(file)
}

function outputWorkbook(workbook: XLSX.WorkBook, onlyone = true) {
    let data = [] as any[]
    for (const sheet in workbook.Sheets) {
        if (workbook.Sheets.hasOwnProperty(sheet)) {
            const rowjson = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
            data = data.concat(rowjson)
            if (onlyone) {
                break
            }
        }
    }
    return data
}

async function validateColumn(columns: any[], data: any[]): Promise<any[]> {
    return new Promise((resove, reject) => {
        try {
            const result = data.map((item: any, index: number) => {
                const resultRow: { [key: string]: any } = {}
                columns.forEach((colItem: any) => {
                    if (colItem.required && item[colItem.title]) {
                        resultRow[colItem.dataIndex] = item[colItem.title]
                    } else if (colItem.required && !item[colItem.title]) {
                        message.error(`第 ${index + 1} 行”${colItem.title}“为必填项,请检查表格后导入！`)
                        reject(`第 ${index + 1}行“${colItem.title}”为必填项,请检查表格后导入！`)
                        throw new Error(`第 ${index + 1}行“${colItem.title}”请检查表格后导入！`)
                    } else if (item[colItem.title]) {
                        resultRow[colItem.dataIndex] = item[colItem.title]
                    } else if (!colItem.required && !item[colItem.title]) {
                        resultRow[colItem.dataIndex] = null
                    } else {
                        message.error(`上传表格中 “${colItem.title}” 与模版格式不一致，请检查表格后导入！`)
                        reject(`上传表格中 ”${colItem.title}“ 与模版格式不一致，请检查表格后导入！`)
                        throw new Error(`上传表格中 ”${colItem.title}“ 与模版格式不一致，请检查表格后导入！`)
                    }
                })
                return resultRow
            })
            resove(result)
        } catch (error) {
            reject(error)
        }
    })
}

export default function UploadXLSX({ onLoaded, children, columns = [] }: {
    children?: React.ReactNode,
    columns?: any[],
    onLoaded?: (data: { [key: string]: any }[]) => void
}) {
    return (<Upload
        accept=".xls,.xlsx"
        beforeUpload={(file) => {
            readWorkbookFromLocalFile(file, async (workbook) => {
                const data = outputWorkbook(workbook)
                const result: any[] = await validateColumn(columns, data)
                onLoaded && onLoaded(result)
            })
            return false
        }}
        showUploadList={false}
        onChange={() => false}
    >
        {children || <Button type="primary" style={{ marginRight: 10 }}>导入文件</Button>}
    </Upload>)
}