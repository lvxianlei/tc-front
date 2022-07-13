/**
 * @author zyc
 * @copyright © 2021 
 * @description 业务处置管理-取消暂停恢复-已加工明细
 */

import React, { useState } from 'react';
import { Input, Select } from 'antd';
import { Page } from '../common';
import { FixedType } from 'rc-table/lib/interface';
import { useLocation } from 'react-router-dom';
import { voltageGradeOptions } from '../../configuration/DictionaryOptions';

export default function SetOutList(): React.ReactNode {
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
            title: '下达单号',
            width: 80,
            dataIndex: 'taskNum'
        },
        {
            key: 'planNumber',
            title: '段名',
            width: 50,
            dataIndex: 'planNumber'
        },
        {
            key: 'internalNumber',
            title: '构件编号',
            dataIndex: 'internalNumber',
            width: 80
        },
        {
            key: 'name',
            title: '材料名称',
            width: 80,
            dataIndex: 'name'
        },
        {
            key: 'num',
            title: '材质',
            width: 80,
            dataIndex: 'num',
        },
        {
            key: 'voltageGradeName',
            title: '规格',
            width: 80,
            dataIndex: 'voltageGradeName',
        },
        {
            key: 'plannedDeliveryTime',
            title: '标准',
            dataIndex: 'plannedDeliveryTime',
            width: 50,
        },
        {
            key: 'patternName',
            title: '宽度（mm）',
            width: 80,
            dataIndex: 'patternName'
        },
        {
            key: 'loftingLeaderName',
            title: '厚度（mm）',
            width: 80,
            dataIndex: 'loftingLeaderName'
        },
        {
            key: 'statusName',
            title: '长度（mm）',
            width: 80,
            dataIndex: 'statusName'
        },
        {
            key: 'updateStatusTime',
            title: '加工数',
            width: 50,
            dataIndex: 'updateStatusTime'
        },
        {
            key: 'updateStatusTime',
            title: '报工数',
            width: 50,
            dataIndex: 'updateStatusTime'
        },
        {
            key: 'updateStatusTime',
            title: '暂停数',
            width: 50,
            dataIndex: 'updateStatusTime'
        },
        {
            key: 'updateStatusTime',
            title: '单件重量（kg）',
            width: 80,
            dataIndex: 'updateStatusTime'
        }
    ]

    const [refresh, setRefresh] = useState(false);
    const location = useLocation<{ state?: number, userId?: string }>();

    return <Page
        path="/tower-science/loftingList"
        exportPath={`/tower-science/loftingList`}
        columns={columns}
        headTabs={[]}
        requestData={{ status: location.state?.state }}
        refresh={refresh}
        searchFormItems={[
            {
                name: 'status',
                label: '电压等级',
                children: <Select style={{ width: '150px' }}
                    showSearch
                    allowClear
                    filterOption={(input, option) =>
                        (option?.props?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                    }>
                    {voltageGradeOptions && voltageGradeOptions.map(({ id, name }, index) => {
                        return <Select.Option key={index} value={id}>
                            {name}
                        </Select.Option>
                    })}
                </Select>
            },
            {
                name: 'fuzzyMsg',
                label: '模糊查询项',
                children: <Input placeholder="放样任务编号/计划号/订单编号/内部合同编号/塔型/塔型钢印号" />
            }
        ]}
        onFilterSubmit={(values: Record<string, any>) => {
            return values;
        }}
    />
}