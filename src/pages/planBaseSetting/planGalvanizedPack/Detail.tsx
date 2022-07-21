import React, { useState } from 'react'
import { Button, Spin, Space, message, Modal, Form, Select, DatePicker} from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable, DetailTitle } from '../../common';
import useRequest from '@ahooksjs/use-request';
import styles from './GalvanizedPack.module.less';
import RequestUtil from '../../../utils/RequestUtil';
import TextArea from 'antd/lib/input/TextArea';
import { FixedType } from 'rc-table/lib/interface';
import zhCN from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
const pack=[
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
        key: 'totalWeight',
        title: '总重量（t）',
        width: 100,
        dataIndex: 'totalWeight'
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
        key: 'packageFirstUnitName',
        title: '* 包装单元',
        width: 150,
        dataIndex: 'packageFirstUnitName',
    },
    {
        key: 'packageFirstStartTime',
        title: '* 计划开始日期',
        width: 150,
        dataIndex: 'packageFirstStartTime',
        type:'date',
        format:'YYYY-MM-DD'
    },
    {
        key: 'packageSecondUnitName',
        title: '包装单元',
        width: 150,
        dataIndex: 'packageSecondUnitName',
    },
    {
        key: 'packageSecondStartTime',
        title: '计划开始日期',
        width: 150,
        dataIndex: 'packageSecondStartTime',
        type:'date',
        format:'YYYY-MM-DD'
    },
    {
        key: 'packageCompleteTime',
        title: '* 计划完成日期',
        width: 150,
        dataIndex: 'packageCompleteTime',
        type:'date',
        format:'YYYY-MM-DD'
    },
    {
        key: 'reportTime',
        title: '* 报补件日期',
        width: 150,
        dataIndex: 'reportTime',
        type:'date',
        format:'YYYY-MM-DD'
    },
    {
        key: 'storageTime',
        title: '* 入库日期',
        width: 150,
        dataIndex: 'storageTime',
        type:'date',
        format:'YYYY-MM-DD'
    },
    {
        key: 'packageDescription',
        title: '包装备注',
        width: 150,
        dataIndex: 'packageDescription'
    },
]
const galvanized=[
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
        key: 'totalWeight',
        title: '总重量（t）',
        width: 100,
        dataIndex: 'totalWeight'
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
        width: 150,
        dataIndex: 'transferStartTime',
        type:'date',
        format:'YYYY-MM-DD'
    },
    {
        key: 'transferEndTime',
        title: '* 转运结束日期',
        width: 150,
        dataIndex: 'transferEndTime',
        type:'date',
        format:'YYYY-MM-DD'
    },
    {
        key: 'galvanizedFirstUnitName',
        title: '* 镀锌单元',
        width: 150,
        dataIndex: 'galvanizedFirstUnitName'
    },
    {
        key: 'galvanizedFirstCompleteTime',
        title: '* 计划完成日期',
        width: 150,
        dataIndex: 'galvanizedFirstCompleteTime',
        type:'date',
        format:'YYYY-MM-DD'
    },
    {
        key: 'galvanizedSecondUnitName',
        title: '镀锌单元',
        width: 150,
        dataIndex: 'galvanizedSecondUnitName',
    },
    {
        key: 'galvanizedSecondCompleteTime',
        title: '计划完成日期',
        width: 150,
        dataIndex: 'galvanizedSecondCompleteTime',
        type:'date',
        format:'YYYY-MM-DD'
    },
    {
        key: 'galvanizedThirdUnitName',
        title: '镀锌单元',
        width: 150,
        dataIndex: 'galvanizedThirdUnitName',
    },
    {
        key: 'galvanizedThirdCompleteTime',
        title: '计划完成日期',
        width: 150,
        dataIndex: 'galvanizedThirdCompleteTime',
        type:'date',
        format:'YYYY-MM-DD'
    },
    {
        key: 'galvanizedDescription',
        title: '镀锌备注',
        width: 150,
        dataIndex: 'galvanizedDescription'
    },
]

