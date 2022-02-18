/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-螺栓列表-螺栓信息
*/

import React, { useState } from 'react';
import { Spin, Button, Space, Modal, Image } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailTitle, BaseInfo, DetailContent, CommonTable } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';

const tableColumns = [
    {
        key: 'index',
        title: '序号',
        dataIndex: 'index',
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
        render: (status: number): React.ReactNode => {
            switch (status) {
                case 0:
                    return '已拒绝';
                case 1:
                    return '待确认';
                case 2:
                    return '待指派';
                case 3:
                    return '待完成';
                case 4:
                    return '待校核';
                case 5:
                    return '已完成';
            }
        }
    }
]

const specialColums = [
    {
        "dataIndex": "materialSandard",
        "title": "原材料标准"
    },
    {
        "dataIndex": "materialDemand",
        "title": "原材料要求"
    },
    {
        "dataIndex": "weldingDemand",
        "title": "焊接要求"
    },
    {
        "dataIndex": "packDemand",
        "title": "包装要求"
    },
    {
        "dataIndex": "galvanizeDemand",
        "title": "镀锌要求"
    },
    {
        "dataIndex": "description",
        "title": "备注",
        "type": "textarea"
    }
]

const productColumns = [
    {
        "dataIndex": "productCategoryNum",
        "title": "塔型（个）"
    },
    {
        "dataIndex": "productNum",
        "title": "杆塔（基）"
    },
    {
        "dataIndex": "productType",
        "title": "产品类型"
    },
    {
        "dataIndex": "totalWeight",
        "title": "总重量（kg）"
    }
]

export default function AssemblyWeldingInformation(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string, loftId: string }>();
    const [pictureVisible, setPictureVisible] = useState<boolean>(false);
    const [pictureUrl, setPictureUrl] = useState('');
    const handlePictureModalCancel = () => { setPictureVisible(false) }
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get(`/tower-science/boltRecord/detail`, { loftingTask: params.loftId, productCategory: params.id })
        resole(data)
    }), {})
    const detailData: any = data
    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }

    return <>
        <DetailContent operation={[
            <Space direction="horizontal" size="small" >
                <Button type="ghost" onClick={() => history.goBack()}>关闭</Button>
            </Space>
        ]}>
            <DetailTitle title="特殊要求" />
            <BaseInfo columns={specialColums} dataSource={detailData} col={2} />
            <DetailTitle title="产品信息" />
            <BaseInfo columns={productColumns} dataSource={detailData} col={2} />
            <DetailTitle title="相关附件" />
            <CommonTable columns={[
                {
                    key: 'fileName',
                    title: '附件名称',
                    dataIndex: 'fileName',
                    width: 250
                },
                {
                    key: 'operation',
                    title: '操作',
                    dataIndex: 'operation',
                    render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                        <Space direction="horizontal" size="small">
                            <Button type="link" onClick={() => window.open(record.filePath)}>下载</Button>
                            {
                                record.fileSuffix === 'pdf'
                                    ?
                                    <Button type="link" onClick={() => window.open(record.filePath)}>预览</Button> : ['jpg', 'jpeg', 'png', 'gif'].includes(record.fileSuffix)
                                        ?
                                        <Button type='link' onClick={() => { setPictureUrl(record.id ? record.filePath : record.link); setPictureVisible(true); }}>预览</Button>
                                        : null
                            }
                            {
                                record.fileSuffix === 'pdf' ? <Button type="link" onClick={() => window.open(record.filePath)}>预览</Button> : null
                            }
                        </Space>
                    )
                }
            ]}
                dataSource={detailData.fileList}
                pagination={false}
            />
            <DetailTitle title="操作信息" />
            <CommonTable columns={tableColumns} dataSource={detailData.statusRecordList} pagination={false} />
        </DetailContent>
        <Modal visible={pictureVisible} onCancel={handlePictureModalCancel} footer={false}>
            <Image src={pictureUrl} preview={false} />
        </Modal>
    </>
}