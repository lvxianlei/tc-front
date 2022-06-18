/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-螺栓列表-螺栓信息
*/

import React, { useState } from 'react';
import { Spin, Button, Space, Modal, Image, Descriptions } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailTitle, BaseInfo, DetailContent, CommonTable } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';

const specialColums = [
    {
        "dataIndex": "reworkNum",
        "title": "处置单单号"
    },
    {
        "dataIndex": "createTime",
        "title": "开单日期"
    },
    {
        "dataIndex": "linkName",
        "title": "生产环节"
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
        "dataIndex": "materialName",
        "title": "产品类型",
    },
    {
        "dataIndex": "projectName",
        "title": "工程名称",
    },
    {
        "dataIndex": "productCategory",
        "title": "塔型",
        "type": "textarea"
    },
    {
        "dataIndex": "workPro",
        "title": "责任工序",
    },
    {
        "dataIndex": "workUnit",
        "title": "生产单元",
    },
    {
        "dataIndex": "responsibleTeamName",
        "title": "责任班组",
    },
    {
        "dataIndex": "responsibleUser",
        "title": "责任人",
    },
    {
        "dataIndex": "createUserName",
        "title": "质检员",
    }
]
const detailColums = [
    {
        "dataIndex": "pieceCode",
        "title": "构件号",
    },
    {
        "dataIndex": "processTypeName",
        "title": "处理类型",
    },
    {
        "dataIndex": "checkDate",
        "title": "检测时间",
    },
    {
        "dataIndex": "sumNum",
        "title": "数量",
    },
    {
        "dataIndex": "fineMoney",
        "title": "罚款金额",
    },
    {
        "dataIndex": "unqualifiedProject",
        "title": "不合格检测项",
    },
    {
        "dataIndex": "recheckStatusName",
        "title": "复检结果",
    }
]
const questionColums = [
    {
        "dataIndex": "questionDesc",
        "title": "问题描述",
        // "type": "textarea"
    }, {
        "dataIndex": "handleDesc",
        "title": "处理建议"
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
            <DetailTitle title='处置单信息'/>
            <BaseInfo columns={specialColums} dataSource={detailData} />
            <DetailTitle title='基本信息'/>
            <BaseInfo columns={detailColums} dataSource={detailData}  />
            <DetailTitle title='其他信息'/>
            <BaseInfo columns={questionColums} dataSource={detailData}  />
        </DetailContent>
    </>
}