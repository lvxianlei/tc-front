import React, { useState } from 'react'
import { Button, Input, Select,  Modal, message} from 'antd';
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
            dataIndex: 'productionBatchNo'
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
            width: 100,
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
        // {
        //     title: '放样',
        //     children: [
        //         {
        //             key: 'description',
        //             title: '下发日期',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '计划完成日期',
        //             width: 100,
        //             dataIndex: 'description'
        //         }, 
        //         {
        //             key: 'description',
        //             title: '完成进度',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '实际完成日期',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '状态',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '执行单元',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //     ]
        // },
        // {
        //     title: '角钢加工',
        //     children: [
        //         {
        //             key: 'description',
        //             title: '下发日期',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '计划完成日期',
        //             width: 100,
        //             dataIndex: 'description'
        //         }, 
        //         {
        //             key: 'description',
        //             title: '完成进度',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '实际完成日期',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '状态',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '执行单元',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //     ]
        // },
        // {
        //     title: '厚钢板加工',
        //     children: [
        //         {
        //             key: 'description',
        //             title: '下发日期',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '计划完成日期',
        //             width: 100,
        //             dataIndex: 'description'
        //         }, 
        //         {
        //             key: 'description',
        //             title: '完成进度',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '实际完成日期',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '状态',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '执行单元',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //     ]
        // },
        // {
        //     title: '薄钢板加工',
        //     children: [
        //         {
        //             key: 'description',
        //             title: '下发日期',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '计划完成日期',
        //             width: 100,
        //             dataIndex: 'description'
        //         }, 
        //         {
        //             key: 'description',
        //             title: '完成进度',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '实际完成日期',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '状态',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '执行单元',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //     ]
        // },
        // {
        //     title: '组焊加工',
        //     children: [
        //         {
        //             key: 'description',
        //             title: '下发日期',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '计划完成日期',
        //             width: 100,
        //             dataIndex: 'description'
        //         }, 
        //         {
        //             key: 'description',
        //             title: '完成进度',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '实际完成日期',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '状态',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '执行单元',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //     ]
        // },
        // {
        //     title: '附件加工',
        //     children: [
        //         {
        //             key: 'description',
        //             title: '下发日期',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '计划完成日期',
        //             width: 100,
        //             dataIndex: 'description'
        //         }, 
        //         {
        //             key: 'description',
        //             title: '完成进度',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '实际完成日期',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '状态',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '执行单元',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //     ]
        // },
        // {
        //     title: '附件焊接',
        //     children: [
        //         {
        //             key: 'description',
        //             title: '下发日期',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '计划完成日期',
        //             width: 100,
        //             dataIndex: 'description'
        //         }, 
        //         {
        //             key: 'description',
        //             title: '完成进度',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '实际完成日期',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '状态',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '执行单元',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //     ]
        // },
        // {
        //     title: '黑件试装',
        //     children: [
        //         {
        //             key: 'description',
        //             title: '下发日期',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '计划完成日期',
        //             width: 100,
        //             dataIndex: 'description'
        //         }, 
        //         {
        //             key: 'description',
        //             title: '完成进度',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '实际完成日期',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '状态',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '执行单元',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //     ]
        // },
        // {
        //     title: '白件试装',
        //     children: [
        //         {
        //             key: 'description',
        //             title: '下发日期',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '计划完成日期',
        //             width: 100,
        //             dataIndex: 'description'
        //         }, 
        //         {
        //             key: 'description',
        //             title: '完成进度',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '实际完成日期',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '状态',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '执行单元',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //     ]
        // },
        // {
        //     title: '大锅镀锌',
        //     children: [
        //         {
        //             key: 'description',
        //             title: '下发日期',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '计划完成日期',
        //             width: 100,
        //             dataIndex: 'description'
        //         }, 
        //         {
        //             key: 'description',
        //             title: '完成进度',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '实际完成日期',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '状态',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '执行单元',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //     ]
        // },
        // {
        //     title: '连板镀锌',
        //     children: [
        //         {
        //             key: 'description',
        //             title: '下发日期',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '计划完成日期',
        //             width: 100,
        //             dataIndex: 'description'
        //         }, 
        //         {
        //             key: 'description',
        //             title: '完成进度',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '实际完成日期',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '状态',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '执行单元',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //     ]
        // },
        // {
        //     title: '角钢包装',
        //     children: [
        //         {
        //             key: 'description',
        //             title: '下发日期',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '计划完成日期',
        //             width: 100,
        //             dataIndex: 'description'
        //         }, 
        //         {
        //             key: 'description',
        //             title: '完成进度',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '实际完成日期',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '状态',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '执行单元',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //     ]
        // },
        // {
        //     title: '连板包装',
        //     children: [
        //         {
        //             key: 'description',
        //             title: '下发日期',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '计划完成日期',
        //             width: 100,
        //             dataIndex: 'description'
        //         }, 
        //         {
        //             key: 'description',
        //             title: '完成进度',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '实际完成日期',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '状态',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //         {
        //             key: 'description',
        //             title: '执行单元',
        //             width: 100,
        //             dataIndex: 'description'
        //         },
        //     ]
        // }
    ]
    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: any[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows)
    }
    return <>
        <Modal visible={ visible } title='添加下达单' okText="确认" onOk={ async ()=>{
            if(selectedKeys.length>0){
                await RequestUtil.post(`/tower-aps/cyclePlan/issueOrder`,selectedRows).then(()=>{
                    message.success('添加成功！')
                })
                setSelectedKeys([])
                setSelectedRows([])
                setVisible(false)
                await run()
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
                    configId: params?.configId
                }}
                tableProps={{
                    rowSelection: {
                        type: "checkbox",
                        selectedRowKeys: selectedKeys,
                        onChange: SelectChange
                    }
                }}
                columns={columns}
                sourceKey='planBoards.records'
                extraOperation={(data: any) => {
                    return <>
                        <span style={{ marginLeft: "20px" }}>
                            合计：总件数： {data?.totalNumber}  总孔数：{data?.totalHoles}  总重量（t）：{data?.totalWeight || "0.00"}
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
                        name: "issuedNumber",
                        label: "下达单号",
                        children: <Input placeholder="请输入下达单号" style={{ width: 150 }} />
                    },
                    {
                        name: "productTypeId",
                        label: "产品类型",
                        children:<Select placeholder="请选择" defaultValue={productTypeOptions&&productTypeOptions[0].id} getPopupContainer={triggerNode => triggerNode.parentNode} style={{ width: "150px" }}>
                            {productTypeOptions && productTypeOptions.map(({ id, name }, index) => {
                                return <Select.Option key={index} value={id}>
                                    {name}
                                </Select.Option>
                            })}
                        </Select>
                    },
                ]}
                onFilterSubmit={(values: any) => {
                    values.configId = params?.configId
                    values.productTypeId = values?.productTypeId?values.productTypeId:productTypeOptions&&productTypeOptions[0].id
                    console.log(values)
                    return values;
                }}
                
                
            />
        </Modal>
        <Button type="primary" ghost onClick={() => {setVisible(true)}}>添加下达单</Button>
    </>
}