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
            title: '段重复数',
            width: 150,
            dataIndex: 'repeatNum'
        },
        {
            key: 'code',
            title: '构件编号',
            dataIndex: 'code',
            width: 120
        },
        {
            key: 'materialName',
            title: '材料名称',
            width: 200,
            dataIndex: 'materialName'
        },
        {
            key: 'structureTexture',
            title: '材质',
            width: 150,
            dataIndex: 'structureTexture',
        },
        {
            key: 'structureSpec',
            title: '规格',
            dataIndex: 'structureSpec',
            width: 200,
        },
        {
            key: 'structureSpec',
            title: '标准',
            dataIndex: 'structureSpec',
            width: 200,
        },
        {
            key: 'width',
            title: '宽度（mm）',
            width: 200,
            dataIndex: 'width'
        },
        {
            key: 'thickness',
            title: '厚度（mm）',
            width: 200,
            dataIndex: 'thickness'
        },
        {
            key: 'length',
            title: '长度（mm）',
            width: 200,
            dataIndex: 'length'
        },
        {
            key: 'basicsPartNum',
            title: '单段件数',
            width: 200,
            dataIndex: 'basicsPartNum'
        },
        {
            key: 'basicsPartNum',
            title: '加工数',
            width: 200,
            dataIndex: 'basicsPartNum'
        },
        {
            key: 'basicsPartNum',
            title: '试装数',
            width: 200,
            dataIndex: 'basicsPartNum'
        },
        {
            key: 'basicsWeight',
            title: '单件重量（kg）',
            width: 200,
            dataIndex: 'basicsWeight'
        },
        {
            key: 'totalWeight',
            title: '小计重量（kg）',
            width: 200,
            dataIndex: 'totalWeight'
        },
        {
            key: 'totalWeight',
            title: '总计重量（kg）',
            width: 200,
            dataIndex: 'totalWeight'
        },
        {
            key: 'totalWeight',
            title: '单件孔数',
            width: 200,
            dataIndex: 'totalWeight'
        },
        {
            key: 'totalWeight',
            title: '总孔数',
            width: 200,
            dataIndex: 'totalWeight'
        },
        {
            key: 'totalWeight',
            title: '工艺',
            width: 200,
            dataIndex: 'totalWeight'
        },
        {
            key: 'description',
            title: '备注',
            width: 200,
            dataIndex: 'description'
        },
        {
            key: 'apertureNumber',
            title: '各孔径孔数',
            width: 200,
            dataIndex: 'apertureNumber'
        },
        {
            key: 'weldingEdge',
            title: '焊接边（mm）',
            width: 200,
            dataIndex: 'weldingEdge',
            render: (_: number, record: Record<string, any>, index: number): React.ReactNode => (
                <span>{_ === -1 ? undefined : _}</span>
            )
        }
    ]

    const onFilterSubmit = (value: any) => {
        if (value.statusUpdateTime) {
            const formatDate = value.statusUpdateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.updateStatusTimeStart = formatDate[0]+ ' 00:00:00';
            value.updateStatusTimeEnd = formatDate[1]+ ' 23:59:59';
            delete value.statusUpdateTime
        }
        if (value.planTime) {
            const formatDate = value.planTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.smallSampleDeliverTimeStart = formatDate[0]+ ' 00:00:00';
            value.smallSampleDeliverTimeEnd = formatDate[1]+ ' 23:59:59';
            delete value.planTime
        }
        setFilterValue(value)
        return value
    }
    return (
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
                    name: 'smallSampleLeader',
                    label:'材料名称',
                    children:   <Form.Item name="smallSampleLeader" initialValue={ location.state?.userId || '' }>
                                    <Select style={{width:'100px'}}>
                                        <Select.Option key={''} value={''}>全部</Select.Option>
                                            {user && user.map((item: any) => {
                                                return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                                            })}
                                    </Select>
                                </Form.Item>
                },
                {
                    name: 'fuzzyMsg',
                    label: '模糊查询项',
                    children: <Input placeholder="" maxLength={200} />
                },
            ]}
        />
    )
}