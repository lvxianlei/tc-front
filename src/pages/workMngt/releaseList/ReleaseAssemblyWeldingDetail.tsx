import React, { useState } from 'react';
import { Space, Input, DatePicker, Button, Form, Select } from 'antd';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { FixedType } from 'rc-table/lib/interface';
import { CommonTable, Page } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import AuthUtil from '../../../utils/AuthUtil';
import useRequest from '@ahooksjs/use-request';

export default function ReleaseList(): React.ReactNode {
    const history = useHistory();
    const [refresh, setRefresh] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState({});
    const [segmentDataSource, setSegmentDataSource] = useState<any[]>([]);
    const params = useParams<{ id: string }>()
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
            width: 100,
            dataIndex: 'segmentName'
        },
        {
            key: 'mainPartId',
            title: '组件号',
            width: 100,
            dataIndex: 'mainPartId'
        },
        {
            key: 'processGroupNum',
            title: '加工组数',
            dataIndex: 'processGroupNum',
            width: 120
        },
        {
            key: 'singleGroupWeight',
            title: '单组重量（kg）',
            width: 100,
            dataIndex: 'singleGroupWeight'
        },
        {
            key: 'electricWeldingMeters',
            title: '电焊米数（mm）',
            width: 100,
            dataIndex: 'electricWeldingMeters',
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
            key: 'code',
            title: '零部件号',
            width: 150,
            dataIndex: 'code'
        },
        {
            key: 'isMainPart',
            title: '是否主件',
            width: 150,
            dataIndex: 'isMainPart',
            render:(number:any)=>{
                return number?[0,'0'].includes(number)?'否':'是':'-'
            }
        },
        {
            key: 'materialName',
            title: '材料',
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
            key: 'structureTexture',
            title: '规格',
            width: 150,
            dataIndex: 'structureTexture',
        },
        {
            key: 'length',
            title: '长度（mm）',
            width: 150,
            dataIndex: 'length',
        },
        {
            key: 'width',
            title: '宽度（mm）',
            width: 150,
            dataIndex: 'width',
        },
        {
            key: 'singleNum',
            title: '单组件数',
            width: 150,
            dataIndex: 'singleNum',
        },
        {
            key: 'craftName',
            title: '工艺',
            width: 150,
            dataIndex: 'craftName',
        }
    ]
    const onFilterSubmit = (value: any) => {
        setFilterValue(value)
        return value
    }
    return (
        <div style={{display:'flex',width:'100%'}} >
            <div style={{width:'40%'}}>
                <Page
                    path="/tower-science/welding/getDetailedById"
                    columns={columns}
                    onFilterSubmit={onFilterSubmit}
                    filterValue={filterValue}
                    refresh={refresh}
                    requestData={ {weldingId:params.id } }
                    exportPath="/tower-science/welding/getDetailedById"
                    tableProps={{
                        onRow:(record:any) => ({
                            onClick: async (event: any) => {
                                const data:any = await RequestUtil.get(`/tower-science/welding/getStructureById`,{segmentId: record.id});
                                // setSegmentDataSource([{craftName:1},{craftName:2}]);
                                setSegmentDataSource([...data]);
                            }
                        })
                    }}
                    searchFormItems={[
                        {
                            name: 'fuzzyMsg',
                            label: '模糊查询项',
                            children: <Input placeholder="" maxLength={200} />
                        },
                    ]}
                />
            </div>
            <div style={{width:'60%'}}>
                <CommonTable columns={detailColumns} dataSource={segmentDataSource} pagination={false}/>
            </div>
        </div>
    )
}