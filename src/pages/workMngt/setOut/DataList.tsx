/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-放样列表-塔型信息-数据上传
*/

import React, { useState } from 'react';
import { Space, Button, Modal, Row, Col, Input, message, Popconfirm, Checkbox, Form } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './SetOut.module.less';
import { useHistory, useParams } from 'react-router-dom';
import RequestUtil from '../../../utils/RequestUtil';
import UploadModal from './UploadModal';
import { FileProps } from '../../common/Attachment';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { useForm } from 'antd/lib/form/Form';

export default function ModelList(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string }>();
    const [refresh, setRefresh] = useState(false);
    const [visible, setVisible] = useState(false);
    const [segmentId, setSegmentId] = useState('');
    const [checked, setChecked] = useState(false);
    const [filterValue, setFilterValue] = useState<any>();
    const [form] = useForm();

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
            key: 'modelName',
            title: '数据类型',
            width: 150,
            dataIndex: 'modelName'
        },
        {
            key: 'name',
            title: '数据名称',
            width: 150,
            dataIndex: 'name'
        },
        {
            key: 'segmentName',
            title: '段信息',
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
                        const data: FileProps = await RequestUtil.get(record?.modelType === 1 ? `/tower-science/productSegment/segmentModelDownload?segmentRecordId=${record.id}` : `/tower-science/loftingTemplate/download/${record.id}`);
                        window.open(data?.downloadUrl)
                    }}>下载</Button>
                    {/* {record?.modelType === 1 ? */}
                    <>
                        <Button type="link" onClick={() => {
                            setVisible(true);
                            form?.setFieldsValue({
                                segmentName: record.segmentName
                            })
                            setSegmentId(record.id)
                        }}>编辑</Button>
                        <Popconfirm
                            title="确认删除?"
                            onConfirm={() => {
                                RequestUtil.delete(`/tower-science/productSegment/segmentModelDelete?segmentRecordId=${record.id}`).then(res => {
                                    message.success('删除成功');
                                    setRefresh(!refresh);
                                })
                            }}
                            okText="确认"
                            cancelText="取消"
                        >
                            <Button type="link">删除</Button>
                        </Popconfirm>
                    </>
                    {/* : null
                    } */}
                </Space>
            )
        }
    ]

    return <>
        <Page
            path={`/tower-science/productSegment/modelList`}
            exportPath={`/tower-science/productSegment/modelList`}
            columns={columns}
            headTabs={[]}
            refresh={refresh}
            filterValue={filterValue}
            requestData={{ productCategoryId: params.id, flag: checked ? 1 : 2 }}
            extraOperation={<Space direction="horizontal" size="small">
                <Checkbox checked={checked} onChange={
                    (e: CheckboxChangeEvent) => {
                        setFilterValue({ flag: e.target.checked ? 1 : 2 })
                        setRefresh(!refresh);
                        setChecked(e.target.checked);
                    }
                }>相同名称显示</Checkbox>
                <UploadModal id={params.id} path="/tower-science/productSegment/segmentModelUpload" updateList={() => setRefresh(!refresh)} />
                <Button type="ghost" onClick={() => history.goBack()}>返回</Button>
            </Space>}
            searchFormItems={[]}
        />
        <Modal
            visible={visible}
            title="编辑"
            key={form?.getFieldsValue(true)?.segmentName}
            onCancel={() => setVisible(false)}
            onOk={() => {
                const segmentName = form?.getFieldsValue(true)?.segmentName
                if (segmentName && /^[^\s]*$/.test(segmentName) && /^[0-9a-zA-Z-,]*$/.test(segmentName)) {
                    RequestUtil.put(`/tower-science/productSegment/segmentModelUpdate`, {
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
            <Form form={form}>
                <Row>
                    <Col span={4}>段名</Col>
                    <Col span={20}>
                        <Form.Item name="segmentName" >
                            <Input />
                        </Form.Item>

                    </Col>
                </Row>
            </Form>

        </Modal>
    </>
}