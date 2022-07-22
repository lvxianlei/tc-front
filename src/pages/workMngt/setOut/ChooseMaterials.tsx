/**
 * @author zyc
 * @copyright © 2022 
 * @description 工作管理-放样列表-工作目录-挑料清单
 */

import React, { forwardRef } from "react";
import { DetailContent, Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';

interface modalProps {
    readonly id?: string;
}

export default forwardRef(function ChooseMaterials({ id }: modalProps, ref) {

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
            title: '段号',
            width: 150,
            dataIndex: 'taskNum'
        },
        {
            key: 'planNumber',
            title: '构件号',
            width: 150,
            dataIndex: 'planNumber'
        },
        {
            key: 'internalNumber',
            title: '材料名称',
            dataIndex: 'internalNumber',
            width: 120
        },
        {
            key: 'name',
            title: '材质',
            width: 200,
            dataIndex: 'name'
        },
        {
            key: 'num',
            title: '规格',
            width: 150,
            dataIndex: 'num',
        },
        {
            key: 'voltageGradeName',
            title: '长（mm）',
            width: 150,
            dataIndex: 'voltageGradeName',
        },
        {
            key: 'plannedDeliveryTime',
            title: '件数',
            dataIndex: 'plannedDeliveryTime',
            width: 200,
        }
    ]

    return <DetailContent key='ChooseMaterials'>
        <Page
            path=""
            exportPath={``}
            columns={columns}
            headTabs={[]}
            requestData={{}}
            searchFormItems={[]}
            extraOperation={<p>
                <span>计划号：<span></span></span>
                <span>塔型名：<span></span></span>
            </p>}
        />
    </DetailContent>
})

