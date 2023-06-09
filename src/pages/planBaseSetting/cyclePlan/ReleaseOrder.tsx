import React, { useCallback, useState } from 'react'
import { Button, Input, Select,  Modal, message, Form, Dropdown, Menu} from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { SearchTable as Page } from '../../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import { productTypeOptions } from '../../../configuration/DictionaryOptions';
import { tableHeader, commonHeader } from "./data.json"
import style from "./index.module.less"
import { DownOutlined } from "@ant-design/icons"
export default function ReleaseOrder({run,data}:{run:()=>void, data:any}): React.ReactElement {
    const history = useHistory()
    const params = useParams<{ id: string, configId:string }>()
    const [ visible, setVisible] = useState<boolean>(false)
    const [ selectedKeys, setSelectedKeys ] = useState<React.Key[]>([]);
    const [ selectedRows, setSelectedRows ] = useState<any[]>([]);
    const [ detail, setDetail ] = useState<any>({totalHoles: 0 ,totalNumber:0 , totalWeight:'0'});
    const [filterValue, setFilterValue] = useState<{ [key: string]: any }>({
        productTypeId: productTypeOptions && productTypeOptions.length>0 && productTypeOptions[0].id,
        configId: params?.configId,
        cyclePlanId: params?.id,
        executeStatus: 1
    });
    const [columns, setColumns] = useState<any[]>(tableHeader)
    const [filterStatus, setFilterStatus] = useState<{ [key: string]: any }>({ })
    
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
    const handleChange = useCallback((data: string | number, name: string) => {
        const newfilterStatus = { ...filterStatus, [name]: data }
        setFilterValue({ ...filterValue, status: Object.keys(newfilterStatus).map((item: string) => `${item}-${newfilterStatus[item]}`).join(",") })
        setFilterStatus(newfilterStatus)
    }, [filterStatus, filterValue, setFilterValue, setFilterStatus])
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
                    cyclePlanId: params?.id,
                }}
                transformResult={(dataSource: any) => {
                    setColumns([...tableHeader, ...dataSource.header.map(((item: any) => ({
                        title: item.productionLinks,
                        align: "center",
                        children: commonHeader.map((head: any) => {
                            if (head.code === "status") {
                                return ({
                                    ...head,
                                    title: <Dropdown
                                        overlay={(<Menu selectable onClick={({ key }) => handleChange(key, item.productionLinkIds)}>
                                            <Menu.Item key={3}>已下发</Menu.Item>
                                            <Menu.Item key={5} >已完成</Menu.Item>
                                            <Menu.Item key={6} >取消</Menu.Item>
                                            <Menu.Item key={7} >暂停</Menu.Item>
                                        </Menu>)}>
                                        <div className={style.dropdown}>
                                            <span>{head.title}</span>
                                            <DownOutlined />
                                        </div>
                                    </Dropdown>,
                                    code: `${item.productionLinkIds}-${head.code}`,
                                    render: (value: any, records: any) => records.unitData[item.productionLinkIds]?.[head.code] || ""
                                })
                            }
                            return ({
                                ...head,
                                code: `${item.productionLinkIds}-${head.code}`,
                                render: (value: any, records: any) => records.unitData[item.productionLinkIds]?.[head.code] || ""
                            })
                        })
                    })))])
                    // return ({
                    //     ...dataSource.planBoards,
                    //     records: dataSource.planBoards.map((item: any, index: number) => ({
                    //         ...item,
                    //         onlyId: `${item.id}-${index}`
                    //     }))
                    // })
                    return ({
                        ...dataSource.planBoards,
                        records: dataSource.planBoards.records.map((item: any, index: number) => ({
                            ...item,
                            onlyId: `${item.id}-${index}`
                        }))
                    })
                }}
                sourceKey='planBoards'
                tableProps={{
                    rowKey:(record: any,index: number) => `${record.id}-${index}`,
                    pagination:false,
                    rowSelection: {
                        type: "checkbox",
                        selectedRowKeys: selectedKeys,
                        onChange: SelectChange
                    }
                }}
                // pagination={false}
                modal={true}
                columns={columns}
                extraOperation={(data: any) => {
                    return <>
                        <span style={{ marginLeft: "20px" }}>
                            合计：总件数： {detail?.totalNumber}  总孔数：{detail?.totalHoles}  总重量（t）：{parseFloat(detail?.totalWeight).toFixed(3) || "0.000"}
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
                                {/* <Select.Option value='' key="">全部</Select.Option> */}
                                {productTypeOptions && productTypeOptions.map(({ id, name }, index) => {
                                    return <Select.Option key={index} value={id}>
                                        {name}
                                    </Select.Option>
                                })}
                            </Select>
                        </Form.Item>
                    },
                    {
                        name: 'executeStatus',
                        label: '执行状态',
                        children: <Form.Item name='executeStatus' initialValue={1}>
                            <Select placeholder="请选择" style={{ width: "150px" }}>
                                {/* <Select.Option value='' key="">全部</Select.Option> */}
                                <Select.Option value={1} key="1">正常</Select.Option>
                                {/* <Select.Option value={2} key="2">暂停</Select.Option> */}
                                <Select.Option value={2} key="2">取消</Select.Option>
                            </Select>
                        </Form.Item>
                    },
                ]}
                onFilterSubmit={(values: any) => {
                    values.configId = params?.configId
                    values.cyclePlanId = params?.id
                    setFilterValue(values)
                    return values;
                }}
                
                
            />
        </Modal>
        <Button type="primary" ghost onClick={() => {setVisible(true)}}>添加下达单</Button>
    </>
}