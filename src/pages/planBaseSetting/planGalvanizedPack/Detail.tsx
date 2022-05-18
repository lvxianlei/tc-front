import React from 'react'
import { Button, Spin, Space, message, Modal, Form, Select, DatePicker} from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable, DetailTitle, Attachment } from '../../common';
import useRequest from '@ahooksjs/use-request';
import styles from './GalvanizedPack.module.less';
import RequestUtil from '../../../utils/RequestUtil';
import TextArea from 'antd/lib/input/TextArea';
import { productTypeOptions, voltageGradeOptions } from '../../../configuration/DictionaryOptions';
import { FixedType } from 'rc-table/lib/interface';



export default function GalvanizedPackDetail(): React.ReactNode {
    const history = useHistory()
    const params = useParams<{ id: string }>()
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-aps/galvanizedPackage/detail`,params.id.indexOf(',')>-1?params?.id.split(','):[params.id])
        form.setFieldsValue({
            packagePlanVOList: data?.packagePlanVOList,
            galvanizedPlanVOList: data?.galvanizedPlanVOList
        })
        resole(data)
    }), {})
    const { data: productUnitData } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-aps/productionUnit?size=10000`);
            resole(result?.records)
        } catch (error) {
            reject(error)
        }
    }))
    const [form] = Form.useForm();
    const detailData: any = data;
    const handleIssue = () => {
        Modal.confirm({
            title: "下发后不可取消，是否下发镀锌包装计划？",
            onOk: async () => new Promise(async (resove, reject) => {
                try {
                    // const result = await deleteRun()
                    message.success("删除成功...")
                    // resove(result)
                    history.goBack()
                } catch (error) {
                    reject(error)
                }
            })
        })
    }

    const galvanizedColumns=[
        {
            key: 'planNumber',
            title: '计划号',
            width: 100,
            dataIndex: 'planNumber'
        },
        {
            key: 'productCategory',
            title: '塔型',
            width: 100,
            dataIndex: 'productCategory'
        },
        {
            key: 'batchNo',
            title: '批次号',
            width: 100,
            dataIndex: 'batchNo'
        },
        {
            key: 'angleWeight',
            title: '角钢重量（t）',
            width: 100,
            dataIndex: 'angleWeight'
        },
        {
            key: 'plateWeight',
            title: '钢板重量（t）',
            width: 100,
            dataIndex: 'plateWeight',
        },
        {
            key: 'angleNumber',
            title: '角钢总件数',
            width: 100,
            dataIndex: 'angleNumber',
        },
        {
            key: 'plateNumber',
            title: '钢板总件数',
            width: 100,
            dataIndex: 'plateNumber',
        },
        {
            key: 'transferStartTime',
            title: '* 转运开始日期',
            width: 100,
            dataIndex: 'transferStartTime',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['packagePlanVOList', index, "transferStartTime"]}
                    initialValue={record.segmentName}
                    rules={[{
                        required: true,
                        message: '请选择开始转运日期'
                    }]}
                >
                    <DatePicker format='YYYY-MM-DD' />
                </Form.Item>
            )
        },
        {
            key: 'transferEndTime',
            title: '* 转运结束日期',
            width: 100,
            dataIndex: 'transferEndTime',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['packagePlanVOList', index, "transferEndTime"]}
                    initialValue={record.segmentName}
                    rules={[{
                        required: true,
                        message: '请选择开始转运日期'
                    }]}
                >
                    <DatePicker format='YYYY-MM-DD' />
                </Form.Item>
            )
        },
        {
            key: 'galvanizedFirstUnitId',
            title: '* 镀锌单元',
            width: 100,
            dataIndex: 'galvanizedFirstUnitId',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['packagePlanVOList', index, "galvanizedFirstUnitId"]}
                    initialValue={_}
                    rules={[{
                        required: true,
                        message: '请选择镀锌单元'
                    }]}
                    // initialValue={ record.pattern }
                >
                    <Select style={{width:'100%'}}>
                        { productUnitData && productUnitData.map(({ id, name }:any, index:number) => {
                        return <Select.Option key={ index } value={ id  }>
                            { name }
                            </Select.Option>
                        }) }
                    </Select>
                </Form.Item>
            )
        },
        {
            key: 'galvanizedFirstCompleteTime',
            title: '* 计划完成日期',
            width: 100,
            dataIndex: 'galvanizedFirstCompleteTime',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['packagePlanVOList', index, "galvanizedFirstCompleteTime"]}
                    initialValue={_}
                    rules={[{
                        required: true,
                        message: '请选择计划完成日期'
                    }]}
                >
                    <DatePicker format='YYYY-MM-DD' />
                </Form.Item>
            )
        },
        {
            key: 'galvanizedSecondUnitId',
            title: '镀锌单元',
            width: 100,
            dataIndex: 'galvanizedSecondUnitId',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['packagePlanVOList', index, "galvanizedSecondUnitId"]}
                    initialValue={_}
                    // initialValue={ record.pattern }
                >
                    <Select style={{width:'100%'}}>
                        { productUnitData && productUnitData.map(({ id, name }:any, index:number) => {
                        return <Select.Option key={ index } value={ id  }>
                            { name }
                            </Select.Option>
                        }) }
                    </Select>
                </Form.Item>
            )
        },
        {
            key: 'galvanizedSecondCompleteTime',
            title: '计划完成日期',
            width: 100,
            dataIndex: 'galvanizedSecondCompleteTime',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['packagePlanVOList', index, "galvanizedSecondCompleteTime"]}
                    initialValue={_}
                >
                    <DatePicker format='YYYY-MM-DD' />
                </Form.Item>
            )
        },
        {
            key: 'galvanizedThirdUnitId',
            title: '镀锌单元',
            width: 100,
            dataIndex: 'galvanizedThirdUnitId',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['packagePlanVOList', index, "galvanizedThirdUnitId"]}
                    initialValue={_}
                    // initialValue={ record.pattern }
                >
                    <Select style={{width:'100%'}}>
                        { productUnitData && productUnitData.map(({ id, name }:any, index:number) => {
                        return <Select.Option key={ index } value={ id  }>
                            { name }
                            </Select.Option>
                        }) }
                    </Select>
                </Form.Item>
            )
        },
        {
            key: 'galvanizedThirdCompleteTime',
            title: '计划完成日期',
            width: 100,
            dataIndex: 'galvanizedThirdCompleteTime',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['packagePlanVOList', index, "galvanizedThirdCompleteTime"]}
                    initialValue={_}
                >
                    <DatePicker format='YYYY-MM-DD' />
                </Form.Item>
            )
        },
        {
            key: 'galvanizedDescription',
            title: '镀锌备注',
            width: 100,
            dataIndex: 'productType',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['packagePlanVOList', index, "galvanizedDescription"]}
                    initialValue={_}
                >
                    <TextArea
                        size="small"
                        rows={1}
                        showCount
                        maxLength={300}
                    />
                </Form.Item>
            )
        },
    ]


    const packColumns=[
        {
            key: 'planNumber',
            title: '计划号',
            width: 100,
            dataIndex: 'planNumber'
        },
        {
            key: 'productCategory',
            title: '塔型',
            width: 100,
            dataIndex: 'productCategory'
        },
        {
            key: 'batchNo',
            title: '批次号',
            width: 100,
            dataIndex: 'batchNo'
        },
        {
            key: 'angleWeight',
            title: '角钢重量（t）',
            width: 100,
            dataIndex: 'angleWeight'
        },
        {
            key: 'plateWeight',
            title: '钢板重量（t）',
            width: 100,
            dataIndex: 'plateWeight',
        },
        {
            key: 'angleNumber',
            title: '角钢总件数',
            width: 100,
            dataIndex: 'angleNumber',
        },
        {
            key: 'plateNumber',
            title: '钢板总件数',
            width: 100,
            dataIndex: 'plateNumber',
        },
        {
            key: 'packageFirstUnitId',
            title: '* 包装单元',
            width: 100,
            dataIndex: 'packageFirstUnitId',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['packagePlanVOList', index, "packageFirstUnitId"]}
                    initialValue={_}
                    rules={[{
                        required: true,
                        message: '请选择包装单元'
                    }]}
                    // initialValue={ record.pattern }
                >
                    <Select style={{width:'100%'}}>
                        { productUnitData && productUnitData.map(({ id, name }:any, index:number) => {
                        return <Select.Option key={ index } value={ id  }>
                            { name }
                            </Select.Option>
                        }) }
                    </Select>
                </Form.Item>
            )
        },
        {
            key: 'packageFirstCompleteTime',
            title: '* 计划开始日期',
            width: 100,
            dataIndex: 'packageFirstCompleteTime',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['packagePlanVOList', index, "packageFirstCompleteTime"]}
                    initialValue={record.segmentName}
                    rules={[{
                        required: true,
                        message: '请选择计划开始日期'
                    }]}
                >
                    <DatePicker format='YYYY-MM-DD' />
                </Form.Item>
            )
        },
        {
            key: 'productType',
            title: '包装单元',
            width: 100,
            dataIndex: 'packageSecondUnitId',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['packagePlanVOList', index, "packageSecondUnitId"]}
                    initialValue={_}
                    // initialValue={ record.pattern }
                >
                    <Select style={{width:'100%'}}>
                        { productUnitData && productUnitData.map(({ id, name }:any, index:number) => {
                        return <Select.Option key={ index } value={ id  }>
                            { name }
                            </Select.Option>
                        }) }
                    </Select>
                </Form.Item>
            )
        },
        {
            key: 'packageSecondCompleteTime',
            title: '计划开始日期',
            width: 100,
            dataIndex: 'packageSecondCompleteTime',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['packagePlanVOList', index, "packageSecondCompleteTime"]}
                    initialValue={record.segmentName}
                >
                    <DatePicker format='YYYY-MM-DD' />
                </Form.Item>
            )
        },
        {
            key: 'productType',
            title: '* 计划完成日期',
            width: 100,
            dataIndex: 'productType',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['packagePlanVOList', index, "A"]}
                    initialValue={record.segmentName}
                    rules={[{
                        required: true,
                        message: '请选择计划完成日期'
                    }]}
                >
                    <DatePicker format='YYYY-MM-DD' />
                </Form.Item>
            )
        },
        {
            key: 'reportTime',
            title: '* 报补件日期',
            width: 100,
            dataIndex: 'reportTime',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['packagePlanVOList', index, "reportTime"]}
                    initialValue={record.segmentName}
                    rules={[{
                        required: true,
                        message: '请选择报补件日期'
                    }]}
                >
                    <DatePicker format='YYYY-MM-DD' />
                </Form.Item>
            )
        },
        {
            key: 'storageTime',
            title: '* 入库日期',
            width: 100,
            dataIndex: 'storageTime',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['packagePlanVOList', index, "storageTime"]}
                    initialValue={record.segmentName}
                    rules={[{
                        required: true,
                        message: '请选择入库日期'
                    }]}
                >
                    <DatePicker format='YYYY-MM-DD' />
                </Form.Item>
            )
        },
        {
            key: 'packageDescription',
            title: '包装备注',
            width: 100,
            dataIndex: 'packageDescription',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['packagePlanVOList', index, "packageDescription"]}
                    initialValue={_}
                >
                    <TextArea
                        size="small"
                        rows={1}
                        showCount
                        maxLength={300}
                    />
                </Form.Item>
            )
        },
    ]
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Space>
                <Button type='primary' onClick={async () => {
                    await form.validateFields()
                    const value = form.getFieldsValue(true)
                }}>保存</Button>
                <Button type='primary' onClick={handleIssue}>镀锌包装下发</Button>
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
                </Space>
            ]}>
                <Form form={form}  className={styles.descripForm}>
                    <DetailTitle title="镀锌计划"/>
                    <Space>
                        <span>合计：</span>
                        <span>角钢重量（t）：{detailData?.totalAngleWeight}</span>
                        <span>钢板重量（t）：{detailData?.totalPlateWeight}</span>
                        <span>角钢总件数：{detailData?.totalAngleNumber}</span>
                        <span>钢板总件数：{detailData?.totalPlateNumber}</span>
                    </Space>
                    <CommonTable columns={galvanizedColumns} dataSource={[...detailData?.galvanizedPlanVOList]} pagination={false}/>
                    <DetailTitle title="包装计划"/>
                    <CommonTable columns={packColumns} dataSource={[...detailData?.packagePlanVOList]} pagination={false}/>
                </Form>
           
            </DetailContent>
        </Spin>
    </>
}