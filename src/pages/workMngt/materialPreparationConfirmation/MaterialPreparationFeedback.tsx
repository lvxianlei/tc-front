/**
 * 备料反馈
 * author: mschange
 * time: 2022/05/06
 */
import React from 'react';
import { Modal, Button, Input } from 'antd';
import { CommonTable, DetailTitle } from '../../common';
import {
    Detail
} from "./materialPreparation";
import {
    MaterialPreparationColumns
} from "./buyBurdening.json";
import "./OverView.less"

const { TextArea } = Input;

export default function MaterialPreparationFeedback(props: Detail): JSX.Element {

    return (
        <Modal
            title={'备料反馈'}
            visible={props.visible}
            onCancel={props?.handleCallBack}
            maskClosable={false}
            width={1100}
            className="OverViewDetail"
            footer={[
                <Button key="back" style={{marginRight: 16}} onClick={props?.handleCallBack}>
                    取消
                </Button>,
                <Button type="primary" onClick={props?.handleCallBack}>
                    确认反馈
                </Button>
            ]}
        >
            <div className='titleWrapper'>
                <span className='text'>下达单号：</span>
                <span className='value'>XDDH-20220101-123</span>
                <span className='text'>计划号：</span>
                <span className='value'>SH-20210101-002</span>
                <span className='text'>塔型：</span>
                <span className='value'>TX-A025</span>
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
                dataSource={[]}
                pagination={false}
            />
            <p className='title'>备料反馈：</p>
            <TextArea rows={4} placeholder="请输入备料反馈" maxLength={600} />
        </Modal>
    )
}