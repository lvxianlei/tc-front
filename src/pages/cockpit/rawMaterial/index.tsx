//原材料看板
import React, { useState } from 'react'
import { Button, Select, DatePicker, Input, Modal } from 'antd'
import { Link, useHistory, } from 'react-router-dom'
import { materialPrice } from "./rawMaterial.json"
import { Page } from '../../common'
import ApplicationContext from '../../../configuration/ApplicationContext'
import HistoryPrice from './HistoryPrice'
import DataSource from './DataSource'

export default function ViewRawMaterial(): React.ReactNode {
    const history = useHistory()
    const invoiceTypeEnum = (ApplicationContext.get().dictionaryOption as any)["104"].map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))
    const [detailId, setDetailId] = useState<string>("")
    const [materialName, setMaterialName] = useState<string>("")
    const [priceVisible, setPriceVisible] = useState<boolean>(false)
    const [dataVisible, setDataVisible] = useState<boolean>(false)
    const onFilterSubmit = (value: any) => {
        if (value.startUpdateTime) {
            const formatDate = value.startUpdateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startUpdateTime = formatDate[0] + " 00:00:00"
            value.endUpdateTime = formatDate[1] + " 23:59:59"
        }
        return value
    }

    return (<>
        <Modal
            title="历史价格"
            visible={priceVisible}
            destroyOnClose
            width={1011}
            footer={[
                <Button key="close" type="primary" ghost onClick={() => {
                    setDetailId("")
                    setPriceVisible(false)
                }}>关闭</Button>
            ]}
            onCancel={() => {
                setDetailId("")
                setPriceVisible(false)
            }} >
            <HistoryPrice id={detailId} name={materialName} />
        </Modal>
        <Modal
            title="数据源"
            width={1011}
            visible={dataVisible}
            destroyOnClose
            footer={[
                <Button key="close" type="primary" ghost onClick={() => {
                    setDetailId("")
                    setDataVisible(false)
                }}>关闭</Button>
            ]}
            onCancel={() => {
                setDetailId("")
                setDataVisible(false)
            }} >
            <DataSource id={detailId} />
        </Modal>
        <Page
            path="/tower-supply/materialPrice"
            columns={[
                {
                    "title": "序号",
                    "dataIndex": "index",
                    render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                },
                ...materialPrice,
                {
                    key: 'operation',
                    title: '操作',
                    dataIndex: 'operation',
                    fixed: 'right',
                    width: 100,
                    render: (_: any, record: any): React.ReactNode => (<>
                        <Button type="link" onClick={() => {
                            setDetailId(record.id)
                            setMaterialName(record.materialName)
                            setPriceVisible(true)
                        }}>历史价格</Button>
                        <Button type="link" onClick={() => {
                            setDetailId(record.id)
                            setDataVisible(true)
                        }}>数据源</Button>
                    </>)
                }
            ]}
            extraOperation={<>
                <Button type="primary" ghost >导出</Button>
                <Button type="primary" ghost><Link to={`/cockpit/rawMaterial/price`}>价格维护</Link></Button>
            </>}
            onFilterSubmit={onFilterSubmit}
            searchFormItems={[
                {
                    name: 'startUpdateTime',
                    label: '更新时间',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'materialCategoryId',
                    label: '原材料类型',
                    children: <Select style={{ width: "150px" }} defaultValue={"全部"}>
                        {/* {projectType.map((item: any, index: number) => <Select.Option value={item.id} key={index}>{item.name}</Select.Option>)} */}
                    </Select>
                },
                {
                    name: 'materialStandard',
                    label: '原材料标准',
                    children: <Select style={{ width: "150px" }} defaultValue={"全部"}>
                        {invoiceTypeEnum.map((item: any, index: number) => <Select.Option value={item.value} key={index}>{item.label}</Select.Option>)}
                    </Select>
                },
                {
                    name: 'fuzzyQuery',
                    label: '查询',
                    children: <Input placeholder="原材料名称/规格" />
                }
            ]}
        />
    </>
    )
}