import React, { useState } from 'react'
import { Space, Input, DatePicker, Button, Form, Modal, Row, Col, Popconfirm, Select, message } from 'antd'
import { FixedType } from 'rc-table/lib/interface';
import { useHistory, useParams } from 'react-router-dom'
import { Page } from '../../common'
import TowerPickAssign from './TowerPickAssign';
import RequestUtil from '../../../utils/RequestUtil';
import AuthUtil from '../../../utils/AuthUtil';
import TreeSelect, { TreeNode } from 'antd/lib/tree-select';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import styles from './pick.module.less';
import useRequest from '@ahooksjs/use-request';
import { patternTypeOptions } from '../../../configuration/DictionaryOptions';

export default function PickTowerMessage(): React.ReactNode {
    const history = useHistory();
    const [refresh, setRefresh] = useState<boolean>(false);
    const [visible, setVisible] = useState<boolean>(false);
    const [edit, setEdit] = useState<boolean>(false);
    const params = useParams<{ id: string, status: string, materialLeader: string }>();
    const [filterValue, setFilterValue] = useState({});
    const [pickLeader, setPickLeader] = useState<any|undefined>([]);
    const [checkLeader, setCheckLeader] = useState<any|undefined>([]);
    const [department, setDepartment] = useState<any|undefined>([]);
    const [detail, setDetail] = useState<any>([]);
    const [form] = Form.useForm();
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const departmentData: any = await RequestUtil.get(`/tower-system/department`);
        setDepartment(departmentData);
        resole(data)
    }), {})
    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'productCategoryName',
            title: '塔型',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'name',
            title: '段包信息',
            width: 100,
            dataIndex: 'name'
        },
        {
            key: 'pattern',
            title: '段模式',
            width: 100,
            dataIndex: 'pattern'
        },
        {
            key: 'plannedDeliveryTime',
            title: '计划交付时间',
            width: 100,
            dataIndex: 'plannedDeliveryTime'
        },
        {
            key: 'materialLeaderName',
            title: '提料人',
            width: 100,
            dataIndex: 'materialLeaderName'
        },
        {
            key: 'materialCheckLeaderName',
            title: '校核人',
            width: 100,
            dataIndex: 'materialCheckLeaderName'
        },
        {
            key: 'statusName',
            title: '提料状态',
            width: 200,
            dataIndex: 'statusName'
        },
        {
            key: 'updateStatusTime',
            title: '最新状态变更时间',
            width: 200,
            dataIndex: 'updateStatusTime'
        },
        {
            key: 'operation',
            title: '操作',
            fixed: 'right' as FixedType,
            width: 200,
            dataIndex: 'operation',
            render: (_: undefined, record: any): React.ReactNode => (
                <Space direction="horizontal" size="small"  className={styles.operationBtn}>
                    <Button onClick={()=>{history.push(`/workMngt/pickList/pickTowerMessage/${params.id}/${params.status}/${params.materialLeader}/pick/${record.id}`)}} type='link' disabled={record.status!==1||AuthUtil.getUserId()!==record.materialLeader}>提料</Button>
                    <Button onClick={()=>{history.push(`/workMngt/pickList/pickTowerMessage/${params.id}/${params.status}/${params.materialLeader}/check/${record.id}/${record.materialLeader}`)}} type='link' disabled={record.status!==2||AuthUtil.getUserId()!==record.materialCheckLeader}>校核</Button>
                    <Button onClick={()=>{history.push(`/workMngt/pickList/pickTowerMessage/${params.id}/${params.status}/${params.materialLeader}/detail/${record.id}`)}} type='link' disabled={record.status<3}>明细</Button>
                    <TowerPickAssign type={ record.status < 2 ? 'message' : "detail" } title="指派信息" detailData={ record } id={ record.id } update={ onRefresh } />
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={ async () => {
                            RequestUtil.delete(`/tower-science/drawProductSegment/${record.id}`).then(()=>{
                                message.success('删除成功！')
                            }).then(()=>{
                                setRefresh(!refresh)
                            })
                        }}
                        okText="提交"
                        cancelText="取消"
                        disabled={record.status!== 1}
                    >
                        <Button type='link' disabled={record.status!== 1}>删除</Button>
                    </Popconfirm>
                    <Button onClick={async ()=>{
                        const data = await RequestUtil.get(`/tower-science/drawProductSegment/pattern/${record.id}`)
                        setDetail(data);
                        form.setFieldsValue({
                            detailData: data
                        })
                        if(record.status > 2){
                            setEdit(true);
                        }else{
                            setEdit(false);
                        }
                        setVisible(true);
                    }} type='link'>段模式</Button>
                </Space>
            )
        }
    ];
    const onDepartmentChange = async (value: Record<string, any>, name: string) => {
        if(value){
            const userData: any= await RequestUtil.get(`/tower-system/employee?dept=${value}&size=1000`);
            if(name==='提料'){
                setPickLeader(userData.records);
            }
            else{
                setCheckLeader(userData.records);
            }
        }else{
            setPickLeader([]);
            setCheckLeader([]);
        }
       
    }
    const renderTreeNodes = (data:any) =>
    data.map((item:any) => {
        if (item.children) {
            return (
            <TreeNode key={item.id} title={item.name} value={item.id}  className={styles.node}>
                {renderTreeNodes(item.children)}
            </TreeNode>
            );
        }
        return <TreeNode {...item} key={item.id} title={item.name} value={item.id} />;
    });
    const wrapRole2DataNode = (roles: (any & SelectDataNode)[] = []): SelectDataNode[] => {
        roles.forEach((role: any & SelectDataNode): void => {
            role.value = role.id;
            role.isLeaf = false;
            if (role.children && role.children.length > 0) {
                wrapRole2DataNode(role.children);
            } else {
                role.children = []
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
    const onRefresh=()=>{
        setRefresh(!refresh);
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
            // const saveData={
            //     productCategoryId: params.id,
            //     // productId: productId,
            //     productSegmentListDTOList: saveTableData
            // }
            RequestUtil.post(`/tower-science/drawProductSegment/pattern/submit`,saveTableData).then(()=>{
                message.success('保存成功！');
                setVisible(false);
                // setProductId('');
                form.resetFields();
            }).then(()=>{
                setRefresh(!refresh);
            })
        } catch (error) {
            console.log(error)
        }
    }
    const handleModalCancel = () => {setVisible(false);;setDetail([]);form.setFieldsValue({
        detailData:{}
    })};
    return (
        <>
         <Modal title='段模式'  width={1200} visible={visible} onCancel={handleModalCancel} footer={false}>
                {detail?<Form initialValues={{ detailData : detail }} autoComplete="off" form={form}>  
                    <Row>
                        <Form.List name="detailData">
                            {
                                ( fields , { add, remove }) => fields.map(
                                    field => (
                                    <>
                                        <Col span={ 1}></Col>
                                        <Col span={ 11 }>
                                        <Form.Item name={[ field.name , 'segmentName']} label='段名' initialValue={[ field.name , 'segmentName']}>
                                            <Input disabled/>
                                        </Form.Item>
                                        </Col>
                                        <Col span={1}></Col>
                                        <Col span={ 11 }>
                                        <Form.Item  name={[ field.name , 'pattern']} label='模式' initialValue={[ field.name , 'pattern']}>
                                            <Select style={{ width: '150px' }} disabled={edit}>
                                                { patternTypeOptions && patternTypeOptions.map(({ id, name }, index) => {
                                                    return <Select.Option key={ index } value={ id  }>
                                                        { name }
                                                    </Select.Option>
                                                }) }
                                            </Select>
                                        </Form.Item>
                                        </Col>
                                    </>
                                    )
                                )
                            }
                        </Form.List> 
                    </Row>
                </Form>:null}
                {edit?null:<Space style={{position:'relative',left:'80%'}}>
                    <Button type="primary" ghost onClick={()=>handleModalCancel()}>关闭</Button>
                    <Button type="primary" onClick={()=>handleModalSave()}>保存</Button>
                </Space>}
            </Modal>
            <Page
                path={`/tower-science/drawProductSegment`}
                columns={columns}
                refresh={refresh}
                onFilterSubmit={onFilterSubmit}
                filterValue={ filterValue }
                requestData={{ productCategory: params.id }}
                exportPath="/tower-science/drawProductSegment"
                extraOperation={
                    <Space>
                    {/* <Button type="primary" ghost>导出</Button> */}
                    { params.materialLeader===AuthUtil.getUserId()&&params.status!=='3'?<Popconfirm
                        title="确认提交?"
                        onConfirm={ async () => {
                            await RequestUtil.post(`/tower-science/drawProductSegment/${params.id}/submit`).then(()=>{
                                message.success('提交成功')
                            }).then(()=>{
                                history.push('/workMngt/pickList');
                            })
                        } }
                        okText="确认"
                        cancelText="取消"
                    >   
                        <Button type="primary" ghost>提交</Button>
                    </Popconfirm>:null}
                    { (params.status==='1'||params.status==='2')&& params.materialLeader===AuthUtil.getUserId() ? <TowerPickAssign title="塔型提料指派" id={ params.id } update={ onRefresh } /> : null }
                    <Button type="ghost" onClick={()=>history.push('/workMngt/pickList')}>返回</Button>
                    </Space>
                }
                searchFormItems={[
                    {
                        name: 'statusUpdateTime',
                        label: '最新状态变更时间',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                    },
                    {
                        name: 'status',
                        label: '提料状态',
                        children: <Select style={{width:'100px'}}>
                            <Select.Option value={''} key ={''}>全部</Select.Option>
                            <Select.Option value={1} key={1}>提料中</Select.Option>
                            <Select.Option value={2} key={2}>校核中</Select.Option>
                            <Select.Option value={3} key={3}>已完成</Select.Option>
                            {/* <Select.Option value={4} key={4}>已提交</Select.Option> */}
                        </Select>
                    },
                    {
                        name: 'materialLeaderDepartment',
                        label: '提料人',
                        children:  <TreeSelect style={{width:'200px'}}
                                        allowClear
                                        onChange={ (value: any) => { onDepartmentChange(value, '提料') }  }
                                    >
                                        {renderTreeNodes(wrapRole2DataNode( department ))}
                                    </TreeSelect>
                    },
                    {
                        name: 'materialLeader',
                        label:'',
                        children:   <Select style={{width:'100px'}} allowClear>
                                        { pickLeader && pickLeader.map((item:any)=>{
                                            return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                                        }) }
                                    </Select>
                    },
                    {
                        name: 'materialCheckLeaderDepartment',
                        label: '校核人',
                        children:  <TreeSelect style={{width:'200px'}}
                                        allowClear
                                        onChange={ (value: any) => { onDepartmentChange(value, '校核') }  }
                                    >
                                        {renderTreeNodes(wrapRole2DataNode( department ))}
                                    </TreeSelect>
                    },
                    {
                        name: 'materialCheckLeader',
                        label:'',
                        children:   <Select style={{width:'100px'}} allowClear>
                                        { checkLeader && checkLeader.map((item:any)=>{
                                            return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                        }) }
                                    </Select>
                    },
                    {
                        name: 'fuzzyMsg',
                        label: '模糊查询项',
                        children: <Input placeholder="请输入..." maxLength={200} />
                    },
                ]}
            />
        </>
    )
}