/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-放样列表-塔型信息-工艺卡
*/

import React, { useState } from 'react';
import { Space, Button, Modal, message, Row, Col, Input, Popconfirm } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './SetOut.module.less';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import RequestUtil from '../../../utils/RequestUtil';
import UploadModal from './UploadModal';
import { FileProps } from '../../common/Attachment';

export default function ProcessCardList(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string }>();
    const [refresh, setRefresh] = useState(false);
    const [visible, setVisible] = useState(false);
    const [segmentName, setSegmentName] = useState('');
    const [segmentId, setSegmentId] = useState('');
    const location = useLocation<{ status: number }>();

    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            fixed: 'left' as FixedType,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'name',
            title: '大样图工艺卡名称',
            width: 150,
            dataIndex: 'name'
        },
        {
            key: 'segmentName',
            title: '段包信息',
            dataIndex: 'segmentName',
            width: 120
        },
        {
            key: 'createTime',
            title: '上传时间',
            dataIndex: 'createTime',
            width: 200,
        },
        {
            key: 'createUserName',
            title: '上传人',
            width: 200,
            dataIndex: 'createUserName'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 150,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small" className={styles.operationBtn}>
                    <Button type="link" onClick={async () => {
                        const data: FileProps = await RequestUtil.get(`/tower-science/productSegment/segmentModelDownload?segmentRecordId=${record.id}`);
                        window.open(data?.downloadUrl)
                    }}>下载</Button>
                    {location.state.status === 1 || location.state.status === 2 ? <Button type="link" onClick={() => {
                        setVisible(true);
                        setSegmentName(record.segmentName);
                        setSegmentId(record.id)
                    }}>编辑</Button> : null}
                    {location.state.status === 1 || location.state.status === 2 ? <Popconfirm
                        title="确认删除?"
                        onConfirm={() => {
                            RequestUtil.delete(`/tower-science/productSegment/segmentDrawDelete?segmentRecordId=${record.id}`).then(res => {
                                message.success('删除成功');
                                setRefresh(!refresh);
                            })
                        }}
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button type="link">删除</Button>
                    </Popconfirm> : null}
                </Space>
            )
        }
    ]

    const onRefresh = () => {
        setRefresh(!refresh);
    }

    return <>
        <Page
            path={`/tower-science/productSegment/sampleList`}
            exportPath={`/tower-science/productSegment/sampleList`}
            columns={columns}
            headTabs={[]}
            refresh={refresh}
            requestData={{ productCategoryId: params.id }}
            extraOperation={<Space direction="horizontal" size="small">
                {location.state.status === 1 || location.state.status === 2 ? <UploadModal id={params.id} path="/tower-science/productSegment/segmentDrawUpload" updateList={() => setRefresh(!refresh)} /> : null}
                <Button type="ghost" onClick={() => history.goBack()}>返回</Button>
            </Space>}
            searchFormItems={[]}
        />
        <Modal visible={visible} title="编辑" onCancel={() => setVisible(false)} onOk={() => {
            if (segmentName && /^[^\s]*$/.test(segmentName) && /^[0-9a-zA-Z-,]*$/.test(segmentName)) {
                RequestUtil.put(`/tower-science/productSegment/segmentDrawUpdate`, {
                    id: segmentId,
                    productCategoryId: params.id,
                    segmentName: segmentName
                }).then(res => {
                    setVisible(false);
                    setRefresh(!refresh);
                });
            } else {
                message.warning('请输入段信息，仅可输入数字/字母/-/,')
            }
        }}>
            <Row>
                <Col span={4}>段名</Col>
                <Col span={20}><Input defaultValue={segmentName} onChange={(e) => {
                    setSegmentName(e.target.value)
                }} /></Col>
            </Row>
        </Modal>
    </>
}