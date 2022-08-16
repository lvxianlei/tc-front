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
    readonly name?: string;
    readonly planNumber?: string;
}

export default forwardRef(function ChooseMaterials({ id, name, planNumber }: modalProps, ref) {

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
            title: '段号',
            width: 150,
            dataIndex: 'segmentName'
        },
        {
            key: 'code',
            title: '构件号',
            width: 150,
            dataIndex: 'code'
        },
        {
            key: 'materialName',
            title: '材料名称',
            dataIndex: 'materialName',
            width: 120
        },
        {
            key: 'structureTexture',
            title: '材质',
            width: 200,
            dataIndex: 'structureTexture'
        },
        {
            key: 'structureSpec',
            title: '规格',
            width: 150,
            dataIndex: 'structureSpec',
        },
        {
            key: 'length',
            title: '长（mm）',
            width: 150,
            dataIndex: 'length',
        },
        {
            key: 'num',
            title: '件数',
            dataIndex: 'num',
            width: 200
        }
    ]

    return <DetailContent key='ChooseMaterials'>
        <Page
            path={`/tower-science/productCategory/picking/list`}
            exportPath={`/tower-science/productCategory/picking/list`}
            columns={columns}
            headTabs={[]}
            requestData={{
                productCategoryId: id
            }}
            searchFormItems={[]}
            extraOperation={<p>
                <span>计划号：<span>{planNumber}</span></span>
                <span>塔型名：<span>{name}</span></span>
            </p>}
        />
    </DetailContent>
})

