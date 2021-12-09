import React, { useState } from 'react';
import { Space, Input, Select, Button, Popconfirm, Form, message, TreeSelect, Modal, DatePicker, Upload } from 'antd';
import { Link } from 'react-router-dom';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './DataMngt.module.less';
import RequestUtil from '../../../utils/RequestUtil';
import { TreeNode } from 'antd/lib/tree-select';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import { IDatabaseTree } from '../../basicData/database/DatabaseMngt';
import useRequest from '@ahooksjs/use-request';
import AuthUtil from '../../../utils/AuthUtil';

export interface IData {
    readonly id?: string;
    readonly dataName?: string;
    readonly dataNumber?: string;
    readonly dataStatus?: number;
    readonly dataPlaceId?: string;
    readonly dataType?: string;
    readonly designation?: string;
    readonly updateTime?: string;
}

enum recordState {
    LEND = 1,
    GIVE_BACK = 2,
    LOST = 3

}

export default function DataMngt(): React.ReactNode {
    const [ refresh, setRefresh ] = useState<boolean>(false);
    const [ filterValue, setFilterValue ] = useState({});

    const columns = [
        {
            key: 'dataNumber',
            title: '资料编号',
            width: 150,
            dataIndex: 'dataNumber',
            render: (_: string, record: Record<string, any>): React.ReactNode => (
                <Link to={`/archivesMngt/dataMngt/detail/${ record.id }`}>{_}</Link>
            )
        },
        {
            key: 'dataName',
            title: '资料名称',
            width: 150,
            dataIndex: 'dataName'
        },
        {
            key: 'dataTypeName',
            title: '资料类型',
            width: 150,
            dataIndex: 'dataTypeName'
        },
        {
            key: 'dataStatus',
            title: '状态',
            dataIndex: 'dataStatus',
            width: 120,
            render: (dataStatus: number): React.ReactNode => {
                switch (dataStatus) {
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
                    <Link to={`/archivesMngt/dataMngt/detail/${ record.id }`}>详情</Link>
                    { record.dataStatus === 0 ? <Link to={{pathname: `/archivesMngt/dataMngt/datasetting`, state:{ type: 'edit', data: [record] } }}><Button type="link">编辑</Button></Link> : <Button type="link" disabled>编辑</Button> }
                    <Button type="link" onClick={ () => {
                        operation(recordState.LEND, record.id);
                    } } disabled={ record.dataStatus !== 1 }>借出</Button>
                    <Button type="link" onClick={ () => {
                        operation(recordState.GIVE_BACK, record.id);
                    } } disabled={ !(record.dataStatus === 2) }>归还</Button>
                    <Button type="link" onClick={ () => {
                        operation(recordState.LOST, record.id);
                    } } disabled={ !(record.dataStatus === 1 || record.dataStatus === 2) }>遗失</Button>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={ () => {
                            RequestUtil.delete(`/tower-system/dataRecord`, [record.id]).then(res => {
                                setRefresh(!refresh); 
                            });
                        } }
                        okText="确认"
                        cancelText="取消"
                        disabled={ record.dataStatus !== 0 }
                    >
                        <Button type="link" disabled={ record.dataStatus !== 0 }>删除</Button>
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
            RequestUtil.delete(`/tower-system/dataRecord`, selectedKeys).then(res => {
                message.success('批量删除成功');
                setSelectedKeys([]);
                setSelectedRows([]);
                setRefresh(!refresh);
            });   
        } else {
            message.warning('请先选择需要删除的数据');
        }
    }

    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: IData[]): void => {
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
                    dataStatus: tip === recordState.LEND ? 2 : tip === recordState.GIVE_BACK ? 4 : 3
                }
                RequestUtil.put(`/tower-system/dataRecord`, { ...value }).then(res => {
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

    const renderTreeNodes2 = (data:any) => data.map((item:any) => {
        if (item.children && item.children.length > 0) {
            return (<TreeNode key={ item.id } title={ item.title } value={ item.id } className={ styles.node } >
                { renderTreeNodes(item.children) }
            </TreeNode>);
        }
        return <TreeNode { ...item } key={ item.id } title={ item.title } value={ item.id } />;
    });

    const [ selectedKeys, setSelectedKeys ] = useState<React.Key[]>([]);
    const [ selectedRows, setSelectedRows ] = useState<IData[]>([]);
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
            path="/tower-system/dataRecord"
            columns={ columns }
            headTabs={ [] }
            exportPath={`/tower-system/dataRecord`}
            extraOperation={ <Space direction="horizontal" size="small">
                 <Upload 
                    action={ () => {
                        const baseUrl: string | undefined = process.env.REQUEST_API_PATH_PREFIX;
                        return baseUrl+'/tower-system/dataRecord/import'
                    } } 
                    headers={
                        {
                            'Authorization': `Basic ${ AuthUtil.getAuthorization() }`,
                            'Tenant-Id': AuthUtil.getTenantId(),
                            'Sinzetech-Auth': AuthUtil.getSinzetechAuth()
                        }
                    }
                    showUploadList={ false }
                    onChange={ (info) => {
                        if(info.file.response && !info.file.response?.success) {
                            message.warning(info.file.response?.msg)
                        }
                        if(info.file.response && info.file.response?.success){
                            message.success('导入成功！');
                            setRefresh(!refresh);
                        } 
                    } }
                >
                    <Button type="primary">导入</Button>
                </Upload>
                {/* <Button type="primary" onClick={ () => downloadTemplate('', '资料管理导入模板') } ghost>下载导入模板</Button> */}
                <Link to={{pathname: `/archivesMngt/dataMngt/dataNew`, state:{ type: 'new' } }}><Button type="primary" ghost>录入</Button></Link>
                { selectedRows.length > 0 && selectedRows.map(items => items.dataStatus).indexOf(1) === -1 && selectedRows.map(items => items.dataStatus).indexOf(2) === -1 && selectedRows.map(items => items.dataStatus).indexOf(3) === -1 ? <Link to={{pathname: `/archivesMngt/dataMngt/datasetting`, state:{ type: 'edit', data: [...selectedRows] } }}><Button type="primary" ghost>编辑</Button></Link> : <Button type="primary" disabled ghost>编辑</Button>}
                { selectedRows.length > 0 && selectedRows.map(items => items.dataStatus).indexOf(1) === -1 && selectedRows.map(items => items.dataStatus).indexOf(2) === -1 && selectedRows.map(items => items.dataStatus).indexOf(3) === -1 ? <Button type="primary" onClick={ batchDel } ghost>删除</Button> : <Button type="primary" disabled ghost>删除</Button>}
                
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
                            { renderTreeNodes2(wrapRole2DataNode(databaseData)) }
                        </TreeSelect>
                    </Form.Item>
                },
                {
                    name: 'dataStatus',
                    label: '在库状态',
                    children: <Form.Item name="dataStatus" initialValue="">
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
                    children: <Input maxLength={50} placeholder="编号/名称"/>
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
                <Form.Item name="lendOrLostTime" label={  tip === recordState.LEND ? '借出时间' : tip === recordState.GIVE_BACK ? '归还时间' : '遗失时间' } rules={[{
                        "required": true,
                        "message": "请选择" + `${tip === recordState.LEND ? '借出时间' : tip === recordState.GIVE_BACK ? '归还时间' : '遗失时间'}`
                    }]}>
                    <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }}/>
                </Form.Item>
            </Form>
        </Modal>
    </>
}