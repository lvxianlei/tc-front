import React, { useState } from 'react';
import { Spin, Button, Space, Modal, Row, Col, Input, message, Image } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailTitle, BaseInfo, DetailContent, CommonTable } from '../common';
import RequestUtil from '../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './AssessmentTask.module.less';
import Attachment, { FileProps } from '../common/Attachment';
import { FixedType } from 'rc-table/lib/interface';

interface IDetail {
    readonly id?: string;
    readonly applicantTime?: string;
    readonly applicantUser?: string;
    readonly bidEndTime?: string;
    readonly customer?: string;
    readonly description?: string;
    readonly programLeaderId?: string;
    readonly programName?: string;
    readonly status?: string | number;
    readonly fileVOList?: FileProps[];
    readonly statusRecordList?: ItaskDataRecordList[];
}

interface ItaskDataRecordList {
    readonly id?: string;
    readonly opreateUser?: string;
    readonly opreateUserDept?: string;
    readonly createTime?: string;
    readonly status?: string;
    readonly description?: string;
}

const tableColumns = [
    {
        key: 'index',
        title: '序号',
        dataIndex: 'index',
        fixed: "left" as FixedType,
        width: 50,
        render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
    },
    {
        key: 'createDeptName',
        title: '操作部门',
        dataIndex: 'createDeptName',
    },
    {
        key: 'createUserName',
        title: '操作人',
        dataIndex: 'createUserName'
    },
    {
        key: 'createTime',
        title: '操作时间',
        dataIndex: 'createTime'
    },
    {
        key: 'currentStatus',
        title: '任务状态',
        dataIndex: 'currentStatus',
        render: (currentStatus: number): React.ReactNode => {
            switch (currentStatus) {
                case 0:
                    return '已拒绝';
                case 1:
                    return '待接收';
                case 2:
                    return '待指派';
                case 3:
                    return '待完成';
                case 4:
                    return '已完成';
                case 5:
                    return '已提交';
            }
        }
    },
    {
        key: 'description',
        title: '备注',
        dataIndex: 'description'
    }
]

const baseColumns = [
    {
        "dataIndex": "programName",
        "title": "项目名称"
    },
    {
        "dataIndex": "customer",
        "title": "客户名称"
    },
    {
        "dataIndex": "programLeaderName",
        "title": "项目负责人"
    },
    {
        "dataIndex": "bidEndTime",
        "title": "投标截止时间",
        "type": "date"
    },
    {
        "dataIndex": "applicantUserName",
        "title": "信息申请人"
    },
    {
        "dataIndex": "applicantTime",
        "title": "申请时间",
        "type": "date"
    },
    {
        "dataIndex": "description",
        "title": "备注",
        "type": "textarea"
    }
]

export default function AssessmentTaskDetail(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string }>();
    const { loading, data } = useRequest<IDetail>(() => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get<IDetail>(`/tower-science/assessTask/taskDetail/${params.id}`);
        resole(data);
    }), {})
    const detailData: IDetail = data || {};
    const [visible, setVisible] = useState(false);
    const [rejectReason, setRejectReason] = useState("");

    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }

    return <>
        <DetailContent operation={[
            <Space direction="horizontal" size="small" className={styles.bottomBtn}>
                <Button type="ghost" onClick={() => history.goBack()}>关闭</Button>
                {
                    detailData.status === 1 ?
                        <><Button type="primary" onClick={() => {
                            RequestUtil.put(`/tower-science/assessTask/accept?id=${params.id}`).then(res => {
                                message.success('接收成功');
                                history.go(0);
                            });
                        }}>接收</Button>
                            {/* <Button type="ghost" onClick={() => setVisible(true)}>拒绝</Button> */}
                        </>
                        :
                        null
                }
            </Space>
        ]}>
            <DetailTitle title="基本信息" />
            <BaseInfo columns={baseColumns} dataSource={detailData} col={2} />
            <Attachment dataSource={ detailData.fileVOList } />
            <DetailTitle title="操作信息" />
            <CommonTable columns={tableColumns} dataSource={detailData.statusRecordList} pagination={false} />
        </DetailContent>
        <Modal
            visible={visible}
            title="拒绝"
            onCancel={() => {
                setVisible(false);
                setRejectReason("");
            }}
            onOk={() => {
                if (rejectReason) {
                    if (/^[^(\s)]*$/.test(rejectReason)) {
                        RequestUtil.put(`/tower-science/assessTask/reject`, { id: params.id, rejectReason: rejectReason }).then(res => {
                            setRejectReason("");
                            setVisible(false);
                            message.success('拒绝成功');
                            history.go(0);
                        });
                    } else {
                        message.warning('禁止输入空格');
                    }
                } else {
                    message.warning('请输入拒绝原因');
                }
            }}
            cancelText="关闭"
            okText="提交"
            className={styles.rejectModal}
        >
            <Row>
                <Col span={4}>拒绝原因<span style={{ color: 'red' }}>*</span></Col>
                <Col span={19} offset={1}><Input placeholder="请输入" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} /></Col>
            </Row>
        </Modal>
    </>
}