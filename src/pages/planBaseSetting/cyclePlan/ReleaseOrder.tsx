import React, { useState } from 'react'
import { Button, Input, Select,  Modal, message, Form} from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { Page } from '../../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import { productTypeOptions } from '../../../configuration/DictionaryOptions';
export default function ReleaseOrder({run,data}:{run:()=>void, data:any}): React.ReactElement {
    const history = useHistory()
    const params = useParams<{ id: string, configId:string }>()
    const [ visible, setVisible] = useState<boolean>(false)
    const [ selectedKeys, setSelectedKeys ] = useState<React.Key[]>([]);
    const [ selectedRows, setSelectedRows ] = useState<any[]>([]);
    const [ detail, setDetail ] = useState<any>({totalHoles: 0 ,totalNumber:0 , totalWeight:'0'});
    const [filterValue, setFilterValue] = useState<{ [key: string]: any }>({
        productTypeId: productTypeOptions && productTypeOptions.length>0 && productTypeOptions[0].id,
        configId: params?.configId
    });
    
    const columns : any =[
        {
            key: 'planNumber',
            title: '计划号',
            width: 100,
            fixed: "left",
            dataIndex: 'planNumber'
        },
        {
            key: 'productCategoryName',
            title: '塔型',
            width: 100,
            fixed: "left",
            dataIndex: 'productCategoryName'
        },
        {
            key: 'productionBatchNo',
            title: '批次号',
            width: 100,
            fixed: "left",
            dataIndex: 'productionBatchNo',
            render: (_: string, record: any): React.ReactNode => (
                <span title={_}>{_&&_.length>50?_.slice(0,30)+'...':_}</span>
            )
        },
        {
            key: 'issuedNumber',
            title: '下达单号',
            width: 100,
            fixed: "left",
            dataIndex: 'issuedNumber'
        },
        {
            key: 'number',
            title: '基数',
            width: 100,
            dataIndex: 'number'
        },
        {
            key: 'voltageGradeName',
            title: '电压等级（Kv）',
            width: 150,
            dataIndex: 'voltageGradeName'
        },
        {
            key: 'orderProjectName',
            title: '工程名称',
            width: 100,
            dataIndex: 'orderProjectName'
        },
        {
            key: 'businessManagerName',
            title: '业务经理',
            width: 100,
            dataIndex: 'businessManagerName'
        },
        {
            key: 'productTypeName',
            title: '产品类型',
            width: 100,
            dataIndex: 'productTypeName'
        },
        {
            key: 'factoryName',
            title: '厂区',
            width: 100,
            dataIndex: 'factoryName'
        },
        {
            key: 'approvalTime',
            title: '审批日期',
            width: 100,
            dataIndex: 'approvalTime'
        },
        {
            key: 'customerDeliveryTime',
            title: '客户交货日期',
            width: 100,
            dataIndex: 'customerDeliveryTime'
        },
        {
            key: 'planDeliveryTime',
            title: '计划交货日期',
            width: 100,
            dataIndex: 'planDeliveryTime'
        },
        {
            key: 'trialAssemble',
            title: '试装类型',
            width: 100,
            dataIndex: 'trialAssemble'
        },
        {
            key: 'totalWeight',
            title: '技术下达重量（t）',
            width: 150,
            dataIndex: 'totalWeight'
        },
        {
            key: 'steelTotalWeight',
            title: '角钢重量（t）',
            width: 100,
            dataIndex: 'steelTotalWeight'
        },
        {
            key: 'platTotalWeight',
            title: '连板重量（t）',
            width: 100,
            dataIndex: 'platTotalWeight'
        },
        {
            key: 'totalProcessNum',
            title: '总件数',
            width: 100,
            dataIndex: 'totalProcessNum'
        },
        {
            key: 'totalHolesNum',
            title: '总孔数',
            width: 100,
            dataIndex: 'totalHolesNum'
        },
        {
            key: 'storageMaterialDescription',
            title: '库存备料',
            width: 100,
            dataIndex: 'storageMaterialDescription'
        },
        {
            key: 'processMaterialDescription',
            title: '生产备料',
            width: 100,
            dataIndex: 'processMaterialDescription'
        },
    ]
    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: any[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows)
        const totalHoles = selectedRows.reduce((pre: any,cur: { totalHolesNum: any; })=>{
            return parseFloat(pre!==null?pre:0) + parseFloat(cur.totalHolesNum!==null?cur.totalHolesNum:0) 
        },0)
        const totalNumber = selectedRows.reduce((pre: any,cur: { totalProcessNum: any; })=>{
            return parseFloat(pre!==null?pre:0 )+ parseFloat(cur.totalProcessNum!==null?cur.totalProcessNum:0 )
        },0)
        const totalWeight = selectedRows.reduce((pre: any,cur: { totalWeight: any; })=>{
            return parseFloat(pre!==null?pre:0) + parseFloat(cur.totalWeight!==null?cur.totalWeight:0)
        },0)
        setDetail({
            totalHoles,
            totalNumber,
            totalWeight
        })
    }
    return <>
        <Modal visible={ visible } title='添加下达单' okText="确认" onOk={ async ()=>{
            if(selectedKeys.length>0){
                await RequestUtil.post(`/tower-aps/cyclePlan/issueOrder`,selectedRows.map((item:any)=>{
                    return{
                        ...item,
                        issueOrderId: item.id,
                        cyclePlanId: params.id,
                    }
                })).then(()=>{
                    message.success('添加成功！')
                })
                setSelectedKeys([])
                setSelectedRows([])
                setVisible(false)
                await run()
                history.go(0)
            }
            else{
                message.error('未选择下达单！')
            }
        } } onCancel={ ()=>{
            // form.resetFields()
            setSelectedKeys([])
            setSelectedRows([])
            setVisible(false)
        } } width={'80%'}>
            <Page
                path="/tower-aps/planBoard/issue/list"
                filterValue={filterValue}
                requestData={{
                    configId: params?.configId,
                    cyclePlanId: params.id,
                }}
                sourceKey='planBoards'
                tableProps={{
                    rowKey:(record: any,index) => `${record.id}-${index}`,
                    pagination:false,
                    rowSelection: {
                        type: "checkbox",
                        selectedRowKeys: selectedKeys,
                        onChange: SelectChange
                    }
                }}
                
                columns={columns}
                extraOperation={(data: any) => {
                    return <>
                        <span style={{ marginLeft: "20px" }}>
                            合计：总件数： {detail?.totalNumber}  总孔数：{detail?.totalHoles}  总重量（t）：{detail?.totalWeight || "0.00"}
                        </span>
                    </>
                }}

                searchFormItems={[
                    {
                        name: "planNum",
                        label: '计划号',
                        children: <Input placeholder="请输入计划号" style={{ width: 150 }} />
                    },
                    {
                        name: "productCategoryName",
                        label: '塔型',
                        children: <Input placeholder="请输入塔型" style={{ width: 150 }} />
                    },
                    {
                        name: "issueNumber",
                        label: "下达单号",
                        children: <Input placeholder="请输入下达单号" style={{ width: 150 }} />
                    },
                    {
                        name: "productTypeId",
                        label: "产品类型",
                        children:
                        <Form.Item initialValue={productTypeOptions&&productTypeOptions[0].id} name='productTypeId'>
                            <Select placeholder="请选择"  getPopupContainer={triggerNode => triggerNode.parentNode} style={{ width: "150px" }}>
                                {productTypeOptions && productTypeOptions.map(({ id, name }, index) => {
                                    return <Select.Option key={index} value={id}>
                                        {name}
                                    </Select.Option>
                                })}
                            </Select>
                        </Form.Item>
                    },
                ]}
                onFilterSubmit={(values: any) => {
                    values.configId = params?.configId
                    values.cyclePlanId = params.id
                    setFilterValue(values)
                    return values;
                }}
                
                
            />
        </Modal>
        <Button type="primary" ghost onClick={() => {setVisible(true)}}>添加下达单</Button>
    </>
}