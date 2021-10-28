import React, { useState } from 'react'
import { Button, TableColumnProps, Select, DatePicker, Input, Modal, Descriptions } from 'antd'
import { Link, useHistory, } from 'react-router-dom'
import { priceMaintain, dataSource } from "./ViewRawMaterial.json"
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
//原材料标准
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

export default function PriceMaintain(): React.ReactNode {
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

    const edit = () => {
        setIsModalVisible(true);
    }
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const del = () => {
        //调接口
    }
    const handleCancel1 = () => {
        setIsModalVisible1(false);
    };
    return (
        <div>
            <Page
                path="/tower-supply/materialPrice"
                columns={[
                    ...priceMaintain,
                    {
                        key: 'operation',
                        title: '操作',
                        dataIndex: 'operation',
                        fixed: 'right',
                        width: 100,
                        render: (_: undefined, record: any): React.ReactNode => (
                            <div></div>
                        )
                    }
                ]}
                filterValue={filterValue}
                extraOperation={<div>
                    <Link to="/project/management/new"><Button type="primary">导出</Button></Link>
                    <Button type="primary" style={{ marginLeft: "50px" }}>导入</Button>
                    <Button type="primary" style={{ marginLeft: "50px" }} onClick={() => setIsModalVisible1(true)}>添加</Button>
                    <Button type="primary" style={{ marginLeft: "50px" }} onClick={() => history.push(`/stock/viewRawMaterial`)}>返回上一级</Button>
                </div>}
                onFilterSubmit={onFilterSubmit}
                searchFormItems={[
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
                        label: '原材料名称',
                        children: <Input placeholder="原材料名称/规格" />
                    },
                ]}
            />
            <Button onClick={() => {
                edit();
            }}>
                编辑
            </Button>
            <Modal width="700px" title="历史价格" visible={isModalVisible} onCancel={handleCancel}>
                <Descriptions title="价格信息" bordered column={2} labelStyle={{ textAlign: 'right' }}>
                    <Descriptions.Item label="原材料名称">Zhou Maomao</Descriptions.Item>
                    <Descriptions.Item label="原材料规格">Zhou Maomao</Descriptions.Item>
                    <Descriptions.Item label="原材料标准">Zhou Maomao</Descriptions.Item>
                    <Descriptions.Item label="原材料类型">Zhou Maomao</Descriptions.Item>
                    <Descriptions.Item label="价格 *">Zhou Maomao</Descriptions.Item>
                    <Descriptions.Item label="价格来源 *">Zhou Maomao</Descriptions.Item>
                    <Descriptions.Item label="报价时间 *">Zhou Maomao</Descriptions.Item>
                    <Descriptions.Item label="UserName">Zhou Maomao</Descriptions.Item>
                </Descriptions>
            </Modal>
            <Button onClick={() => {
                del();
            }}>
                删除
            </Button>
            {/* 添加 */}
            <Modal width="700px" title="数据源" visible={isModalVisible1} onCancel={handleCancel1}>
                <Descriptions title="价格信息" bordered column={2} labelStyle={{ textAlign: 'right' }}>
                    <Descriptions.Item label="原材料名称 *">Zhou Maomao</Descriptions.Item>
                    <Descriptions.Item label="原材料规格 *">Zhou Maomao</Descriptions.Item>
                    <Descriptions.Item label="原材料标准 *">Zhou Maomao</Descriptions.Item>
                    <Descriptions.Item label="原材料类型 *">Zhou Maomao</Descriptions.Item>
                    <Descriptions.Item label="价格 *">Zhou Maomao</Descriptions.Item>
                    <Descriptions.Item label="价格来源 *">Zhou Maomao</Descriptions.Item>
                    <Descriptions.Item label="报价时间 *">Zhou Maomao</Descriptions.Item>
                    <Descriptions.Item label="">Zhou Maomao</Descriptions.Item>
                </Descriptions>
            </Modal>
        </div>
    )
}