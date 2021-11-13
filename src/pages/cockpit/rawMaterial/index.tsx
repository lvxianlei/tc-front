//原材料看板
import React, { useEffect, useState } from 'react'
import { Button, Select, DatePicker, Input, Modal } from 'antd'
import { Link, useHistory, } from 'react-router-dom'
import { materialPrice, dataSource, priceInformation } from "./rawMaterial.json"
import AntdCharts from "./antdCharts"
import { CommonTable, Page } from '../../common'
import RequestUtil from '../../../utils/RequestUtil'
import ApplicationContext from '../../../configuration/ApplicationContext'

export default function ViewRawMaterial(): React.ReactNode {
    //原材料标准
    const invoiceTypeEnum = (ApplicationContext.get().dictionaryOption as any)["104"].map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))
    const history = useHistory()
    const onFilterSubmit = (value: any) => {
        if (value.startUpdateTime) {
            const formatDate = value.startUpdateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startUpdateTime = formatDate[0] + " 00:00:00"
            value.endUpdateTime = formatDate[1] + " 23:59:59"
        }
        return value
    }

    // const historyPrice = async (materialPriceId: string) => {
    //     setIsModalVisible(true)
    //     setMaterialPriceId(Number(materialPriceId))
    //     const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/materialPrice/history/${materialPriceId}`)
    //     result.map((item: any) => {
    //         const time = moment(item.updateTime).format("YYYY-MM-DD")
    //     })
    //     setArr(result);
    // }
    // const handleCancel = () => {
    //     setIsModalVisible(false);
    // };
    // const state = async (materialPriceId: number) => {
    //     setIsModalVisible1(true);
    //     setMaterialPriceId(materialPriceId);
    //     const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/materialPrice/priceSource/${materialPriceId}`)
    //     console.log(result);
    //     setArr1(result);
    // }
    // const handleCancel1 = () => {
    //     setIsModalVisible1(false);
    // };

    // const buttons: {} | null | undefined = [
    //     <div>
    //         <Button onClick={() => setIsModalVisible(false)}>关闭</Button>
    //     </div>
    // ]
    // const buttons1: {} | null | undefined = [
    //     <div>
    //         <Button onClick={() => setIsModalVisible1(false)}>关闭</Button>
    //     </div>
    // ]
    // const bb = async () => {
    //     try {
    //         const result: { [key: string]: any } = await RequestUtil.get(`/tower-system/materialCategory?current=1&size=20`);
    //         setProjectType(result);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
    // useEffect(() => {
    //     bb();
    // }, [])
    return (<>
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
                    render: (_: undefined, record: any): React.ReactNode => {
                        return <>
                            <Button type="link" onClick={() => { }}>历史价格</Button>
                            <Button type="link" onClick={() => { }}>数据源</Button>
                        </>
                    }
                }
            ]}
            extraOperation={<>
                <Button type="primary" ghost >导出</Button>
                <Button type="primary" ghost onClick={() => history.push(`/cockpit/rawMaterial/edit`)}>价格维护</Button>
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