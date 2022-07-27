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
            key: 'taskNum',
            title: '段名',
            width: 80,
            dataIndex: 'taskNum'
        },
        {
            key: 'planNumber',
            title: '构件号',
            width: 100,
            dataIndex: 'planNumber'
        },
        {
            key: 'internalNumber',
            title: '构件数',
            dataIndex: 'internalNumber',
            width: 80
        },
        {
            key: 'name',
            title: '电焊配置数',
            width: 80,
            dataIndex: 'name'
        },
        {
            key: 'num',
            title: '配置情况',
            width: 80,
            dataIndex: 'num',
        },
        {
            key: 'voltageGradeName',
            title: '是否主件',
            width: 80,
            dataIndex: 'voltageGradeName',
        }
    ]

    return <DetailContent key='ChooseMaterials'>
        <Page
            path=""
            columns={columns}
            headTabs={[]}
            requestData={{}}
            searchFormItems={[]}
        />
    </DetailContent>
})

