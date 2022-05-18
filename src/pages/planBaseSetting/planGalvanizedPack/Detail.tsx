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
        // const data: any = await RequestUtil.get(`/tower-aps/galvanizedPackage/detail`,params.id.indexOf(',')>-1?params?.id.split(','):[params.id])
        // form.setFieldsValue({
        //     packagePlanVOList: data?.packagePlanVOList,
        //     galvanizedPlanVOList: data?.galvanizedPlanVOList
        // })
        form.setFieldsValue({
            packagePlanVOList: [{}],
            galvanizedPlanVOList: [{}]
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
            onOk: async ()=>{
                await form.validateFields()
                const value = form.getFieldsValue(true)
                const submitData = {
                    galvanizedPlanDTOList: value?.galvanizedPlanDTOList.map((item:any,index:number)=>{
                        return {
                            ...detailData?.galvanizedPlanDTOList[index]?.id,
                            ...item,
                            galvanizedFirstUnitId:item?.galvanizedFirst.split(',')[0],
                            galvanizedFirstUnitName:item?.galvanizedFirst.split(',')[1],
                            galvanizedSecondUnitId:item?.galvanizedSecond.split(',')[0],
                            galvanizedSecondUnitName:item?.galvanizedSecond.split(',')[1],
                            galvanizedThirdUnitId:item?.galvanizedThird.split(',')[0],
                            galvanizedThirdUnitName:item?.galvanizedThird.split(',')[1],
                        }
                    }),
                    packagePlanDTOList:  value?.packagePlanDTOList.map((item:any,index:number)=>{
                        return {
                            ...detailData?.packagePlanDTOList[index],
                            ...item,
                            packageFirstUnitId:item?.packageFirst.split(',')[0],
                            packageFirstUnitName:item?.packageFirst.split(',')[1],
                            packageSecondUnitId:item?.packageSecond.split(',')[0],
                            packageSecondUnitName:item?.packageSecond.split(',')[1],
                        }
                    }),
                }
                RequestUtil.post(`/tower-aps/galvanizedPackage/issue`,submitData).then(async ()=>{
                    await message.success('下发成功！')
                    history.goBack()
                })
            }
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
                    name={['galvanizedPlanDTOList', index, "transferStartTime"]}
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
                    name={['galvanizedPlanDTOList', index, "transferEndTime"]}
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
            key: 'galvanizedFirst',
            title: '* 镀锌单元',
            width: 100,
            dataIndex: 'galvanizedFirst',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['galvanizedPlanDTOList', index, "galvanizedFirst"]}
                    initialValue={_}
                    rules={[{
                        required: true,
                        message: '请选择镀锌单元'
                    }]}
                    // initialValue={ record.pattern }
                >
                    <Select style={{width:'100%'}}>
                        { productUnitData && productUnitData.map(({ id, name }:any, index:number) => {
                        return <Select.Option key={ index } value={ id+','+name   }>
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
                    name={['galvanizedPlanDTOList', index, "galvanizedFirstCompleteTime"]}
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
            key: 'galvanizedSecond',
            title: '镀锌单元',
            width: 100,
            dataIndex: 'galvanizedSecond',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['galvanizedPlanDTOList', index, "galvanizedSecond"]}
                    initialValue={_}
                    // initialValue={ record.pattern }
                >
                    <Select style={{width:'100%'}}>
                        { productUnitData && productUnitData.map(({ id, name }:any, index:number) => {
                        return <Select.Option key={ index } value={ id+','+name }>
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
                    name={['galvanizedPlanDTOList', index, "galvanizedSecondCompleteTime"]}
                    initialValue={_}
                    rules={[{
                        required: true,
                        validator: (rule: any, value: any, callback: (error?: string) => void) => {
                            if (value) {
                                callback()
                            } else {
                                if(form.getFieldsValue(true)?.galvanizedPlanDTOList&&form.getFieldsValue(true)?.galvanizedPlanDTOList[index]?.galvanizedSecond){
                                    callback('请选择计划完成日期')
                                }else{
                                    callback()
                                }
                                
                            }
                        }
                    }]}
                >
                    <DatePicker format='YYYY-MM-DD' />
                </Form.Item>
            )
        },
        {
            key: 'galvanizedThird',
            title: '镀锌单元',
            width: 100,
            dataIndex: 'galvanizedThird',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['galvanizedPlanDTOList', index, "galvanizedThird"]}
                    initialValue={_}
                    // initialValue={ record.pattern }
                >
                    <Select style={{width:'100%'}}>
                        { productUnitData && productUnitData.map(({ id, name }:any, index:number) => {
                        return <Select.Option key={ index } value={ id+','+name   }>
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
                    name={['galvanizedPlanDTOList', index, "galvanizedThirdCompleteTime"]}
                    initialValue={_}
                    rules={[{
                        required: true,
                        validator: (rule: any, value: any, callback: (error?: string) => void) => {
                            if (value) {
                                callback()
                            } else {
                                if(form.getFieldsValue(true)?.galvanizedPlanDTOList&&form.getFieldsValue(true)?.galvanizedPlanDTOList[index]?.galvanizedThird){
                                    callback('请选择计划完成日期')
                                }else{
                                    callback()
                                }
                                
                            }
                        }
                    }]}
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
                    name={['galvanizedPlanDTOList', index, "galvanizedDescription"]}
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
            key: 'productionBatchNo',
            title: '批次号',
            width: 100,
            dataIndex: 'productionBatchNo'
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
            key: 'packageFirst',
            title: '* 包装单元',
            width: 100,
            dataIndex: 'packageFirst',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['packagePlanVOList', index, "packageFirst"]}
                    initialValue={_}
                    rules={[{
                        required: true,
                        message: '请选择包装单元'
                    }]}
                    // initialValue={ record.pattern }
                >
                    <Select style={{width:'100%'}}>
                        { productUnitData && productUnitData.map(({ id, name }:any, index:number) => {
                        return <Select.Option key={ index } value={ id+','+name  }>
                            { name }
                            </Select.Option>
                        }) }
                    </Select>
                </Form.Item>
            )
        },
        {
            key: 'packageFirstStartTime',
            title: '* 计划开始日期',
            width: 100,
            dataIndex: 'packageFirstStartTime',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['packagePlanVOList', index, "packageFirstStartTime"]}
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
            key: 'packageSecond',
            title: '包装单元',
            width: 100,
            dataIndex: 'packageSecond',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['packagePlanVOList', index, "packageSecond"]}
                    initialValue={_}
                   
                    // initialValue={ record.pattern }
                >
                    <Select style={{width:'100%'}}>
                        { productUnitData && productUnitData.map(({ id, name }:any, index:number) => {
                        return <Select.Option key={ index } value={ id+','+name   }>
                            { name }
                            </Select.Option>
                        }) }
                    </Select>
                </Form.Item>
            )
        },
        {
            key: 'packageSecondStartTime',
            title: '计划开始日期',
            width: 100,
            dataIndex: 'packageSecondStartTime',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['packagePlanVOList', index, "packageSecondStartTime"]}
                    initialValue={_}
                    rules={[{
                        required: true,
                        validator: (rule: any, value: any, callback: (error?: string) => void) => {
                            if (value) {
                                callback()
                            } else {
                                if(form.getFieldsValue(true)?.packagePlanVOList[index]?.packageSecond){
                                    callback('请选择计划开始日期')
                                }else{
                                    callback()
                                }
                                
                            }
                        }
                    }]}
                >
                    <DatePicker format='YYYY-MM-DD' />
                </Form.Item>
            )
        },
        {
            key: 'packageCompleteTime',
            title: '* 计划完成日期',
            width: 100,
            dataIndex: 'packageCompleteTime',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['packagePlanVOList', index, "packageCompleteTime"]}
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
                    const submitData = {
                        galvanizedPlanDTOList: value?.galvanizedPlanDTOList.map((item:any,index:number)=>{
                            return {
                                ...detailData?.galvanizedPlanDTOList[index]?.id,
                                ...item,
                                galvanizedFirstUnitId:item?.galvanizedFirst.split(',')[0],
                                galvanizedFirstUnitName:item?.galvanizedFirst.split(',')[1],
                                galvanizedSecondUnitId:item?.galvanizedSecond.split(',')[0],
                                galvanizedSecondUnitName:item?.galvanizedSecond.split(',')[1],
                                galvanizedThirdUnitId:item?.galvanizedThird.split(',')[0],
                                galvanizedThirdUnitName:item?.galvanizedThird.split(',')[1],
                            }
                        }),
                        packagePlanDTOList:  value?.packagePlanDTOList.map((item:any,index:number)=>{
                            return {
                                ...detailData?.packagePlanDTOList[index],
                                ...item,
                                packageFirstUnitId:item?.packageFirst.split(',')[0],
                                packageFirstUnitName:item?.packageFirst.split(',')[1],
                                packageSecondUnitId:item?.packageSecond.split(',')[0],
                                packageSecondUnitName:item?.packageSecond.split(',')[1],
                            }
                        }),
                    }
                    RequestUtil.post(`/tower-aps/galvanizedPackage/update`,submitData).then(async ()=>{
                        await message.success('保存成功！')
                        history.go(0)
                    })
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
                    <CommonTable columns={galvanizedColumns} dataSource={[{}]} pagination={false}/>
                    <DetailTitle title="包装计划"/>
                    <CommonTable columns={packColumns} dataSource={[{}]} pagination={false}/>
                </Form>
           
            </DetailContent>
        </Spin>
    </>
}