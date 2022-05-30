import React, { useImperativeHandle, forwardRef, useState } from "react"
import { Spin, Form, Select, InputNumber, Popconfirm, Space, Button, TimePicker, Table, message } from 'antd'
import { DetailTitle, BaseInfo, DetailContent } from '../../common'
import RequestUtil from '../../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import styles from './WorkCenterMngt.module.less';
import { IWorkCenterMngt } from "../IWorkshopPlanBasic";
import { FixedType } from 'rc-table/lib/interface';
import { materialTextureOptions } from "../../../configuration/DictionaryOptions";
import moment from "moment"
import { useHistory, useParams } from "react-router-dom"

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
    const [specifications, setSpecifications] = useState<any>({});

    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-aps/work/center/info/${params?.id}`)
            baseForm.setFieldsValue({
                ...result,
                time: [moment(result.workStartTime, 'HH:mm'), moment(result.workEndTime, 'HH:mm')],
                equipmentId: result?.equipmentId && result?.equipmentId.split(',')
            })
            form.setFieldsValue({ workCenterRelations: [...result?.workCenterRelations] });
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

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            const baseData = await baseForm.validateFields();
            if (form.getFieldsValue(true).workCenterRelations && form.getFieldsValue(true).workCenterRelations.length > 0) {
                const data = await form.validateFields();
                await saveRun({
                    ...baseData,
                    workStartTime: baseData.time[0].format('HH:mm'),
                    workEndTime: baseData.time[1].format('HH:mm'),
                    workCenterRelations: [...data?.workCenterRelations],
                    equipmentId: baseData.equipmentId.join(',')
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

    const materialChange = async (e: string, index: number) => {
        // var newArr = allMaterialList.filter((item: any, index: any, self: any) => {
        //     return e === item.materialName
        // })
        const result: { [key: string]: any } = await RequestUtil.get(`/tower-system/material?size=1000&materialName=${e}`);
        const workCenterRelations = form.getFieldsValue(true)?.workCenterRelations;
        workCenterRelations[index] = {
            ...workCenterRelations[index],
            specificationName: ''
        }
        form.setFieldsValue({ workCenterRelations: workCenterRelations })
        setSpecifications({
            ...specifications,
            [index]: result?.records
        })
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
            "title": "编码",
            "dataIndex": "code",
            "type": "string",
            "rules": [
                {
                    "required": true,
                    "message": "请输入编码"
                },
                {
                    "pattern": /^[0-9a-zA-Z]*$/,
                    "message": '仅可输入数字/字母'
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
            "rules": [
                {
                    "required": true,
                    "message": "请选择关联设备"
                }
            ]
        }
    ]

    const tableColumns = [
        {
            key: 'processId',
            title: <span><span style={{ color: 'red' }}>*</span>工序</span>,
            dataIndex: 'processId',
            width: 210,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={["workCenterRelations", index, "processId"]} initialValue={_} rules={[{
                    "required": true,
                    "message": "请选择工序"
                },
                {
                    "pattern": /^[^\s]*$/,
                    "message": '禁止输入空格',
                }]}>
                    <Select placeholder="请选择" style={{ width: '200px' }} size="small">
                        {processList?.map((item: any) => {
                            return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                        })}
                    </Select>
                </Form.Item>
            )
        },
        {
            key: 'materialName',
            title: <span><span style={{ color: 'red' }}>*</span>材料</span>,
            dataIndex: 'materialName',
            width: 210,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={["workCenterRelations", index, "materialName"]} initialValue={_} rules={[{
                    "required": true,
                    "message": "请选择材料"
                }]}>
                    <Select placeholder="请选择" size="small" style={{ width: '200px' }} onChange={(e: string) => materialChange(e, index)}>
                        {materialList?.map((item: any) => {
                            return <Select.Option key={item} value={item}>{item}</Select.Option>
                        })}
                    </Select>
                </Form.Item>
            )
        },
        {
            key: 'specificationName',
            title: <span><span style={{ color: 'red' }}>*</span>规格</span>,
            dataIndex: 'specificationName',
            width: 210,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={["workCenterRelations", index, "specificationName"]} initialValue={_} rules={[{
                    "required": true,
                    "message": "请选择规格"
                }]}>
                    <Select placeholder="请选择" size="small" style={{ width: '200px' }} key={index} onDropdownVisibleChange={
                        (open) => {
                            if (open && form.getFieldsValue(true)?.workCenterRelations[index]?.materialName) {
                                materialChange(form.getFieldsValue(true)?.workCenterRelations[index]?.materialName, index);
                            }
                        }
                    }>
                        {specifications[index]?.map((item: any) => {
                            return <Select.Option key={item.id} value={item.structureSpec}>{item.structureSpec}</Select.Option>
                        })}
                    </Select>
                </Form.Item>
            )
        },
        {
            key: 'materialTextureName',
            title: <span><span style={{ color: 'red' }}>*</span>材质</span>,
            dataIndex: 'materialTextureName',
            width: 210,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={["workCenterRelations", index, "materialTextureName"]} initialValue={_} rules={[{
                    "required": true,
                    "message": "请选择材质"
                }]}>
                    <Select style={{ width: '200px' }} size="small">
                        {materialTextureOptions?.map((item: any, index: number) => <Select.Option value={item.name} key={index}>{item.name}</Select.Option>)}
                    </Select>
                </Form.Item>
            )
        },
        {
            key: 'workHour',
            title: <span><span style={{ color: 'red' }}>*</span>标准工时（s）</span>,
            dataIndex: 'workHour',
            width: 150,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={["workCenterRelations", index, "workHour"]} initialValue={_} rules={[{
                    "required": true,
                    "message": "请输入标准工时"
                }]}>
                    <InputNumber step={1} min={0} max={3600} precision={0} size="small" key={index} />
                </Form.Item>
            )
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            width: 100,
            fixed: 'right' as FixedType,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Space direction="horizontal" size="small">
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


    const addRow = () => {
        let workCenterListValues = form.getFieldsValue(true).workCenterRelations || [];
        let newData = {
            workHour: ''
        }
        setWorkCenterRelationsList([...workCenterListValues, newData]);
        form.setFieldsValue({ workCenterRelations: [...workCenterListValues, newData] })
    }

    const delRow = (index?: number) => {
        let workCenterListValues = form.getFieldsValue(true).workCenterRelations || [];
        workCenterListValues.splice(index, 1);
        setWorkCenterRelationsList([...workCenterListValues]);
        form.setFieldsValue({ workCenterRelations: [...workCenterListValues] })
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
                if (item.dataIndex === "code") {
                    return ({
                        ...item, type: 'select',
                        render: (_: any, record: Record<string, any>, index: number): React.ReactNode => (
                            <Form.Item name="code" style={{ width: '100%' }}>
                                <Select>
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
                <Button type="primary" onClick={addRow}>新增</Button>
            </Space>]} />
            <Form form={form}>
                <Table
                    scroll={{ x: 500 }}
                    rowKey="id"
                    dataSource={[...workCenterRelationsList]}
                    pagination={false}
                    columns={tableColumns}
                    className={styles.addModal} />
            </Form>
        </DetailContent>
    </Spin>
}