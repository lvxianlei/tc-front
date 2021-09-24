/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-放样列表-塔型信息-放样
*/

import React, { useState } from 'react';
import { Space, Select, Button, Popconfirm, Input, Form, FormInstance } from 'antd';
import { Page } from '../../common';
import { ColumnType, FixedType } from 'rc-table/lib/interface';
import styles from './TowerLoftingAssign.module.less';
import { useHistory, useParams } from 'react-router-dom';
import UploadModal from './UploadModal';

interface Column extends ColumnType<object> {
    editable?: boolean;
}

const form: React.RefObject<FormInstance> = React.createRef<FormInstance>();

const getForm = (): FormInstance | null => {
    return form?.current;
}

const columns = [
    {
        key: 'index',
        title: '序号',
        dataIndex: 'index',
        width: 50,
        fixed: 'left' as FixedType,
        render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{ index + 1 }</span>)
    },
    {
        key: 'projectName',
        title: '段名',
        width: 150,
        editable: true,
        dataIndex: 'projectName',
        render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            <Form.Item name={['data',index, "projectName"]} initialValue={ _ }>
                <Input size="small"/>
            </Form.Item>
        )
    },
    {
        key: 'projectNumber',
        title: '构件编号',
        dataIndex: 'projectNumber',
        width: 120,
        editable: true,
        render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            <Form.Item name={['data',index, "projectNumber"]} initialValue={ _ }>
                <Input size="small"/>
            </Form.Item>
        )
    },
    {
        key: 'bidBuyEndTime',
        title: '材料名称',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'biddingEndTime',
        title: '材质',
        width: 150,
        dataIndex: 'biddingEndTime',
    },
    {
        key: 'biddingPerson',
        title: '规格',
        dataIndex: 'biddingPerson',
        width: 200,
    },
    {
        key: 'bidBuyEndTime',
        title: '宽度（mm）',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '厚度（mm）',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '长度（mm）',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '单基件数',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '单件重量（kg）',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '小计重量（kg）',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: 'NC程序名称',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '备注',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '电焊',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '火曲',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '切角',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '铲背',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '清根',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '打扁',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '开合角',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '钻孔',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '坡口',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '割相贯线',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '开槽形式',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '边数',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '周长',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '表面积',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '各孔径孔数',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '焊接边（mm）',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'operation',
        title: '操作',
        dataIndex: 'operation',
        fixed: 'right' as FixedType,
        width: 100,
        render: (_: undefined, record: Record<string, any>): React.ReactNode => (
            <Space direction="horizontal" size="small" className={ styles.operationBtn }>
                <Popconfirm
                    title="确认删除?"
                    onConfirm={ () => {} }
                    okText="提交"
                    cancelText="取消"
                >
                    <Button type="link">删除</Button>
                </Popconfirm>
            </Space>
        )
    }
]

const columnsSetting: Column[] = columns.map((col: Column) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      render: undefined,
    }
})
export default function Lofting(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string }>();
    const [ editorLock, setEditorLock ] = useState('编辑');
    const [ tableColumns, setColumns ] = useState(columnsSetting);
    return <Form ref={ form } className={ styles.descripForm }>
        <Page
            path="/tower-market/bidInfo"
            columns={ tableColumns }
            headTabs={ [] }
            tableProps={{ pagination: false }}
            extraOperation={ <Space direction="horizontal" size="small">
                <Button type="primary" ghost>导出</Button>
                <Button type="primary" ghost>模板下载</Button>
                <Button type="primary" ghost>完成放样</Button>
                <Button type="primary" ghost>导入</Button>
                <Button type="primary" ghost>放样塔型套用</Button>
                <Button type="primary" ghost onClick={ () => { 
                    if(editorLock === '编辑') {
                        setColumns(columns);
                        setEditorLock('锁定');
                    } else {
                        setColumns(columnsSetting);
                        setEditorLock('编辑');
                    }
                    console.log(getForm()?.getFieldsValue(true)) 
                } }>{ editorLock }</Button>
                <UploadModal id={ params.id } btnName="模型上传"/>
                <UploadModal id={ params.id } btnName="样图上传"/>
                <Button type="primary" ghost onClick={() => history.goBack()}>返回上一级</Button>
            </Space>}
            searchFormItems={ [
                {
                    name: 'startBidBuyEndTime',
                    label: '材料名称',
                    children: <Select style={{ width: '120px' }} placeholder="请选择">
                        <Select.Option value="0" key="0">放样中</Select.Option>
                        <Select.Option value="1" key="1">校核中</Select.Option>
                        <Select.Option value="2" key="2">已完成</Select.Option>
                        <Select.Option value="3" key="3">已提交</Select.Option>
                    </Select>
                },
                {
                    name: 'startBidBuyEndTime',
                    label: '材质',
                    children: <Select style={{ width: '120px' }} placeholder="请选择">
                        <Select.Option value="0" key="0">放样人</Select.Option>
                    </Select>
                }
            ] }
        />
    </Form>
}