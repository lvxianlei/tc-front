import React, { useImperativeHandle, forwardRef, useRef, useState } from "react"
import { Spin, Form, Select, Input, InputNumber, Popconfirm, Space, Button, TimePicker, Table } from 'antd'
import { DetailTitle, BaseInfo } from '../../common'
import RequestUtil from '../../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import styles from './WorkCenterMngt.module.less';
import { IWorkCenterMngt } from "../IWorkshopPlanBasic"
import { materialTextureOptions } from "../../../configuration/DictionaryOptions"

interface EditProps {
    type: "new" | "edit",
    id: string
}
interface IResponse {
    readonly records?: [];
}

export default forwardRef(function Edit({ type, id }: EditProps, ref) {
    const [ companyList, setCompanyList ] = useState([]);
    const [baseForm] = Form.useForm();
    const [form] = Form.useForm();
    const [ processList, setProcessList ] = useState<IWorkCenterMngt[]>([]);
    // const [ selectedKeys, setSelectedKeys ] = useState<React.Key[]>([]);
    const [ allMaterialList, setAllMaterialList ] = useState<any>([]);
    const [ specifications, setSpecifications ]= useState<any>({});
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/invoice/${id}`)
            baseForm.setFieldsValue({
                ...result,
                businessId: result.businessId + ',' + result.businessName,
                receiptVos: result.receiptVos.map((item: any) => item.receiptNumber).join(",")
            })
            businessTypeChange(result.businessType);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: type === "new", refreshDeps: [id] })

    const { data: materialList } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-system/material?size=1000`);
            setAllMaterialList(result?.records);
            var newArr = result?.records.filter((item: any,index: any,self: any) => {
                return self.findIndex((el: any) => el.materialName === item.materialName) === index
            })
            resole(newArr)
        } catch (error) {
            reject(error)
        }
    }))

    const { run: saveRun } = useRequest<{ [key: string]: any }>((postData: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil[type === "new" ? "post" : "put"](`/tower-supply/invoice`, { ...postData, id: data?.id })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            const baseData = await baseForm.validateFields()
            await saveRun({
                ...baseData,
                // supplierName: baseData.supplierName.value || data?.supplierName,
                // supplierId: baseData.supplierName.id || data?.supplierId,
                businessId: baseData.businessId?.split(',')[0],
                businessName: baseData.businessId?.split(',')[1],
                receiptDtos: baseData.receiptVos.records?.map((item: any) => ({
                    receiptId: item.id,
                    receiptNumber: item.receiveNumber
                })) || data?.receiptVos.map((item: any) => ({
                    receiptId: item.receiptId,
                    receiptNumber: item.receiptNumber,
                })),
            })
            resolve(true)
        } catch (error) {
            reject(false)
        }
    })
    const resetFields = () => {
        baseForm.resetFields();
    }

    const materialChange = (e: string, index: number) => {
        var newArr = allMaterialList.filter((item: any,index: any,self: any) => {
            return e === item.materialName
        })
        setSpecifications({
            ...specifications,
            [index]: newArr
        })
    }

    const baseColumns = [
        {
            "title": "工作中心名称",
            "dataIndex": "createUserName",
            "rules": [
                {
                    "required": true,
                    "message": "请输入工作中心名称"
                },
                {
                    "pattern": /^[^\s]*$/,
                    "message": '禁止输入空格',
                }
            ],
            render:  (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Input maxLength={ 100 } />
            )  
        },
        {
            "title": "编码",
            "dataIndex": "createUserName",
            "rules": [
                {
                    "required": true,
                    "message": "请输入编码"
                }, 
                {
                    pattern: /^[0-9a-zA-Z]*$/,
                    message: '仅可输入数字/字母'
                }
            ],
            render:  (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Input maxLength={ 20 } />
            )  
        },
        {
            "title": "工作时间",
            "dataIndex": "createUserName",
            "rules": [
                {
                    "required": true,
                    "message": "请选择开始工作时间"
                }
            ],
            render:  (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <TimePicker.RangePicker style={{width: '100%'}} format="HH:mm" />
            ) 
        },
        {
            "title": "关联设备",
            "dataIndex": "createUserName",
            "rules": [
                {
                    "required": true,
                    "message": "请选择关联设备"
                }
            ],
            render:  (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Select disabled={ type === 'edit' }>
                    { companyList && companyList.map((item: any) => {
                        return <Select.Option key={ item.id + ',' + item.name } value={ item.id + ',' + item.name }>{ item.name }</Select.Option>
                    }) }
                </Select>
            ) 
        },
    ]

    const tableColumns = [
        {
            key: 'name',
            title: <span><span style={{ color: 'red' }}>*</span>工序</span>,
            dataIndex: 'name',
            render:  (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={ ["deptProcessesDetailList", index, "name"] } initialValue={ _ } rules={[{ 
                    "required": true,
                    "message": "请输入工序" },
                    {
                    pattern: /^[^\s]*$/,
                    message: '禁止输入空格',
                    }]}>
                    <Input maxLength={ 50 } key={ index } />
                </Form.Item>
            )  
        },
        {
            key: 'sort',
            title: <span><span style={{ color: 'red' }}>*</span>材料</span>,
            dataIndex: 'sort',
            render:  (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={ ["deptProcessesDetailList", index, "sort"] } initialValue={ _ } rules={[{ 
                    "required": true,
                    "message": "请输入顺序" }]}>
                    <Select placeholder="请选择"  style={{ width: '200px' }}onChange={(e: string) => materialChange(e, index)}>
                        { materialList?.map((item: any) => {
                            return <Select.Option key={ item.id } value={ item.materialName }>{ item.materialName }</Select.Option>
                        }) }
                    </Select>
                </Form.Item>
            )  
        },
        {
            key: 'sort',
            title: <span><span style={{ color: 'red' }}>*</span>规格</span>,
            dataIndex: 'sort',
            render:  (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={ ["deptProcessesDetailList", index, "sort"] } initialValue={ _ } rules={[{ 
                    "required": true,
                    "message": "请选择规格" }]}>
                    <Select placeholder="请选择" style={{ width: '200px' }} key={index} onChange={(e: string) => materialChange(e, index)}>
                        { specifications[index]?.map((item: any) => {
                            return <Select.Option key={ item.id } value={ item.structureSpec }>{ item.structureSpec }</Select.Option>
                        }) }
                    </Select>
                </Form.Item>
            )  
        },
        {
            key: 'sort',
            title: <span><span style={{ color: 'red' }}>*</span>材质</span>,
            dataIndex: 'sort',
            render:  (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={ ["deptProcessesDetailList", index, "sort"] } initialValue={ _ } rules={[{ 
                    "required": true,
                    "message": "请选择材质" }]}>
                    <Select style={{ width: '200px' }}>
                        { materialTextureOptions?.map((item: any, index: number) => <Select.Option value={item.name} key={index}>{item.name}</Select.Option>) }
                    </Select>
                </Form.Item>
            )  
        },
        {
            key: 'sort',
            title: <span><span style={{ color: 'red' }}>*</span>标准工时（s）</span>,
            dataIndex: 'sort',
            render:  (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={ ["deptProcessesDetailList", index, "sort"] } initialValue={ _ } rules={[{ 
                    "required": true,
                    "message": "请输入标准工时" }]}>
                    <InputNumber step={1} min={ 0 } maxLength={ 10 } precision={ 0 } key={ index } />
                </Form.Item>
            )  
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={ () => delRow(index) }
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button type="link">删除</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ]

    const businessTypeChange = async (e: number) => {
        let result: IResponse = await RequestUtil.get(`/tower-supply/supplier?size=100`);
        let list: any = result?.records?.map((item: { supplierName: string }) => {
                return{
                    ...item,
                    name: item.supplierName
                }
            })
        setCompanyList(list || []);
    }
    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, onSubmit, resetFields]);

    const addRow = () => {
        let processListValues = form.getFieldsValue(true).deptProcessesDetailList || [];
        let newData = {
            name: '',
            sort: undefined
        }
        setProcessList([...processListValues, newData]);
        form.setFieldsValue({ deptProcessesDetailList: [...processListValues, newData] })
    }

    const delRow = (index?: number) => {
        let processListValues = form.getFieldsValue(true).deptProcessesDetailList || []; 
        // if(index) {
            processListValues.splice(index, 1);
            setProcessList([...processListValues]);
        // } else {
        //     processListValues.filter((item: any) => {
        //         if(selectedKeys.indexOf(item) === -1) {
        //             return selectedKeys.indexOf(item.id) === -1
        //         }            
        //     })
        //     selectedKeys.forEach((item) => {
        //         processListValues.splice(item, 1);
        //     })
        // }
        
        baseForm.setFieldsValue({ deptProcessesDetailList: [...processListValues] })
    }

    // const SelectChange = (selectedRowKeys: React.Key[]): void => {
    //     setSelectedKeys(selectedRowKeys);
    // }

    return <Spin spinning={loading}>
        <DetailTitle title="基本信息" />
        <BaseInfo form={baseForm} columns={baseColumns} col={2} dataSource={{}} edit />
        <DetailTitle title="产能矩阵" operation={[<Space size="small">
            <Button type="primary" onClick={ addRow }>新增</Button>
            {/* <Button type="primary" onClick={ () => {
                console.log(selectedKeys)
            } }>删除</Button> */}
        </Space>]}/>
        <Form form={form}>
            <Table 
                rowKey="id" 
                dataSource={[...processList]} 
                // rowSelection={{
                //     selectedRowKeys: selectedKeys,
                //     onChange: SelectChange
                // }}
                pagination={false} 
                columns={tableColumns} 
                className={styles.addModal}/>
        </Form>
    </Spin>
})