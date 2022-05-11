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

const specialColums = [
    {
        "dataIndex": "issuedNumber",
        "title": "处置单单号"
    },
    {
        "dataIndex": "checkDate",
        "title": "开单日期"
    },
    {
        "dataIndex": "weldingDemand",
        "title": "发现环节"
    },
    {
        "dataIndex": "planNumber",
        "title": "计划号"
    },
    {
        "dataIndex": "issuedNumber",
        "title": "生产下达单号"
    },
    {
        "dataIndex": "description",
        "title": "产品类型",
        "type": "textarea"
    },
    {
        "dataIndex": "description",
        "title": "工程名称",
        "type": "textarea"
    },
    {
        "dataIndex": "productCategory",
        "title": "塔型",
        "type": "textarea"
    },
    {
        "dataIndex": "workPro",
        "title": "责任工序",
        "type": "textarea"
    },
    {
        "dataIndex": "workUnit",
        "title": "生产单元",
        "type": "textarea"
    },
    {
        "dataIndex": "responsibleTeamName",
        "title": "责任班组",
        "type": "textarea"
    },
    {
        "dataIndex": "responsibleUser",
        "title": "责任人",
        "type": "textarea"
    },
    {
        "dataIndex": "description",
        "title": "质检员",
        "type": "textarea"
    },
    {
        "dataIndex": "pieceCode",
        "title": "构件号",
        "type": "textarea"
    },
    {
        "dataIndex": "processTypeName",
        "title": "处理类型",
        "type": "textarea"
    },
    {
        "dataIndex": "checkDate",
        "title": "检测时间",
        "type": "textarea"
    },
    {
        "dataIndex": "recheckUnqualifiedNum",
        "title": "数量",
        "type": "textarea"
    },
    {
        "dataIndex": "fineMoney",
        "title": "罚款金额",
        "type": "textarea"
    },
    {
        "dataIndex": "unqualifiedProject",
        "title": "不合格检测项",
        "type": "textarea"
    },
    {
        "dataIndex": "recheckStatusName",
        "title": "复检结果",
        "type": "textarea"
    },
    {
        "dataIndex": "questionDesc",
        "title": "问题描述",
        "type": "textarea"
    },
    {
        "dataIndex": "handleDesc",
        "title": "处理建议",
        "type": "textarea"
    }
]


export default function AssemblyWeldingInformation(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string }>();
    
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get(`/tower-quality/rework/${params.id}`)
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
            <BaseInfo columns={specialColums} dataSource={detailData} col={2} />
        </DetailContent>
    </>
}