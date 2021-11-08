import React, { useState } from 'react'
import { Input, Select, Button, Modal, Form, message, Descriptions } from 'antd'
import { useHistory } from 'react-router-dom'
import { CommonTable, DetailContent, DetailTitle, Page } from '../common';
import RequestUtil from '../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import { supplierMngt, supplierMngt1, AddEditDetail } from "./supplier-mngt.json"
import ApplicationContext from "../../configuration/ApplicationContext"
import { Key } from 'rc-select/lib/interface/generator';
// import styles from './confirm.module.less';

export default function SupplierMngt(): React.ReactNode {
    //供应商类型
    const invoiceTypeEnum = (ApplicationContext.get().dictionaryOption as any)["144"].map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))
    //质量保证体系
    const invoiceTypeEnum1 = (ApplicationContext.get().dictionaryOption as any)["145"].map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))
    //主要供货产品
    const invoiceTypeEnum2 = (ApplicationContext.get().dictionaryOption as any)["148"].map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))
    const [refresh, setRefresh] = useState<boolean>(true);
    const [filterValue, setFilterValue] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisible1, setIsModalVisible1] = useState(false);
    const [isModalVisible2, setIsModalVisible2] = useState(false);
    const [columnsData, setColumnsData] = useState([]);
    const [obj, setObj] = useState<any>({});
    const [obj1, setObj1] = useState<any>({});
    const [bankAccount, setBankAccount] = useState("");//开户账号
    const [bankDeposit, setBankDeposit] = useState("");//开户行
    const [contactMan, setContactMan] = useState("");//联系人
    const [contactManTel, setContactManTel] = useState("");//联系人电话
    const [description, setDescription] = useState("");//备注
    const [qualityAssurance, setQualityAssurance] = useState(0);//质量保证体系
    const [supplierCode, setSupplierCode] = useState("");//供应商编号
    const [supplierName, setSupplierName] = useState("");//供应商名称
    const [supplierType, setSupplierType] = useState(0);//供应商类型
    const [supplyProducts, setSupplyProducts] = useState("");//供货产品

    const onFilterSubmit = (value: any) => {
        if (value.statusUpdateTime) {
            const formatDate = value.statusUpdateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.updateStatusTimeStart = formatDate[0] + ' 00:00:00';
            value.updateStatusTimeEnd = formatDate[1] + ' 23:59:59';
            delete value.statusUpdateTime
        }
        setFilterValue(value)
        return value
    }
    const add = () => {
        setIsModalVisible1(true)
    }
    const handleCancel1 = () => {
        setIsModalVisible1(false);
    };
    const save1 = async (bankAccount: string, bankDeposit: string, contactMan: string, contactManTel: string, description: string, qualityAssurance: number, supplierCode: string, supplierName: string, supplierType: number, supplyProducts: string) => {
        const result: { [key: string]: any } = await RequestUtil.post(`/tower-supply/supplier`, { bankAccount, bankDeposit, contactMan, contactManTel, description, qualityAssurance, supplierCode, supplierName, supplierType, supplyProducts }, { "Content-Type": "application/json" })
        console.log(result);
    }
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const save = async (bankAccount: string, bankDeposit: string, contactMan: string, contactManTel: string, description: string, qualityAssurance: number, supplierCode: string, supplierName: string, supplierType: number, supplyProducts: string) => {
        const result: { [key: string]: any } = await RequestUtil.put(`/tower-supply/supplier`, { bankAccount, bankDeposit, contactMan, contactManTel, description, qualityAssurance, supplierCode, supplierName, supplierType, supplyProducts }, { "Content-Type": "application/json" })
        console.log(result);
    }
    const edit = (record: any) => {
        setIsModalVisible(true)
        console.log(record);
        setObj1(record);
    }
    const detail = async (supplierId: string) => {
        ///tower-supply/supplier/{supplierId}
        setIsModalVisible2(true);
        const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/supplier/${supplierId}`)
        console.log(result);
        setObj(result);
    }
    const handleCancel2 = () => {
        setIsModalVisible2(false);
    };
    const handleChange = (value: any) => {
        console.log(`selected ${value}`);
        setSupplierType(value);
    }
    const handleChange1 = (value: any) => {
        console.log(`selected ${value}`);
        setQualityAssurance(value);
    }
    const handleChange2 = (value: any) => {
        console.log(value.toString());
        setSupplyProducts(value.toString());
    }
    const buttons: {} | null | undefined = [
        <div>
            <Button onClick={() => { handleCancel() }}>关闭</Button>
            <Button onClick={() => { save(bankAccount, bankDeposit, contactMan, contactManTel, description, qualityAssurance, supplierCode, supplierName, supplierType, supplyProducts) }}>保存</Button>
        </div>
    ]
    const buttons1: {} | null | undefined = [
        <div>
            <Button onClick={() => { handleCancel1() }}>关闭</Button>
            <Button onClick={() => { save1(bankAccount, bankDeposit, contactMan, contactManTel, description, qualityAssurance, supplierCode, supplierName, supplierType, supplyProducts) }}>保存</Button>
        </div>
    ]
    const buttons2: {} | null | undefined = [
        <div>
            <Button onClick={() => { handleCancel2() }}>关闭</Button>
        </div>
    ]
    //调接口删除
    const handleDelete = async (supplierId: number) => {
        ///tower-supply/supplier
        // console.log(id);
        const result: { [key: string]: any } = await RequestUtil.delete(`/tower-supply/supplier?supplierId=${supplierId}`, {});
        console.log(result);
        message.success('删除成功');
    }
    return <>
        <Page
            path="/tower-supply/supplier"
            columns={[
                {
                    title: "序号",
                    dataIndex: "index",
                    render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                }
                ,
                ...supplierMngt,
                {
                    title: "操作",
                    dataIndex: "opration",
                    render: (_: any, record: any) => {
                        // console.log(record);
                        return <>
                            <Button type="link" onClick={() => edit(record)}>编辑</Button>
                            <Button type="link" onClick={() => { detail(record.id) }}>详情</Button>
                            <Button type="link" onClick={() => handleDelete(record.id)}>删除</Button>
                        </>
                    }
                }
            ]}
            refresh={refresh}
            extraOperation={<div><Button type="primary">导出</Button><Button onClick={() => add()}>创建</Button></div>}
            filterValue={filterValue}
            onFilterSubmit={onFilterSubmit}
            searchFormItems={[
                {
                    name: 'supplierType',
                    label: '供应商类型',
                    children: <Select style={{ width: "150px" }} defaultValue="请选择">
                        <Select.Option value={1} key={1}>原材料</Select.Option>
                        <Select.Option value={2} key={2}>辅料</Select.Option>
                        <Select.Option value={2} key={2}>设备</Select.Option>
                    </Select>
                },
                {
                    name: 'supplyProducts',
                    label: '供货产品',
                    children: <Select style={{ width: "150px" }} defaultValue="请选择">
                        <Select.Option value={1} key={1}>角钢</Select.Option>
                        <Select.Option value={2} key={2}>钢板</Select.Option>
                    </Select>
                },
                {
                    name: 'qualityAssurance',
                    label: '质量保证体系',
                    children: <Select style={{ width: "150px" }} defaultValue="请选择">
                        <Select.Option value={1} key={1}>角钢</Select.Option>
                        <Select.Option value={2} key={2}>钢板</Select.Option>
                    </Select>
                },
                {
                    name: 'fuzzyMsg',
                    label: '查询',
                    children: <Input maxLength={200} />
                },
            ]}
        />
        <Modal width="700px" title="编辑" visible={isModalVisible} footer={buttons} onCancel={handleCancel}>
            <Descriptions title="供应商基础信息" bordered column={2} labelStyle={{ textAlign: 'center' }}>
                <Descriptions.Item label="供应商编号"><input placeholder={obj1.supplierCode} style={{ border: "none", outline: "none" }} value={supplierCode} onChange={(e) => { setSupplierCode(e.target.value) }} /></Descriptions.Item>
                <Descriptions.Item label="供应商名称 *"><input placeholder={obj1.supplierName} style={{ border: "none", outline: "none" }} value={supplierName} onChange={(e) => { setSupplierName(e.target.value) }} /></Descriptions.Item>
                <Descriptions.Item label="供应商类型 *">
                    <Select defaultValue={obj1.supplierType} style={{ width: 120 }} bordered={false} onChange={handleChange}>
                        {
                            invoiceTypeEnum.map((item: any) => {
                                return <Select.Option value={item.value}>{item.label}</Select.Option>
                            })
                        }
                    </Select>
                </Descriptions.Item>
                <Descriptions.Item label="质量保证体系 *">
                    <Select defaultValue={obj1.qualityAssurance} style={{ width: 120 }} bordered={false} onChange={handleChange1}>
                        {
                            invoiceTypeEnum1.map((item: any) => {
                                return <Select.Option value={item.value}>{item.label}</Select.Option>
                            })
                        }
                    </Select>
                </Descriptions.Item>
                <Descriptions.Item label="联系人 *"><input placeholder={obj1.contactMan} style={{ border: "none", outline: "none" }} value={contactMan} onChange={(e) => { setContactMan(e.target.value) }} /></Descriptions.Item>
                <Descriptions.Item label="联系电话 *"><input placeholder={obj1.contactManTel} style={{ border: "none", outline: "none" }} value={contactManTel} onChange={(e) => { setContactManTel(e.target.value) }} /></Descriptions.Item>
                <Descriptions.Item label="主要供货产品 *">
                    <Select mode="tags" defaultValue={obj1.supplyProducts} style={{ width: 120 }} bordered={false} onChange={handleChange2}>
                        {
                            invoiceTypeEnum2.map((item: { value: Key; label: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }) => {
                                return <Select.Option value={item.value}>{item.label}</Select.Option>
                            })
                        }
                    </Select></Descriptions.Item>
                <Descriptions.Item label="备注"><input placeholder={obj1.description} style={{ border: "none", outline: "none" }} value={description} onChange={(e) => { setDescription(e.target.value) }} /></Descriptions.Item>
            </Descriptions>
            <Descriptions title="供应商账户信息" bordered column={2} labelStyle={{ textAlign: 'center' }}>
                <Descriptions.Item label="开户银行 *"><input placeholder={obj1.bankDeposit} style={{ border: "none", outline: "none" }} value={bankDeposit} onChange={(e) => { setBankDeposit(e.target.value) }} /></Descriptions.Item>
                <Descriptions.Item label="银行账号 *"><input placeholder={obj1.bankAccount} style={{ border: "none", outline: "none" }} value={bankAccount} onChange={(e) => { setBankAccount(e.target.value) }} /></Descriptions.Item>
            </Descriptions>
            <DetailContent>
                <DetailTitle title="操作信息" />
                <CommonTable
                    columns={[
                        ...AddEditDetail
                    ]}
                    dataSource={columnsData}
                />
            </DetailContent>
        </Modal>
        <Modal width="800px" title="创建" visible={isModalVisible1} footer={buttons1} onCancel={handleCancel1}>
            <Descriptions title="供应商基础信息" bordered column={2} labelStyle={{ textAlign: 'center' }}>
                <Descriptions.Item label="供应商编号"><input style={{ border: "none", outline: "none" }} value={supplierCode} onChange={(e) => { setSupplierCode(e.target.value) }} /></Descriptions.Item>
                <Descriptions.Item label="供应商名称 *"><input placeholder='请输入' style={{ border: "none", outline: "none" }} value={supplierName} onChange={(e) => { setSupplierName(e.target.value) }} /></Descriptions.Item>
                <Descriptions.Item label="供应商类型 *">
                    <Select defaultValue="请选择" style={{ width: 120 }} bordered={false} onChange={handleChange}>
                        {
                            invoiceTypeEnum.map((item: any) => {
                                return <Select.Option value={item.value}>{item.label}</Select.Option>
                            })
                        }
                    </Select>
                </Descriptions.Item>
                <Descriptions.Item label="质量保证体系 *">
                    <Select defaultValue="请选择" style={{ width: 120 }} bordered={false} onChange={handleChange1}>
                        {
                            invoiceTypeEnum1.map((item: any) => {
                                return <Select.Option value={item.value}>{item.label}</Select.Option>
                            })
                        }
                    </Select>
                </Descriptions.Item>
                <Descriptions.Item label="联系人 *"><input style={{ border: "none", outline: "none" }} value={contactMan} onChange={(e) => { setContactMan(e.target.value) }} /></Descriptions.Item>
                <Descriptions.Item label="联系电话 *"><input style={{ border: "none", outline: "none" }} value={contactManTel} onChange={(e) => { setContactManTel(e.target.value) }} /></Descriptions.Item>
                <Descriptions.Item label="主要供货产品 *">
                    <Select mode="tags" style={{ width: 120 }} bordered={false} onChange={handleChange2}>
                        {
                            invoiceTypeEnum2.map((item: { value: Key; label: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }) => {
                                return <Select.Option value={item.value}>{item.label}</Select.Option>
                            })
                        }
                    </Select></Descriptions.Item>
                <Descriptions.Item label="备注"><input style={{ border: "none", outline: "none" }} value={description} onChange={(e) => { setDescription(e.target.value) }} /></Descriptions.Item>
            </Descriptions>
            {/* <BaseInfo
                columns={[
                    ...supplierMngt1
                ]}
                form={form}
                dataSource={{}}
                edit
                col={2}
            /> */}
            <Descriptions title="供应商账户信息" bordered column={2} labelStyle={{ textAlign: 'center' }}>
                <Descriptions.Item label="开户银行 *"><input style={{ border: "none", outline: "none" }} value={bankDeposit} onChange={(e) => { setBankDeposit(e.target.value) }} /></Descriptions.Item>
                <Descriptions.Item label="银行账号 *"><input style={{ border: "none", outline: "none" }} value={bankAccount} onChange={(e) => { setBankAccount(e.target.value) }} /></Descriptions.Item>
            </Descriptions>
            <DetailContent>
                <DetailTitle title="操作信息" />
                <CommonTable
                    columns={[
                        ...AddEditDetail
                    ]}
                    dataSource={columnsData}
                />
            </DetailContent>
        </Modal>
        <Modal width="700px" title="详情" visible={isModalVisible2} footer={buttons2} onCancel={handleCancel2}>
            <Descriptions title="供应商基础信息" bordered column={2} labelStyle={{ textAlign: 'center' }}>
                <Descriptions.Item label="供应商编号">{obj.supplierCode}</Descriptions.Item>
                <Descriptions.Item label="供应商名称">{obj.supplierName}</Descriptions.Item>
                <Descriptions.Item label="供应商类型">{obj.supplierTypeName}</Descriptions.Item>
                <Descriptions.Item label="质量保证体系">{obj.qualityAssuranceName}</Descriptions.Item>
                <Descriptions.Item label="联系人">{obj.contactMan}</Descriptions.Item>
                <Descriptions.Item label="联系电话">{obj.contactManTel}</Descriptions.Item>
                <Descriptions.Item label="主要供货产品">{obj.supplyProductsName}</Descriptions.Item>
                <Descriptions.Item label="备注">{obj.description}</Descriptions.Item>
            </Descriptions>
            <Descriptions title="供应商账户信息" bordered column={2} labelStyle={{ textAlign: 'center' }}>
                <Descriptions.Item label="开户银行">{obj.bankDeposit}</Descriptions.Item>
                <Descriptions.Item label="银行账号">{obj.bankAccount}</Descriptions.Item>
            </Descriptions>
            <DetailContent>
                <DetailTitle title="操作信息" />
                <CommonTable
                    columns={[
                        ...AddEditDetail
                    ]}
                    dataSource={columnsData}
                />
            </DetailContent>
        </Modal>
    </>
}