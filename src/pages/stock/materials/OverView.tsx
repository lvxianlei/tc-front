/**
 * 原材料盘点详情
 */
import React, { useEffect, useState } from 'react';
import { Modal, Form, Button, message } from 'antd';
import { BaseInfo, CommonTable, DetailTitle } from '../../common';
import {
    material
} from "./CreatePlan.json";
import "./CreatePlan.less";
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';

interface DetailInterface {
    visible: boolean,
    handleCreate: (options: any) => void
    id?: string
    stockTakingNumber: string
    warehouseName: string
    warehouseId: string
    takingNumberStatus: number | string
}

export default function OverView(props: DetailInterface): JSX.Element {
    const [addCollectionForm] = Form.useForm();

    const { run, data: detailData } = useRequest<{ [key: string]: any }>(() => new Promise(async (resove, reject) => {
        try {
            const result: any[] = await RequestUtil.get(`/tower-storage/stockTaking/detail/${props.id}`)
            resove(result || [])
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { run: stockTakingRun } = useRequest<{ [key: string]: any }>(() => new Promise(async (resove, reject) => {
        try {
            detailData?.forEach((item: any) => {
                if (item.id) {
                    // 删除id属性
                    delete item.id;
                }
            })
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-storage/stockTaking/finish`, {
                stockTakingDetailDTOList: detailData,
                id: props.id,
                warehouseName: props.warehouseName,
                warehouseId: props.warehouseId,
                stockTakingNumber: props.stockTakingNumber
            })
            message.success("完成盘点！");
            props?.handleCreate({ code: 1 })
            resove(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    useEffect(() => {
        if (props.visible) {
            run()
        }
    }, [props.visible])

    return (
        <Modal
            title={'盘点单详情'}
            visible={props.visible}
            onCancel={() => {
                props?.handleCreate({code: 0});
            }}
            maskClosable={false}
            width={1100}
            footer={[
                <Button key="create" type="primary" disabled={(+props.takingNumberStatus) !== 0 } onClick={() => stockTakingRun({})}>
                    完成盘点
                </Button>,
                <Button key="back" onClick={() => {
                    props?.handleCreate({code: 0});
                }}>
                    关闭
                </Button>
            ]}
        >
            <DetailTitle title="基本信息" />
            <BaseInfo
                form={addCollectionForm}
                dataSource={{
                    ...props
                }}
                col={4}
                classStyle="baseInfo"
                columns={[
                    {
                        "dataIndex": "stockTakingNumber",
                        "title": "盘点单号",
                    },
                    {
                        "dataIndex": "warehouseName",
                        "title": "盘点仓库"
                    }
                ]}
            />
            <DetailTitle title="入库明细" style={{marginTop: 16}}/>
            <CommonTable
                rowKey={"id"}
                style={{ padding: "0" }}
                columns={[
                    ...material.map((item: any) => {
                        if (item.dataIndex === "profitAndLossNum") {
                            return ({
                                title: item.title,
                                dataIndex: item.dataIndex,
                                width: 50,
                                render: (_: any, record: any): React.ReactNode => {
                                    return (
                                        <span>
                                            {record.profitAndLossNum + "  "}
                                        </span>)
                                }
                            })
                        }
                        if (item.dataIndex === "materialStandard") {
                            return ({
                                title: item.title,
                                dataIndex: item.dataIndex,
                                width: 50,
                                render: (_: any, record: any): React.ReactNode => {
                                    return (
                                        <span>
                                            {record.materialStandardName }
                                        </span>)
                                }
                            })
                        }
                        return item;
                    })
                ]}
                pagination={false}
                dataSource={(detailData as any) || []} />
        </Modal>
    )
}