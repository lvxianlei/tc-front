/**
 * @author zyc
 * @copyright © 2021 
*/

import React from 'react';
import { Spin, Button, Space, Input, Row, Col } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailTitle, DetailContent, CommonTable } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import styles from './AssemblyWelding.module.less';
import useRequest from '@ahooksjs/use-request';

export default function QuestionnaireDetail(): React.ReactNode {
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
            key: 'status',
            title: '问题单状态',
            dataIndex: 'status',
            render: (status: number): React.ReactNode => {
                switch (status) {
                    case 1:
                        return '待修改';
                    case 2:
                        return '已修改';
                    case 3:
                        return '已拒绝';
                    case 4:
                        return '已删除';
                }
            }
        },
        {
            key: 'description',
            title: '备注',
            dataIndex: 'description'
        }
    ]

    const paragraphColumns = [
        {
            title: '零件号',
            dataIndex: 'code',
            key: 'code'
        },
        {
            title: '材料',
            dataIndex: 'materialName',
            key: 'materialName'
        },
        {
            title: '材质',
            dataIndex: 'structureTexture',
            key: 'structureTexture'
        },
        {
            title: '规格',
            dataIndex: 'structureSpec',
            key: 'structureSpec'
        },
        {
            title: '长度（mm）',
            dataIndex: 'length',
            key: 'length'
        },
        {
            title: '单组件数',
            dataIndex: 'singleNum',
            key: 'singleNum'
        },
        {
            title: '是否主件',
            dataIndex: 'length',
            key: 'length'
        },
        {
            title: '电焊长度（mm）',
            dataIndex: 'weldingLength',
            key: 'weldingLength'
        }
    ]

    const history = useHistory();
    const params = useParams<{ id: string, productCategoryId: string, segmentId: string }>();
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get(`/tower-science/welding/getIssueById?segmentId=${params.segmentId}`)
        resole(data)
    }), {})
    const detailData: any = data;

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
            <DetailTitle title="问题信息" />
            <Row className={styles.header}>
                <Col>校核前</Col>
                <Col offset={1}>段号：{detailData.weldingDetailedVO.segmentName} </Col>
                <Col>组件号：{detailData.weldingDetailedVO.componentId}</Col>
                <Col>主件号：{detailData.weldingDetailedVO.mainPartId}</Col>
                <Col>电焊米数：{detailData.weldingDetailedVO.electricWeldingMeters}</Col>
            </Row>
            <CommonTable columns={paragraphColumns} dataSource={detailData.weldingDetailedVO.weldingDetailedStructureList} pagination={false} />
            <Row className={styles.header}>
                <Col>校核后</Col>
                <Col offset={1}>段号：{detailData.issueWeldingDetailedVO.segmentName} </Col>
                <Col>组件号：{detailData.issueWeldingDetailedVO.componentId}</Col>
                <Col>主件号：{detailData.issueWeldingDetailedVO.mainPartId}</Col>
                <Col>电焊米数：{detailData.issueWeldingDetailedVO.electricWeldingMeters}</Col>
            </Row>
            <CommonTable columns={paragraphColumns} dataSource={detailData.issueWeldingDetailedVO.weldingDetailedStructureList} pagination={false} />
            <DetailTitle title="备注" />
            <Input.TextArea value={detailData.description} disabled />
            <DetailTitle title="操作信息" />
            <CommonTable columns={tableColumns} dataSource={detailData.issueRecordList} pagination={false} />
        </DetailContent>
    </>
}