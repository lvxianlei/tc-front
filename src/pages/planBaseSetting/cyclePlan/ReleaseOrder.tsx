import React, { useState } from 'react'
import { Button, Input, Select,  Modal, message} from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable, DetailTitle, Page } from '../../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import { productTypeOptions } from '../../../configuration/DictionaryOptions';
export default function ReleaseOrder({run}:{run:()=>void}): React.ReactElement {
    const history = useHistory()
    const [ visible, setVisible] = useState<boolean>(false)
    const [ selectedKeys, setSelectedKeys ] = useState<React.Key[]>([]);
    const [ selectedRows, setSelectedRows ] = useState<any[]>([]);
    const [filterValue, setFilterValue] = useState<{ [key: string]: any }>({});
    const params = useParams<{ id: string }>()
    const columns : any =[
        {
            key: 'planNumber',
            title: '计划号',
            width: 100,
            fixed: "left",
            dataIndex: 'planNumber'
        },
        {
            key: 'productCategory',
            title: '塔型',
            width: 100,
            fixed: "left",
            dataIndex: 'productCategory'
        },
        {
            key: 'batchNo',
            title: '批次号',
            width: 100,
            fixed: "left",
            dataIndex: 'batchNo'
        },
        {
            key: 'issueOrderNumber',
            title: '下达单号',
            width: 100,
            fixed: "left",
            dataIndex: 'issueOrderNumber'
        },
        {
            key: 'lineName',
            title: '基数',
            width: 100,
            dataIndex: 'lineName'
        },
        {
            key: 'totalWeight',
            title: '电压等级（Kv）',
            width: 150,
            dataIndex: 'totalWeight'
        },
        {
            key: 'productType',
            title: '工程名称',
            width: 100,
            dataIndex: 'productType'
        },
        {
            key: 'description',
            title: '业务经理',
            width: 100,
            dataIndex: 'description'
        },
        {
            key: 'description',
            title: '产品类型',
            width: 100,
            dataIndex: 'description'
        },
        {
            key: 'totalHoles',
            title: '厂区',
            width: 100,
            dataIndex: 'totalHoles'
        },
        {
            key: 'totalNumber',
            title: '审批日期',
            width: 100,
            dataIndex: 'totalNumber'
        },
        {
            key: 'totalWeight',
            title: '客户交货日期',
            width: 100,
            dataIndex: 'totalWeight'
        },
        {
            key: 'description',
            title: '计划交货日期',
            width: 100,
            dataIndex: 'description'
        },
        {
            key: 'description',
            title: '试装类型',
            width: 100,
            dataIndex: 'description'
        },
        {
            key: 'description',
            title: '技术下达重量（t）',
            width: 100,
            dataIndex: 'description'
        },
        {
            key: 'description',
            title: '角钢重量（t）',
            width: 100,
            dataIndex: 'description'
        },
        {
            key: 'description',
            title: '连板重量（t）',
            width: 100,
            dataIndex: 'description'
        },
        {
            key: 'description',
            title: '总件数',
            width: 100,
            dataIndex: 'description'
        },
        {
            key: 'description',
            title: '总孔数',
            width: 100,
            dataIndex: 'description'
        },
        {
            key: 'description',
            title: '库存备料',
            width: 100,
            dataIndex: 'description'
        },
        {
            key: 'description',
            title: '生产备料',
            width: 100,
            dataIndex: 'description'
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
                        children:<Select placeholder="请选择" getPopupContainer={triggerNode => triggerNode.parentNode} style={{ width: "150px" }}>
                            {productTypeOptions && productTypeOptions.map(({ id, name }, index) => {
                                return <Select.Option key={index} value={id}>
                                    {name}
                                </Select.Option>
                            })}
                        </Select>
                    },
                ]}
                onFilterSubmit={(values: any) => {
                    return values;
                }}
                
                
            />
        </Modal>
        <Button type="primary" ghost onClick={() => {setVisible(true)}}>添加下达单</Button>
    </>
}