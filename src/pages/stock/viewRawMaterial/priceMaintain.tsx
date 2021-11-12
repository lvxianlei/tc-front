//原材料看板-价格维护
import React, { useState, useEffect } from 'react'
import { Button, Select, DatePicker, Input, Modal, Descriptions, message, Popconfirm } from 'antd'
import { Link, useHistory, } from 'react-router-dom'
import { priceMaintain, change } from "./ViewRawMaterial.json"
import { Page } from '../../common'
import RequestUtil from '../../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import ApplicationContext from "../../../configuration/ApplicationContext"
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
    const [isModalVisible2, setIsModalVisible2] = useState(false);
    const [filterValue, setFilterValue] = useState({});
    const [id, setId] = useState(0);//原材料价格主键id
    const [materialCategoryId, setMaterialCategoryId] = useState(0);//原材料类型id
    const [materialCategoryName, setMaterialCategoryName] = useState("");//原材料类型名称
    const [materialId, setMaterialId] = useState(0);//原材料id
    const [materialName, setMaterialName] = useState("");//原材料名称
    const [materialSpec, setMaterialSpec] = useState("");//原材料规格
    const [materialStandard, setMaterialStandard] = useState(0);//原材料标准id
    const [materialStandardName, setMaterialStandardName] = useState("");//原材料标准名称
    const [price, setPrice] = useState(0);//原材料价格
    const [price1, setPrice1] = useState("");
    const [priceSource, setPriceSource] = useState("");//价格来源
    const [quotationTime, setQuotationTime] = useState("");//报价时间
    const [obj, setObj] = useState<any>({});
    let [selects, setSelects] = useState<any>({
        materialNames: [],
        materialTextures: [],
        specs: [],
    }); // 获取页面下拉框默认数据
    var moment = require('moment');
    moment().format();

    // 原材料类型
    const invoiceTypeEnum = (ApplicationContext.get().dictionaryOption as any)["104"].map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))

    // 原材料标准
    const invoiceTypeEnum1 = (ApplicationContext.get().dictionaryOption as any)["101"].map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))

    // 获取页面默认数据
    useEffect(() => {
        getSelectDetail()
    }, []);

    // 获取选择框信息
    const getSelectDetail = async () => {
        const data: any = await RequestUtil.get('/tower-system/material/selectDetail')
        setSelects(data)
    }

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
    const edit = (id: any, price: any, priceSource: any, quotationTime: any, record: any) => {
        setId(id);
        setPrice(price);
        setPriceSource(priceSource);
        setQuotationTime(quotationTime);
        setIsModalVisible(true);
        setObj(record);
    }
    const add = () => {
        setIsModalVisible1(true);
        if (materialName || materialSpec || materialStandardName || materialCategoryName || price || priceSource || quotationTime) {
            setMaterialName("");
            setMaterialSpec("");
            setMaterialStandardName("");
            setMaterialCategoryName("");
            setPrice(0);
            setPriceSource("");
            setQuotationTime("");
        }
        setMaterialCategoryId(Math.floor(Math.random() * 10));
        setMaterialId(Math.floor(Math.random() * 10));
        setMaterialStandard(Math.floor(Math.random() * 10));
    }
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const handleCancel1 = () => {
        setIsModalVisible1(false);
    };
    const handleCancel2 = () => {
        setIsModalVisible2(false);
    };
    const handleChange = (value: any) => {
        console.log(`selected ${value}`);
        setMaterialName(value);
    }
    const handleChange1 = (value: any) => {
        console.log(`selected ${value}`);
        setMaterialSpec(value);
    }
    const handleChange2 = (value: any) => {
        console.log(`selected ${value}`);
        setMaterialStandardName(value);
    }
    const handleChange3 = (value: any) => {
        console.log(`selected ${value}`);
        setMaterialCategoryName(value);
    }
    const handleChange4 = (value: any) => {
        console.log(`selected ${value}`);
        setPriceSource(value);
    }
    const disabledDateTime = () => {
        return {
            disabledHours: () => [0, 24],
            disabledMinutes: () => [30, 60],
            disabledSeconds: () => [55, 56],
        };
    }
    const onChange = (date: any, dateString: any) => {
        console.log(date, dateString);
        const a = moment(dateString).format("YYYY-MM-DD HH:mm:ss");
        setQuotationTime(a);
    }
    const value = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/(^\s*)|(\s*$)/g, "")
        console.log(val);
        var reg = /[^\d.]/g
        // 只能是数字和小数点，不能是其他输入
        val = val.replace(reg, "")
        // // 保证第一位只能是数字，不能是点
        val = val.replace(/^\./g, "");
        // // 小数只能出现1位
        val = val.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        // // 小数点后面保留2位
        val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
        console.log(val);
        const value = Number(val);
        setPrice(value);
    }
    // const input = (e: any) => {
    //     e.target.value = e.target.value.replace(/[^\d]/g, '')
    // }
    const value1 = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/(^\s*)|(\s*$)/g, "")
        console.log(val);
        var reg = /[^\d.]/g
        // 只能是数字和小数点，不能是其他输入
        val = val.replace(reg, "")
        // // 保证第一位只能是数字，不能是点
        val = val.replace(/^\./g, "");
        // // 小数只能出现1位
        val = val.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        // // 小数点后面保留2位
        val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
        console.log(val);
        setPrice1(val);
    }
    const lead = async () => {
        const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/materialPrice/excelTemplate`);
        console.log(result);
    }
    const save = async (id: number, price: number, priceSource: string, quotationTime: string) => {
        console.log(price, priceSource, quotationTime, "dfvsvdfvdfbvdf");
        if (price || priceSource || quotationTime) {
            const result: { [key: string]: any } = await RequestUtil.put(`/tower-supply/materialPrice`, { id, price, priceSource, quotationTime }, { "Content-Type": "application/json" })
            console.log(result);
            setIsModalVisible(false);
            history.go(0);
        } else {
            message.info("请填入必填项")
            // setIsModalVisible(false);
        }
    }
    const save1 = async (materialCategoryName: string, materialName: string, materialSpec: string, materialStandardName: string, priceSource: string, quotationTime: string, price1: string) => {
        const result: { [key: string]: any } = await RequestUtil.post(`/tower-supply/materialPrice`, { materialCategoryId, materialCategoryName, materialId, materialName, materialSpec, materialStandard, materialStandardName, price: price1, priceSource, quotationTime }, { "Content-Type": "application/json" })
        setIsModalVisible1(false);
        // 刷新列表
        history.go(0);
    }
    const confirm = (id: number) => {
        // message.success('Click on Yes');
        del(id)
    }
    const cancel = () => {
        message.error('Click on No');
    }
    const del = async (materialPriceId: number) => {
        const result: { [key: string]: any } = await RequestUtil.delete(`/tower-supply/materialPrice/${materialPriceId}`, {});
        message.success("删除成功！")
        console.log(result);
        history.go(0);
    }
    const buttons: {} | null | undefined = [
        <div>
            <Button onClick={() => { handleCancel() }}>关闭</Button>
            <Button onClick={() => { save(id, price, priceSource, quotationTime) }}>保存</Button>
        </div>
    ]
    const buttons1: {} | null | undefined = [
        <div>
            <Button onClick={() => { handleCancel1() }}>关闭</Button>
            <Button onClick={() => { save1(materialCategoryName, materialName, materialSpec, materialStandardName, priceSource, quotationTime, price1) }}>保存</Button>
        </div>
    ]
    const buttons2: {} | null | undefined = [
        <div>
            <Button onClick={() => setIsModalVisible2(false)}>关闭</Button>
            <Button>保存</Button>
        </div>
    ]
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
                    ...priceMaintain,
                    {
                        key: 'operation',
                        title: '操作',
                        dataIndex: 'operation',
                        fixed: 'right',
                        width: 100,
                        render: (_: undefined, record: any): React.ReactNode => {
                            return <div>
                                <Button type="link" onClick={() => { edit(record.id, record.price, record.priceSource, record.quotationTime, record) }}>编辑</Button>
                                <Popconfirm
                                    title="你确定删除吗?"
                                    onConfirm={() => confirm(record.id)}
                                    onCancel={cancel}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button type="link">删除</Button>
                                </Popconfirm>
                            </div>
                        }
                    }
                ]}
                filterValue={filterValue}
                extraOperation={<div>
                    <Link to="/project/management/new"><Button type="primary">导出</Button></Link>
                    <Button type="primary" style={{ marginLeft: "16px" }} onClick={() => {
                        lead();
                    }}>导入</Button>
                    <Button type="primary" style={{ marginLeft: "16px" }} onClick={() => { add() }}>添加</Button>
                    <Button type="primary" style={{ marginLeft: "16px" }} onClick={() => history.push(`/stock/viewRawMaterial`)}>返回上一级</Button>
                </div>}
                onFilterSubmit={onFilterSubmit}
                searchFormItems={[
                    {
                        name: 'materialCategoryId',
                        label: '原材料类型',
                        children: <Select style={{ width: "150px" }}>
                            {invoiceTypeEnum1.map((item: any, index: number) => <Select.Option value={item.value} key={index}>{item.label}</Select.Option>)}
                        </Select>
                    },
                    {
                        name: 'materialStandard',
                        label: '原材料标准',
                        children: <Select style={{ width: "150px" }}>
                            {invoiceTypeEnum.map((item: any, index: number) => <Select.Option value={item.value} key={index}>{item.label}</Select.Option>)}
                        </Select>
                    },
                    {
                        name: 'materialName',
                        label: '原材料名称',
                        children: <Input placeholder="原材料名称/规格" />
                    },
                ]}
            />
            <Modal width="700px" title="编辑" visible={isModalVisible} footer={buttons} onCancel={handleCancel}>
                <Descriptions title="价格信息" bordered column={2} labelStyle={{ textAlign: 'right' }}>
                    <Descriptions.Item label="原材料名称">{obj.materialName}</Descriptions.Item>
                    <Descriptions.Item label="原材料规格">{obj.materialSpec}</Descriptions.Item>
                    <Descriptions.Item label="原材料标准">{obj.materialStandardName}</Descriptions.Item>
                    <Descriptions.Item label="原材料类型">{obj.materialCategoryName}</Descriptions.Item>
                    <Descriptions.Item label={<span>价格<span style={{ color: 'red' }}>*</span></span>}>￥<input type="number" maxLength={20} style={{ border: "none", outline: "none" }} value={price} onChange={(e) => { value(e) }} />/吨</Descriptions.Item>
                    <Descriptions.Item label={<span>价格来源<span style={{ color: 'red' }}>*</span></span>}>
                        <Select defaultValue={obj.priceSource} style={{ width: 120 }} bordered={false} onChange={handleChange4}>
                            <Select.Option value="南山钢铁有限公司">南山钢铁有限公司</Select.Option>
                            <Select.Option value="钢铁网">钢铁网</Select.Option>
                        </Select>
                    </Descriptions.Item>
                    <Descriptions.Item label={<span>报价时间<span style={{ color: 'red' }}>*</span></span>}>
                        <DatePicker
                            defaultValue={moment(obj.quotationTime)}
                            format="YYYY-MM-DD HH:mm:ss"
                            disabledDate={(current) => { return current && current >= moment().endOf('day') }}
                            disabledTime={disabledDateTime}
                            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                            onChange={onChange}
                        />
                    </Descriptions.Item>
                    <Descriptions.Item label="">{ }</Descriptions.Item>
                </Descriptions>
            </Modal>
            {/* 添加 */}
            <Modal width="700px" title="添加" visible={isModalVisible1} footer={buttons1} onCancel={handleCancel1}>
                <Button type="primary" style={{ marginLeft: "600px" }} onClick={() => setIsModalVisible2(true)}>选择</Button>
                <Descriptions title="价格信息" bordered column={2} labelStyle={{ textAlign: 'right' }}>
                    <Descriptions.Item label={<span>原材料名称<span style={{ color: 'red' }}>*</span></span>} >
                        <Select defaultValue="请选择" style={{ width: 120 }} bordered={false} onChange={handleChange}>
                          {selects.materialNames.map((item: any, index: number) => <Select.Option value={item} key={index}>{item}</Select.Option>)}
                        </Select>
                    </Descriptions.Item>
                    <Descriptions.Item label={<span>原材料规格<span style={{ color: 'red' }}>*</span></span>}>
                        <Select defaultValue="请选择" style={{ width: 120 }} bordered={false} onChange={handleChange1}>
                          {selects && selects.structureSpecs && selects.structureSpecs.map((item: any, index: number) => <Select.Option value={item} key={index}>{item}</Select.Option>)}
                        </Select>
                    </Descriptions.Item>
                    <Descriptions.Item label={<span>原材料标准<span style={{ color: 'red' }}>*</span></span>}>
                        <Select defaultValue="请选择" style={{ width: 120 }} bordered={false} onChange={handleChange2}>
                            {invoiceTypeEnum.map((item: any, index: number) => <Select.Option value={item.value} key={index}>{item.label}</Select.Option>)}
                        </Select>
                    </Descriptions.Item>
                    <Descriptions.Item label={<span>原材料类型<span style={{ color: 'red' }}>*</span></span>}>
                        <Select defaultValue="请选择" style={{ width: 120 }} bordered={false} onChange={handleChange3}>
                            {invoiceTypeEnum1.map((item: any, index: number) => <Select.Option value={item.value} key={index}>{item.label}</Select.Option>)}
                        </Select>
                    </Descriptions.Item>
                    <Descriptions.Item label={<span>价格<span style={{ color: 'red' }}>*</span></span>}>￥<input placeholder='请输入' type="text" value={price1} maxLength={20} style={{ border: "none", outline: "none" }} onChange={(e) => value1(e)} />/吨</Descriptions.Item>
                    <Descriptions.Item label={<span>价格来源<span style={{ color: 'red' }}>*</span></span>}>
                        <Select defaultValue="请选择" style={{ width: 120 }} bordered={false} onChange={handleChange4}>
                            <Select.Option value="南山钢铁有限公司">南山钢铁有限公司</Select.Option>
                            <Select.Option value="钢铁网">钢铁网</Select.Option>
                        </Select>
                    </Descriptions.Item>
                    <Descriptions.Item label={<span>报价时间<span style={{ color: 'red' }}>*</span></span>}>
                        {/* <DatePicker showTime onChange={onChange} /> */}
                        <DatePicker
                            format="YYYY-MM-DD HH:mm:ss"
                            disabledDate={(current) => { return current && current >= moment().endOf('day') }}
                            disabledTime={disabledDateTime}
                            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                            onChange={onChange}
                        />
                    </Descriptions.Item>
                    <Descriptions.Item label="">{ }</Descriptions.Item>
                </Descriptions>
            </Modal>
            <Modal width="600px" title="选择" visible={isModalVisible2} footer={buttons2} onCancel={handleCancel2}>
                <Page
                    path="/tower-supply/materialPurchaseTask/inquirer"
                    columns={[
                        ...change,
                        {
                            key: 'operation',
                            title: '操作',
                            dataIndex: 'operation',
                            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                                <Button type="link">选择</Button>
                            )
                        }
                    ]}
                    searchFormItems={[
                        {
                            name: 'goodsType',
                            label: '类别',
                            children: <Select style={{ width: '100px' }}>
                                <Select.Option value={''} key={''}>全部</Select.Option>
                                <Select.Option value={1} key={1}>新放</Select.Option>
                                <Select.Option value={3} key={3}>套用</Select.Option>
                                <Select.Option value={2} key={2}>重新出卡</Select.Option>
                            </Select>
                        },
                        {
                            name: 'pattern',
                            label: '类型',
                            children: <Select style={{ width: '100px' }}>
                                <Select.Option value={''} key={''}>全部</Select.Option>
                                <Select.Option value={1} key={1}>新放</Select.Option>
                                <Select.Option value={3} key={3}>套用</Select.Option>
                                <Select.Option value={2} key={2}>重新出卡</Select.Option>
                            </Select>
                        },
                        {
                            name: 'standard',
                            label: '标准',
                            children: <Select style={{ width: '100px' }}>
                                <Select.Option value={''} key={''}>全部</Select.Option>
                                <Select.Option value={1} key={1}>新放</Select.Option>
                                <Select.Option value={3} key={3}>套用</Select.Option>
                                <Select.Option value={2} key={2}>重新出卡</Select.Option>
                            </Select>
                        },
                        {
                            name: 'materialTexture',
                            label: '材质',
                            children: <Select style={{ width: '100px' }}>
                                <Select.Option value={''} key={''}>全部</Select.Option>
                                <Select.Option value={1} key={1}>新放</Select.Option>
                                <Select.Option value={3} key={3}>套用</Select.Option>
                                <Select.Option value={2} key={2}>重新出卡</Select.Option>
                            </Select>
                        },
                        {
                            name: 'spec',
                            label: '规格',
                            children: <Select style={{ width: '100px' }}>
                                <Select.Option value={''} key={''}>全部</Select.Option>
                                <Select.Option value={1} key={1}>新放</Select.Option>
                                <Select.Option value={3} key={3}>套用</Select.Option>
                                <Select.Option value={2} key={2}>重新出卡</Select.Option>
                            </Select>
                        },
                    ]}
                />
            </Modal>
        </div>
    )
}