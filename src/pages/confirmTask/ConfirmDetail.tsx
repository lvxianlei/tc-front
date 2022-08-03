import React from 'react'
import { Button, Spin, Space } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable, DetailTitle, Attachment } from '../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../utils/RequestUtil';
import TextArea from 'antd/lib/input/TextArea';
import { productTypeOptions, voltageGradeOptions } from '../../configuration/DictionaryOptions';
import { FixedType } from 'rc-table/lib/interface';

const towerColumns = [
    {
        key: 'index',
        title: '序号',
        dataIndex: 'index',
        fixed: "left" as FixedType,
        width: 50,
        render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
    },
    {
        key: 'lineName',
        title: '线路名称',
        width: 100,
        dataIndex: 'lineName'
    },
    {
        key: 'productType',
        title: '产品类型',
        width: 100,
        dataIndex: 'productType',
        render: (value: any, record: object): React.ReactNode => {
            const renderEnum: any = productTypeOptions && productTypeOptions.map(({ id, name }) => {
                return {
                    label: name,
                    value: id,
                }
            })
            return <>{value ? renderEnum && value && renderEnum.find((item: any) => item.value === value).label : '-'}</>
        }
    },
    {
        key: 'voltageLevel',
        title: '电压等级（kv）',
        width: 100,
        dataIndex: 'voltageLevel',
        render: (value: number, record: object): React.ReactNode => {
            const renderEnum: any = voltageGradeOptions && voltageGradeOptions.map(({ id, name }) => {
                return {
                    label: name,
                    value: id,
                }
            })
            return <>{renderEnum && value && renderEnum.find((item: any) => item.value === value).label}</>
        }
    },
    {
        key: 'productCategory',
        title: '塔型',
        width: 100,
        dataIndex: 'productCategory'
    },
    {
        key: 'steelProductShape',
        title: '塔型钢印号',
        width: 100,
        dataIndex: 'steelProductShape'
    },
    {
        key: 'name',
        title: '杆塔号',
        width: 100,
        dataIndex: 'name'
    },
    {
        key: 'basicHeight',
        title: '呼高（m）',
        width: 100,
        dataIndex: 'basicHeight'
    },
    {
        key: 'patternName',
        title: '模式',
        width: 100,
        dataIndex: 'patternName'
    },
    {
        key: 'structure',
        title: '结构',
        width: 100,
        dataIndex: 'structure'
    },
    {
        key: 'legConfigurationA',
        title: '接腿配置A',
        width: 100,
        dataIndex: 'legConfigurationA'
    },
    {
        key: 'legConfigurationB',
        title: '接腿配置B',
        width: 100,
        dataIndex: 'legConfigurationB'
    },
    {
        key: 'legConfigurationC',
        title: '接腿配置C',
        width: 100,
        dataIndex: 'legConfigurationC'
    },
    {
        key: 'legConfigurationD',
        title: '接腿配置D',
        width: 100,
        dataIndex: 'legConfigurationD'
    },
    {
        key: 'legWeightA',
        title: '接腿重A（kg）',
        width: 100,
        dataIndex: 'legWeightA'
    },
    {
        key: 'legWeightB',
        title: '接腿重B（kg）',
        width: 100,
        dataIndex: 'legWeightB'
    },
    {
        key: 'legWeightC',
        title: '接腿重C（kg）',
        width: 100,
        dataIndex: 'legWeightC'
    },
    {
        key: 'legWeightD',
        title: '接腿重D（kg）',
        width: 100,
        dataIndex: 'legWeightD'
    },
    {
        key: 'bodyWeight',
        title: '本体重量（kg）',
        width: 100,
        dataIndex: 'bodyWeight'
    },
    {
        key: 'monomerWeight',
        title: '单重（kg）',
        width: 100,
        dataIndex: 'monomerWeight'
    },
    {
        key: 'totalWeight',
        title: '总重（kg）',
        width: 100,
        dataIndex: 'totalWeight'
    },
    {
        key: 'otherWeightBg',
        title: '其他增重-抱箍（kg）',
        width: 100,
        dataIndex: 'otherWeightBg'
    },
    {
        key: 'otherWeightPt',
        title: '其他增重-平台（kg）',
        width: 100,
        dataIndex: 'otherWeightPt'
    },
    {
        key: 'otherWeightXxp',
        title: '其他增重-相序牌（kg）',
        width: 100,
        dataIndex: 'otherWeightXxp'
    },
    {
        key: 'otherWeightPat',
        title: '其他增重-爬梯（kg）',
        width: 100,
        dataIndex: 'otherWeightPat'
    },
    {
        key: 'otherWeightFd',
        title: '其他增重-防盗（kg）',
        width: 100,
        dataIndex: 'otherWeightFd'
    },
    {
        key: 'otherWeightDdssgkb',
        title: '其他增重-兜底绳施工孔板（kg）',
        width: 100,
        dataIndex: 'otherWeightDdssgkb'
    },
    {
        key: 'otherWeightGdxg',
        title: '其他增重-挂点修改（kg）',
        width: 100,
        dataIndex: 'otherWeightGdxg'
    },
    {
        key: 'otherWeightXg',
        title: '其他增重-修改（kg）',
        width: 100,
        dataIndex: 'otherWeightXg'
    },
    {
        key: 'otherWeightQtsm',
        title: '其他增重-全塔双帽（kg）',
        width: 100,
        dataIndex: 'otherWeightQtsm'
    },
    {
        key: 'otherWeightLs',
        title: '其他增重-螺栓（kg）',
        width: 100,
        dataIndex: 'otherWeightLs'
    },
    {
        key: 'description',
        title: '备注',
        width: 100,
        dataIndex: 'description'
    }
]

export default function ConfirmDetail(): React.ReactNode {
    const history = useHistory()
    const params = useParams<{ id: string }>()
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-science/drawTask/getList?drawTaskId=${params.id}`)
        resole(data)
    }), {})
    const detailData: any = data;
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]}>
                <DetailTitle title="杆塔信息" />
                <CommonTable columns={towerColumns} dataSource={detailData?.drawProductDetailList} pagination={false} />
                <DetailTitle title="备注" />
                <TextArea maxLength={500} showCount rows={3} value={detailData?.description} disabled style={{ padding: '0px 0px 24px 0px' }} />
                {/* <DetailTitle title="附件"/>
            <CommonTable columns={[
                {
                    title: '附件名称',
                    dataIndex: 'name',
                    key: 'name',
                },
                {
                    key: 'operation',
                    title: '操作',
                    dataIndex: 'operation',
                    render: (_: undefined, record: any): React.ReactNode => (
                        <Space direction="horizontal" size="small">
                            <Button type='link' onClick={()=>{window.open(record.filePath)}}>下载</Button>
                            {record.fileSuffix==='pdf'?<Button type='link' onClick={()=>{window.open(record.filePath)}}>预览</Button>:null}
                        </Space>
                    )
                }
            ]} dataSource={detailData?.attachInfoList} /> */}
                <Attachment dataSource={detailData?.fileVOList} />
            </DetailContent>
        </Spin>
    </>
}