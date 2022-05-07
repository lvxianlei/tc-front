/**
 * 查看详情
 * author: mschange
 * time: 2022/05/06
 */
import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { CommonTable } from '../../common';
import {
    Detail
} from "./materialPreparation";
import {
    tableColumns
} from "./buyBurdening.json";
import MaterialPreparationFeedback from "./MaterialPreparationFeedback";
import "./OverView.less"
export default function OverViewDetail(props: Detail): JSX.Element {
    const [visible, setVisible] = useState<boolean>(false);
    // 关闭回调
    const handleCallBack = () => {
        setVisible(false);
    }
    return (
        <>
            <Modal
                title={'备料任务详情'}
                visible={props.visible}
                onCancel={props?.handleCallBack}
                maskClosable={false}
                width={1100}
                className="OverViewDetail"
                footer={[
                    <Button key="back" style={{marginRight: 16}} onClick={props?.handleCallBack}>
                        返回
                    </Button>,
                    <Button type="primary" onClick={props?.handleCallBack}>
                        确认反馈
                    </Button>
                ]}
            >
                <div className='titleWrapper'>
                    <span className='text'>合计：总件数：</span>
                    <span className='value'>4566</span>
                    <span className='text'>总重量（kg）：</span>
                    <span className='value'>22020.32</span>
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
                            ...tableColumns,
                            {
                                title: '操作',
                                width: 120,
                                fixed: "right",
                                dataIndex: 'operation',
                                render: (_: any, records: any) => (
                                    <>
                                        <Button type="link" className='btn-operation-link' onClick={() => {
                                            setVisible(true);
                                        }}>反馈</Button>
                                        <Button type="link" className='btn-operation-link' onClick={() => {
                                            setVisible(true);
                                        }}>查看</Button>
                                    </>
                                )
                            }
                        ]
                    }
                    key="id"
                    dataSource={[{batchNumber: "ewrrew"}]}
                    pagination={false}
                />
            </Modal>
            <MaterialPreparationFeedback
                visible={visible}
                handleCallBack={handleCallBack}
            />
        </>
        
    )
}