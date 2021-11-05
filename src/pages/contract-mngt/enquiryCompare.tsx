// 合同管理-询比价
import React, { useState } from 'react'
import { CommonTable, DetailContent, DetailTitle, Page } from "../common"
import { DatePicker, Select, Input, Button, Modal, Descriptions } from 'antd'
import { Link, useHistory } from 'react-router-dom'
// 表格数据
import { contract3, contract4, contract2, contract5, contract6 } from "./contract.json"
import RequestUtil from '../../utils/RequestUtil'

export default function ContractMngt() {
    const { RangePicker } = DatePicker;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisible1, setIsModalVisible1] = useState(false);
    const [isModalVisible2, setIsModalVisible2] = useState(false);
    const [isModalVisible3, setIsModalVisible3] = useState(false);
    const [columnsData, setColumnsData] = useState([]);
    const [comparisonPriceId, setComparisonPriceId] = useState(0);
    const [id, setId] = useState(0);
    const { Option } = Select;
    const history = useHistory();
    //创建
    const showModal = () => {
        setIsModalVisible(true);
    };
    //添加原材料
    const showModal1 = () => {
        setIsModalVisible1(true);
    };
    //选择计划
    const showModal2 = () => {
        setIsModalVisible2(true);
    };
    // 弹框的开关
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    // 添加原材料
    const handleCancel1 = () => {
        setIsModalVisible1(false);
    };
    // 选择计划
    const handleCancel2 = () => {
        setIsModalVisible2(false);
    };
    const handleCancel3 = () => {
        setIsModalVisible3(false);
    };
    const enquiryInformation = async (comparisonPriceId: number) => {
        // const result: { [key: string]: any } = await RequestUtil.get(`/comparisonPrice/${comparisonPriceId}`, {}, { "Content-Type": "application/json" })
        // console.log(result);
        history.push(`/contract-mngt/enquiryCompare/enquiryInformation`)
    }
    const cancel = async (id: number) => {
        const result: { [key: string]: any } = await RequestUtil.post(`/comparisonPrice/cancelComparisonPrice?id=${id}`, {}, { "Content-Type": "application/json" })
        console.log(result);
    }
    // 二个按钮
    const buttons: {} | null | undefined = [
        <div>
            <Button >关闭</Button>
            <Button >保存</Button>
        </div>
    ]
    //添加原材料
    const buttons1: {} | null | undefined = [
        <div>
            <Button >关闭</Button>
            <Button >保存</Button>
        </div>
    ]
    //选择计划
    const buttons2: {} | null | undefined = [
        <div>
            <Button >关闭</Button>
            <Button >保存</Button>
        </div>
    ]
    const buttons3: {} | null | undefined = [
        <div>
            <Button >关闭</Button>
        </div>
    ]
    return (
        <div>
            <Page
                path="/tower-supply/comparisonPrice"
                //表格
                columns={[
                    {
                        "title": "序号",
                        "dataIndex": "index",
                        render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                    },
                    ...contract3,
                    {
                        title: "操作",
                        dataIndex: "opration",
                        fixed: "right",
                        render: (_: any, records: any) => <>
                            <Button type="link" onClick={() => { }}>询价信息</Button>
                            <Button type="link" onClick={() => { }}>取消</Button>
                            <Button type="link" onClick={() => { }}>编辑</Button>
                            <Button type="link" onClick={() => { }}>操作信息</Button>
                        </>
                    }
                ]}
                extraOperation={<div><Link to=""><Button >导出</Button></Link> <Link to="/contract-mngt/enquiryCompare"><Button onClick={showModal} style={{ marginLeft: "900px" }}>创建</Button></Link></div>}
                //头部时间
                searchFormItems={[
                    {
                        name: 'updateTime',
                        label: '最新状态变更时间',
                        children: <RangePicker style={{ width: "150px" }} />
                    },
                    //合同状态 
                    {
                        name: 'outStockUserName',
                        label: '状态',
                        children: <Select placeholder="请选择" style={{ width: "100px" }}>
                        </Select>
                    },

                    // 经办人 
                    {
                        name: 'pickingPerson',
                        label: '询价人',
                        children: <Select placeholder="部门" style={{ width: "100px" }}>
                        </Select>
                    },
                    {
                        name: 'pickingPerson',
                        children: <Select placeholder="人员" style={{ width: "100px" }}>
                        </Select>
                    },
                    // 查询
                    {
                        name: 'inquire',
                        label: '查询',
                        children: <Input style={{ width: "150px" }} placeholder="询比价编号" />
                    },
                    // 询比价类型
                    {
                        name: 'inquire',
                        label: '询比价类型',
                        children: <Select placeholder="请选择" style={{ width: "100px" }}>
                        </Select>
                    },
                ]}
            />
            <Modal title="创建" width="1000px" footer={buttons} visible={isModalVisible} onCancel={handleCancel}>
                {/* 询比价基本信息 */}
                <Descriptions title="询比价基本信息" column={3} bordered>
                    <Descriptions.Item label="询比价编号"><input placeholder="自动生成" style={{ border: "none", outline: "none" }} /></Descriptions.Item>
                    <Descriptions.Item label="类型">
                        <Select placeholder="请选择 " bordered={false}></Select>
                    </Descriptions.Item>
                    <Descriptions.Item label="用途"><input placeholder="请输入" style={{ border: "none", outline: "none" }} /></Descriptions.Item>
                </Descriptions>
                <Page
                    path=""
                    columns={[
                        {
                            "title": "序号",
                            "dataIndex": "index",
                            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                        },
                        ...contract4
                    ]}
                    extraOperation={<div><p>询价原材料 *</p><Link to="/contract-mngt/enquiryCompare"><Button style={{ marginLeft: "600px" }} onClick={showModal1} type="primary">添加询价原材料</Button></Link> <Link to="/contract-mngt/enquiryCompare"><Button onClick={showModal2} style={{ marginLeft: "50px" }}>选择计划</Button></Link></div>}
                    //头部时间
                    searchFormItems={[]}
                />
            </Modal>
            <Modal title="添加原材料" width="1200px" footer={buttons1} visible={isModalVisible1} onCancel={handleCancel1}>
                <Page
                    // path="/tower-system/material"
                    path=""
                    //表格
                    columns={[
                        ...contract2
                    ]}
                    //头部时间
                    searchFormItems={[
                        //标准 
                        {
                            name: 'outStockUserName',
                            label: '标准',
                            children: <Select placeholder="请选择" style={{ width: "100px" }}>
                                <Option value="外部">外部</Option>
                                <Option value="内部">内部</Option>
                                <Option value="缺料">缺料</Option>
                            </Select>
                        },
                        // 材质 
                        {
                            name: 'pickingPerson',
                            label: '材质',
                            children: <Select placeholder="请选择" style={{ width: "100px" }}>
                                <Option value="外部">外部</Option>
                                <Option value="内部">内部</Option>
                                <Option value="缺料">缺料</Option>
                            </Select>
                        },
                        // 品名 
                        {
                            name: 'pickingPerson',
                            label: '品名',
                            children: <Select placeholder="请选择" style={{ width: "100px" }}>
                                <Option value="外部">外部</Option>
                                <Option value="内部">内部</Option>
                                <Option value="缺料">缺料</Option>
                            </Select>
                        },
                        // 材料 
                        {
                            name: 'pickingPerson',
                            label: '材料',
                            children: <Select placeholder="请选择" style={{ width: "100px" }}>
                                <Option value="外部">外部</Option>
                                <Option value="内部">内部</Option>
                                <Option value="缺料">缺料</Option>
                            </Select>
                        },
                        // 规格 
                        {
                            name: 'pickingPerson',
                            label: '规格',
                            children: <Select placeholder="请选择" style={{ width: "100px" }}>
                                <Option value="外部">外部</Option>
                                <Option value="内部">内部</Option>
                                <Option value="缺料">缺料</Option>
                            </Select>
                        },
                        // 查询
                        {
                            name: 'inquire',
                            label: '物料编号',
                            children: <Input style={{ width: "100px" }} />
                        },
                    ]}
                />
            </Modal>
            <Modal title="选择计划" width="1000px" footer={buttons2} visible={isModalVisible2} onCancel={handleCancel2}>
                <Page
                    path=""

                    //表格
                    columns={[
                        {
                            "title": "序号",
                            "dataIndex": "index",
                            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                        },
                        ...contract5
                    ]}
                    //头部时间
                    searchFormItems={[
                        //采购类型 
                        {
                            name: 'outStockUserName',
                            label: '采购类型',
                            children: <Select placeholder="请选择" style={{ width: "100px" }}>
                                <Option value="外部">外部</Option>
                                <Option value="内部">内部</Option>
                                <Option value="缺料">缺料</Option>
                            </Select>
                        },

                        // 采购人 
                        {
                            name: 'pickingPerson',
                            label: '采购人',
                            children: <Select placeholder="部门" style={{ width: "100px" }}>
                            </Select>
                        }, {
                            name: 'pickingPerson',
                            children: <Select placeholder="人员" style={{ width: "100px" }}>
                            </Select>
                        },
                        // 采购计划编号
                        {
                            name: 'inquire',
                            label: '采购计划编号',
                            children: <Input style={{ width: "150px" }} />
                        },
                    ]}
                />
            </Modal>
            <Modal title="操作信息" width="1000px" footer={buttons3} visible={isModalVisible3} onCancel={handleCancel3}>
                <DetailContent>
                    <DetailTitle title="操作信息" />
                    <CommonTable
                        columns={[
                            ...contract6,
                        ]}
                        dataSource={columnsData}
                    />
                </DetailContent>
            </Modal>
            <Button onClick={() => { enquiryInformation(comparisonPriceId) }}>询价信息</Button>
            <Button onClick={() => {
                //调接口
                cancel(id);
            }}>取消</Button>
            <Button onClick={() => { }}>编辑</Button>
            <Button onClick={() => { setIsModalVisible3(true) }}>操作信息</Button>
        </div>
    )
}