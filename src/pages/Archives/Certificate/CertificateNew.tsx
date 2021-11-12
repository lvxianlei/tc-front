import React, { useState } from 'react';
import { Spin, Button, Space, message, Form, Input, Table, Popconfirm, Select, TreeSelect, DatePicker } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import { DetailTitle, DetailContent } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './CertificateMngt.module.less';
import { ICertificate } from './CertificateMngt';
import { wrapRole2DataNode } from '../../baseSetting/deptUtil';
import { TreeNode } from 'antd/lib/tree-select';
import { FixedType } from 'rc-table/lib/interface';
import moment from 'moment';

export default function CertificateNew(): React.ReactNode {
    const [ form ] = Form.useForm();
    const history = useHistory();
    const location = useLocation<{ type: string, data: ICertificate[] }>();
    const [ dataList, setDataList ] = useState<ICertificate[]>([]);
    const [ databaseData, setDatabaseData ] = useState([{id: '121321', title: 'asdasd'}]);

    const tableColumns = [
        {
            key: 'certificateNumber',
            title: <span><span style={{ color: 'red' }}>*</span>证书编号</span>,
            dataIndex: 'certificateNumber',
            width: 150,
            render:  (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={ ["list", index, "certificateNumber"] } key={ index } initialValue={ _ } rules={[{ 
                    "required": true,
                    "message": "请输入证书编号" },
                    {
                      pattern: /^[^\s]*$/,
                      message: '禁止输入空格',
                    }]}>
                    <Input maxLength={ 50 }/>
                </Form.Item>
            )  
        },
        {
            key: 'certificateName',
            title: <span><span style={{ color: 'red' }}>*</span>证书名称</span>,
            dataIndex: 'certificateName',
            width: 150,
            render:  (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={ ["list", index, "certificateName"] } key={ index } initialValue={ _ } rules={[{ 
                    "required": true,
                    "message": "请输入资料名称" },
                    {
                      pattern: /^[^\s]*$/,
                      message: '禁止输入空格',
                    }]}>
                    <Input maxLength={ 50 }/>
                </Form.Item>
            )  
        },
        {
            key: 'certificateType',
            title: <span><span style={{ color: 'red' }}>*</span>证书类型</span>,
            dataIndex: 'certificateType',
            width: 150,
            render:  (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={ ["list", index, "certificateType"] } key={ index } initialValue={ _ } rules={[{ 
                    "required": true,
                    "message": "请选择资料类型" }]}>
                    <Select getPopupContainer={triggerNode => triggerNode.parentNode}>
                        <Select.Option key={1} value={123}>1</Select.Option>
                        {/* { boltTypeOptions && boltTypeOptions.map(({ id, name }, index) => {
                            return <Select.Option key={index} value={id}>
                                {name}
                            </Select.Option>
                        }) } */}
                    </Select>
                </Form.Item>
            )  
        },
        {
            key: 'certificateLevel',
            title: '证书等级',
            dataIndex: 'certificateLevel',
            width: 150,
            render:  (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={ ["list", index, "certificateLevel"] } key={ index } initialValue={ _ }>
                    <Input maxLength={ 50 }/>
                </Form.Item>
            )  
        },
        {
            key: 'certificateIntroduce',
            title: '资质简介',
            dataIndex: 'certificateIntroduce',
            width: 150,
            render:  (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={ ["list", index, "certificateIntroduce"] } key={ index } initialValue={ _ }>
                    <Input maxLength={ 50 }/>
                </Form.Item>
            )  
        },
        {
            key: 'startDate',
            title: '生效日期',
            dataIndex: 'startDate',
            width: 150,
            render:  (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={ ["list", index, "startDate"] } key={ index } initialValue={ _ }>
                    <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }}/>
                </Form.Item>
            )  
        },
        {
            key: 'endDate',
            title: '失效日期',
            dataIndex: 'endDate',
            width: 150,
            render:  (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={ ["list", index, "endDate"] } key={ index } initialValue={ _ }>
                    <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }}/>
                </Form.Item>
            )  
        },
        {
            key: 'certificateDepartment',
            title: '发证部门',
            dataIndex: 'certificateDepartment',
            width: 150,
            render:  (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={ ["list", index, "certificateDepartment"] } key={ index } initialValue={ _ }>
                    <Input maxLength={ 50 }/>
                </Form.Item>
            )  
        },
        {
            key: 'dataPlaceId',
            title: <span><span style={{ color: 'red' }}>*</span>资料库</span>,
            dataIndex: 'dataPlaceId',
            width: 180,
            render:  (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={ ["list", index, "dataPlaceId"] } key={ index } initialValue={ _ } rules={[{ 
                    "required": true,
                    "message": "请选择资料库" }]}>
                    <TreeSelect placeholder="请选择" style={{ width: "150px" }}>
                        { renderTreeNodes(wrapRole2DataNode(databaseData)) }
                    </TreeSelect>
                </Form.Item>
            )  
        },
        {
            key: 'designation',
            title: '备注',
            dataIndex: 'designation',
            width: 150,
            render:  (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={ ["list", index, "designation"] } key={ index } initialValue={ _ }>
                    <Input maxLength={ 200 } key={ index }/>
                </Form.Item>
            )  
        },
        {
            key: 'staffId',
            title: <span><span style={{ color: 'red' }}>*</span>工号</span>,
            dataIndex: 'staffId',
            width: 150,
            render:  (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={ ["list", index, "staffId"] } key={ index } initialValue={ _ } rules={[{ 
                    "required": true,
                    "message": "请选择工号" }]}>
                    <Input maxLength={ 50 }/>
                </Form.Item>
            )  
        },
        {
            key: 'name',
            title: '姓名',
            dataIndex: 'name',
            width: 150,
            render:  (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={ ["list", index, "name"] } key={ index } initialValue={ _ }>
                    <Input disabled bordered={ false }/>
                </Form.Item>
            )  
        },
        {
            key: 'categoryName',
            title: '员工类型',
            dataIndex: 'categoryName',
            width: 150,
            render:  (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={ ["list", index, "categoryName"] } key={ index } initialValue={ _ }>
                    <Input disabled bordered={ false }/>
                </Form.Item>
            )  
        },
        {
            key: 'dept',
            title: '部门',
            dataIndex: 'dept',
            width: 150,
            render:  (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={ ["list", index, "dept"] } key={ index } initialValue={ _ }>
                    <Input disabled bordered={ false }/>
                </Form.Item>
            )  
        },
        {
            key: 'dept',
            title: '职位',
            dataIndex: 'dept',
            width: 150,
            render:  (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={ ["list", index, "dept"] } key={ index } initialValue={ _ }>
                    <Input disabled bordered={ false }/>
                </Form.Item>
            )  
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            width: 150,
            fixed: 'right' as FixedType,
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

    const renderTreeNodes = (data:any) => data.map((item:any) => {
        if (item.children) {
            item.disabled = true;
            return (<TreeNode key={ item.id } title={ item.title } value={ item.id } disabled={ item.disabled } className={ styles.node } >
                { renderTreeNodes(item.children) }
            </TreeNode>);
        }
        return <TreeNode { ...item } key={ item.id } title={ item.title } value={ item.id } />;
    });

    const addRow = () => {
        const dataListValues = form.getFieldsValue(true).list || [];
        const newRow = {
            certificateDepartment: '',
            certificateIntroduce: '',
            dataPlaceId: undefined,
            certificateLevel: '',
            certificateName: '',
            certificateNumber: '',
            certificateType: '',
            designation: '',
            endDate: undefined,
            staffId: '',
            staffName: '',
            startDate: undefined,
        }
        setDataList([
            ...dataListValues,
            newRow
        ])
        form.setFieldsValue({list: [...dataListValues, newRow]})
    }

    const delRow = (index: number) => {
        const dataListValues = form.getFieldsValue(true).list;
        dataListValues.splice(index, 1);
        setDataList([...dataListValues]);
    }

    const save = (tip: number) => {
        if(form) {
            form.validateFields().then(res => {
                let value = form.getFieldsValue(true).list;
                if(value.length > 0) {
                    if(tip === 0) {
                        value = value.map((items: ICertificate, index: number) => {
                            return {
                                ...items,
                                dataStatus: 0,
                                id: dataList[index].id,
                                startDate: items.startDate && moment(items.startDate).format('YYYY-MM-DD'),
                                endDate: items.endDate && moment(items.endDate).format('YYYY-MM-DD')
                            }
                        })
                    } else {
                        value = value.map((items: ICertificate, index: number) => {
                            return {
                                ...items,
                                dataStatus: 1,
                                id: dataList[index].id,
                                startDate: items.startDate && moment(items.startDate).format('YYYY-MM-DD'),
                                endDate: items.endDate && moment(items.endDate).format('YYYY-MM-DD')
                            }
                        })
                    }
                    console.log(value)
                    if(location.state.type === 'new') {
                        RequestUtil.post(`/tower-system/certificateRecord`, value).then(res => {
                            history.goBack();
                        })
                    }else {
                        RequestUtil.put(`/tower-system/certificateRecord/update`, value).then(res => {
                            history.goBack();
                        })
                    }
                } else {
                    message.warning('请先新增数据');
                }
            })
        }
    }

    const { loading } = useRequest(() => new Promise(async (resole, reject) => {
        if(location.state.type === 'edit') {
            let data: ICertificate[] = location.state.data;
            data = data.map((items: ICertificate) => {
                return {
                    ...items,
                    startDate: items.startDate && moment(items.startDate),
                    endDate: items.endDate && moment(items.endDate)
                }
            })
            setDataList(data);
        } else {
            setDataList([]);
        }
        resole(true)
    }), {})
    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }

    return ( <DetailContent operation={ [
            <Space direction="horizontal" size="small" className={ styles.bottomBtn }>
                <Button type="primary" onClick={ () => save(0) }>保存</Button>
                <Button type="primary" onClick={ () => save(1) }>保存并入库</Button>
                <Button type="ghost" onClick={() => history.goBack()}>取消</Button>
            </Space>
        ] }>
            <DetailTitle title="证书信息" operation={[location.state.type === 'new' ? <Button type="primary" onClick={ addRow }>新增一行</Button> : <></>]}/>
            <Form form={ form }>
                <Table rowKey="id" scroll={{ x: 1200 }} dataSource={[...dataList]} pagination={false} columns={location.state.type === 'edit' ? tableColumns.splice(0, 15) : tableColumns} className={styles.addModal}/>
            </Form>
        </DetailContent>
    )
}