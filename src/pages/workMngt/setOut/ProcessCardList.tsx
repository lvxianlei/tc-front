/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-放样列表-塔型信息-工艺卡
*/

import React, { useState } from 'react';
import { Space, Button, Modal, message, Row, Col, Input } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './SetOut.module.less';
import { useHistory, useParams } from 'react-router-dom';
import RequestUtil from '../../../utils/RequestUtil';
import UploadModal from './UploadModal';
import { FileProps } from '../../common/Attachment';

export default function ProcessCardList(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string }>();
    const [ refresh, setRefresh ] = useState(false);
    const [ visible, setVisible ] = useState(false);
    const [ segmentName, setSegmentName ] = useState('');
    const [ segmentId, setSegmentId ] = useState('');

    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            fixed: 'left' as FixedType,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{ index + 1 }</span>)
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
            key: 'createUser',
            title: '上传人',
            width: 200,
            dataIndex: 'createUser'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 250,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small" className={ styles.operationBtn }>
                    <Button type="link" onClick={ async ()  => {
                        const data: FileProps = await RequestUtil.get(`/tower-science/productSegment/segmentDrawDownload?productSegmentId=${ record.id }`);
                        window.open(data?.downloadUrl)
                    }}>下载</Button>
                    <Button type="link" onClick={ () => {
                        setVisible(true);
                        setSegmentName(record.segmentName);
                        setSegmentId(record.id)
                    } }>编辑</Button>
                </Space>
            )
        }
    ]

    const onRefresh = () => {
        setRefresh(!refresh);
    }

    return <>
        <Page
            path={ `/tower-science/productSegment/sampleList` }
            columns={ columns }
            headTabs={ [] }
            refresh={ refresh }
            requestData={{ productCategoryId: params.id }}
            extraOperation={ <Space direction="horizontal" size="small">
                <Button type="primary" ghost>导出</Button>
                <UploadModal id={ params.id } path="/tower-science/productSegment/segmentDrawUpload" updateList={ () => setRefresh(!refresh) }/>
                <Button type="primary" ghost onClick={() => history.goBack()}>返回上一级</Button>
            </Space> }
            searchFormItems={ [] }
        />
        <Modal visible={ visible } title="编辑" onCancel={ () => setVisible(false) } onOk={ () => {
            if(segmentName) {
                RequestUtil.put(`/tower-science/productSegment/segmentDrawUpdate`, {
                    id: segmentId,
                    productCategoryId: params.id,
                    segmentName: segmentName
                }).then(res => {
                    setVisible(false);
                    setRefresh(!refresh);
                });
            } else {
                message.warning('请输入段信息')
            }
        } }>
            <Row>
                <Col span={ 4 }>段名</Col>
                <Col span={ 20 }><Input defaultValue={ segmentName }/></Col>
            </Row>
        </Modal>
    </>
}