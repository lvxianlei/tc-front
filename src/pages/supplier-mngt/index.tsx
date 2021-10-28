import React, { useState } from 'react'
import { Space, Input, DatePicker, Select, Button, Modal, Form, Popconfirm, Row, Col, TreeSelect, message } from 'antd'
import { useHistory } from 'react-router-dom'
import { Page } from '../common';
import RequestUtil from '../../utils/RequestUtil';
import moment from 'moment';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import { TreeNode } from 'antd/lib/tree-select';
import useRequest from '@ahooksjs/use-request';
import { supplierMngt } from "./supplier-mngt.json"
// import styles from './confirm.module.less';

export default function SupplierMngt(): React.ReactNode {
    const [refresh, setRefresh] = useState<boolean>(false);
    const [department, setDepartment] = useState<any | undefined>([]);
    const [filterValue, setFilterValue] = useState({});
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
    const add=()=>{
        history.push(`/supplier-mngt/supplierAdd`);
    }
    const edit=()=>{
        history.push(`/supplier-mngt/supplierEdit`);
    }
    const detail=()=>{
        history.push(`/supplier-mngt/supplierDetail`);
    }
    //调接口删除
    const handleDelete = (id: string) => {
        Modal.confirm({
            title: "确定删除本条消息吗",
            onOk: async () => new Promise(async (resove, reject) => {
                try {
                    // const result = await deleteRun()
                    message.success("删除成功...")
                    // resove(result)
                    history.goBack()
                } catch (error) {
                    reject(error)
                }
            })
        })
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
                            <Button type="link" onClick={() => history.push(`/project/invoicing/detail/${record.id}`)}>编辑</Button>
                            <Button type="link" onClick={() => history.push(`/project/invoicing/edit/${record.id}`)}>详情</Button>
                            <Button type="link" onClick={() => handleDelete(record.id)}>删除</Button>
                        </>
                    }
                }
            ]}
            refresh={refresh}
            extraOperation={<Button type="primary">导出</Button>}
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
        <Button onClick={()=>{
            add();
        }}>添加</Button>
        <Button onClick={()=>{
            edit()
        }}>编辑</Button>
        <Button onClick={()=>{
            detail()
        }}>详情</Button>
    </>
}