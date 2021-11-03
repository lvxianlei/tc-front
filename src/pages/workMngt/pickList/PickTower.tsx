import React, { useState } from 'react'
import { Space, Input, DatePicker, Button, Form, Modal, Row, Col, Popconfirm, Select, message, InputNumber, TreeSelect } from 'antd'
import { FixedType } from 'rc-table/lib/interface';
import { Link, useHistory, useParams } from 'react-router-dom'
import { Page } from '../../common'
import RequestUtil from '../../../utils/RequestUtil';
import AuthUtil from '../../../utils/AuthUtil';
import { TreeNode } from 'antd/lib/tree-select';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import styles from './pick.module.less';
import useRequest from '@ahooksjs/use-request';
export interface IDetail {
    productCategory?: string;
    productCategoryName?: string;
    productId?: string;
    productNumber?: string;
    materialDrawProductSegmentList?: IMaterialDetail[]
}
export interface IMaterialDetail{
    count: string;
    id: string;
    segmentName: string;
}
export default function PickTower(): React.ReactNode {
    const [visible, setVisible] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [matchLeader, setMatchLeader] = useState<any|undefined>([]);
    const [department, setDepartment] = useState<any|undefined>([]);
    const params = useParams<{ id: string }>()
    const history = useHistory();
    const [form] = Form.useForm();
    const [filterValue, setFilterValue] = useState({});
    const [productId, setProductId] = useState('');
    const [detail, setDetail] = useState<IDetail>({});
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const departmentData: any = await RequestUtil.get(`/sinzetech-user/department/tree`);
        setDepartment(departmentData);
        resole(data)
    }), {})
    const handleModalOk = async () => {
        try {
            const data = await form.validateFields()
            const submitTableData = data.detailData.map((item:any,index:number)=>{
                return{
                    segmentId: item.id,
                    ...item,
                    id: item.id===-1?'':item.id,
                }
            });
            const submitData={
                productCategoryId: params.id,
                productId: productId,
                productSegmentListDTOList: submitTableData
            }
            RequestUtil.post(`/tower-science/product/material/segment/submit`,submitData).then(()=>{
                message.success('提交成功！');
                setVisible(false);
                setProductId('');
                form.resetFields()
            }).then(()=>{
                setRefresh(!refresh);
            })
        } catch (error) {
            console.log(error)
        }
    }
    const handleModalSave =  async () => {
        try {
            const data = await form.validateFields();
            const saveTableData = data.detailData.map((item:any,index:number)=>{
                return{
                    segmentId: item.id,
                    ...item,
                    id: item.id===-1?'':item.id,
                }
            });
            const saveData={
                productCategoryId: params.id,
                productId: productId,
                productSegmentListDTOList: saveTableData
            }
            RequestUtil.post(`/tower-science/product/material/segment/save`,saveData).then(()=>{
                message.success('保存成功！');
                setVisible(false);
                setProductId('');
                form.resetFields();
            }).then(()=>{
                setRefresh(!refresh);
            })
        } catch (error) {
            console.log(error)
        }
    }
    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'productNumber',
            title: '杆塔号',
            width: 100,
            dataIndex: 'productNumber'
        },
        {
            key: 'productCategoryName',
            title: '塔型',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'materialDeliverTime',
            title: '计划交付时间',
            width: 100,
            dataIndex: 'materialDeliverTime'
        },
        {
            key: 'materialUserName',
            title: '配段人',
            width: 100,
            dataIndex: 'materialUserName'
        },
        {
            key: 'materialStatus',
            title: '杆塔配段状态',
            width: 100,
            dataIndex: 'materialStatus',
            render: (value: number, record: object): React.ReactNode => {
                const renderEnum: any = [
                    {
                        value: 1,
                        label: "待开始"
                      },
                    {
                        value: 2,
                        label: "配段中"
                    },
                    {
                        value: 3,
                        label: "已完成"
                    },
                    {
                        value: 4,
                        label: "已提交"
                    }
                ]
                return <>{value&&value!==-1?renderEnum.find((item: any) => item.value === value).label:null}</>
            }
        },
        {
            key: 'materialUpdateStatusTime',
            title: '最新状态变更时间',
            width: 200,
            dataIndex: 'materialUpdateStatusTime'
        },
        {
            key: 'operation',
            title: '操作',
            fixed: 'right' as FixedType,
            width: 230,
            dataIndex: 'operation',
            render: (_: undefined, record: any): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type='link' onClick={async () => {
                        setVisible(true);
                            let data: IDetail = await RequestUtil.get<IDetail>(`/tower-science/product/material/${record.id}`)
                            const detailData: IMaterialDetail[]|undefined = data&&data.materialDrawProductSegmentList&&data.materialDrawProductSegmentList.map((item:IMaterialDetail)=>{
                                return {
                                    ...item,
                                    // value:item.count===-1?0:item.count,
                                }
                            })
                            setProductId(record.id);
                            setDetail({
                                ...data,
                                materialDrawProductSegmentList:detailData
                            })
                            form.setFieldsValue({detailData:detailData});
                            
                    }} disabled={record.materialStatus!==2||AuthUtil.getUserId()!==record.materialUser}>配段</Button>
                    <Button type='link' onClick={()=>{history.push(`/workMngt/pickList/pickTower/${params.id}/pickTowerDetail/${record.id}`)}} disabled={record.materialStatus!==3}>杆塔提料明细</Button>
                </Space>
            )
        }
    ]

    const handleModalCancel = () => {setVisible(false);setProductId('');form.resetFields()};
    const formItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 17 }
    };
    const onDepartmentChange = async (value: Record<string, any>) => {
        if(value){
            const userData: any= await RequestUtil.get(`/sinzetech-user/user?departmentId=${value}&size=1000`);
            setMatchLeader(userData.records);
        }else{
            
            setMatchLeader([]);
        }
       
    }
    const renderTreeNodes = (data:any) =>
    data.map((item:any) => {
        if (item.children) {
            item.disabled = true;
            return (
            <TreeNode key={item.id} title={item.title} value={item.id} disabled={item.disabled} className={styles.node}>
                {renderTreeNodes(item.children)}
            </TreeNode>
            );
        }
        return <TreeNode {...item} key={item.id} title={item.title} value={item.id} />;
    });
    const wrapRole2DataNode = (roles: (any & SelectDataNode)[] = []): SelectDataNode[] => {
        roles.forEach((role: any & SelectDataNode): void => {
            role.value = role.id;
            role.isLeaf = false;
            if (role.children && role.children.length > 0) {
                wrapRole2DataNode(role.children);
            }
        });
        return roles;
    }
    const onFilterSubmit = (value: any) => {
        if (value.statusUpdateTime) {
            const formatDate = value.statusUpdateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.updateStatusTimeStart = formatDate[0]+ ' 00:00:00';
            value.updateStatusTimeEnd = formatDate[1]+ ' 23:59:59';
            delete value.statusUpdateTime
        }
        setFilterValue(value)
        return value
    }
    return (
        <>
            <Modal title='配段信息'  width={1200} visible={visible} onCancel={handleModalCancel} footer={false}>
                {detail?.materialDrawProductSegmentList?<Form initialValues={{ detailData : detail.materialDrawProductSegmentList }} autoComplete="off" form={form}>  
                    <Row>
                        <Col span={1}></Col>
                        <Col span={11}>
                            <Form.Item name="productCategoryName" label="塔型">
                                <span>{detail?.productCategoryName}</span>
                            </Form.Item>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={11}>
                            <Form.Item name="productNumber" label="杆塔号">
                                <span>{detail?.productNumber}</span>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                    
                        <Form.List name="detailData">
                            
                            {
                                ( fields , { add, remove }) => fields.map(
                                    field => (
                                    <>
                                        <Col span={ 1}></Col>
                                        <Col span={ 11 }>
                                        <Form.Item name={[ field.name , 'segmentName']} label='段号'>
                                            <span>{detail.materialDrawProductSegmentList&&detail.materialDrawProductSegmentList[field.name].segmentName}</span>
                                        </Form.Item>
                                        </Col>
                                        <Col span={1}></Col>
                                        <Col span={ 11 }>
                                        <Form.Item  name={[ field.name , 'count']} label='段数' initialValue={[ field.name , 'count']}>
                                            <InputNumber min={0} precision={0} style={{width:'100%'}}/>
                                        </Form.Item>
                                        </Col>
                                    </>
                                    )
                                )
                            }
                        </Form.List> 
                    </Row>
                </Form>:null}
                <Space style={{position:'relative',left:'80%'}}>
                    <Button type="primary" ghost onClick={()=>handleModalCancel()}>取消</Button>
                    <Button type="primary" onClick={()=>handleModalSave()}>保存</Button>
                    <Button type="primary" onClick={()=>handleModalOk()}>保存并提交</Button>
                </Space>
            </Modal>
            <Page
                path="/tower-science/product/material"
                columns={columns}
                onFilterSubmit={onFilterSubmit}
                filterValue={ filterValue }
                refresh={ refresh }
                requestData={{ productCategoryId: params.id }}
                extraOperation={
                    <Space>
                    {/* <Button type="primary">导出</Button> */}
                    <Popconfirm
                        title="确认提交?"
                        onConfirm={ async ()=>{
                            await RequestUtil.post(`/tower-science/product/material/submit?productCategoryId=${params.id}`).then(()=>{
                                message.success('提交成功！')
                            }).then(()=>{
                                history.push('/workMngt/pickList')
                            })
                        } }
                        okText="确认"
                        cancelText="取消"
                    >   
                        <Button type="primary" >提交</Button>
                    </Popconfirm>
                    <Button type="primary" onClick={()=>history.push('/workMngt/pickList')}>返回上一级</Button>
                    </Space>
                }
                searchFormItems={[
                    {
                        name: 'statusUpdateTime',
                        label: '最新状态变更时间',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                    },
                    {
                        name: 'materialStatus',
                        label: '杆塔配段状态',
                        children: <Select style={{width:'100px'}}>
                            <Select.Option value={''} key ={''}>全部</Select.Option>
                            <Select.Option value={1} key={1}>待开始</Select.Option>
                            <Select.Option value={2} key={2}>配段中</Select.Option>
                            <Select.Option value={3} key={3}>已完成</Select.Option>
                            <Select.Option value={4} key={4}>已提交</Select.Option>
                        </Select>
                    },
                    {
                        name: 'materialUserDepartment',
                        label: '配段人',
                        children:  <TreeSelect style={{width:'200px'}}
                                        allowClear
                                        onChange={ onDepartmentChange }
                                    >
                                        {renderTreeNodes(wrapRole2DataNode( department ))}
                                    </TreeSelect>
                    },
                    {
                        name: 'materialUser',
                        label:'',
                        children:   <Select style={{width:'100px'}} allowClear>
                                        { matchLeader && matchLeader.map((item:any)=>{
                                            return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                        }) }
                                    </Select>
                    },
                ]}
            />
        </>
    )
}