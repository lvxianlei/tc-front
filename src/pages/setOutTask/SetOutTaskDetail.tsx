import React, { useState } from 'react';
import { Spin, Button, Space, Modal, Row, Col, Input, message } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailTitle, BaseInfo, DetailContent, CommonTable } from '../common';
import RequestUtil from '../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import { baseColumns, specialColums, productColumns } from './SetOutTaskDetail.json';
import styles from './SetOutTask.module.less';

const tableColumns = [
    { 
        key: 'index', 
        title: '序号', 
        dataIndex: 'index', 
        width: 50, 
        render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{ index + 1 }</span>) },
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

export default function SetOutTaskDetail(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string }>();
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get(`/tower-science/loftingTask/detail?id=${ params.id }`)
        resole(data)
    }), {})
    const detailData: any = data;
    const [ visible, setVisible ] = useState(false);
    const [ rejectReason, setRejectReason ] = useState("");

    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }

    return <>
        <DetailContent operation={ [
            <Space direction="horizontal" size="small" >
                <Button type="ghost" onClick={() => history.goBack()}>关闭</Button>
                {
                    detailData.status === 1 ? 
                    <><Button type="primary" onClick={ () => {
                        RequestUtil.post(`/tower-science/loftingTask/receive`, { id: params.id }).then(res => {
                            history.goBack();
                        });
                    } }>接收</Button> 
                    <Button type="ghost" onClick={ () => setVisible(true) }>拒绝</Button></>
                    : null
                }
            </Space>
        ] }>
            <DetailTitle title="基础信息" />
            <BaseInfo columns={ baseColumns } dataSource={ detailData } col={ 2 } />
            <DetailTitle title="特殊要求" />
            <BaseInfo columns={ specialColums } dataSource={ detailData } col={ 2 } />
            <DetailTitle title="产品信息" />
            <BaseInfo columns={ productColumns } dataSource={ detailData } col={ 2 } />
            <DetailTitle title="相关附件" />
            <CommonTable columns={[
                { 
                    key: 'name', 
                    title: '附件名称', 
                    dataIndex: 'name',
                    width: 350
                },
                { 
                    key: 'operation', 
                    title: '操作', 
                    dataIndex: 'operation', 
                    render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                        <Space direction="horizontal" size="small">
                            <Button type="link" onClick={ () => window.open(record.filePath) }>下载</Button>
                            {
                                record.fileSuffix === 'pdf' ? <Button type="link" onClick={ () => window.open(record.filePath) }>预览</Button> : null
                            }
                        </Space>
                ) }
            ]}
                dataSource={ detailData.attachVos } 
                pagination={ false }
            />
            <DetailTitle title="操作信息"/>
            <CommonTable columns={ tableColumns } dataSource={ detailData.stateRecordVOS } pagination={ false }/>
        </DetailContent>
        <Modal 
            visible={ visible } 
            title="拒绝" 
            onCancel={ () => { 
                setVisible(false); 
                setRejectReason(""); 
            } } 
            onOk={ () => {
                if(rejectReason) {
                    RequestUtil.post(`/tower-science/loftingTask/refuse`, { id: params.id, description: rejectReason });
                    setVisible(false); 
                    history.goBack();
                    setRejectReason("");
                } else {
                    message.warning('请输入拒绝原因');
                }
            } } 
            cancelText="关闭" 
            okText="提交" 
            className={ styles.rejectModal }
        >
            <Row>
                <Col span={ 4 }>拒绝原因<span style={{ color: 'red' }}>*</span></Col>
                <Col span={ 19 } offset={ 1 }><Input placeholder="请输入" value={ rejectReason } onChange={ (e) => setRejectReason(e.target.value) }/></Col>
            </Row>
        </Modal>
    </>
}