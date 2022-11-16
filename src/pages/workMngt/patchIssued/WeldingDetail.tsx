import React, { useState } from 'react';
import { Input, Button, Form, Space } from 'antd';
import { useHistory, useLocation, useParams, useRouteMatch } from 'react-router-dom';
import { FixedType } from 'rc-table/lib/interface';
import { CommonTable } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import { downloadTemplate } from '../setOut/downloadTemplate';

export default function WeldingDetail(): React.ReactNode {
    const history = useHistory();
    const [filterValue, setFilterValue] = useState<any>({});
    const params = useParams<{ id: string, weldingId: string }>()
    const [pages, setPages] = useState<any>({
        current: 1,
        size: 20
    })
    const { loading, data, run } = useRequest<any[]>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-science/supplyBatch/getBatchWeld`, { ...pages, id: params.id, ...data });
            if(result?.records.length > 0 && result?.records[0]?.id) {
                getSegmentData(result?.records[0]?.id)
            }
            resole(result?.records)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [params.id] })
    
    const { data: segmentData, run: getSegmentData } = useRequest<any[]>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-science/supplyBatch/getBatchWeldStructure`, { segmentId: data })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleChange = async (page: number, pageSize: number) => {
        setPages({
            ...params,
            size: pageSize,
            current: page
        })
    }
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
            render: (number: any) => {
                return number ? [0, '0'].includes(number) ? '否' : '是' : '-'
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
            key: 'structureSpec',
            title: '规格',
            width: 150,
            dataIndex: 'structureSpec',
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
    return (
        <>
            <Form layout="inline" onFinish={async (values) => {
                setFilterValue(values)
                await run({
                    ...values
                })
            }}>
                <Form.Item label='模糊查询项' name='fuzzyMsg'>
                    <Input placeholder="" maxLength={200} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">查询</Button>
                </Form.Item>
                <Form.Item>
                    <Button htmlType="reset">重置</Button>
                </Form.Item>
            </Form>
            <Space direction="horizontal" size="middle" style={{ padding: '6px 0' }}>
                <Button type="primary" onClick={() => {
                    downloadTemplate(`/tower-science/supplyBatch/downloadBatch`, '组焊明细', {
                        id: params.id,
                        fuzzyMsg: filterValue?.fuzzyMsg
                    }, false, 'array')
                }}>导出</Button>
                <Button onClick={() => history.goBack()} >返回</Button>
            </Space>

            <div style={{ display: 'flex', width: '100%' }} >
                <div style={{ width: '40%', paddingRight: '20px' }}>
                    <CommonTable
                        style={{ padding: "0" }}
                        loading={loading}
                        columns={columns}
                        rowKey={(item: any) => `${item.id}`}
                        pagination={{
                            current: pages?.current,
                            pageSize: pages?.size,
                            onChange: handleChange
                        }}
                        onRow={(record: any) => ({
                            onClick: async (event: any) => getSegmentData(record?.id)
                        })}
                        dataSource={data as any || []}
                    />
                </div>
                <div style={{ width: '60%' }} >
                    <CommonTable columns={detailColumns} dataSource={segmentData} pagination={false} />
                </div>
            </div>
        </>
    )
}