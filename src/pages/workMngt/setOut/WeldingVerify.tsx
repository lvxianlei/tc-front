/**
 * @author zyc
 * @copyright © 2022 
 * @description 工作管理-放样列表-杆塔配段-电焊件验证
 */

import React, { forwardRef } from "react";
import { DetailContent, Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';

interface modalProps {
    readonly id?: string;
}

export default forwardRef(function WeldingVerify({ id }: modalProps, ref) {

    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            fixed: "left" as FixedType,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'segmentName',
            title: '段名',
            width: 80,
            dataIndex: 'segmentName'
        },
        {
            key: 'code',
            title: '构件号',
            width: 100,
            dataIndex: 'code'
        },
        {
            key: 'partNum',
            title: '构件数',
            dataIndex: 'partNum',
            width: 80
        },
        {
            key: 'weldingNum',
            title: '电焊配置数',
            width: 80,
            dataIndex: 'weldingNum'
        },
        {
            key: 'configStatus',
            title: '配置情况',
            width: 80,
            dataIndex: 'configStatus',
            type: 'select',
            enum: [
                { "value": 1, "label": "已完成" },
                { "value": 2, "label": "未完成" }
            ]
        },
        {
            key: 'voltageGradeName',
            title: '是否主件',
            width: 80,
            dataIndex: 'voltageGradeName',
            type: 'select',
            enum: [
                { "value": 1, "label": "是" },
                { "value": 0, "label": "否" }
            ]
        }
    ]

    return <DetailContent key='ChooseMaterials'>
        <Page
            path="/tower-science/productCategory/welding/check/list"
            columns={columns}
            headTabs={[]}
            requestData={{ productCategoryId: id }}
            searchFormItems={[]}
            tableProps={{
                pagination: false
            }}
        />
    </DetailContent>
})

