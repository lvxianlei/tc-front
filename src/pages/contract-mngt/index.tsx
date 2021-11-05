// 合同管理-原材料合同管理
import React, { useState } from 'react'
//page 组件
import { CommonTable, DetailContent, DetailTitle, Page } from "../common"
// 表格数据
import { contract, contract1, contract2, contract7 } from "./contract.json"
//路由
import { Link, } from 'react-router-dom'
// antd
import { DatePicker, Select, Input, Button, Modal, Descriptions } from 'antd'
import RequestUtil from '../../utils/RequestUtil'

export default function ContractMngt() {
    const { RangePicker } = DatePicker;
    // 创建开关
    const [isModalVisible, setIsModalVisible] = useState(false);
    // 添加开关
    const [isModalVisible1, setIsModalVisible1] = useState(false);
    const [isModalVisible2, setIsModalVisible2] = useState(false);
    const [isModalVisible3, setIsModalVisible3] = useState(false);
    const [isModalVisible4, setIsModalVisible4] = useState(false);
    const [contractId, setContractId] = useState(0);
    const [obj, setObj] = useState<any>({})
    const [contractNumber, setContractNumber] = useState("");//合同编号

    const [purchasePlanId, setPurchasePlanId] = useState(0);//采购计划id
    const [purchasePlanNumber, setPurchasePlanNumber] = useState("");//采购计划编号  关联采购计划
    const [supplierName, setSupplierName] = useState("");//供应商名称
    const [supplierId, setSupplierId] = useState(0);//供应商id
    const [signingTime, setSigningTime] = useState("");//签订时间
    const [operatorDeptId, setOperatorDeptId] = useState(0);//经办人部门
    const [operatorId, setOperatorId] = useState(0);//经办人 
    const [deliveryMethod, setDeliveryMethod] = useState(0);//交货方式
    const [materialStandard, setMaterialStandard] = useState(0);//材料标准
    const [transportBear, setTransportBear] = useState("");//运输承担 
    const [transportMethod, setTransportMethod] = useState(0);//运输方式
    const [unloadBear, setUnloadBear] = useState("");//卸车承担
    const [id, setId] = useState(0);
    const [columnsData, setColumnsData] = useState([]);
    // 选择器
    const { Option } = Select;
    var moment = require('moment');
    moment().format();
    //创建
    const showModal = () => {
        setIsModalVisible(true);
        setPurchasePlanId(Math.floor(Math.random() * 10));
        setSupplierId(Math.floor(Math.random() * 10));
    };
    //创建 弹框的开关
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const handleCancel1 = () => {
        setIsModalVisible1(false);
    };
    const handleCancel2 = () => {
        setIsModalVisible2(false);
    };
    const handleCancel3 = () => {
        setIsModalVisible3(false);
    };
    const handleCancel4 = () => {
        setIsModalVisible4(false);
    };
    const handleChange = (value: any) => {
        console.log(`selected ${value}`);
        setPurchasePlanNumber(value);
    }
    const handleChange1 = (value: any) => {
        console.log(`selected ${value}`);
        setSupplierName(value);
    }
    const handleChange3 = (value: any) => {
        console.log(`selected ${value}`);
        setOperatorDeptId(value);
    }
    const handleChange4 = (value: any) => {
        console.log(`selected ${value}`);
        setOperatorId(value);
    }
    const handleChange5 = (value: any) => {
        console.log(`selected ${value}`);
        setDeliveryMethod(value);
    }
    const handleChange6 = (value: any) => {
        console.log(`selected ${value}`);
        setMaterialStandard(value);
    }
    const handleChange7 = (value: any) => {
        console.log(`selected ${value}`);
        setTransportBear(value);
    }
    const handleChange8 = (value: any) => {
        console.log(`selected ${value}`);
        setTransportMethod(value);
    }
    const handleChange9 = (value: any) => {
        console.log(`selected ${value}`);
        setUnloadBear(value);
    }
    const onChange = (date: any, dateString: any) => {
        console.log(date, dateString);
        const a = moment(dateString).format("YYYY-MM-DD HH:mm:ss");
        setSigningTime(a);
    }
    const detail = async (materialContractId: number) => {
        setIsModalVisible2(true)
        ///tower-supply/materialContract/{materialContractId}
        const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/materialContract/${materialContractId}`)
        console.log(result);
        setObj(result)
        console.log(obj);
    }
    const edit = (id: number) => {
        setIsModalVisible3(true);
        setId(id);
        setPurchasePlanId(Math.floor(Math.random() * 10));
        setSupplierId(Math.floor(Math.random() * 10));
    }
    const save = async (deliveryMethod: number, materialStandard: number, operatorDeptId: number, operatorId: number, purchasePlanId: number, purchasePlanNumber: string, signingTime: string, supplierId: number, supplierName: string, transportBear: string, transportMethod: number, unloadBear: string) => {
        const result: { [key: string]: any } = await RequestUtil.post(`/tower-supply/materialContract`, { deliveryMethod, materialStandard, operatorDeptId, operatorId, purchasePlanId, purchasePlanNumber, signingTime, supplierId, supplierName, transportBear, transportMethod, unloadBear }, { "Content-Type": "application/json" })
        console.log(result);
    }
    const save1 = async (id: number, deliveryMethod: number, materialStandard: number, operatorDeptId: number, operatorId: number, purchasePlanId: number, purchasePlanNumber: string, signingTime: string, supplierId: number, supplierName: string, transportBear: string, transportMethod: number, unloadBear: string) => {
        const result: { [key: string]: any } = await RequestUtil.put(`/tower-supply/materialContract`, { id, deliveryMethod, materialStandard, operatorDeptId, operatorId, purchasePlanId, purchasePlanNumber, signingTime, supplierId, supplierName, transportBear, transportMethod, unloadBear }, { "Content-Type": "application/json" })
        console.log(result);
    }
    const del = async (id: number) => {
        const result: { [key: string]: any } = await RequestUtil.delete(`/tower-supply/materialContract?id=${id}`)
        console.log(result);
    }
    // 创建按钮
    const buttons: {} | null | undefined = [
        <div>
            <Button onClick={() => setIsModalVisible1(false)}>关闭</Button>
            <Button onClick={() => { save(deliveryMethod, materialStandard, operatorDeptId, operatorId, purchasePlanId, purchasePlanNumber, signingTime, supplierId, supplierName, transportBear, transportMethod, unloadBear) }}>保存</Button>
        </div>
    ]
    // /弹窗里面的添加按钮
    const buttons1: {} | null | undefined = [
        <div>
            <Button onClick={() => setIsModalVisible1(false)} >关闭</Button>
            <Button >保存</Button>
        </div>
    ]
    const buttons2: {} | null | undefined = [
        <div>
            <Button onClick={() => setIsModalVisible2(false)}>关闭</Button>
        </div>
    ]
    const buttons3: {} | null | undefined = [
        <div>
            <Button onClick={() => setIsModalVisible3(false)}>关闭</Button>
            <Button onClick={() => { save1(id, deliveryMethod, materialStandard, operatorDeptId, operatorId, purchasePlanId, purchasePlanNumber, signingTime, supplierId, supplierName, transportBear, transportMethod, unloadBear) }}>保存</Button>
        </div>
    ]
    const buttons4: {} | null | undefined = [
        <div>
            <Button onClick={() => setIsModalVisible4(false)}>关闭</Button>
            <Button>保存</Button>
        </div>
    ]
    //弹窗里面的添加
    const showModal1 = () => {
        setIsModalVisible1(true);
    }
    return (
        <div>
            <Page
                path="/tower-supply/materialContract"
                //表格
                columns={[
                    {
                        title: "序号",
                        dataIndex: "index",
                        fixed: "left",
                        render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                    },
                    ...contract,
                    {
                        title: "操作",
                        dataIndex: "opration",
                        fixed: "right",
                        render: (_: any, records: any) => <>
                            <Button type="link" onClick={() => { edit(records.id) }}>编辑</Button>
                            <Button type="link" onClick={() => { detail(records.id) }}>详情</Button>
                            <Button type="link" onClick={() => { del(records.id) }}>删除</Button>
                        </>
                    }
                ]}
                extraOperation={<div><Link to=""><Button >导出</Button></Link> <Link to="/contract-mngt/index"><Button onClick={showModal} style={{ marginLeft: "900px" }}>创建</Button></Link></div>}
                //头部时间
                searchFormItems={[
                    {
                        name: 'updateTime',
                        label: '签订时间',
                        children: <RangePicker style={{ width: "150px" }} />
                    },
                    //合同状态 
                    {
                        name: 'outStockUserName',
                        label: '合同状态',
                        children: <Select placeholder="请选择" style={{ width: "100px" }}>
                        </Select>
                    },

                    // 经办人 
                    {
                        name: 'pickingPerson',
                        label: '经办人',
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
                        children: <Input style={{ width: "150px" }} placeholder="任务编号/项目名称/客户名称" />
                    },
                ]}
            />
            <Modal title="创建" width="900px" footer={buttons} visible={isModalVisible} onCancel={handleCancel}>
                {/* 合同基本信息 */}
                <Descriptions title="合同基本信息" column={2} bordered>
                    <Descriptions.Item label="合同编号 *"><input placeholder="自动生成" style={{ border: "none", outline: "none" }} value={contractNumber} onChange={(e) => { setContractNumber(e.target.value) }} /></Descriptions.Item>
                    <Descriptions.Item label="关联采购计划 *">
                        {/* 跳工作管理下的计划列表 */}
                        <Select placeholder="请选择 " bordered={false} onChange={handleChange}>
                            <Select.Option value="aa">aa</Select.Option>
                            <Select.Option value="bb">bb</Select.Option>
                        </Select>
                    </Descriptions.Item>
                    <Descriptions.Item label="供应商 *">
                        <Select placeholder="请选择" bordered={false} onChange={handleChange1}>
                            <Select.Option value="aa">aa</Select.Option>
                            <Select.Option value="bb">bb</Select.Option>
                        </Select>
                    </Descriptions.Item>
                    <Descriptions.Item label="签订时间 *">
                        <DatePicker onChange={onChange} />
                    </Descriptions.Item>
                    <Descriptions.Item label="经办人 *">
                        <Select placeholder="请选择部门" bordered={false} onChange={handleChange3}>
                            <Select.Option value="1">aa</Select.Option>
                            <Select.Option value="2">bb</Select.Option>
                        </Select>
                        <Select placeholder="请选择人员" bordered={false} onChange={handleChange4}>
                            <Select.Option value="1">aa</Select.Option>
                            <Select.Option value="2">bb</Select.Option>
                        </Select>
                    </Descriptions.Item>
                    <Descriptions.Item label="交货方式 *">
                        <Select placeholder="请选择" bordered={false} onChange={handleChange5}>
                            <Select.Option value="1">需方场地</Select.Option>
                        </Select>
                    </Descriptions.Item>
                    <Descriptions.Item label="材料标准 *">
                        <Select placeholder="请选择" bordered={false} onChange={handleChange6}>
                            <Select.Option value="1">国网</Select.Option>
                        </Select>
                    </Descriptions.Item>
                    <Descriptions.Item label="运输承担 *">
                        <Select placeholder="请选择" bordered={false} onChange={handleChange7}>
                            <Select.Option value="供方">供方</Select.Option>
                            <Select.Option value="需方">需方</Select.Option>
                        </Select>
                    </Descriptions.Item>
                    <Descriptions.Item label="运输方式 *">
                        <Select placeholder="请选择" bordered={false} onChange={handleChange8}>
                            <Select.Option value="1">汽运</Select.Option>
                        </Select>
                    </Descriptions.Item>
                    <Descriptions.Item label="卸车承担 *">
                        <Select placeholder="请选择" bordered={false} onChange={handleChange9}>
                            <Select.Option value="供方">供方</Select.Option>
                            <Select.Option value="需方">需方</Select.Option>
                        </Select>
                    </Descriptions.Item>
                    <Descriptions.Item label="备注">
                        <input placeholder="请输入" style={{ border: "none", outline: "none" }} />
                    </Descriptions.Item>
                </Descriptions>
                {/* 询比价信息 */}
                <Descriptions title="询比价信息" column={1} bordered>
                    <Descriptions.Item label="询比价名称"><div onClick={() => { setIsModalVisible4(true) }}>请选择</div></Descriptions.Item>
                </Descriptions>
                {/* 上传附件 */}
                <Descriptions title="上传附件" column={2} bordered>
                    <Descriptions.Item label="附件名称附件名称附件名称附件名称附件名称">预览 下载 删除</Descriptions.Item>
                </Descriptions>
                <Page
                    path=""
                    //表格
                    columns={[
                        {
                            title: "序号",
                            dataIndex: "index",
                            fixed: "left",
                            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                        },
                        ...contract1,
                        {
                            title: "操作",
                            dataIndex: "opration",
                            fixed: "right",
                            render: (_: any, records: any) => <>
                                <Button type="link" onClick={() => { }}>删除</Button>
                            </>
                        }
                    ]}
                    extraOperation={<div><div>原材料信息</div><b style={{ color: "#F59A23" }}>重量合计（吨）：62.00  含税金额合计（元）：371010    不含税金额合计（元）322778.7</b> <Link to="/contract-mngt/index"><Button onClick={showModal1} style={{ marginLeft: "50px" }} >添加</Button></Link></div>}
                    //头部时间
                    searchFormItems={[]}
                />
            </Modal>
            <Modal title="添加原材料" width="1200px" footer={buttons1} visible={isModalVisible1} onCancel={handleCancel1}>
                <Page
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
            <Modal title="详情" width="700px" footer={buttons2} visible={isModalVisible2} onCancel={handleCancel2}>
                {/* 合同基本信息 */}
                <Descriptions title="合同基本信息" column={2} bordered>
                    <Descriptions.Item label="合同编号 *">{obj.contractNumber}</Descriptions.Item>
                    <Descriptions.Item label="关联采购计划 *">{obj.purchasePlanNumber}</Descriptions.Item>
                    <Descriptions.Item label="供应商 *">{obj.supplierName}</Descriptions.Item>
                    <Descriptions.Item label="签订时间 *">{obj.signingTime}</Descriptions.Item>
                    <Descriptions.Item label="经办人 *">{obj.operator}</Descriptions.Item>
                    <Descriptions.Item label="交货方式 *">{obj.deliveryMethod}</Descriptions.Item>
                    <Descriptions.Item label="材料标准 *">{obj.materialStandard}</Descriptions.Item>
                    <Descriptions.Item label="运输承担 *">{obj.transportBear}</Descriptions.Item>
                    <Descriptions.Item label="运输方式 *">{obj.transportMethod}</Descriptions.Item>
                    <Descriptions.Item label="卸车承担 *">{obj.unloadBear}</Descriptions.Item>
                    <Descriptions.Item label="备注">{obj.description}</Descriptions.Item>
                </Descriptions>
                {/* 询比价信息 */}
                <Descriptions title="询比价信息" column={2} bordered>
                    <Descriptions.Item label="询比价名称">  <Select placeholder="请选择 " bordered={false}></Select></Descriptions.Item>
                </Descriptions>
                {/* 上传附件 */}
                <Descriptions title="上传附件" column={2} bordered>
                    <Descriptions.Item label="附件名称附件名称附件名称附件名称附件名称">预览 下载 删除</Descriptions.Item>
                </Descriptions>
                {/* <Page
                    path=""
                    //表格
                    columns={[
                        {
                            title: "序号",
                            dataIndex: "index",
                            fixed: "left",
                            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                        },
                        ...contract1,
                        {
                            title: "操作",
                            dataIndex: "opration",
                            fixed: "right",
                            render: (_: any, records: any) => <>
                                <Button type="link" onClick={() => { }}>删除</Button>
                            </>
                        }
                    ]}
                    extraOperation={<div><div>原材料信息</div><b style={{ color: "#F59A23" }}>重量合计（吨）：62.00  含税金额合计（元）：371010    不含税金额合计（元）322778.7</b> <Link to="/contract-mngt/index"><Button onClick={showModal1} style={{ marginLeft: "50px" }} >添加</Button></Link></div>}
                    //头部时间
                    searchFormItems={[]}
                /> */}
            </Modal>
            <Modal title="编辑" width="900px" footer={buttons3} visible={isModalVisible3} onCancel={handleCancel3}>
                {/* 合同基本信息 */}
                <Descriptions title="合同基本信息" column={2} bordered>
                    <Descriptions.Item label="合同编号 *"><input placeholder="自动生成" style={{ border: "none", outline: "none" }} value={contractNumber} onChange={(e) => { setContractNumber(e.target.value) }} /></Descriptions.Item>
                    <Descriptions.Item label="关联采购计划 *">
                        <Select placeholder="请选择 " bordered={false} onChange={handleChange}>
                            <Select.Option value="aa">aa</Select.Option>
                            <Select.Option value="bb">bb</Select.Option>
                        </Select>
                    </Descriptions.Item>
                    <Descriptions.Item label="供应商 *">
                        <Select placeholder="请选择" bordered={false} onChange={handleChange1}>
                            <Select.Option value="aa">aa</Select.Option>
                            <Select.Option value="bb">bb</Select.Option>
                        </Select>
                    </Descriptions.Item>
                    <Descriptions.Item label="签订时间 *">
                        <DatePicker onChange={onChange} />
                    </Descriptions.Item>
                    <Descriptions.Item label="经办人 *">
                        <Select placeholder="请选择部门" bordered={false} onChange={handleChange3}>
                            <Select.Option value="1">aa</Select.Option>
                            <Select.Option value="2">bb</Select.Option>
                        </Select>
                        <Select placeholder="请选择人员" bordered={false} onChange={handleChange4}>
                            <Select.Option value="1">aa</Select.Option>
                            <Select.Option value="2">bb</Select.Option>
                        </Select>
                    </Descriptions.Item>
                    <Descriptions.Item label="交货方式 *">
                        <Select placeholder="请选择" bordered={false} onChange={handleChange5}>
                            <Select.Option value="1">需方场地</Select.Option>
                        </Select>
                    </Descriptions.Item>
                    <Descriptions.Item label="材料标准 *">
                        <Select placeholder="请选择" bordered={false} onChange={handleChange6}>
                            <Select.Option value="1">国网</Select.Option>
                        </Select>
                    </Descriptions.Item>
                    <Descriptions.Item label="运输承担 *">
                        <Select placeholder="请选择" bordered={false} onChange={handleChange7}>
                            <Select.Option value="供方">供方</Select.Option>
                            <Select.Option value="需方">需方</Select.Option>
                        </Select>
                    </Descriptions.Item>
                    <Descriptions.Item label="运输方式 *">
                        <Select placeholder="请选择" bordered={false} onChange={handleChange8}>
                            <Select.Option value="1">汽运</Select.Option>
                        </Select>
                    </Descriptions.Item>
                    <Descriptions.Item label="卸车承担 *">
                        <Select placeholder="请选择" bordered={false} onChange={handleChange9}>
                            <Select.Option value="供方">供方</Select.Option>
                            <Select.Option value="需方">需方</Select.Option>
                        </Select>
                    </Descriptions.Item>
                    <Descriptions.Item label="备注">
                        <input placeholder="请输入" style={{ border: "none", outline: "none" }} />
                    </Descriptions.Item>
                </Descriptions>
                {/* 询比价信息 */}
                <Descriptions title="询比价信息" column={2} bordered>
                    <Descriptions.Item label="询比价名称">  <Select placeholder="请选择 " bordered={false}></Select></Descriptions.Item>
                </Descriptions>
                {/* 上传附件 */}
                <Descriptions title="上传附件" column={2} bordered>
                    <Descriptions.Item label="附件名称附件名称附件名称附件名称附件名称">预览 下载 删除</Descriptions.Item>
                </Descriptions>
                {/* <Page
                    path=""
                    //表格
                    columns={[
                        {
                            title: "序号",
                            dataIndex: "index",
                            fixed: "left",
                            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                        },
                        ...contract1,
                        {
                            title: "操作",
                            dataIndex: "opration",
                            fixed: "right",
                            render: (_: any, records: any) => <>
                                <Button type="link" onClick={() => { }}>删除</Button>
                            </>
                        }
                    ]}
                    extraOperation={<div><div>原材料信息</div><b style={{ color: "#F59A23" }}>重量合计（吨）：62.00  含税金额合计（元）：371010    不含税金额合计（元）322778.7</b> <Link to="/contract-mngt/index"><Button onClick={showModal1} style={{ marginLeft: "50px" }} >添加</Button></Link></div>}
                    //头部时间
                    searchFormItems={[]}
                /> */}
            </Modal>
            <Modal title="编辑" width="900px" footer={buttons4} visible={isModalVisible4} onCancel={handleCancel4}>
                <DetailContent>
                    <DetailTitle title="操作信息" />
                    <CommonTable
                        columns={[
                            {
                                title: "序号",
                                dataIndex: "index",
                                render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                            },
                            ...contract7,
                        ]}
                        dataSource={columnsData}
                    />
                </DetailContent>
            </Modal>
        </div>
    )
}