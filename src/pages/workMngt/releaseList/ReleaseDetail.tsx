import React, { useState } from 'react';
import { Button, Input,  Select } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { FixedType } from 'rc-table/lib/interface';
import { Page } from '../../common';
import { materialStandardOptions } from '../../../configuration/DictionaryOptions';

export default function ReleaseList(): React.ReactNode {
    const [refresh, setRefresh] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState({});
    const params = useParams<{ id: string, productCategoryId: string }>()
    const history = useHistory();
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
            key: 'materialStandardName',
            title: '标准',
            dataIndex: 'materialStandardName',
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
            key: 'processNum',
            title: '加工数',
            width: 200,
            dataIndex: 'processNum'
        },
        {
            key: 'trialAssembleNum',
            title: '试装数',
            width: 200,
            dataIndex: 'trialAssembleNum'
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
            key: 'holesNum',
            title: '单件孔数',
            width: 200,
            dataIndex: 'holesNum'
        },
        {
            key: 'totalHolesNum',
            title: '总孔数',
            width: 200,
            dataIndex: 'totalHolesNum'
        },
        {
            key: 'craftName',
            title: '工艺',
            width: 200,
            dataIndex: 'craftName'
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
        setFilterValue(value)
        return value
    }
    return (
        <Page
            path="/tower-science/loftingBatch/batchDetail"
            columns={columns}
            onFilterSubmit={onFilterSubmit}
            filterValue={filterValue}
            refresh={refresh}
            requestData={ { productCategoryId:params.productCategoryId, id:params.id } }
            exportPath="/tower-science/loftingBatch/batchDetail"
            extraOperation={<Button style={{margin:'0px 20px 0px 0px'}}  onClick={() => history.goBack()} >返回</Button>}
            searchFormItems={[
                {
                    name: 'materialName',
                    label:'材料名称',
                    children:   <Select style={{width:"100px"}} defaultValue={''}>
                                    { materialStandardOptions && materialStandardOptions.map(({ id, name }, index) => {
                                        <Select.Option value={''} key ={''}>全部</Select.Option>
                                        return <Select.Option key={ index } value={ name }>
                                            { name }
                                        </Select.Option>
                                    }) }
                                </Select>
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