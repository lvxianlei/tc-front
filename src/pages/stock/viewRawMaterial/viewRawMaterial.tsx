import React, { useState } from 'react'
import { Button, TableColumnProps, Select, DatePicker, Input, Modal } from 'antd'
import { Link, useHistory, } from 'react-router-dom'
import { materialPrice, dataSource, priceInformation } from "./ViewRawMaterial.json"
import AntdCharts from "./antdCharts"
import { Page } from '../../common'
//原材料类型
const projectType = [
    {
        value: 0,
        label: "焊管"
    },
    {
        value: 1,
        label: "钢板"
    },
    {
        value: 2,
        label: "圆钢"
    },
    {
        value: 3,
        label: "大角钢"
    }
]

const currentProjectStage = [
    {
        value: 0,
        label: "国网B级"
    },
    {
        value: 1,
        label: "国网C级"
    },
    {
        value: 2,
        label: "国网D\级"
    },
    {
        value: 3,
        label: "国网正公差"
    }
]

export default function ViewRawMaterial(): React.ReactNode {
    const history = useHistory()
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisible1, setIsModalVisible1] = useState(false);
    const [filterValue, setFilterValue] = useState({});
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

    const historyPrice = () => {
        setIsModalVisible(true);
    }
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const state = () => {
        setIsModalVisible1(true);
    }
    const handleCancel1 = () => {
        setIsModalVisible1(false);
    };
    const goPrice = () => {
        history.push(`/stock/viewRawMaterial/priceMaintain`)
    }
    return (
        <div>
            <Page
                path="/tower-supply/materialPrice"
                columns={[
                    ...materialPrice
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
                        children: <Select style={{ width: "150px" }}>
                            {projectType.map((item: any, index: number) => <Select.Option value={item.value} key={index}>{item.label}</Select.Option>)}
                        </Select>
                    },
                    {
                        name: 'materialStandard',
                        label: '原材料标准',
                        children: <Select style={{ width: "150px" }}>
                            {currentProjectStage.map((item: any, index: number) => <Select.Option value={item.value} key={index}>{item.label}</Select.Option>)}
                        </Select>
                    },
                    {
                        name: 'inquire',
                        label: '查询',
                        children: <Input placeholder="原材料名称/规格" />
                    },
                ]}
            />
            <Button onClick={() => {
                historyPrice();
            }}>
                历史价格
            </Button>
            <Modal width="1000px" title="历史价格" visible={isModalVisible} onCancel={handleCancel}>
                <div style={{display:"flex"}}>
                    {/* 折线图 */}
                    <div>
                        <AntdCharts />
                    </div>
                    <div style={{width: "500px",height:"400px",marginLeft:"50px"}}>
                        <Page
                            path="/tower-supply/materialPrice/history/{materialPriceId}"
                            columns={[
                                ...priceInformation
                            ]}
                            searchFormItems={[]}
                        />
                    </div>
                </div>
            </Modal>
            <Button onClick={() => {
                state();
            }}>
                数据源
            </Button>
            <Modal width="700px" title="数据源" visible={isModalVisible1} onCancel={handleCancel1}>
                <Page
                    path="/tower-supply/materialPrice/priceSource/{materialPriceId}"
                    columns={[
                        ...dataSource
                    ]}
                    searchFormItems={[]}
                />
            </Modal>
        </div>
    )
}