export default function GalvanizedPackDetail(): React.ReactNode {
    const history = useHistory()
    const params = useParams<{ id: string }>()
    const [detailData, setDetailData] = useState<any>({
        galvanizedPlanVOList:[],
        packagePlanVOList:[]
    })
    const [galvanizedSelectedKeys, setGalvanizedSelectedKeys] = useState<React.Key[]>([]);
    const [galvanizedSelectedRows, setGalvanizedSelectedRows] = useState<any[]>([]);
    const [packSelectedKeys, setPackSelectedKeys] = useState<React.Key[]>([]);
    const [packSelectedRows, setPackSelectedRows] = useState<any[]>([]);
    // const [lock, setLock] = useState<string>('编辑')
    const [galvanizedForm] = Form.useForm();
    const onGalvanizedSelectChange = (selectedRowKeys: string[], selectRows: any[]) => {
        setGalvanizedSelectedKeys(selectedRowKeys);
        setGalvanizedSelectedRows(selectRows);
    }
    const onPackSelectChange = (selectedRowKeys: string[], selectRows: any[]) => {
        setPackSelectedKeys(selectedRowKeys);
        setPackSelectedRows(selectRows);
    }
    const [packForm] = Form.useForm();
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.post(`/tower-aps/galvanizedPackage/detail`,params?.id.indexOf(',')>-1?params?.id.split(','):[params.id])
        // const detailData = {
        //     ...data,
        //     packagePlanVOList:data?.packagePlanVOList&&data?.packagePlanVOList.length>0&&data?.packagePlanVOList.map((item:any)=>{
        //         return {
        //             ...item,
        //             packageFirst: item?.packageFirstUnitId&&item?.packageFirstUnitName?item?.packageFirstUnitId+','+item?.packageFirstUnitName:'',
        //             packageSecond: item?.packageSecondUnitId&&item?.packageSecondUnitName?item?.packageSecondUnitId+','+item?.packageSecondUnitName:'',
        //             storageTime: item?.storageTime?moment(item?.storageTime):'',
        //             reportTime: item?.reportTime?moment(item?.reportTime):'',
        //             packageCompleteTime: item?.packageCompleteTime?moment(item?.packageCompleteTime):'',
        //             packageFirstStartTime: item?.packageFirstStartTime?moment(item?.packageFirstStartTime):'',
        //             packageSecondStartTime: item?.packageSecondStartTime?moment(item?.packageSecondStartTime):'',
        //         }
        //     })||[],
        //     galvanizedPlanVOList: data?.galvanizedPlanVOList&&data?.galvanizedPlanVOList.length>0&&data?.galvanizedPlanVOList.map((item:any)=>{
        //         return {
        //             ...item,
        //             galvanizedFirst: item?.galvanizedFirstUnitId&&item?.galvanizedFirstUnitName?item?.galvanizedFirstUnitId+','+item?.galvanizedFirstUnitName:'',
        //             galvanizedSecond: item?.galvanizedSecondUnitId&&item?.galvanizedSecondUnitName?item?.galvanizedSecondUnitId+','+item?.galvanizedSecondUnitName:'',
        //             galvanizedThird: item?.galvanizedThirdUnitId&&item?.galvanizedThirdUnitName?item?.galvanizedThirdUnitId+','+item?.galvanizedThirdUnitName:'',
        //             transferStartTime: item?.storageTime?moment(item?.storageTime):'',
        //             transferEndTime: item?.reportTime?moment(item?.reportTime):'',
        //             galvanizedFirstCompleteTime: item?.galvanizedFirstCompleteTime?moment(item?.galvanizedFirstCompleteTime):'',
        //             galvanizedSecondCompleteTime: item?.galvanizedSecondCompleteTime?moment(item?.galvanizedSecondCompleteTime):'',
        //             galvanizedThirdCompleteTime: item?.galvanizedThirdCompleteTime?moment(item?.galvanizedThirdCompleteTime):'',
        //         }
        //     })||[],
        // }
        setDetailData(data)
        form.setFieldsValue({
            packagePlanDTOList: data?.packagePlanVOList&&data?.packagePlanVOList.length>0&&data?.packagePlanVOList.map((item:any)=>{
                return {
                    ...item,
                    packageFirst: item?.packageFirstUnitId&&item?.packageFirstUnitName?item?.packageFirstUnitId+','+item?.packageFirstUnitName:'',
                    packageSecond: item?.packageSecondUnitId&&item?.packageSecondUnitName?item?.packageSecondUnitId+','+item?.packageSecondUnitName:'',
                    storageTime: item?.storageTime?moment(item?.storageTime):'',
                    reportTime: item?.reportTime?moment(item?.reportTime):'',
                    packageCompleteTime: item?.packageCompleteTime?moment(item?.packageCompleteTime):'',
                    packageFirstStartTime: item?.packageFirstStartTime?moment(item?.packageFirstStartTime):'',
                    packageSecondStartTime: item?.packageSecondStartTime?moment(item?.packageSecondStartTime):'',
                }
            })||[],
            galvanizedPlanDTOList: data?.galvanizedPlanVOList&&data?.galvanizedPlanVOList.length>0&&data?.galvanizedPlanVOList.map((item:any)=>{
                return {
                    ...item,
                    galvanizedFirst: item?.galvanizedFirstUnitId&&item?.galvanizedFirstUnitName?item?.galvanizedFirstUnitId+','+item?.galvanizedFirstUnitName:'',
                    galvanizedSecond: item?.galvanizedSecondUnitId&&item?.galvanizedSecondUnitName?item?.galvanizedSecondUnitId+','+item?.galvanizedSecondUnitName:'',
                    galvanizedThird: item?.galvanizedThirdUnitId&&item?.galvanizedThirdUnitName?item?.galvanizedThirdUnitId+','+item?.galvanizedThirdUnitName:'',
                    transferStartTime: item?.transferStartTime?moment(item?.transferStartTime):'',
                    transferEndTime: item?.transferEndTime?moment(item?.transferEndTime):'',
                    galvanizedFirstCompleteTime: item?.galvanizedFirstCompleteTime?moment(item?.galvanizedFirstCompleteTime):'',
                    galvanizedSecondCompleteTime: item?.galvanizedSecondCompleteTime?moment(item?.galvanizedSecondCompleteTime):'',
                    galvanizedThirdCompleteTime: item?.galvanizedThirdCompleteTime?moment(item?.galvanizedThirdCompleteTime):'',
                }
            })||[],
        })
        resole(data)
    }), {})
    const { data: productGalvanizeUnitData } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-aps/productionUnit/trial/galvanize`);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))
    const { data: productPackUnitData } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-aps/productionUnit/trial/packaging`);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))
    const { run: galvanizedDate } = useRequest((option) => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.post(`/tower-aps/galvanizedPackage/update/galvanized`, option);
            resole(result)
        } catch (error) {
            console.log(error)
            reject(error)
        }
    }), { manual: true })
    const { run: packDate } = useRequest((option) => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.post(`/tower-aps/galvanizedPackage/update/package`, option);
            resole(result)
        } catch (error) {
            console.log(error)
            reject(error)
        }
    }), { manual: true })
    const [form] = Form.useForm();
    const handleIssue = () => {
        Modal.confirm({
            title: "下发后不可取消，是否下发镀锌包装计划？",
            onOk: async ()=>{
                await form.validateFields()
                const value = form.getFieldsValue(true)
                const submitData = {
                    galvanizedPlanDTOList: detailData?.galvanizedPlanVOList,
                    packagePlanDTOList:  detailData?.packagePlanVOList
                    // galvanizedPlanDTOList: value?.galvanizedPlanDTOList.map((item:any,index:number)=>{
                    //     return {
                    //         ...detailData?.galvanizedPlanVOList[index]?.id,
                    //         ...item,
                    //         galvanizedFirstUnitId:item?.galvanizedFirst.split(',')[0],
                    //         galvanizedFirstUnitName:item?.galvanizedFirst.split(',')[1],
                    //         galvanizedSecondUnitId:item?.galvanizedSecond?item?.galvanizedSecond.split(',')[0]:'',
                    //         galvanizedSecondUnitName:item?.galvanizedSecond?item?.galvanizedSecond.split(',')[1]:'',
                    //         galvanizedThirdUnitId:item?.galvanizedThird?item?.galvanizedThird.split(',')[0]:"",
                    //         galvanizedThirdUnitName:item?.galvanizedThird?item?.galvanizedThird.split(',')[1]:'',
                    //         transferStartTime: item?.transferStartTime?moment(item?.transferStartTime).format('YYYY-MM-DD'):'',
                    //         transferEndTime: item?.transferEndTime?moment(item?.transferEndTime).format('YYYY-MM-DD'):'',
                    //         galvanizedFirstCompleteTime: item?.galvanizedFirstCompleteTime?moment(item?.galvanizedFirstCompleteTime).format('YYYY-MM-DD'):'',
                    //         galvanizedSecondCompleteTime: item?.galvanizedSecondCompleteTime?moment(item?.galvanizedSecondCompleteTime).format('YYYY-MM-DD'):'',
                    //         galvanizedThirdCompleteTime: item?.galvanizedThirdCompleteTime?moment(item?.galvanizedThirdCompleteTime).format('YYYY-MM-DD'):'',
                    //     }
                    // }),
                    // packagePlanDTOList:  value?.packagePlanDTOList.map((item:any,index:number)=>{
                    //     return {
                    //         ...detailData?.packagePlanVOList[index],
                    //         ...item,
                    //         packageFirstUnitId:item?.packageFirst.split(',')[0],
                    //         packageFirstUnitName:item?.packageFirst.split(',')[1],
                    //         packageSecondUnitId:item?.packageSecond?item?.packageSecond.split(',')[0]:'',
                    //         packageSecondUnitName:item?.packageSecond?item?.packageSecond.split(',')[1]:'',
                    //         storageTime: item?.storageTime?moment(item?.storageTime).format('YYYY-MM-DD'):'',
                    //         reportTime: item?.reportTime?moment(item?.reportTime).format('YYYY-MM-DD'):'',
                    //         packageCompleteTime: item?.packageCompleteTime?moment(item?.packageCompleteTime).format('YYYY-MM-DD'):'',
                    //         packageFirstStartTime: item?.packageFirstStartTime?moment(item?.packageFirstStartTime).format('YYYY-MM-DD'):'',
                    //         packageSecondStartTime: item?.packageSecondStartTime?moment(item?.packageSecondStartTime).format('YYYY-MM-DD'):'',
                    //     }
                    // }),
                }
                RequestUtil.put(`/tower-aps/galvanizedPackage/issue`,submitData).then(async ()=>{
                    message.success('下发成功！')
                    history.goBack()
                })
            }
        })
    }
    //批量包装
    const usePack = () => {
        Modal.confirm({
            title: "包装信息",
            icon: null,
            content: <Form form={packForm} labelCol={{span:6}}>
                <Form.Item
                    label='包装单元'
                    name="packageFirst"
                    rules={[{
                        required: true,
                        message: '请选择包装单元'
                    }]}
                    // initialValue={ record.pattern }
                >
                    <Select style={{width:'100%'}} allowClear>
                        { productPackUnitData && productPackUnitData.map(({ id, name }:any, index:number) => {
                        return <Select.Option key={ index } value={ id+','+name  }>
                            { name }
                            </Select.Option>
                        }) }
                    </Select>
                </Form.Item>
                <Form.Item
                    label='计划开始日期'
                    name='packageFirstStartTime'
                    rules={[{
                        required: true,
                        message: '请选择计划开始日期'
                    }]}
                >
                    <DatePicker style={{width:'100%'}} format='YYYY-MM-DD' locale={zhCN}/>
                </Form.Item>
                <Form.Item
                    label='包装单元'
                    name="packageSecond"
                    // initialValue={ record.pattern }
                >
                    <Select style={{width:'100%'}} allowClear>
                        { productPackUnitData && productPackUnitData.map(({ id, name }:any, index:number) => {
                        return <Select.Option key={ index } value={ id+','+name  }>
                            { name }
                            </Select.Option>
                        }) }
                    </Select>
                </Form.Item>
                <Form.Item
                    label='计划开始日期'
                    name='packageSecondStartTime'
                >
                    <DatePicker style={{width:'100%'}} format='YYYY-MM-DD' locale={zhCN}/>
                </Form.Item>
                <Form.Item
                    label='计划完成日期'
                    name='packageCompleteTime'
                    rules={[{
                        required: true,
                        message: '请选择计划完成日期'
                    }]}
                >
                    <DatePicker style={{width:'100%'}} format='YYYY-MM-DD' locale={zhCN}/>
                </Form.Item>
                <Form.Item
                    label='报补件日期'
                    name='reportTime'
                    rules={[{
                        required: true,
                        message: '请选择报补件日期'
                    }]}
                >
                    <DatePicker  style={{width:'100%'}} format='YYYY-MM-DD' locale={zhCN}/>
                </Form.Item>
                <Form.Item
                    label='入库日期'
                    name='storageTime'
                    rules={[{
                        required: true,
                        message: '请选择入库日期'
                    }]}
                >
                    <DatePicker  style={{width:'100%'}} format='YYYY-MM-DD' locale={zhCN}/>
                </Form.Item>
                <Form.Item
                    label='包装备注'
                    name="packageDescription"
                >
                    <TextArea
                        size="small"
                        rows={1}
                        showCount
                        maxLength={200}
                    />
                </Form.Item>
            </Form>,
            onOk: () => new Promise(async (resove, reject) => {
                try {
                    const value = await packForm.validateFields()
                    await packDate({
                        ...value,
                        ids: packSelectedKeys,
                        packageFirstUnitId:value?.packageFirst.split(',')[0],
                        packageFirstUnitName:value?.packageFirst.split(',')[1],
                        packageSecondUnitId:value?.packageSecond?value?.packageSecond.split(',')[0]:"",
                        packageSecondUnitName:value?.packageSecond?value?.packageSecond.split(',')[1]:'',
                        storageTime: value?.storageTime?moment(value?.storageTime).format('YYYY-MM-DD'):'',
                        reportTime: value?.reportTime?moment(value?.reportTime).format('YYYY-MM-DD'):'',
                        packageCompleteTime: value?.packageCompleteTime?moment(value?.packageCompleteTime).format('YYYY-MM-DD'):'',
                        packageFirstStartTime: value?.packageFirstStartTime?moment(value?.packageFirstStartTime).format('YYYY-MM-DD'):'',
                        packageSecondStartTime: value?.packageSecondStartTime?moment(value?.packageSecondStartTime).format('YYYY-MM-DD'):'',
                    
                    })
                    await message.success("已成功设置包装计划！")
                    setPackSelectedKeys([])
                    setPackSelectedRows([])
                    packForm.resetFields()
                    history.go(0)
                    resove(true)
                } catch (error) {
                    reject(false)
                }
            }),
            onCancel() {
                packForm.resetFields()
            }
        })
    }
    //批量镀锌
    const useGalvanized = () => {
        Modal.confirm({
            title: "镀锌信息",
            icon: null,
            content: <Form form={galvanizedForm} labelCol={{span:6}}>
                <Form.Item
                    label='转运起止日期'
                    name='transferTime'
                    rules={[{
                        required: true,
                        message: '请选择转运起止日期'
                    }]}
                >
                    <DatePicker.RangePicker style={{width:'100%'}} format='YYYY-MM-DD' locale={zhCN}/>
                </Form.Item>
                <Form.Item
                    label='镀锌单元'
                    name="galvanizedFirst"
                    rules={[{
                        required: true,
                        message: '请选择镀锌单元'
                    }]}
                    // initialValue={ record.pattern }
                >
                    <Select style={{width:'100%'}} allowClear>
                        { productGalvanizeUnitData && productGalvanizeUnitData.map(({ id, name }:any, index:number) => {
                        return <Select.Option key={ index } value={ id+','+name   }>
                            { name }
                            </Select.Option>
                        }) }
                    </Select>
                </Form.Item>
                <Form.Item
                    label='计划完成日期'
                    name='galvanizedFirstCompleteTime'
                    rules={[{
                        required: true,
                        message: '请选择计划完成日期'
                    }]}
                >
                    <DatePicker style={{width:'100%'}} format='YYYY-MM-DD' locale={zhCN}/>
                </Form.Item>
                <Form.Item
                    label='镀锌单元'
                    name="galvanizedSecond"
                    // initialValue={ record.pattern }
                >
                    <Select style={{width:'100%'}} allowClear>
                        { productGalvanizeUnitData && productGalvanizeUnitData.map(({ id, name }:any, index:number) => {
                        return <Select.Option key={ index } value={ id+','+name   }>
                            { name }
                            </Select.Option>
                        }) }
                    </Select>
                </Form.Item>
                <Form.Item
                    label='计划完成日期'
                    name='galvanizedSecondCompleteTime'
                >
                    <DatePicker style={{width:'100%'}} format='YYYY-MM-DD' locale={zhCN}/>
                </Form.Item>
                <Form.Item
                    label='镀锌单元'
                    name="galvanizedThird"
                    // initialValue={ record.pattern }
                >
                    <Select style={{width:'100%'}} allowClear>
                        { productGalvanizeUnitData && productGalvanizeUnitData.map(({ id, name }:any, index:number) => {
                        return <Select.Option key={ index } value={ id+','+name   }>
                            { name }
                            </Select.Option>
                        }) }
                    </Select>
                </Form.Item>
                <Form.Item
                    label='计划完成日期'
                    name='galvanizedThirdCompleteTime'
                >
                    <DatePicker style={{width:'100%'}} format='YYYY-MM-DD' locale={zhCN}/>
                </Form.Item>
                <Form.Item
                    label='镀锌备注'
                    name="galvanizedDescription"
                >
                    <TextArea
                        size="small"
                        rows={1}
                        showCount
                        maxLength={200}
                    />
                </Form.Item>
            </Form>,
            onOk: () => new Promise(async (resove, reject) => {
                try {
                    const value = await galvanizedForm.validateFields()
                    if (value.transferTime) {
                        const formatDate = value.transferTime.map((item: any) => item.format("YYYY-MM-DD"))
                        value.transferStartTime = formatDate[0] + ' 00:00:00';
                        value.transferEndTime = formatDate[1] + ' 23:59:59';
                        delete value.transferTime
                    }
                    await galvanizedDate({
                        ...value,
                        ids: galvanizedSelectedKeys,
                        galvanizedFirstUnitId:value?.galvanizedFirst.split(',')[0],
                        galvanizedFirstUnitName:value?.galvanizedFirst.split(',')[1],
                        galvanizedSecondUnitId:value?.galvanizedSecond?value?.galvanizedSecond.split(',')[0]:"",
                        galvanizedSecondUnitName:value?.galvanizedSecond?value?.galvanizedSecond.split(',')[1]:"",
                        galvanizedThirdUnitId:value?.galvanizedThird?value?.galvanizedThird.split(',')[0]:"",
                        galvanizedThirdUnitName:value?.galvanizedThird?value?.galvanizedThird.split(',')[1]:'',
                        transferStartTime: value?.transferStartTime?moment(value?.transferStartTime).format('YYYY-MM-DD'):'',
                        transferEndTime: value?.transferEndTime?moment(value?.transferEndTime).format('YYYY-MM-DD'):'',
                        galvanizedFirstCompleteTime: value?.galvanizedFirstCompleteTime?moment(value?.galvanizedFirstCompleteTime).format('YYYY-MM-DD'):'',
                        galvanizedSecondCompleteTime: value?.galvanizedSecondCompleteTime?moment(value?.galvanizedSecondCompleteTime).format('YYYY-MM-DD'):'',
                        galvanizedThirdCompleteTime: value?.galvanizedThirdCompleteTime?moment(value?.galvanizedThirdCompleteTime).format('YYYY-MM-DD'):'',            
                    })
                    await message.success("已成功设置镀锌计划！")
                    setGalvanizedSelectedKeys([])
                    setGalvanizedSelectedRows([])
                    galvanizedForm.resetFields()
                    history.go(0)
                    resove(true)
                } catch (error) {
                    reject(false)
                }
            }),
            onCancel() {
                galvanizedForm.resetFields()
            }
        })
    }

    // const galvanizedColumns=[
    //     {
    //         key: 'planNumber',
    //         title: '计划号',
    //         width: 100,
    //         dataIndex: 'planNumber'
    //     },
    //     {
    //         key: 'productCategory',
    //         title: '塔型',
    //         width: 100,
    //         dataIndex: 'productCategory'
    //     },
    //     {
    //         key: 'productionBatchNo',
    //         title: '批次号',
    //         width: 100,
    //         dataIndex: 'productionBatchNo'
    //     },
    //     {
    //         key: 'angleWeight',
    //         title: '角钢重量（t）',
    //         width: 100,
    //         dataIndex: 'angleWeight'
    //     },
    //     {
    //         key: 'plateWeight',
    //         title: '钢板重量（t）',
    //         width: 100,
    //         dataIndex: 'plateWeight',
    //     },
    //     {
    //         key: 'angleNumber',
    //         title: '角钢总件数',
    //         width: 100,
    //         dataIndex: 'angleNumber',
    //     },
    //     {
    //         key: 'plateNumber',
    //         title: '钢板总件数',
    //         width: 100,
    //         dataIndex: 'plateNumber',
    //     },
    //     {
    //         key: 'transferStartTime',
    //         title: '* 转运开始日期',
    //         width: 150,
    //         dataIndex: 'transferStartTime',
    //         render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
    //             <Form.Item
    //                 name={['galvanizedPlanDTOList', index, "transferStartTime"]}
    //                 initialValue={record.transferStartTime?moment(record.transferStartTime):''}
    //                 rules={[{
    //                     required: true,
    //                     message: '请选择开始转运日期'
    //                 }]}
    //             >
    //                 <DatePicker format='YYYY-MM-DD' />
    //             </Form.Item>
    //         )
    //     },
    //     {
    //         key: 'transferEndTime',
    //         title: '* 转运结束日期',
    //         width: 150,
    //         dataIndex: 'transferEndTime',
    //         render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
    //             <Form.Item
    //                 name={['galvanizedPlanDTOList', index, "transferEndTime"]}
    //                 initialValue={record.transferEndTime?moment(record.transferEndTime):''}
    //                 rules={[{
    //                     required: true,
    //                     message: '请选择开始转运日期'
    //                 }]}
    //             >
    //                 <DatePicker format='YYYY-MM-DD' />
    //             </Form.Item>
    //         )
    //     },
    //     {
    //         key: 'galvanizedFirst',
    //         title: '* 镀锌单元',
    //         width: 150,
    //         dataIndex: 'galvanizedFirst',
    //         render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
    //             <Form.Item
    //                 name={['galvanizedPlanDTOList', index, "galvanizedFirst"]}
    //                 initialValue={record?.galvanizedFirstUnitId+','+record?.galvanizedFirstUnitName}
    //                 rules={[{
    //                     required: true,
    //                     message: '请选择镀锌单元'
    //                 }]}
    //                 // initialValue={ record.pattern }
    //             >
    //                 <Select style={{width:'100%'}}>
    //                     { productGalvanizeUnitData && productGalvanizeUnitData.map(({ id, name }:any, index:number) => {
    //                     return <Select.Option key={ index } value={ id+','+name   }>
    //                         { name }
    //                         </Select.Option>
    //                     }) }
    //                 </Select>
    //             </Form.Item>
    //         )
    //     },
    //     {
    //         key: 'galvanizedFirstCompleteTime',
    //         title: '* 计划完成日期',
    //         width: 150,
    //         dataIndex: 'galvanizedFirstCompleteTime',
    //         render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
    //             <Form.Item
    //                 name={['galvanizedPlanDTOList', index, "galvanizedFirstCompleteTime"]}
    //                 initialValue={record?.galvanizedFirstCompleteTime?moment(record?.galvanizedFirstCompleteTime):''}
    //                 rules={[{
    //                     required: true,
    //                     message: '请选择计划完成日期'
    //                 }]}
    //             >
    //                 <DatePicker format='YYYY-MM-DD' />
    //             </Form.Item>
    //         )
    //     },
    //     {
    //         key: 'galvanizedSecond',
    //         title: '镀锌单元',
    //         width: 150,
    //         dataIndex: 'galvanizedSecond',
    //         render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
    //             <Form.Item
    //                 name={['galvanizedPlanDTOList', index, "galvanizedSecond"]}
    //                 initialValue={record?.galvanizedSecondUnitId+','+record?.galvanizedSecondUnitName}
    //                 // initialValue={ record.pattern }
    //             >
    //                 <Select style={{width:'100%'}}>
    //                     { productGalvanizeUnitData && productGalvanizeUnitData.map(({ id, name }:any, index:number) => {
    //                     return <Select.Option key={ index } value={ id+','+name }>
    //                         { name }
    //                         </Select.Option>
    //                     }) }
    //                 </Select>
    //             </Form.Item>
    //         )
    //     },
    //     {
    //         key: 'galvanizedSecondCompleteTime',
    //         title: '计划完成日期',
    //         width: 150,
    //         dataIndex: 'galvanizedSecondCompleteTime',
    //         render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
    //             <Form.Item
    //                 name={['galvanizedPlanDTOList', index, "galvanizedSecondCompleteTime"]}
    //                 initialValue={record?.galvanizedSecondCompleteTime?moment(record?.galvanizedSecondCompleteTime):""}
    //                 rules={[{
    //                     required: true,
    //                     validator: (rule: any, value: any, callback: (error?: string) => void) => {
    //                         if (value) {
    //                             callback()
    //                         } else {
    //                             if(form.getFieldsValue(true)?.galvanizedPlanDTOList&&form.getFieldsValue(true)?.galvanizedPlanDTOList[index]?.galvanizedSecond){
    //                                 callback('请选择计划完成日期')
    //                             }else{
    //                                 callback()
    //                             }
                                
    //                         }
    //                     }
    //                 }]}
    //             >
    //                 <DatePicker format='YYYY-MM-DD' />
    //             </Form.Item>
    //         )
    //     },
    //     {
    //         key: 'galvanizedThird',
    //         title: '镀锌单元',
    //         width: 150,
    //         dataIndex: 'galvanizedThird',
    //         render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
    //             <Form.Item
    //                 name={['galvanizedPlanDTOList', index, "galvanizedThird"]}
    //                 initialValue={record?.galvanizedThirdUnitId+','+record?.galvanizedThirdUnitName}
    //                 // initialValue={ record.pattern }
    //             >
    //                 <Select style={{width:'100%'}}>
    //                     { productGalvanizeUnitData && productGalvanizeUnitData.map(({ id, name }:any, index:number) => {
    //                     return <Select.Option key={ index } value={ id+','+name   }>
    //                         { name }
    //                         </Select.Option>
    //                     }) }
    //                 </Select>
    //             </Form.Item>
    //         )
    //     },
    //     {
    //         key: 'galvanizedThirdCompleteTime',
    //         title: '计划完成日期',
    //         width: 150,
    //         dataIndex: 'galvanizedThirdCompleteTime',
    //         render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
    //             <Form.Item
    //                 name={['galvanizedPlanDTOList', index, "galvanizedThirdCompleteTime"]}
    //                 initialValue={record?.galvanizedThirdCompleteTime?moment(record?.galvanizedThirdCompleteTime):""}
    //                 rules={[{
    //                     required: true,
    //                     validator: (rule: any, value: any, callback: (error?: string) => void) => {
    //                         if (value) {
    //                             callback()
    //                         } else {
    //                             if(form.getFieldsValue(true)?.galvanizedPlanDTOList&&form.getFieldsValue(true)?.galvanizedPlanDTOList[index]?.galvanizedThird){
    //                                 callback('请选择计划完成日期')
    //                             }else{
    //                                 callback()
    //                             }
                                
    //                         }
    //                     }
    //                 }]}
    //             >
    //                 <DatePicker format='YYYY-MM-DD' />
    //             </Form.Item>
    //         )
    //     },
    //     {
    //         key: 'galvanizedDescription',
    //         title: '镀锌备注',
    //         width: 150,
    //         dataIndex: 'galvanizedDescription',
    //         render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
    //             <Form.Item
    //                 name={['galvanizedPlanDTOList', index, "galvanizedDescription"]}
    //                 initialValue={_}
    //             >
    //                 <TextArea
    //                     size="small"
    //                     rows={1}
    //                     showCount
    //                     maxLength={200}
    //                 />
    //             </Form.Item>
    //         )
    //     },
    // ]

    
    // const packColumns=[
    //     {
    //         key: 'planNumber',
    //         title: '计划号',
    //         width: 100,
    //         dataIndex: 'planNumber'
    //     },
    //     {
    //         key: 'productCategory',
    //         title: '塔型',
    //         width: 100,
    //         dataIndex: 'productCategory'
    //     },
    //     {
    //         key: 'productionBatchNo',
    //         title: '批次号',
    //         width: 100,
    //         dataIndex: 'productionBatchNo'
    //     },
    //     {
    //         key: 'angleWeight',
    //         title: '角钢重量（t）',
    //         width: 100,
    //         dataIndex: 'angleWeight'
    //     },
    //     {
    //         key: 'plateWeight',
    //         title: '钢板重量（t）',
    //         width: 100,
    //         dataIndex: 'plateWeight',
    //     },
    //     {
    //         key: 'angleNumber',
    //         title: '角钢总件数',
    //         width: 100,
    //         dataIndex: 'angleNumber',
    //     },
    //     {
    //         key: 'plateNumber',
    //         title: '钢板总件数',
    //         width: 100,
    //         dataIndex: 'plateNumber',
    //     },
    //     {
    //         key: 'packageFirst',
    //         title: '* 包装单元',
    //         width: 150,
    //         dataIndex: 'packageFirst',
    //         render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
    //             <Form.Item
    //                 name={['packagePlanDTOList', index, "packageFirst"]}
    //                 initialValue={record?.packageFirstUnitId+','+record?.packageFirstUnitName}
    //                 rules={[{
    //                     required: true,
    //                     message: '请选择包装单元'
    //                 }]}
    //                 // initialValue={ record.pattern }
    //             >
    //                 <Select style={{width:'100%'}}>
    //                     { productPackUnitData && productPackUnitData.map(({ id, name }:any, index:number) => {
    //                     return <Select.Option key={ index } value={ id+','+name  }>
    //                         { name }
    //                         </Select.Option>
    //                     }) }
    //                 </Select>
    //             </Form.Item>
    //         )
    //     },
    //     {
    //         key: 'packageFirstStartTime',
    //         title: '* 计划开始日期',
    //         width: 150,
    //         dataIndex: 'packageFirstStartTime',
    //         render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
    //             <Form.Item
    //                 name={['packagePlanDTOList', index, "packageFirstStartTime"]}
    //                 initialValue={record.packageFirstStartTime?moment(record.packageFirstStartTime):""}
    //                 rules={[{
    //                     required: true,
    //                     message: '请选择计划开始日期'
    //                 }]}
    //             >
    //                 <DatePicker format='YYYY-MM-DD' />
    //             </Form.Item>
    //         )
    //     },
    //     {
    //         key: 'packageSecond',
    //         title: '包装单元',
    //         width: 150,
    //         dataIndex: 'packageSecond',
    //         render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
    //             <Form.Item
    //                 name={['packagePlanDTOList', index, "packageSecond"]}
    //                 initialValue={record?.packageSecondUnitId+','+record?.packageSecondUnitName}
                   
    //                 // initialValue={ record.pattern }
    //             >
    //                 <Select style={{width:'100%'}}>
    //                     { productPackUnitData && productPackUnitData.map(({ id, name }:any, index:number) => {
    //                     return <Select.Option key={ index } value={ id+','+name}>
    //                         { name }
    //                         </Select.Option>
    //                     }) }
    //                 </Select>
    //             </Form.Item>
    //         )
    //     },
    //     {
    //         key: 'packageSecondStartTime',
    //         title: '计划开始日期',
    //         width: 150,
    //         dataIndex: 'packageSecondStartTime',
    //         render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
    //             <Form.Item
    //                 name={['packagePlanDTOList', index, "packageSecondStartTime"]}
    //                 initialValue={record?.packageSecondStartTime?moment(record?.packageSecondStartTime):""}
    //                 rules={[{
    //                     required: true,
    //                     validator: (rule: any, value: any, callback: (error?: string) => void) => {
    //                         if (value) {
    //                             callback()
    //                         } else {
    //                             if(form.getFieldsValue(true)?.packagePlanDTOList&&form.getFieldsValue(true)?.packagePlanDTOList[index]?.packageSecond){
    //                                 callback('请选择计划开始日期')
    //                             }else{
    //                                 callback()
    //                             }
                                
    //                         }
    //                     }
    //                 }]}
    //             >
    //                 <DatePicker format='YYYY-MM-DD' />
    //             </Form.Item>
    //         )
    //     },
    //     {
    //         key: 'packageCompleteTime',
    //         title: '* 计划完成日期',
    //         width: 150,
    //         dataIndex: 'packageCompleteTime',
    //         render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
    //             <Form.Item
    //                 name={['packagePlanDTOList', index, "packageCompleteTime"]}
    //                 initialValue={record.packageCompleteTime?moment(record.packageCompleteTime):""}
    //                 rules={[{
    //                     required: true,
    //                     message: '请选择计划完成日期'
    //                 }]}
    //             >
    //                 <DatePicker format='YYYY-MM-DD' />
    //             </Form.Item>
    //         )
    //     },
    //     {
    //         key: 'reportTime',
    //         title: '* 报补件日期',
    //         width: 150,
    //         dataIndex: 'reportTime',
    //         render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
    //             <Form.Item
    //                 name={['packagePlanDTOList', index, "reportTime"]}
    //                 initialValue={record.reportTime?moment(record.reportTime):""}
    //                 rules={[{
    //                     required: true,
    //                     message: '请选择报补件日期'
    //                 }]}
    //             >
    //                 <DatePicker format='YYYY-MM-DD' />
    //             </Form.Item>
    //         )
    //     },
    //     {
    //         key: 'storageTime',
    //         title: '* 入库日期',
    //         width: 150,
    //         dataIndex: 'storageTime',
    //         render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
    //             <Form.Item
    //                 name={['packagePlanDTOList', index, "storageTime"]}
    //                 initialValue={record.storageTime?moment(record.storageTime):""}
    //                 rules={[{
    //                     required: true,
    //                     message: '请选择入库日期'
    //                 }]}
    //             >
    //                 <DatePicker format='YYYY-MM-DD' />
    //             </Form.Item>
    //         )
    //     },
    //     {
    //         key: 'packageDescription',
    //         title: '包装备注',
    //         width: 150,
    //         dataIndex: 'packageDescription',
    //         render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
    //             <Form.Item
    //                 name={['packagePlanDTOList', index, "packageDescription"]}
    //                 initialValue={_}
    //             >
    //                 <TextArea
    //                     size="small"
    //                     rows={1}
    //                     showCount
    //                     maxLength={200}
    //                 />
    //             </Form.Item>
    //         )
    //     },
    // ]
    
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Space>
                {/* <Button type='primary' onClick={async () => {
                    if(lock==='保存'){
                        await form.validateFields()
                        const value = form.getFieldsValue(true)
                        console.log(value)
                        const submitData = {
                            galvanizedPlanDTOList: value?.galvanizedPlanDTOList.map((item:any,index:number)=>{
                                return {
                                    ...detailData?.galvanizedPlanVOList[index],
                                    ...item,
                                    galvanizedFirstUnitId:item?.galvanizedFirst.split(',')[0],
                                    galvanizedFirstUnitName:item?.galvanizedFirst.split(',')[1],
                                    galvanizedSecondUnitId:item?.galvanizedSecond?item?.galvanizedSecond.split(',')[0]:"",
                                    galvanizedSecondUnitName:item?.galvanizedSecond?item?.galvanizedSecond.split(',')[1]:"",
                                    galvanizedThirdUnitId:item?.galvanizedThird?item?.galvanizedThird.split(',')[0]:"",
                                    galvanizedThirdUnitName:item?.galvanizedThird?item?.galvanizedThird.split(',')[1]:'',
                                    transferStartTime: item?.transferStartTime?moment(item?.transferStartTime).format('YYYY-MM-DD'):'',
                                    transferEndTime: item?.transferEndTime?moment(item?.transferEndTime).format('YYYY-MM-DD'):'',
                                    galvanizedFirstCompleteTime: item?.galvanizedFirstCompleteTime?moment(item?.galvanizedFirstCompleteTime).format('YYYY-MM-DD'):'',
                                    galvanizedSecondCompleteTime: item?.galvanizedSecondCompleteTime?moment(item?.galvanizedSecondCompleteTime).format('YYYY-MM-DD'):'',
                                    galvanizedThirdCompleteTime: item?.galvanizedThirdCompleteTime?moment(item?.galvanizedThirdCompleteTime).format('YYYY-MM-DD'):'',
                                }
                            }),
                            packagePlanDTOList:  value?.packagePlanDTOList&& value?.packagePlanDTOList.length>0 &&value?.packagePlanDTOList.map((item:any,index:number)=>{
                                return {
                                    ...detailData?.packagePlanVOList[index],
                                    ...item,
                                    packageFirstUnitId:item?.packageFirst.split(',')[0],
                                    packageFirstUnitName:item?.packageFirst.split(',')[1],
                                    packageSecondUnitId:item?.packageSecond?item?.packageSecond.split(',')[0]:"",
                                    packageSecondUnitName:item?.packageSecond?item?.packageSecond.split(',')[1]:'',
                                    storageTime: item?.storageTime?moment(item?.storageTime).format('YYYY-MM-DD'):'',
                                    reportTime: item?.reportTime?moment(item?.reportTime).format('YYYY-MM-DD'):'',
                                    packageCompleteTime: item?.packageCompleteTime?moment(item?.packageCompleteTime).format('YYYY-MM-DD'):'',
                                    packageFirstStartTime: item?.packageFirstStartTime?moment(item?.packageFirstStartTime).format('YYYY-MM-DD'):'',
                                    packageSecondStartTime: item?.packageSecondStartTime?moment(item?.packageSecondStartTime).format('YYYY-MM-DD'):'',
                                }
                            }),
                        }
                        RequestUtil.post(`/tower-aps/galvanizedPackage/update`,submitData).then(async ()=>{
                            message.success('保存成功！')
                            history.go(0)
                        })
                    }else{
                        form.setFieldsValue({
                            packagePlanDTOList: detailData?.packagePlanVOList&&detailData?.packagePlanVOList.length>0&&detailData?.packagePlanVOList.map((item:any)=>{
                                return {
                                    ...item,
                                    packageFirst: item?.packageFirstUnitId&&item?.packageFirstUnitName?item?.packageFirstUnitId+','+item?.packageFirstUnitName:'',
                                    packageSecond: item?.packageSecondUnitId&&item?.packageSecondUnitName?item?.packageSecondUnitId+','+item?.packageSecondUnitName:'',
                                    storageTime: item?.storageTime?moment(item?.storageTime):'',
                                    reportTime: item?.reportTime?moment(item?.reportTime):'',
                                    packageCompleteTime: item?.packageCompleteTime?moment(item?.packageCompleteTime):'',
                                    packageFirstStartTime: item?.packageFirstStartTime?moment(item?.packageFirstStartTime):'',
                                    packageSecondStartTime: item?.packageSecondStartTime?moment(item?.packageSecondStartTime):'',
                                }
                            })||[],
                            galvanizedPlanDTOList: detailData?.galvanizedPlanVOList&&detailData?.galvanizedPlanVOList.length>0&&detailData?.galvanizedPlanVOList.map((item:any)=>{
                                return {
                                    ...item,
                                    galvanizedFirst: item?.galvanizedFirstUnitId&&item?.galvanizedFirstUnitName?item?.galvanizedFirstUnitId+','+item?.galvanizedFirstUnitName:'',
                                    galvanizedSecond: item?.galvanizedSecondUnitId&&item?.galvanizedSecondUnitName?item?.galvanizedSecondUnitId+','+item?.galvanizedSecondUnitName:'',
                                    galvanizedThird: item?.galvanizedThirdUnitId&&item?.galvanizedThirdUnitName?item?.galvanizedThirdUnitId+','+item?.galvanizedThirdUnitName:'',
                                    transferStartTime: item?.transferStartTime?moment(item?.transferStartTime):'',
                                    transferEndTime: item?.transferEndTime?moment(item?.transferEndTime):'',
                                    galvanizedFirstCompleteTime: item?.galvanizedFirstCompleteTime?moment(item?.galvanizedFirstCompleteTime):'',
                                    galvanizedSecondCompleteTime: item?.galvanizedSecondCompleteTime?moment(item?.galvanizedSecondCompleteTime):'',
                                    galvanizedThirdCompleteTime: item?.galvanizedThirdCompleteTime?moment(item?.galvanizedThirdCompleteTime):'',
                                }
                            })||[],
                        })
                        setLock('保存')
                    }
                    
                }}>{lock}</Button> */}
                <Button type='primary' onClick={handleIssue}>镀锌包装下发</Button>
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
                </Space>
            ]}>
                {/* {lock==='保存'?
                <Form form={form}  className={styles.descripForm}>
                    <DetailTitle title="镀锌计划"/>
                    <Space>
                        <span>合计：</span>
                        <span>角钢重量（t）：{detailData?.totalAngleWeight}</span>
                        <span>钢板重量（t）：{detailData?.totalPlateWeight}</span>
                        <span>角钢总件数：{detailData?.totalAngleNumber}</span>
                        <span>钢板总件数：{detailData?.totalPlateNumber}</span>
                    </Space>
                    <CommonTable columns={galvanizedColumns} dataSource={[...detailData?.galvanizedPlanVOList]||[]} pagination={false}/>
                    <DetailTitle title="包装计划"/>
                    <CommonTable columns={packColumns} dataSource={[...detailData?.packagePlanVOList]||[]} pagination={false}/>
                </Form>:<> */}
                <DetailTitle title="镀锌计划" operation={[<Button type='primary' onClick={useGalvanized} disabled={!(galvanizedSelectedKeys.length>0)}>批量设置镀锌计划</Button>]}/>
                <Space>
                    <span>合计：</span>
                    <span>总重量（t）：{detailData?.totalWeight}</span>
                    <span>角钢重量（t）：{detailData?.totalAngleWeight}</span>
                    <span>钢板重量（t）：{detailData?.totalPlateWeight}</span>
                    <span>角钢总件数：{detailData?.totalAngleNumber}</span>
                    <span>钢板总件数：{detailData?.totalPlateNumber}</span>
                </Space>
                <CommonTable 
                    columns={galvanized} 
                    dataSource={detailData?.galvanizedPlanVOList} 
                    pagination={false}
                    rowSelection={{
                        selectedRowKeys: galvanizedSelectedKeys,
                        onChange: onGalvanizedSelectChange,
                        type: "checkbox",
                    }}
                />
                <DetailTitle title="包装计划"  style={{marginTop:'10px'}} operation={[<Button type='primary' onClick={usePack} disabled={!(packSelectedKeys.length>0)}>批量设置包装计划</Button>]}/>
                <CommonTable 
                    columns={pack} 
                    dataSource={detailData?.packagePlanVOList} 
                    pagination={false}
                    rowSelection={{
                        selectedRowKeys: packSelectedKeys,
                        onChange: onPackSelectChange,
                        type: "checkbox",
                    }}
                />
                {/* </>} */}
            </DetailContent>
        </Spin>
    </>
}