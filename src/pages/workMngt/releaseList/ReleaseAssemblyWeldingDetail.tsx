import React, { useState } from 'react';
import { Space, Input, DatePicker, Button, Form, Select } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import { FixedType } from 'rc-table/lib/interface';
import { Page } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import AuthUtil from '../../../utils/AuthUtil';
import useRequest from '@ahooksjs/use-request';
// import styles from './sample.module.less';

export default function ReleaseList(): React.ReactNode {
    const history = useHistory();
    const [refresh, setRefresh] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState({});
    const location = useLocation<{ state?: number, userId?: string }>();
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data:any = await RequestUtil.get(`/tower-system/employee?size=1000`);
        resole(data?.records);
    }), {})
    const user:any = data||[];
    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            fixed: 'left' as FixedType,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'segmentName',
            title: '段名',
            width: 150,
            dataIndex: 'segmentName'
        },
        {
            key: 'repeatNum',
            title: '组件号',
            width: 150,
            dataIndex: 'repeatNum'
        },
        {
            key: 'code',
            title: '加工组数',
            dataIndex: 'code',
            width: 120
        },
        {
            key: 'materialName',
            title: '单组重量',
            width: 200,
            dataIndex: 'materialName'
        },
        {
            key: 'structureTexture',
            title: '电焊米数（mm）',
            width: 150,
            dataIndex: 'structureTexture',
        }
    ]
    const detailColumns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            fixed: 'left' as FixedType,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'segmentName',
            title: '零部件号',
            width: 150,
            dataIndex: 'segmentName'
        },
        {
            key: 'repeatNum',
            title: '是否主件',
            width: 150,
            dataIndex: 'repeatNum'
        },
        {
            key: 'code',
            title: '材料',
            dataIndex: 'code',
            width: 120
        },
        {
            key: 'materialName',
            title: '材质',
            width: 200,
            dataIndex: 'materialName'
        },
        {
            key: 'structureTexture',
            title: '规格',
            width: 150,
            dataIndex: 'structureTexture',
        },
        {
            key: 'structureTexture',
            title: '长度（mm）',
            width: 150,
            dataIndex: 'structureTexture',
        },
        {
            key: 'structureTexture',
            title: '宽度（mm）',
            width: 150,
            dataIndex: 'structureTexture',
        },
        {
            key: 'structureTexture',
            title: '单组件数',
            width: 150,
            dataIndex: 'structureTexture',
        },
        {
            key: 'structureTexture',
            title: '工艺',
            width: 150,
            dataIndex: 'structureTexture',
        }
    ]
    const onFilterSubmit = (value: any) => {
        setFilterValue(value)
        return value
    }
    return (
        <div>
        <Page
            path="/tower-science/smallSample"
            columns={columns}
            onFilterSubmit={onFilterSubmit}
            filterValue={filterValue}
            refresh={refresh}
            requestData={ { smallSampleStatus: location.state?.state, smallSampleLeader: location.state?.userId } }
            exportPath="/tower-science/smallSample"
            searchFormItems={[
                {
                    name: 'fuzzyMsg',
                    label: '模糊查询项',
                    children: <Input placeholder="" maxLength={200} />
                },
            ]}
        />
        </div>
    )
}