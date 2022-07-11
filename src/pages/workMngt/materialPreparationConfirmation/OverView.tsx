/**
 * 查看详情
 * author: mschange
 * time: 2022/05/06
 */
import React, { useEffect, useState } from 'react';
import { Modal, Button, Spin, message } from 'antd';
import { CommonTable } from '../../common';
import { Details } from "./materialPreparation";
import { tableColumns } from "./buyBurdening.json";
import MaterialPreparationFeedback from "./MaterialPreparationFeedback";
import "./OverView.less"
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
export default function OverViewDetail(props: Details): JSX.Element {
    const [visible, setVisible] = useState<boolean>(false);
    const [batcherId, setBatcherId] = useState<string>("");
    const [code, setCode] = useState<string>("1");
    // 关闭回调
    const handleCallBack = (res: any) => {
        if (res.code === 1) {
            run();
        }
        setVisible(false);
    }

    useEffect(() => {
        if (props.visible) {
            run()
        }
    }, [props.visible])

    // 返回
    const backClick = () => {
        if ((data as any).length < 1) {
            props?.handleCallBack();
            return false;
        }
        let flag = false;
        for (let i = 0; i < (data as any).length; i += 1) {
            if ((data as any)[i].feedStatus != 2) {
                flag = true;
            }
        }
        if (flag) {
            props?.handleCallBack();
            return false;
        }
        Modal.confirm({
            title: '反馈提醒',
            content: "所有下达单均已反馈，是否进行确认反馈？",
            onOk() {
                materialConfirmRun();
            },
            onCancel() {
                props?.handleCallBack();
            },
        });
    }

    const sureClick = () => {
        if ((data as any).length < 1) {
            message.error("暂无反馈项！")
            return false;
        }
        let flag = false;
        for (let i = 0; i < (data as any).length; i += 1) {
            if ((data as any)[i].feedStatus != 2) {
                flag = true;
            }
        }
        if (flag) {
            message.error("请全部反馈后进行确认反馈！")
            return false;
        }
        Modal.confirm({
            title: '反馈提醒',
            content: "所有下达单均已反馈，是否进行确认反馈？",
            onOk() {
                materialConfirmRun();
            },
            onCancel() {
                props?.handleCallBack();
            },
        });
    }

    // 获取详情数据
    const { loading, run, data } = useRequest(() => new Promise(async (resolve, reject) => {
        try {
            const result = await RequestUtil.get(`/tower-supply/materialConfirm/detail/${props.chooseId}`)
            resolve(result || []);
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    // 确认反馈
    const { loading: materialConfirmLoading, run: materialConfirmRun } = useRequest(() => new Promise(async (resolve, reject) => {
        try {
            const result = await RequestUtil.put(`/tower-supply/materialConfirm/confirm/finish/${props.chooseId}`)
            message.success("反馈成功！")
            props?.handleCallBack();
            resolve(result || []);
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    return (
        <Spin spinning={materialConfirmLoading || loading}>
            <Modal
                title={'备料任务详情'}
                visible={props.visible}
                onCancel={props?.handleCallBack}
                maskClosable={false}
                width={1100}
                className="OverViewDetail"
                footer={props?.materialConfirmStatus !== 0 ?
                    [<Button key="back" style={{ marginRight: 16 }} onClick={() => props?.handleCallBack()} >
                        关闭
                    </Button>] :
                    [<Button key="back" style={{ marginRight: 16 }} onClick={() => {
                        backClick()
                    }}>
                        返回
                    </Button>,
                    <Button type="primary" onClick={() => {
                        sureClick();
                    }}>
                        确认反馈
                    </Button>]
                }
            >
                <div className='titleWrapper'>
                    <span className='text'>合计：总件数：</span>
                    <span className='value'>{props?.totalNum}</span>
                    <span className='text'>总重量（kg）：</span>
                    <span className='value'>{props?.totalWeight}</span>
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
                                width: 80,
                                fixed: "right",
                                dataIndex: 'operation',
                                render: (_: any, records: any) => (
                                    <>
                                        <Button
                                            type="link"
                                            className='btn-operation-link'
                                            onClick={() => {
                                                setBatcherId(records?.id)
                                                setVisible(true);
                                                setCode("1");
                                            }}
                                            disabled={records?.feedStatus !== 1}
                                        >反馈</Button>
                                        <Button
                                            type="link"
                                            className='btn-operation-link'
                                            onClick={() => {
                                                setBatcherId(records?.id)
                                                setVisible(true);
                                                setCode("2");
                                            }}
                                            disabled={records?.feedStatus !== 2}
                                        >查看</Button>
                                    </>
                                )
                            }
                        ]
                    }
                    key="id"
                    dataSource={data as any}
                    pagination={false}
                />
            </Modal>
            <MaterialPreparationFeedback
                visible={visible}
                batcherId={batcherId}
                code={code}
                handleCallBack={handleCallBack}
            />
        </Spin>

    )
}