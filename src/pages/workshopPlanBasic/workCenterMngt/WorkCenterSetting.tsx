import React, { useImperativeHandle, forwardRef, useState } from "react"
import { Spin, Form, Select, InputNumber, Popconfirm, Space, Button, TimePicker, Table, message, Modal, Input, Upload } from 'antd'
import { DetailTitle, BaseInfo, DetailContent } from '../../common'
import RequestUtil from '../../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import styles from './WorkCenterMngt.module.less';
import { IWorkCenterMngt } from "../IWorkshopPlanBasic";
import { FixedType } from 'rc-table/lib/interface';
import { materialTextureOptions } from "../../../configuration/DictionaryOptions";
import moment from "moment"
import { useHistory, useParams } from "react-router-dom"
import { downloadTemplate } from "../../workMngt/setOut/downloadTemplate"
import AuthUtil from "../../../utils/AuthUtil"

interface EditProps {
    type: "new" | "edit",
    id: string
}

export default function WorkCenterSetting(): React.ReactNode{

    const [baseForm] = Form.useForm();
    const [form] = Form.useForm();
    const history = useHistory()
    const params = useParams<{ id: string }>();
    const [workCenterRelationsList, setWorkCenterRelationsList] = useState<IWorkCenterMngt[]>([]);
    // const [allMaterialList, setAllMaterialList] = useState<any>([]);
    const [visible,setVisible] =  useState<boolean>(false);
    const [specifications, setSpecifications] = useState<any[]>([]);
    const [title,setTitle] = useState<string>('新增');
    const [mode,setMode] = useState<string>('单选');
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-aps/work/center/info/${params?.id}`)
            baseForm.setFieldsValue({
                ...result,
                time: result.workStartTime&&result.workEndTime?[moment(result.workStartTime, 'HH:mm'), moment(result.workEndTime, 'HH:mm')]:'',
                equipmentId: result?.equipmentId&&result?.equipmentId.length>0 ? result?.equipmentId.split(','):[],
                unitName: result?.unitName+','+result?.code
            })
            setWorkCenterRelationsList(result?.workCenterRelations);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: params?.id?false:true, refreshDeps: [params?.id] })

    const { data: materialList } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-system/material/selectDetail`);
            // setAllMaterialList(result?.materialNames);
            // var newArr = result?.records.filter((item: any, index: any, self: any) => {
            //     return self.findIndex((el: any) => el.materialName === item.materialName) === index
            // })
            resole(result?.materialNames)
        } catch (error) {
            reject(error)
        }
    }))

    const { data: equipmentList } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-equipment/device?size=1000&operatingStatus=0`);
            const resultData: { [key: string]: any } = await RequestUtil.get(`/tower-equipment/device?size=1000&operatingStatus=1`);
            const list: { [key: string]: any } = await RequestUtil.get(`/tower-aps/work/center/info/equipment?workCenterInfoId=${params?.id?params?.id:''}`);
            const data = [...result?.records, ...resultData?.records]?.filter((item: any) => !list.some((ele: any) => ele === item.id));
            resole(data)
        } catch (error) {
            reject(error)
        }
    }))

    const { data: codeList } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const data: { [key: string]: any } = await RequestUtil.get(`/tower-aps/productionUnit?current=1&size=10000`);
            resole(data?.records)
        } catch (error) {
            reject(error)
        }
    }))
    const { data: processList } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-aps/product/process?size=1000`);
            resole(result?.records)
        } catch (error) {
            reject(error)
        }
    }))
    
    const { run: saveRun } = useRequest<{ [key: string]: any }>((postData: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-aps/work/center/info`, { ...postData, id: data?.id })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { run: specificationGet } = useRequest<{ [key: string]: any }>((e: any) => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-system/material?size=1000&materialName=${e}`);
            // console.log(result)
            setSpecifications(result?.records)
            resole(result?.records)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            await baseForm.validateFields();
            if (workCenterRelationsList && workCenterRelationsList.length > 0) {
                const baseData = await baseForm.getFieldsValue(true);
                console.log(baseData)
                await saveRun({
                    ...baseData,
                    workStartTime: baseData?.time?baseData.time[0].format('HH:mm'):"",
                    workEndTime:  baseData?.time?baseData.time[1].format('HH:mm'):"",
                    workCenterRelations: workCenterRelationsList,
                    unitName: baseData?.unitName.split(',')[0],
                    equipmentId: baseData&&baseData?.equipmentId&&baseData?.equipmentId.length>0?baseData.equipmentId.join(','):''
                })
                resolve(true);
            } else {
                message.warning("请添加产能矩阵");
                reject(false);
            }
        } catch (error) {
            reject(false)
        }
    })

    const resetFields = () => {
        baseForm.resetFields();
    }



    const baseColumns = [
        {
            "title": "工作中心名称",
            "dataIndex": "workCenterName",
            "type": "string",
            "rules": [
                {
                    "required": true,
                    "message": "请输入工作中心名称"
                },
                {
                    "pattern": /^[^\s]*$/,
                    "message": '禁止输入空格',
                }
            ]
        },
        {
            "title": <span><span style={{color:'red'}}>* </span>生产单元名称</span>,
            "dataIndex": "unitName",
            "type": "select",
        },
        {
            "title": "生产单元编码",
            "dataIndex": "code",
            "type": "string",
            "rules": [
                {
                    "required": true,
                    "message": "请选择生产单元编码"
                }
            ]
        },
        {
            "title": "工作时间",
            "dataIndex": "time",
            "type": "string",
        },
        {
            "title": "关联设备",
            "dataIndex": "equipmentId",
            "type": "select",
        }
    ]

    const tableColumns = [
        {
            key: 'processId',
            title: <span><span style={{ color: 'red' }}>*</span>工序</span>,
            dataIndex: 'processName',
            width: 210,
        },
        {
            key: 'materialName',
            title: <span><span style={{ color: 'red' }}>*</span>材料</span>,
            dataIndex: 'materialName',
            width: 210,
        },
        {
            key: 'specificationName',
            title: <span><span style={{ color: 'red' }}>*</span>规格</span>,
            dataIndex: 'specificationName',
            width: 210,
        },
        {
            key: 'materialTextureName',
            title: <span><span style={{ color: 'red' }}>*</span>材质</span>,
            dataIndex: 'materialTextureName',
            width: 210,
        },
        {
            key: 'workHour',
            title: <span><span style={{ color: 'red' }}>*</span>标准工时（s）</span>,
            dataIndex: 'workHour',
            width: 150,
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            width: 100,
            fixed: 'right' as FixedType,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type="link" onClick={async ()=>{
                        setVisible(true)
                        console.log(record)
                        setTitle('编辑')
                        form.setFieldsValue({
                            ...record,
                            index:index,
                            process: record?.processId+','+record?.processName,
                            specificationName: record?.specificationName.indexOf(',')>-1?record?.specificationName.split(','):record?.specificationName,
                            materialTextureName: record?.materialTextureName.indexOf(',')>-1?record?.materialTextureName.split(','):record?.materialTextureName,
                        })
                        // if(record?.materialName==='钢板'){
                        //     setMode('多选')
                        // }else{
                        //     setMode('单选')
                        // }
                        await specificationGet(record?.materialName)
                        console.log(form.getFieldsValue(true))
                    }}>编辑</Button>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={() => delRow(index)}
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button type="link">删除</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ]


    const delRow = (index: number) => {
        workCenterRelationsList.splice(index, 1);
        setWorkCenterRelationsList([...workCenterRelationsList]);
    }
    const handleModalOk = () => new Promise(async (resove, reject) => {
        try {
            await onSubmit()
            message.success(`工作中心${params?.id ? "编辑" : "新增"}成功...`)
            history.push(`/workshopPlanBasic/workCenterMngt`)
            resove(true);
        } catch (error) {
            reject(false)
        }
    })
    return <Spin spinning={loading}>
        <DetailContent operation={[<Space>
            <Button  onClick={()=>
                history.goBack()
            }>返回</Button>
            <Button type='primary' onClick={()=>
                handleModalOk()
            }>确定</Button>
           
        </Space>]}>
            <DetailTitle title="基本信息" style={{ padding: '0 0 8px' }} />
            <BaseInfo form={baseForm} columns={baseColumns.map((item: any) => {
                if (item.dataIndex === "time") {
                    return ({
                        ...item, type: 'date',
                        render: (_: any, record: Record<string, any>, index: number): React.ReactNode => (<Form.Item name="time" style={{ width: '100%' }}><TimePicker.RangePicker style={{ width: '100%' }} format="HH" /></Form.Item>)
                    })
                }
                if (item.dataIndex === "equipmentId") {
                    return ({
                        ...item, type: 'select',
                        render: (_: any, record: Record<string, any>, index: number): React.ReactNode => (
                            <Form.Item name="equipmentId" style={{ width: '100%' }}>
                                <Select mode="multiple">
                                    {equipmentList?.map((item: any) => {
                                        return <Select.Option key={item.id} value={item.id}>{item.deviceName}</Select.Option>
                                    })}
                                </Select>
                            </Form.Item>
                        )
                    })
                }
                if (item.dataIndex === "unitName") {
                    return ({
                        ...item, type: 'select',
                        render: (_: any, record: Record<string, any>, index: number): React.ReactNode => (
                            <Form.Item name="unitName" style={{ width: '100%' }} rules={[
                                {
                                    "required": true,
                                    "message": "请选择生产单元名称"
                                }
                            ]}> 
                                <Select onChange={(value:any)=>{
                                    console.log(value)
                                    const codeValue = value.split(',')
                                    baseForm.setFieldsValue({
                                        code:codeValue[1]
                                    })
                                }} showSearch>
                                    {codeList?.map((item: any) => {
                                        return <Select.Option key={item.id} value={item.name+','+item.productUnitCode}>{item.name}</Select.Option>
                                    })}
                                </Select>
                            </Form.Item>
                        )
                    })
                }
                if (item.dataIndex === "code") {
                    return ({
                        ...item, type: 'select',
                        render: (_: any, record: Record<string, any>, index: number): React.ReactNode => (
                            <Form.Item name="code" style={{ width: '100%' }}>
                                <Select disabled>
                                    {codeList?.map((item: any) => {
                                        return <Select.Option key={item.id} value={item.productUnitCode}>{item.productUnitCode}</Select.Option>
                                    })}
                                </Select>
                            </Form.Item>
                        )
                    })
                }
                return item
            })} col={2} dataSource={{}} edit />
            <DetailTitle title="产能矩阵" operation={[<Space size="small">
                <Button type="primary" onClick={()=>{
                    setVisible(true)
                    setTitle(`新增`)
                }}>新增</Button>
                <Upload 
                    action={ () => {
                        const baseUrl: string | undefined = process.env.REQUEST_API_PATH_PREFIX;
                        return baseUrl+'/tower-aps/work/relation/importRelation'
                    } } 
                    accept=".xls,.xlsx"
                    headers={
                        {
                            'Authorization': `Basic ${ AuthUtil.getAuthorization() }`,
                            'Tenant-Id': AuthUtil.getTenantId(),
                            'Sinzetech-Auth': AuthUtil.getSinzetechAuth()
                        }
                    }
                    showUploadList={ false }
                    onChange={ async (info) => {
                        if(info.file.response && !info.file.response?.success) {
                            message.warning(info.file.response?.msg)
                        }
                        if(info.file.response && info.file.response?.success){
                            if (info.file.response && info.file.response?.success) {
                                if (info.file.response?.data) {
                                    console.log(info.file.response?.data?.data)
                                    const str =  info.file.response?.data
                                    const value =  typeof str === 'string'
                                    if(value){
                                        window.open(str)
                                    }else{
                                        message.success('导入成功！');
                                        setWorkCenterRelationsList([...info.file.response?.data.concat(workCenterRelationsList)])
                                    }
                                   
                                }
                            }
                        } 
                    } }
                >
                    <Button type="primary" ghost>导入</Button>
                </Upload>
                <Button type="primary" onClick={() => downloadTemplate('/tower-aps/work/relation/exportTemplate', '产能矩阵模板')} ghost>下载导入模板</Button>
            </Space>]} />
            <Table
                scroll={{ x: 500 }}
                rowKey="id"
                dataSource={[...workCenterRelationsList]}
                pagination={false}
                columns={tableColumns}
                className={styles.addModal} 
            />
            <Modal
                visible={visible}
                title={ form.getFieldsValue(true)?.processName?'编辑':'新增'}
                onCancel={() => {
                    setVisible(false)
                    form.resetFields()
                }}
                onOk={async () => {
                    await form.validateFields()
                    const value = await form.getFieldsValue(true)
                    if(value.process){
                        value.processId = value.process.split(',')[0]
                        value.processName = value.process.split(',')[1]
                        delete value.process
                    }
                    if(Array.isArray(value.materialTextureName)){
                        value.materialTextureName = value.materialTextureName.join(',')
                    }
                    if(Array.isArray(value.specificationName)){
                        value.specificationName = value.specificationName.join(',')
                    }
                    console.log(value)
                    setVisible(false)
                    if(title==='新增'){
                        workCenterRelationsList.unshift(value)
                    }else{
                        workCenterRelationsList.splice(value?.index,1)
                        workCenterRelationsList.unshift(value)
                    }
                    setWorkCenterRelationsList(
                        [...workCenterRelationsList]
                    )
                   
                    form.resetFields()
                    setTitle('新增')
                }}
            >
                <Form form={form}>
                    <Form.Item name="id" style={{display:'none'}}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="index" style={{display:'none'}}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="process" label='工序' rules={[{
                        "required": true,
                        "message": "请选择工序"
                    },
                    {
                        "pattern": /^[^\s]*$/,
                        "message": '禁止输入空格',
                    }]}>
                        <Select placeholder="请选择" style={{ width: '100%' }} size="small">
                            {processList?.map((item: any) => {
                                return <Select.Option key={item.id} value={item.id+','+item.name}>{item.name}</Select.Option>
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item name= "materialName" label='材料' rules={[{
                        "required": true,
                        "message": "请选择材料"
                    }]}>
                        <Select showSearch placeholder="请选择" size="small" style={{ width: '100%' }} onChange={async (e: string) => {
                            // if(e==='钢板'){
                            //     setMode('多选')
                            // }else{
                            //     setMode('单选')
                            // }
                            await specificationGet(e)
                        }}>
                            {materialList?.map((item: any) => {
                                return <Select.Option key={item} value={item}>{item}</Select.Option>
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item name= "specificationName" label='规格' rules={[{
                        "required": true,
                        "message": "请选择规格"
                    }]}>
                        <Select showSearch placeholder="请选择" size="small" style={{ width: '100%' }} mode={'multiple'}>
                            <Select.Option key='全部' value='全部' >全部</Select.Option>
                            {specifications?.map((item: any) => {
                                return <Select.Option key={item.id} value={item.structureSpec}>{item.structureSpec}</Select.Option>
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item name="materialTextureName" label='材质' rules={[{
                        "required": true,
                        "message": "请选择材质"
                    }]}>
                        <Select style={{ width: '100%' }} size="small" showSearch mode={'multiple'}>
                            <Select.Option key='全部' value='全部'>全部</Select.Option>
                            {materialTextureOptions?.map((item: any, index: number) => <Select.Option value={item.name} key={index}>{item.name}</Select.Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item name="workHour" label='标准工时' rules={[{
                        "required": true,
                        "message": "请输入标准工时"
                    }]}>
                        <InputNumber  style={{ width: '100%' }} step={1} min={0} max={3600} precision={0} size="small"/>
                    </Form.Item>
                </Form>
            </Modal>
        </DetailContent>
    </Spin>
}