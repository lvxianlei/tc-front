//原材料看板-价格维护
import React, { useState } from 'react'
import { Button, Select, DatePicker, Input, Modal, Descriptions } from 'antd'
import { Link, useHistory, } from 'react-router-dom'
import { priceMaintain } from "./ViewRawMaterial.json"
import { Page } from '../../common'
import RequestUtil from '../../../utils/RequestUtil'
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
    const [obj, setObj] = useState<any>({})
    var moment = require('moment');
    moment().format();

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
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const del = async (materialPriceId: number) => {
        const result: { [key: string]: any } = await RequestUtil.delete(`/tower-supply/materialPrice/${materialPriceId}`, {});
        console.log(result);
    }
    const handleCancel1 = () => {
        setIsModalVisible1(false);
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
    const input = (e: any) => {
        e.target.value = e.target.value.replace(/[^\d]/g, '')
    }
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
    const save = async (id: any, price: any, priceSource: any, quotationTime: any) => {
        const result: { [key: string]: any } = await RequestUtil.put(`/tower-supply/materialPrice`, { id, price, priceSource, quotationTime }, { "Content-Type": "application/json" })
        console.log(result);
    }
    const save1 = async (materialCategoryName: string, materialName: string, materialSpec: string, materialStandardName: string, priceSource: string, quotationTime: string) => {
        const result: { [key: string]: any } = await RequestUtil.post(`/tower-supply/materialPrice`, { id, materialCategoryId, materialCategoryName, materialId, materialName, materialSpec, materialStandard, materialStandardName, price, priceSource, quotationTime }, { "Content-Type": "application/json" })
        console.log(result);
        setIsModalVisible1(false);
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
            <Button onClick={() => { save1(materialCategoryName, materialName, materialSpec, materialStandardName, priceSource, quotationTime) }}>保存</Button>
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
                                <Button type="link" onClick={() => { del(record.id) }}>删除</Button>
                            </div>
                        }
                    }
                ]}
                filterValue={filterValue}
                extraOperation={<div>
                    <Link to="/project/management/new"><Button type="primary">导出</Button></Link>
                    <Button type="primary" style={{ marginLeft: "50px" }} onClick={() => {
                        lead();
                    }}>导入</Button>
                    <Button type="primary" style={{ marginLeft: "50px" }} onClick={() => {
                        setIsModalVisible1(true);
                        setId(Math.floor(Math.random() * 10));
                        setMaterialCategoryId(Math.floor(Math.random() * 10));
                        setMaterialId(Math.floor(Math.random() * 10));
                        setMaterialStandard(Math.floor(Math.random() * 10));
                    }}>添加</Button>
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
            <Modal width="700px" title="编辑" visible={isModalVisible} footer={buttons} onCancel={handleCancel}>
                <Descriptions title="价格信息" bordered column={2} labelStyle={{ textAlign: 'right' }}>
                    <Descriptions.Item label="原材料名称">{obj.materialName}</Descriptions.Item>
                    <Descriptions.Item label="原材料规格">{obj.materialSpec}</Descriptions.Item>
                    <Descriptions.Item label="原材料标准">{obj.materialStandardName}</Descriptions.Item>
                    <Descriptions.Item label="原材料类型">{obj.materialCategoryName}</Descriptions.Item>
                    <Descriptions.Item label="价格 *">￥<input type="number" maxLength={20} style={{ border: "none", outline: "none" }} value={price} onChange={(e) => { value(e) }} />/吨</Descriptions.Item>
                    <Descriptions.Item label="价格来源 *">
                        <Select defaultValue={obj.priceSource} style={{ width: 120 }} bordered={false} onChange={handleChange4}>
                            <Select.Option value="南山钢铁有限公司">南山钢铁有限公司</Select.Option>
                            <Select.Option value="钢铁网">钢铁网</Select.Option>
                        </Select>
                    </Descriptions.Item>
                    <Descriptions.Item label="报价时间 *">
                        {obj.quotationTime}
                    </Descriptions.Item>
                    <Descriptions.Item label="">{ }</Descriptions.Item>
                </Descriptions>
            </Modal>
            {/* 添加 */}
            <Modal width="700px" title="添加" visible={isModalVisible1} footer={buttons1} onCancel={handleCancel1}>
                <Descriptions title="价格信息" bordered column={2} labelStyle={{ textAlign: 'right' }}>
                    {/* labelStyle */}
                    <Descriptions.Item label="原材料名称 *" >
                        <Select defaultValue="请选择" style={{ width: 120 }} bordered={false} onChange={handleChange}>
                            <Select.Option value="角钢">角钢</Select.Option>
                            <Select.Option value="钢板">钢板</Select.Option>
                        </Select>
                    </Descriptions.Item>
                    <Descriptions.Item label="原材料规格 *">
                        <Select defaultValue="请选择" style={{ width: 120 }} bordered={false} onChange={handleChange1}>
                            <Select.Option value="Q420">Q420</Select.Option>
                            <Select.Option value="Q355">Q355</Select.Option>
                            <Select.Option value="35#">35#</Select.Option>
                        </Select>
                    </Descriptions.Item>
                    <Descriptions.Item label="原材料标准 *">
                        <Select defaultValue="请选择" style={{ width: 120 }} bordered={false} onChange={handleChange2}>
                            <Select.Option value="国网B级">国网B级</Select.Option>
                            <Select.Option value="国网C级">国网C级</Select.Option>
                            <Select.Option value="国网D\级">国网D\级</Select.Option>
                            <Select.Option value="国网正公差">国网正公差</Select.Option>
                        </Select>
                    </Descriptions.Item>
                    <Descriptions.Item label="原材料类型 *">
                        <Select defaultValue="请选择" style={{ width: 120 }} bordered={false} onChange={handleChange3}>
                            <Select.Option value="焊管">焊管</Select.Option>
                            <Select.Option value="钢板">钢板</Select.Option>
                            <Select.Option value="圆钢">圆钢</Select.Option>
                            <Select.Option value="大角钢">大角钢</Select.Option>
                        </Select>
                    </Descriptions.Item>
                    <Descriptions.Item label="价格 *">￥<input placeholder='请输入' onInput={(e) => input(e)} value={price1} maxLength={20} style={{ border: "none", outline: "none" }} onChange={(e) => value1(e)} />/吨</Descriptions.Item>
                    <Descriptions.Item label="价格来源 *">
                        <Select defaultValue="请选择" style={{ width: 120 }} bordered={false} onChange={handleChange4}>
                            <Select.Option value="南山钢铁有限公司">南山钢铁有限公司</Select.Option>
                            <Select.Option value="钢铁网">钢铁网</Select.Option>
                        </Select>
                    </Descriptions.Item>
                    <Descriptions.Item label="报价时间 *">
                        <DatePicker showTime onChange={onChange} />
                    </Descriptions.Item>
                    <Descriptions.Item label="">{ }</Descriptions.Item>
                </Descriptions>
            </Modal>
        </div>
    )
}