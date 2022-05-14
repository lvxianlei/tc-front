/**
 * 查看保函申请
 */
 import React, { useRef, useState } from 'react';
 import { Modal, Form, Button } from 'antd';
import { BaseInfo, CommonTable, DetailTitle, PopTableContent } from '../../common';
import {
    applicationdetails
} from "./CreatePlan.json";
import "./CreatePlan.less";

const materialList = {
    "title": "原材料",
    "dataIndex": "materialName",
    "type": "popTable",
    "selectType": "checkbox",
    "path": "/tower-system/material",
    "width": 1011,
    "value": "materialName",
    "dependencies": true,
    "readOnly": true,
    "columns": [
        {
            "title": "类别",
            "dataIndex": "bigCategoryName",
            "search": true
        },
        {
            "title": "类型",
            "dataIndex": "materialCategoryName"
        },
        {
            "title": "物料编号",
            "dataIndex": "materialCode",
            "search": true
        },
        {
            "title": "品名",
            "dataIndex": "materialName"
        },
        {
            "title": "快捷码",
            "dataIndex": "shortcutCode"
        },
        {
            "title": "标准",
            "dataIndex": "standardName"
        },
        {
            "title": "材料",
            "dataIndex": "rowMaterial"
        },
        {
            "title": "材质",
            "dataIndex": "structureTexture"
        },
        {
            "title": "规格",
            "dataIndex": "structureSpec"
        }
    ]
}
 
 export default function CreatePlan(props: any): JSX.Element {
    const [addCollectionForm] = Form.useForm();
    const [visible, setVisible] = useState<boolean>(false)
    const [value, setValue] = useState<any[]>([]);
    const handleChange = (event: any) => {
        console.log(event, "============>>>>")
        setValue(event);
    }
    const handleOk = () => {
        setVisible(false)
    }
    return (
        <Modal
            title={'创建采购计划'}
            visible={props.visible}
            onCancel={props?.handleCreate}
            maskClosable={false}
            width={1100}
            footer={[
                <Button key="back" onClick={props?.handleCreate}>
                    关闭
                </Button>,
                <Button type="primary" onClick={props?.handleCreate}>
                    创建
                </Button>
            ]}
        >
        <DetailTitle title="基本信息" />
        <BaseInfo
            form={addCollectionForm}
            edit
            dataSource={[]}
            col={4}
            classStyle="baseInfo"
            columns={[
                {
                    "dataIndex": "guaranteeNumber",
                    "title": "采购类型",
                    "type": "select",
                    "rules": [
                        {
                            "required": true,
                            "message": "请选择是否交回原件"
                        }
                    ],
                    "enum": [
                        {
                            "value": 1,
                            "label": "是"
                        },
                        {
                            "value": 0,
                            "label": "否"
                        }
                    ]
                }
            ]}
        />
        <DetailTitle title="原材料明细" />
        <div className='btnWrapper'>
            <Button type='primary' ghost style={{marginRight: 8}}  onClick={() => setVisible(true)}>添加</Button>
            <Button type='primary' ghost>清空</Button>
        </div>
        <CommonTable columns={[
            {
                key: 'index',
                title: '序号',
                dataIndex: 'index',
                fixed: "left",
                width: 50,
                render: (_a: any, _b: any, index: number): React.ReactNode => {
                    return (
                        <span>
                            {index + 1}
                        </span>
                    )
                }
            },
            ...applicationdetails,
            {
                title: "操作",
                dataIndex: "opration",
                fixed: "right",
                width: 60,
                render: (_: any, record: any) => {
                    return (
                        <>
                            <Button type="link" className="btn-operation-link">移除</Button>
                        </>
                    )
                }
            }
        ]}
            dataSource={[]}
        />
        <Modal width={1100} title={`选择原材料明细`} destroyOnClose
            visible={visible}
            onOk={handleOk}
            onCancel={() => setVisible(false)}
        >
            <PopTableContent data={materialList as any} value={{
                id: "",
                records: value,
                value: ""
            }} onChange={handleChange} />
        </Modal>
    </Modal>
    )
 }