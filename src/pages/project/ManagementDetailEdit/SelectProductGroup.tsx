import React, { useEffect, useState } from "react"
import { Modal } from "antd"
import { CommonTable, DetailTitle } from "../../common"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from "../../../utils/RequestUtil"
import { contract, productAssist } from '../managementDetailData.json'
export default function SelectProductGroup(props: any): JSX.Element {
    const [select, setSelect] = useState<any[]>([])
    const [projectSelect, setProjectSelect] = useState<string[]>(props.select || [])
    const [projectSelectRows, setProjectSelectRows] = useState<any[]>([])
    useEffect(() => {
        setProjectSelect(props.select)
    }, [JSON.stringify(props.select)])
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/contract?projectId=${props.projectId}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))

    const { loading: productGroupLoading, data: productGroup, run: productGroupRun } = useRequest<any>(({ id }) => new Promise(async (resole, reject) => {
        try {
            const productGroupId = props.productGroupId ? `&productGroupId=${props.productGroupId}` : ""
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/productAssist/getProductByContractId?contractId=${id}${productGroupId}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSelectChange = (selectedRowKeys: string[], selectRows: any[]) => {
        setSelect(selectedRowKeys)
        productGroupRun({ id: selectRows[0].id })
    }
    const onProductGroupChange = (selectedRowKeys: string[], selectRows: any[]) => {
        setProjectSelect(selectedRowKeys)
        setProjectSelectRows(selectRows)
    }
    console.log(props.select, projectSelect)
    return <Modal title="选择确认明细" width={1011} {...props} destroyOnClose onOk={() => props.onOk && props.onOk(projectSelectRows)} >
        <CommonTable
            loading={loading}
            columns={contract}
            dataSource={data?.records}
            rowSelection={{
                selectedRowKeys: select,
                type: "radio",
                onChange: onSelectChange,
            }} />
        <DetailTitle title="明细" />
        <CommonTable
            loading={productGroupLoading}
            columns={productAssist}
            dataSource={productGroup || []}
            rowSelection={{
                selectedRowKeys: projectSelect,
                type: "checkbox",
                onChange: onProductGroupChange,
            }}
        />
    </Modal>
}