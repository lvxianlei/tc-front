/**
 * @author zyc
 * @copyright © 2021 
 * @description 配置管理-原材料管理（sw1.1）
 */

import React, { useState } from 'react';
import { Space, Input, Select, Button, Form } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
// import styles from './MaterialMngt.module.less';
import { Link, useHistory } from 'react-router-dom';
import AuthUtil from '../../../utils/AuthUtil';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import { IMaterialType } from '../material/IMaterial';

export default function MaterialMngt(): React.ReactNode {
    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'materialCode',
            title: '编号',
            width: 150,
            dataIndex: 'materialCode'
        },
        {
            key: 'materialTypeName',
            title: '类别',
            width: 150,
            dataIndex: 'materialTypeName',
        },
        {
            key: 'materialCategoryName',
            title: '类型',
            width: 150,
            dataIndex: 'materialCategoryName'
        },
        {
            key: 'materialName',
            title: '品名',
            width: 150,
            dataIndex: 'materialName'
        },
        {
            key: 'structureSpec',
            title: '规格',
            dataIndex: 'structureSpec',
            width: 120
        },
        {
            key: 'proportion',
            title: '比重',
            width: 200,
            dataIndex: 'proportion'
        },
        {
            key: 'weightAlgorithm',
            title: '算法',
            width: 200,
            dataIndex: 'weightAlgorithm'
        },
        {
            key: 'description',
            title: '备注',
            dataIndex: 'description',
            width: 200,
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 200,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    {
                        record.boltLeader === userId ? <Link to={`/workMngt/boltList/boltListing/${record.id}/${record.boltLeader}/${record.boltStatus}`}>螺栓清单</Link> : <Button type="link" disabled>螺栓清单</Button>
                    }
                    {
                        record.boltStatus === 3 && record.loftingLeader === userId ? <Link to={`/workMngt/boltList/boltCheck/${record.id}`}>校核</Link> : <Button type="link" disabled>校核</Button>
                    }
                </Space>
            )
        }
    ]

    const userId = AuthUtil.getUserId();
    const [ materialList, setMaterialList ] = useState([]);
    const history = useHistory();
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: IMaterialType[] = await RequestUtil.get<IMaterialType[]>(`/tower-system/materialCategory`);
        resole(data);
    }), {})
    const materialType: any = data || [];

    return <Page
        path="/tower-system/material"
        columns={columns}
        headTabs={[]}
        exportPath={`/tower-system/material`}
        extraOperation={<Space direction="horizontal" size="small">
            <Button type="primary" ghost>模板下载</Button>
            <Button type="primary" ghost>导入</Button>
            <Button type="primary" ghost>新增</Button>
            <Button type="primary" onClick={() => history.goBack()} ghost>返回上一级</Button>
        </Space>}
        searchFormItems={[
            {
                name: 'materialType',
                label: '类别',
                children: <Form.Item name="materialType" initialValue="">
                    <Select placeholder="请选择" style={{ width: "150px" }} onChange={ (e) => {
                        const list = materialType.filter((res: IMaterialType) => res.id === e);
                        console.log(list)
                        setMaterialList(list[0].children);
                    } }>
                        <Select.Option value="" key="6">全部</Select.Option>
                        { materialType && materialType.map((item: any) => {
                            return <Select.Option key={ item.id } value={ item.id }>{ item.name }</Select.Option>
                        }) }
                    </Select>
                </Form.Item>
            },
            {
                name: 'materialCategory',
                label: '类型',
                children: <Form.Item name="materialCategory" initialValue="">
                    <Select placeholder="请选择" style={{ width: "150px" }}>
                        <Select.Option value="" key="6">全部</Select.Option>
                        { materialList && materialList.map((item: any) => {
                            return <Select.Option key={ item.id } value={ item.id }>{ item.name }</Select.Option>
                        }) }
                    </Select>
                </Form.Item>
            },
            {
                name: 'fuzzyMsg',
                label: '查询',
                children: <Input placeholder="品名/规格" />
            }
        ]}
        onFilterSubmit={(values: Record<string, any>) => {
            if (values.updateTime) {
                const formatDate = values.updateTime.map((item: any) => item.format("YYYY-MM-DD"));
                values.updateStatusTimeStart = formatDate[0] + ' 00:00:00';
                values.updateStatusTimeEnd = formatDate[1] + ' 23:59:59';
            }
            return values;
        }}
    />
}