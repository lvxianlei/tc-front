/**
 * 备料反馈
 * author: mschange
 * time: 2022/05/06
 */
import React, { useEffect, useState } from 'react';
import { Modal, Button, Input, message } from 'antd';
import { CommonTable, DetailTitle } from '../../common';
import {
    Detail
} from "./materialPreparation";
import {
    MaterialPreparationColumns
} from "./buyBurdening.json";
import "./OverView.less"
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';

const { TextArea } = Input;

export default function MaterialPreparationFeedback(props: Detail): JSX.Element {
    const [textValue, setTextValue] = useState<string>("");
    useEffect(() => {
        if (props.visible) {
            run()
        }
    }, [props.visible])

    // 获取详情列表
    const { loading, run, data } = useRequest(() => new Promise(async (resolve, reject) => {
        try {
            const result = await RequestUtil.get(`/tower-supply/materialConfirm/issuedNumber/${props.batcherId}`)
            resolve(result || {});
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    // 确认反馈
    const { loading: materialConfirmLoding, run: materialConfirmRun } = useRequest(() => new Promise(async (resolve, reject) => {
        console.log(textValue, "textValue")
        try {
            const v = {
                description: textValue,
                id: props.batcherId,
                stockDetail: (data as any)?.materialConfirmInfoDetails
            }
            const result = await RequestUtil.put(`/tower-supply/materialConfirm/issuedNumber/confirm`, v)
            console.log(result, "=====>>>")
            message.success("反馈成功！");
            props?.handleCallBack();
            resolve(result || {});
        } catch (error) {
            reject(error)
        }
    }), { manual: true })
    
    return (
        <Modal
            title={'备料反馈'}
            visible={props.visible}
            onCancel={props?.handleCallBack}
            maskClosable={false}
            width={1100}
            className="OverViewDetail"
            footer={[
                props?.code === "1" ? 
                    <>
                        <Button key="back" style={{marginRight: 16}} onClick={props?.handleCallBack}>
                            取消
                        </Button>,
                        <Button type="primary" onClick={() => {
                            if (!textValue) {
                                message.error("请您输入备料反馈！");
                                return false;
                            }
                            materialConfirmRun();
                        }}>
                            确认反馈
                        </Button>
                    </>
                : <Button key="back" style={{marginRight: 16}} onClick={props?.handleCallBack}>
                    关闭
                </Button>
            ]}
        >
            <div className='titleWrapper'>
                <span className='text'>下达单号：</span>
                <span className='value'>{ (data as any)?.issuedNumber }</span>
                <span className='text'>计划号：</span>
                <span className='value'>{ (data as any)?.planNumber }</span>
                <span className='text'>塔型：</span>
                <span className='value'>{ (data as any)?.productCategoryName }</span>
            </div>
            <CommonTable
                columns={
                    [
                        {
                            title: "序号",
                            dataIndex: "index",
                            width: 50,
                            fixed: "left",
                            render: (_: any, _a: any, index) => <>{index + 1}</>
                        },
                        ...MaterialPreparationColumns
                    ]
                }
                dataSource={(data as any)?.materialConfirmInfoDetails || []}
                pagination={false}
            />
            <p className='title'>备料反馈：</p>
            <TextArea
                rows={4}
                placeholder="请输入备料反馈"
                value={textValue}
                maxLength={600}
                disabled={props?.code !== "1"}
                onChange={(e: any) => {
                    setTextValue(e.target.value)
                }}
            />
        </Modal>
    )
}