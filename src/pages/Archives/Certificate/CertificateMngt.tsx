import React, { useState } from 'react';
import { Space, Input, Select, Button, Popconfirm, Form, message, TreeSelect, Modal, DatePicker } from 'antd';
import { Link } from 'react-router-dom';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './CertificateMngt.module.less';
import RequestUtil from '../../../utils/RequestUtil';
import { TreeNode } from 'antd/lib/tree-select';
import useRequest from '@ahooksjs/use-request';
import { IDatabaseTree } from '../../basicData/database/DatabaseMngt';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';

export interface ICertificate {
    readonly id?: string;
    readonly certificateDepartment?: string;
    readonly certificateIntroduce?: string;
    readonly certificateStatus?: number;
    readonly certificateLevel?: string;
    readonly certificateName?: string;
    readonly certificateNumber?: string;
    readonly certificateType?: string;
    readonly dataPlaceId?: string;
    readonly designation?: string;
    readonly endDate?: string | moment.Moment;
    readonly staffId?: string;
    readonly staffName?: string;
    readonly startDate?: string | moment.Moment;
    readonly updateTime?: string;
}

enum recordState {
    LEND = 1,
    GIVE_BACK = 2,
    LOST = 3

}

export default function CertificateMngt(): React.ReactNode {
    const [ refresh, setRefresh ] = useState<boolean>(false);
    const [ filterValue, setFilterValue ] = useState({});

    const columns = [
        {
            key: 'certificateNumber',
            title: '证书编号',
            width: 150,
            dataIndex: 'certificateNumber',
            render: (_: string, record: Record<string, any>): React.ReactNode => (
                <Link to={`/archivesMngt/certificateMngt/certificateDetail/${ record.id }`}>{_}</Link>
            )
        },
        {
            key: 'certificateName',
            title: '证书名称',
            width: 150,
            dataIndex: 'certificateName'
        },
        {
            key: 'certificateTypeName',
            title: '证书类型',
            width: 150,
            dataIndex: 'certificateTypeName'
        },
        {
            key: 'certificateLevel',
            title: '证书等级',
            width: 150,
            dataIndex: 'certificateLevel'
        },
        {
            key: 'certificateIntroduce',
            title: '资质简介',
            width: 150,
            dataIndex: 'certificateIntroduce'
        },
        {
            key: 'startDate',
            title: '生效日期',
            width: 150,
            dataIndex: 'startDate'
        },
        {
            key: 'endDate',
            title: '失效日期',
            width: 150,
            dataIndex: 'endDate'
        },
        {
            key: 'certificateDepartment',
            title: '发证部门',
            width: 150,
            dataIndex: 'certificateDepartment'
        },
        {
            key: 'staffName',
            title: '姓名',
            width: 150,
            dataIndex: 'staffName'
        },
        {
            key: 'certificateStatus',
            title: '状态',
            dataIndex: 'certificateStatus',
            width: 120,
            render: (certificateStatus: number): React.ReactNode => {
                switch (certificateStatus) {
                    case 0:
                        return '待入库';
                    case 1:
                        return '在库';
                    case 2:
                        return '借出';
                    case 3:
                        return '遗失';
                }
            }
        },
        {
            key: 'updateTime',
            title: '最新状态变更时间',
            width: 200,
            dataIndex: 'updateTime'
        },
        {
            key: 'designation',
            title: '备注',
            width: 200,
            dataIndex: 'designation'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 130,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small" className={ styles.operationBtn }>
                    <Link to={`/archivesMngt/certificateMngt/certificateDetail/${ record.id }`}>详情</Link>
                    { record.certificateStatus === 0 ? <Link to={{pathname: `/archivesMngt/certificateMngt/certificateSetting`, state:{ type: 'edit', data: [record] } }}><Button type="link">编辑</Button></Link> : <Button type="link" disabled>编辑</Button> }
                    <Button type="link" onClick={ () => {
                        operation(recordState.LEND, record.id);
                    } } disabled={ record.certificateStatus !== 1 }>借出</Button>
                    <Button type="link" onClick={ () => {
                        operation(recordState.GIVE_BACK, record.id);
                    } } disabled={ !(record.certificateStatus === 2) }>归还</Button>
                    <Button type="link" onClick={ () => {
                        operation(recordState.LOST, record.id);
                    } } disabled={ !(record.certificateStatus === 1 || record.certificateStatus === 2) }>遗失</Button>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={ () => {
                            RequestUtil.delete(`/tower-system/certificateRecord`, [record.id]).then(res => {
                                setRefresh(!refresh); 
                            });
                        } }
                        okText="确认"
                        cancelText="取消"
                        disabled={record.certificateStatus !== 0}
                    >
                        <Button type="link" disabled={record.certificateStatus !== 0}>删除</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ]

    const operation = (recordState: number, id: string) => {
        setTip(recordState);
        setRecordId(id);
        setVisible(true);
    }

    const batchDel = () => {
        if(selectedRows.length > 0) {
            RequestUtil.delete(`/tower-system/certificateRecord`, selectedKeys).then(res => {
                message.success('批量删除成功');
                setSelectedKeys([]);
                setSelectedRows([]);
                setRefresh(!refresh);
            });   
        } else {
            message.warning('请先选择需要删除的数据');
        }
    }

    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: ICertificate[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows)
    }

    const modalSave = () => {
        if(form) {
            form.validateFields().then(res => {
                let value = form.getFieldsValue(true);
                value = {
                    ...value,
                    lendOrLostTime: value.lendOrLostTime.format('YYYY-MM-DD'),
                    id: recordId,
                    certificateStatus: tip === recordState.LEND ? 2 : tip === recordState.GIVE_BACK ? 4 : 3
                }
                RequestUtil.put(`/tower-system/certificateRecord`, { ...value }).then(res => {
                    message.success('操作成功');
                    setVisible(false);
                    form.resetFields();
                    setRefresh(!refresh);
                })
            })
        }
    }

    const modalCancel = () => {
        form.resetFields();
        setVisible(false);
    }

    const wrapRole2DataNode = (roles: (any & SelectDataNode)[] = []): SelectDataNode[] => {
        roles && roles.forEach((role: any & SelectDataNode): void => {
            role.value = role.id;
            role.title = role.dataPlaceName;
            role.isLeaf = false;
            if (role.children && role.children.length > 0) {
                wrapRole2DataNode(role.children);
            }
        });
        return roles;
    }

    const renderTreeNodes = (data:any) => data.map((item:any) => {
        if (item.children && item.children.length > 0) {
            item.disabled = true;
            return (<TreeNode key={ item.id } title={ item.title } value={ item.id } disabled={ item.disabled } className={ styles.node } >
                { renderTreeNodes(item.children) }
            </TreeNode>);
        }
        return <TreeNode { ...item } key={ item.id } title={ item.title } value={ item.id } />;
    });

    const [ selectedKeys, setSelectedKeys ] = useState<React.Key[]>([]);
    const [ selectedRows, setSelectedRows ] = useState<ICertificate[]>([]);
    const [ visible, setVisible ] = useState<boolean>(false);
    const [ form ] = Form.useForm();
    const [ tip, setTip ] = useState<number>(1);
    const [ recordId, setRecordId ] = useState<string>('');
    
    const { loading, data } = useRequest<IDatabaseTree[]>(() => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get<IDatabaseTree[]>(`/tower-system/dataPlace`);
        resole(data)
    }), {})
    const databaseData: IDatabaseTree[] = data || [];

    return <>
        <Page
            path="/tower-system/certificateRecord"
            columns={ columns }
            headTabs={ [] }
            extraOperation={ <Space direction="horizontal" size="small">
                <Link to={{pathname: `/archivesMngt/certificateMngt/certificateNew`, state:{ type: 'new' } }}><Button type="primary" ghost>录入</Button></Link>
                { selectedRows.length > 0 && selectedRows.map(items => items.certificateStatus).indexOf(1 || 2 || 3) === -1 ? <Link to={{pathname: `/archivesMngt/certificateMngt/certificateSetting`, state:{ type: 'edit', data: [...selectedRows] } }}><Button type="primary" ghost>编辑</Button></Link> : <Button type="primary" disabled ghost>编辑</Button>}
                <Button type="primary" onClick={ batchDel } ghost>删除</Button>
            </Space> }
            refresh={ refresh }
            tableProps={{
                rowSelection: {
                    selectedRowKeys: selectedKeys,
                    onChange: SelectChange
                }
            }}
            searchFormItems={ [
                {
                    name: 'dataPlaceId',
                    label: '资料库',
                    children: <Form.Item name="dataPlaceId">
                        <TreeSelect placeholder="请选择" style={{ width: "150px" }}>
                            { renderTreeNodes(wrapRole2DataNode(databaseData)) }
                        </TreeSelect>
                    </Form.Item>
                },
                {
                    name: 'certificateStatus',
                    label: '在库状态',
                    children: <Form.Item name="certificateStatus" initialValue="">
                        <Select placeholder="请选择" style={{ width: "150px" }}>
                            <Select.Option value={''} key="4">全部</Select.Option>
                            <Select.Option value={0} key="0">待入库</Select.Option>
                            <Select.Option value={1} key="1">在库</Select.Option>
                            <Select.Option value={2} key="2">借出</Select.Option>
                            <Select.Option value={3} key="3">遗失</Select.Option>
                        </Select>
                    </Form.Item>
                },
                {
                    name: 'fuzzyQuery',
                    label: '模糊查询项',
                    children: <Input maxLength={50}/>
                }
            ] }
            filterValue={ filterValue }
            onFilterSubmit = { (values: Record<string, any>) => {
                setFilterValue(values);
                return values;
            } }
        />
        <Modal title={ tip === recordState.LEND ? '借出' : tip === recordState.GIVE_BACK ? '归还' : '遗失' } visible={ visible } onOk={ modalSave } onCancel={ modalCancel }>
            <Form form={ form } labelCol={{ span: 4 }}>
                <Form.Item name="lenderOrLoser" label={  tip === recordState.LEND ? '借出人' : tip === recordState.GIVE_BACK ? '归还人' : '遗失人' } rules={[{
                        "required": true,
                        "message": "请输入" + `${tip === recordState.LEND ? '借出人' : tip === recordState.GIVE_BACK ? '归还人' : '遗失人'}`
                    },
                    {
                        pattern: /^[^\s]*$/,
                        message: '禁止输入空格',
                    }]}>
                    <Input placeholder="请输入" maxLength={ 50 } />
                </Form.Item>
                <Form.Item name="lendOrLostTime" label={  tip === recordState.LEND ? '借出时间' : tip === recordState.GIVE_BACK ? '归还人' : '遗失人' } rules={[{
                        "required": true,
                        "message": "请选择" + `${tip === recordState.LEND ? '借出时间' : tip === recordState.GIVE_BACK ? '归还时间' : '遗失时间'}`
                    }]}>
                    <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }}/>
                </Form.Item>
            </Form>
        </Modal>
    </>
}