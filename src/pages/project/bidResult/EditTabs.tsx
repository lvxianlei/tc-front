import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react"
import { Button, Tabs, Upload, Tooltip, Form } from "antd"
import { InfoCircleOutlined } from "@ant-design/icons"
import { EditTable } from "../../common"
import * as XLSX from "xlsx"
import { EditTableProps } from "../../common/EditTable"

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

function formatWorkbook(input: { [key: string]: any, __rowNum__: number }[], keyNameDic?: Map<string, string>, requireKeys?: string[]) {
  const _data = input.slice(0).sort((a, b) => a.__rowNum__ - b.__rowNum__)
  const fullKeys: string[] = []
  const calcRequire = requireKeys && requireKeys.length > 0
  const res = _data.map((item) => {
    const resObj = {} as { [key: string]: any }
    Object.keys(item).forEach((kname) => {
      const realKeyName = keyNameDic ? keyNameDic.get(kname) || kname : kname
      const realVal = item[kname]
      resObj[realKeyName] = realVal
      if (calcRequire && !fullKeys.includes(realKeyName)) {
        fullKeys.push(realKeyName)
      }
    })
    return resObj
  })

  if (calcRequire) {
    if (requireKeys && requireKeys.some((kname) => !fullKeys.includes(kname))) {
      return []
    }
  }

  return res
}


export const UploadXLS = (props: {
  children?: React.ReactNode,
  readEnd?: (data: { [key: string]: any }[]) => void,
  title?: React.ReactNode | (() => React.ReactNode),
  xlsKeyNameDic?: [string, string][],
  requireKeys?: string[]
}) => {
  const { readEnd, xlsKeyNameDic, requireKeys, title } = props
  return (<>
    <Upload
      accept=".xls,.xlsx"
      beforeUpload={(file) => {
        readWorkbookFromLocalFile(file, (workbook) => {
          const data = outputWorkbook(workbook)
          const xlsxList = formatWorkbook(
            data,
            new Map(xlsKeyNameDic),
            requireKeys
          )
          readEnd && readEnd(xlsxList)
        })
        return false
      }}
      showUploadList={false}
      onChange={() => false}
    >
      {props.children || <Button type="primary" style={{ marginRight: 10 }}>导入文件</Button>}
    </Upload>
    {props.children || <Tooltip
      placement="top"
      title={title || <>文件导入要求：<br />
        1、仅Excel文件导入（xls，xlsx均可）。<br />
        2、列名必须包括包号、投标人名称、分标编号、货物类别、项目单位、总价（元）、 重量（吨）</>
      }><InfoCircleOutlined style={{ fontSize: 20, lineHeight: "32px" }} /></Tooltip>}
  </>)
}

interface BidProps {
  title: string
  key: string
  closable?: boolean
  [key: string]: any
}

interface TabsCanEditData {
  title: string
  key: string
  closable?: boolean
  content?: React.ReactNode
  item?: any
}

export const EditTableHasForm = forwardRef((props: EditTableProps, ref?: any) => {
  const [form] = Form.useForm()
  useEffect(() => {
    form.setFieldsValue({ submit: props.dataSource })
  }, [props.dataSource])

  useImperativeHandle(ref, () => ({ getForm: () => form }), [form])
  return <EditTable form={form} {...props} />
})

interface TabsCanEditProps {
  data?: BidProps[] // 务必要有不同的key值
  eachContent?: (item: any, tempRef?: { ref: Record<string, any>, key: string }) => React.ReactNode
  canEdit?: boolean // 是否可编辑，可编辑时没有X
  newItemTitle?: (newkey: string, paneslen: number) => string
  hasRefFun?: boolean // 是否获取到content内部的ref方法，会在 getData 方法返回 refFun 字段
  onRemove?: (removeKey: string, removeItem: TabsCanEditData | undefined) => void
}

export const TabsCanEdit = forwardRef((props: TabsCanEditProps, ref?: any) => {
  const { data, eachContent, canEdit, newItemTitle, hasRefFun, onRemove } = props
  const [panes, setpanes] = useState<undefined | TabsCanEditData[]>()
  const contentRefs = useRef<Record<string, any>>({})
  useEffect(() => {
    setpanes(
      data?.map((item) => {
        const { title, key, closable } = item
        return {
          title, key, closable: canEdit ? closable : false, item,
          content: eachContent && eachContent(item, hasRefFun ? { ref: contentRefs.current, key, } : undefined)
        }
      })
    )
  }, [canEdit, data, eachContent, hasRefFun])

  const [activeKey, setactiveKey] = useState("1")

  const tabChange = useCallback((activeKey: string) => setactiveKey(activeKey), [])

  const paneslen = panes?.length || 0
  const tabAdd = useCallback((_activeKey?: string) => {
    const activeKey = _activeKey || `第${paneslen + 1}轮`
    const title = newItemTitle ? newItemTitle(activeKey, paneslen) : activeKey
    const newItem: BidProps = {
      title,
      key: activeKey,
      closable: true,
    }

    const newPanes: TabsCanEditData = {
      ...newItem,
      item: newItem,
      content: eachContent && eachContent(newItem, hasRefFun ? { ref: contentRefs.current, key: activeKey } : undefined)
    }
    setpanes((pre) => {
      if (!pre) {
        return [newPanes]
      }
      const cpdata = pre.slice(0)
      cpdata.unshift(newPanes)
      return cpdata
    })
    setactiveKey(activeKey)

  }, [eachContent, hasRefFun, newItemTitle, paneslen])

  const tabEdit = (targetKey: any, action: "add" | "remove") => {
    if (action === "add") {
      tabAdd()
    } else if (action === "remove") {
      if (!panes) {
        return
      }
      const newPanes = panes.filter((pane) => (pane.key + "" !== targetKey))
      setpanes(newPanes)
      setactiveKey("1")
      delete contentRefs.current?.[parseFloat(targetKey)]
      onRemove && onRemove(targetKey, panes.find((pane: any) => pane.key.toString() === targetKey)?.item)
      return
    }
  }

  useEffect(() => {
    return () => {
      contentRefs.current && (contentRefs.current = {})
    }
  }, [])

  useImperativeHandle(ref, () => ({
    tabAdd,
    getData(needRefFun?: boolean) {
      const refFuncs = contentRefs.current
      return panes?.map((item) => {
        if (needRefFun) {
          return item.item
        }
        return {
          ...item.item,
          refFun: refFuncs[item.key],
        }
      })
    },
  }), [tabAdd, panes])
  return (
    <Tabs
      type={canEdit ? "editable-card" : "card"}
      style={{ marginTop: "10px" }}
      onChange={tabChange}
      activeKey={activeKey}
      onEdit={tabEdit}
      hideAdd={true}
    >
      {panes?.map((pane, index) => (
        <Tabs.TabPane tab={pane.title} key={pane.key} closable={index === panes.length - 1 ? false : pane.closable}>
          {pane.content}
        </Tabs.TabPane>
      ))}
    </Tabs>
  )
})
