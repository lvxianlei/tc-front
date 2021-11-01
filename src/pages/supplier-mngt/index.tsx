import React, { useState } from 'react'
import { Space, Input, DatePicker, Select, Button, Modal, Form, Popconfirm, Row, Col, TreeSelect, message, Descriptions } from 'antd'
import { useHistory } from 'react-router-dom'
import { Page } from '../common';
import RequestUtil from '../../utils/RequestUtil';
import moment from 'moment';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import { TreeNode } from 'antd/lib/tree-select';
import useRequest from '@ahooksjs/use-request';
import { supplierMngt, AddEditDetail } from "./supplier-mngt.json"
// import styles from './confirm.module.less';

export default function SupplierMngt(): React.ReactNode {
    const [refresh, setRefresh] = useState<boolean>(false);
    const [department, setDepartment] = useState<any | undefined>([]);
    const [filterValue, setFilterValue] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisible1, setIsModalVisible1] = useState(false);
    const [isModalVisible2, setIsModalVisible2] = useState(false);
    const [materialCategoryId, setMaterialCategoryId] = useState("");
    const [supplierId, setSupplierId] = useState("");
    const [form] = Form.useForm();
    const history = useHistory();

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
<<<<<<< HEAD
    const add=()=>{
        history.push(`/supplier-mngt/supplierAdd`);
    }
    const edit=()=>{
        history.push(`/supplier-mngt/supplierEdit`);
    }
    const detail=()=>{
        history.push(`/supplier-mngt/supplierDetail`);
=======
    const add = () => {
        setIsModalVisible1(true)
    }
    const handleCancel1 = () => {
        setIsModalVisible1(false);
    };
    const save1 = async () => {
        const result: { [key: string]: any } = await RequestUtil.post(`/tower-supply/supplier`, {}, { "Content-Type": "application/json" })
        console.log(result);
    }
    const edit = () => {
        setIsModalVisible(true)
>>>>>>> f6e67334bc67f136e1815a950785e30a5bc7a317
    }
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const save = async (materialCategoryId: string, supplierId: string,) => {
        const result: { [key: string]: any } = await RequestUtil.put(`/tower-supply/supplier`, { materialCategoryId, supplierId }, { "Content-Type": "application/json" })
        console.log(result);
    }
    const detail = async (supplierId: string) => {
        ///tower-supply/supplier/{supplierId}
        setIsModalVisible(true)
        const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/supplier/${supplierId}`)
        console.log(result);
    }
    const handleCancel2 = () => {
        setIsModalVisible2(false);
    };
    const handleChange = (value: any) => {
        console.log(`selected ${value}`);
        // setDeptId(value);
    }
    const handleChange1 = (value: any) => {
        console.log(`selected ${value}`);
        // setDeptId(value);
    }
    const handleChange2 = (value: any) => {
        console.log(`selected ${value}`);
        // setDeptId(value);
    }
    const buttons: {} | null | undefined = [
        <div>
            <Button onClick={() => { handleCancel() }}>关闭</Button>
            <Button onClick={() => { save(materialCategoryId, supplierId) }}>保存</Button>
        </div>
    ]
    const buttons1: {} | null | undefined = [
        <div>
            <Button onClick={() => { handleCancel1() }}>关闭</Button>
            <Button onClick={() => { save1() }}>保存</Button>
        </div>
    ]
    const buttons2: {} | null | undefined = [
        <div>
            <Button onClick={() => { handleCancel2() }}>关闭</Button>
        </div>
    ]
    //调接口删除
    const handleDelete = async (id: string) => {
        ///tower-supply/supplier
        const result: { [key: string]: any } = await RequestUtil.delete(`/tower-supply/supplier`, { id })
        console.log(result);
    }
    return <>
        <Page
            path="/tower-supply/supplier"
            columns={[
                ...supplierMngt,
                {
                    title: "操作",
                    dataIndex: "opration",
                    render: (_: any, record: any) => {
                        console.log(record);
                        return <>
                            <Button type="link" onClick={() => setIsModalVisible(true)}>编辑</Button>
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
                <Descriptions.Item label="供应商编号">Zhou Maomao</Descriptions.Item>
                <Descriptions.Item label="供应商名称 *">Zhou Maomao</Descriptions.Item>
                <Descriptions.Item label="供应商类型 *">Zhou Maomao</Descriptions.Item>
                <Descriptions.Item label="质量保证体系 *">Zhou Maomao</Descriptions.Item>
                <Descriptions.Item label="联系人 *">Zhou Maomao</Descriptions.Item>
                <Descriptions.Item label="联系电话 *">Zhou Maomao</Descriptions.Item>
                <Descriptions.Item label="主要供货产品 *">Zhou Maomao</Descriptions.Item>
                <Descriptions.Item label="备注">Zhou Maomao</Descriptions.Item>
            </Descriptions>
            <Descriptions title="供应商账户信息" bordered column={2} labelStyle={{ textAlign: 'center' }}>
                <Descriptions.Item label="开户银行 *">Zhou Maomao</Descriptions.Item>
                <Descriptions.Item label="银行账号 *">Zhou Maomao</Descriptions.Item>
            </Descriptions>
            <Page
                path="/tower-supply/supplier"
                columns={
                    [
                        ...AddEditDetail
                    ]
                }
                searchFormItems={[]}
            />
        </Modal>
        <Modal width="800px" title="创建" visible={isModalVisible1} footer={buttons1} onCancel={handleCancel1}>
            <Descriptions title="供应商基础信息" bordered column={2} labelStyle={{ textAlign: 'center' }}>
                <Descriptions.Item label="供应商编号"><input style={{ border: "none", outline: "none" }} /></Descriptions.Item>
                <Descriptions.Item label="供应商名称 *"><input placeholder='请输入' style={{ border: "none", outline: "none" }} /></Descriptions.Item>
                <Descriptions.Item label="供应商类型 *">
                    <Select defaultValue="请选择" style={{ width: 120 }} bordered={false} onChange={handleChange}>
                        <Select.Option value="1">Jack</Select.Option>
                        <Select.Option value="2">Lucy</Select.Option>
                        <Select.Option value="3">yiminghe</Select.Option>
                    </Select>
                </Descriptions.Item>
                <Descriptions.Item label="质量保证体系 *">
                    <Select defaultValue="请选择" style={{ width: 120 }} bordered={false} onChange={handleChange1}>
                        <Select.Option value="1">Jack</Select.Option>
                        <Select.Option value="2">Lucy</Select.Option>
                        <Select.Option value="3">yiminghe</Select.Option>
                    </Select>
                </Descriptions.Item>
                <Descriptions.Item label="联系人 *"><input style={{ border: "none", outline: "none" }} /></Descriptions.Item>
                <Descriptions.Item label="联系电话 *"><input style={{ border: "none", outline: "none" }} /></Descriptions.Item>
                <Descriptions.Item label="主要供货产品 *">
                    <Select defaultValue="lucy" style={{ width: 120 }} bordered={false} onChange={handleChange2}>
                        <Select.Option value="1">Jack</Select.Option>
                        <Select.Option value="2">Lucy</Select.Option>
                        <Select.Option value="3">yiminghe</Select.Option>
                    </Select></Descriptions.Item>
                <Descriptions.Item label="备注"><input style={{ border: "none", outline: "none" }} /></Descriptions.Item>
            </Descriptions>
            <Descriptions title="供应商账户信息" bordered column={2} labelStyle={{ textAlign: 'center' }}>
                <Descriptions.Item label="开户银行 *"><input style={{ border: "none", outline: "none" }} /></Descriptions.Item>
                <Descriptions.Item label="银行账号 *"><input style={{ border: "none", outline: "none" }} /></Descriptions.Item>
            </Descriptions>
            <Page
                path="/tower-supply/supplier"
                columns={
                    [
                        ...AddEditDetail
                    ]
                }
                searchFormItems={[]}
            />
        </Modal>
        <Modal width="700px" title="详情" visible={isModalVisible2} footer={buttons2} onCancel={handleCancel2}>
            <Descriptions title="供应商基础信息" bordered column={2} labelStyle={{ textAlign: 'center' }}>
                <Descriptions.Item label="供应商编号">Zhou Maomao</Descriptions.Item>
                <Descriptions.Item label="供应商名称">Zhou Maomao</Descriptions.Item>
                <Descriptions.Item label="供应商类型">Zhou Maomao</Descriptions.Item>
                <Descriptions.Item label="质量保证体系">Zhou Maomao</Descriptions.Item>
                <Descriptions.Item label="联系人">Zhou Maomao</Descriptions.Item>
                <Descriptions.Item label="联系电话">Zhou Maomao</Descriptions.Item>
                <Descriptions.Item label="主要供货产品">Zhou Maomao</Descriptions.Item>
                <Descriptions.Item label="备注">Zhou Maomao</Descriptions.Item>
            </Descriptions>
            <Descriptions title="供应商账户信息" bordered column={2} labelStyle={{ textAlign: 'center' }}>
                <Descriptions.Item label="开户银行">Zhou Maomao</Descriptions.Item>
                <Descriptions.Item label="银行账号">Zhou Maomao</Descriptions.Item>
            </Descriptions>
            <Page
                path="/tower-supply/supplier"
                columns={
                    [
                        ...AddEditDetail
                    ]
                }
                searchFormItems={[]}
            />
        </Modal>
        <Button onClick={() => {
            edit()
        }}>编辑</Button>
        {/* <Button onClick={() => {
            detail(supplierId)
        }}>详情</Button> */}
    </>
}