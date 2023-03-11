/**
 * 详情
 */
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Space } from 'antd';
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil';
import { unloadModeOptions, settlementModeOptions } from "../../../configuration/DictionaryOptions"
import { BaseInfo, DetailTitle, CommonTable } from '../../common';
import { baseInfo, freightInfo, handlingChargesInfo, goodsDetail } from './Detail.json';
interface OverViewProps {
    visible?: boolean
    acceptStatus?: number
    id?: string
    onCancel: () => void
    onOk: () => void
}
interface TotalState {
    num?: string
    balanceTotalWeight?: string
    totalTaxPrice?: string
    totalUnTaxPrice?: string
}
export default function Detail(props: OverViewProps): JSX.Element {
    const [addCollectionForm] = Form.useForm();

    // 收货单基础信息
    const [baseInfomation, setBaseInfomation] = useState({});
    const [total, setTotal] = useState<TotalState>({});
    const { run: getUser, data: userData } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/receiveStock/${id}`);
            setBaseInfomation(result);
            const seletTotal = result?.lists.reduce((total: TotalState, current: any) => ({
                num: parseFloat(total?.num || "0") + parseFloat(current?.num),
                balanceTotalWeight: (parseFloat(total?.balanceTotalWeight || "0") + parseFloat(current?.balanceTotalWeight)).toFixed(5),
                totalTaxPrice: (parseFloat(total?.totalTaxPrice || "0") + parseFloat(current?.totalTaxPrice)).toFixed(2),
                totalUnTaxPrice: (parseFloat(total?.totalUnTaxPrice || "0") + parseFloat(current?.totalUnTaxPrice)).toFixed(2)
            }), {})
            setTotal(seletTotal)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    // 获取详情数据
    useEffect(() => {
        getUser(props.id)
    }, [props.id])

    return (
        <Modal
            title={'详情'}
            visible={props.visible}
            onCancel={props?.onCancel}
            maskClosable={false}
            width={1011}
            destroyOnClose={true}
            footer={[
                <Button key="back" onClick={props?.onCancel}>
                    关闭
                </Button>
            ]}
        >
            <DetailTitle title="收货单基础信息" />
            <BaseInfo
                form={addCollectionForm}
                dataSource={baseInfomation}
                col={2}
                columns={baseInfo.map((item: any) => {
                    switch (item.dataIndex) {
                        case "unloadMode":
                            return ({
                                ...item,
                                enum: unloadModeOptions?.map((item: any) => ({ value: item.id, label: item.name }))
                            })
                        case "settlementMode":
                            return ({
                                ...item,
                                enum: settlementModeOptions?.map((item: any) => ({ value: item.id, label: item.name }))
                            })
                        default:
                            return item
                    }
                })}
            />
            {/* <DetailTitle title="运费信息" />
            <BaseInfo
                form={addCollectionForm}
                dataSource={baseInfomation}
                col={3}
                columns={[...freightInfo]}
            />
            <DetailTitle title="装卸费信息" />
            <BaseInfo
                form={addCollectionForm}
                dataSource={baseInfomation}
                col={3}
                columns={[...handlingChargesInfo]}
            /> */}
            <DetailTitle title="货物明细" />
            <Space style={{ color: "red" }}>
                <div><span>数量合计：</span><span>{total.num || "0"}</span></div>
                <div><span>重量合计(吨)：</span><span>{total.balanceTotalWeight || "0"}</span></div>
                <div><span>含税金额合计(元)：</span><span>{total.totalTaxPrice || "0"}</span></div>
                <div><span>不含税金额合计(元)：</span><span>{total.totalUnTaxPrice || "0"}</span></div>
            </Space>
            <CommonTable columns={[
                {
                    key: 'index',
                    title: '序号',
                    dataIndex: 'index',
                    fixed: "left",
                    width: 50,
                    render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                },
                ...goodsDetail.map((item:any)=>{
                    return({
                        ...item
                    })
                })
            ]} dataSource={userData?.lists || []} />
        </Modal>
    )
}