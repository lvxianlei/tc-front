/**
 * 原材料盘点详情
 */
import React, { useState } from 'react';
import { Modal, Form, Button, message } from 'antd';
import { BaseInfo, CommonTable, DetailTitle } from '../../common';
import {
    material
} from "./CreatePlan.json";
import "./CreatePlan.less";
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';

export default function OverView(props: any): JSX.Element {
    const [addCollectionForm] = Form.useForm();

    const { run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resove, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-supply/materialPurchasePlan`, data)
            message.success("创建成功！");
            props?.handleCreate({ code: 1 })
            resove(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    return (
        <Modal
            title={'盘点单详情'}
            visible={props.visible}
            onCancel={() => {
                props?.handleCreate();
            }}
            maskClosable={false}
            width={1100}
            footer={[
                <Button key="back" onClick={() => {
                    props?.handleCreate();
                }}>
                    取消
                </Button>,
                <Button key="create" type="primary">
                    完成盘点
                </Button>,
                <Button key="create" type="primary">
                    关闭
                </Button>
            ]}
        >
            <DetailTitle title="基本信息" />
            <BaseInfo
                form={addCollectionForm}
                dataSource={[]}
                col={4}
                classStyle="baseInfo"
                columns={[
                    {
                        "dataIndex": "purchaseType",
                        "title": "盘点单号",
                    },
                    {
                        "dataIndex": "purchaseType",
                        "title": "盘点仓库",
                        "type": "select",
                        "rules": [
                            {
                                "required": true,
                                "message": "请选择盘点仓库"
                            }
                        ],
                        "enum": [
                            {
                                "value": 2,
                                "label": "库存采购"
                            }
                        ]
                    }
                ]}
            />
            <DetailTitle title="入库明细" style={{marginTop: 16}}/>
            <CommonTable
                rowKey={"id"}
                style={{ padding: "0" }}
                columns={material}
                pagination={false}
                dataSource={[]} />
        </Modal>
    )
}