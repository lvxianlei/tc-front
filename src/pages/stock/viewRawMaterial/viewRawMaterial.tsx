//原材料看板
import React, { useEffect, useState } from 'react'
import { Button, TableColumnProps, Select, DatePicker, Input, Modal } from 'antd'
import { Link, useHistory, } from 'react-router-dom'
import { materialPrice, dataSource, priceInformation } from "./ViewRawMaterial.json"
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
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisible1, setIsModalVisible1] = useState(false);
    const [filterValue, setFilterValue] = useState({});
    const [materialPriceId, setMaterialPriceId] = useState(0);
    const [arr, setArr] = useState<any>([]);
    //原材料类型
    const [projectType, setProjectType] = useState<any>([]);
    const { RangePicker } = DatePicker;

    const onFilterSubmit = (value: any) => {
        if (value.startBidBuyEndTime) {
            const formatDate = value.startBidBuyEndTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startBidBuyEndTime = formatDate[0]
            value.endBidBuyEndTime = formatDate[1]
        }

        if (value.startBiddingEndTime) {
            const formatDate = value.startBiddingEndTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startBiddingEndTime = formatDate[0]
            value.endBiddingEndTime = formatDate[1]
        }
        setFilterValue(value)
        return value
    }

    const historyPrice = async (materialPriceId: string) => {
        setIsModalVisible(true);
        setMaterialPriceId(Number(materialPriceId));
        console.log(materialPriceId);
        ///tower-supply/materialPrice/history/{materialPriceId}
        const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/materialPrice/history/${materialPriceId}`)
        console.log(result);
    }
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const state = async (materialPriceId: string) => {
        setIsModalVisible1(true);
        const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/materialPrice/priceSource/${materialPriceId}`)
        console.log(result);
    }
    const handleCancel1 = () => {
        setIsModalVisible1(false);
    };
    const goPrice = () => {
        history.push(`/stock/viewRawMaterial/priceMaintain`)
    }
    const buttons: {} | null | undefined = [
        <div>
            <Button onClick={() => setIsModalVisible(false)}>关闭</Button>
        </div>
    ]
    const buttons1: {} | null | undefined = [
        <div>
            <Button onClick={() => setIsModalVisible1(false)}>关闭</Button>
        </div>
    ]
    const aa = async () => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/materialPrice/history/${materialPriceId}`);
            console.log(result);
            setArr(result);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        aa();
    }, [])
    const bb = async () => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-system/materialCategory?current=1&size=20`);
            console.log(result);
            setProjectType(result);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        bb();
    }, [])
    return (
        <div>
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
                            return <div>
                                <Button type="link" onClick={() => { historyPrice(record.id) }}>历史价格</Button>
                                <Button type="link" onClick={() => { state(record.id) }}>数据源</Button>
                            </div>
                        }
                    }
                ]}
                filterValue={filterValue}
                extraOperation={<div><Link to="/project/management/new"><Button type="primary">导出</Button></Link><Button type="link" style={{ marginLeft: "1050px" }} onClick={() => { goPrice() }}>价格维护</Button></div>}
                onFilterSubmit={onFilterSubmit}
                searchFormItems={[
                    {
                        name: 'updateTime',
                        label: '更新时间',
                        children: <RangePicker />
                    },
                    {
                        name: 'rawMaterialType',
                        label: '原材料类型',
                        children: <Select style={{ width: "150px" }} defaultValue={"全部"}>
                            {projectType.map((item: any, index: number) => <Select.Option value={item.name} key={index}>{item.name}</Select.Option>)}
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
                        name: 'inquire',
                        label: '查询',
                        children: <Input placeholder="原材料名称/规格" />
                    },
                ]}
            />
            <Modal width="1000px" title="历史价格" visible={isModalVisible} onCancel={handleCancel} footer={buttons}>
                <div style={{ display: "flex" }}>
                    {/* 折线图 */}
                    <div>
                        <AntdCharts />
                    </div>
                    <div style={{ width: "500px", height: "400px", marginLeft: "50px" }}>
                        {/* <Page
                            path={`/tower-supply/materialPrice/history/${materialPriceId}`}
                            columns={[
                                {
                                    title: "序号",
                                    dataIndex: "index",
                                    render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                                },
                                ...priceInformation
                            ]}
                            searchFormItems={[]}
                        /> */}
                        <CommonTable
                            columns={[
                                {
                                    title: "序号",
                                    dataIndex: "index",
                                    render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                                },
                                ...priceInformation
                            ]}
                            dataSource={arr}
                        />
                    </div>
                </div>
            </Modal>
            <Modal width="700px" title="数据源" visible={isModalVisible1} onCancel={handleCancel1} footer={buttons1}>
                <Page
                    path={`/tower-supply/materialPrice/priceSource/${materialPriceId}`}
                    columns={[
                        {
                            title: "序号",
                            dataIndex: "index",
                            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                        },
                        ...dataSource
                    ]}
                    searchFormItems={[]}
                />
            </Modal>
        </div>
    )
}