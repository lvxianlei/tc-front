import React, { useState } from 'react'
import { Space, Input, DatePicker, Button, Form, Modal } from 'antd'
import { FixedType } from 'rc-table/lib/interface';
import { Link } from 'react-router-dom'
import { CommonTable, Page } from '../../../common'
import QuestionnaireModal from './QuestionnaireModal';
import { Popconfirm } from 'antd';

export default function PickCheckList(): React.ReactNode {
    const [form] = Form.useForm();
    const [ visible, setVisible ] = useState(false);
    const [ record, setRecord ] = useState({});
    const [ title, setTitle ] = useState('提交问题');

   
    const columns = [
        { title: '序号', dataIndex: 'index', key: 'index', editable: true, render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
        { title: '段名', dataIndex: 'partBidNumber', key: 'partBidNumber', editable: true},
        { title: '构件编号', dataIndex: 'projectNumber', key: 'projectNumber',editable: true },
        { title: '材料名称', dataIndex: 'packageNumber', key: 'packgeNumber', editable: true },
        { title: '材质', dataIndex: 'amount', key: 'amount', editable: true },
        { title: '规格', dataIndex: 'unit', key: 'unit', editable: true },
        { title: '宽度（mm）', dataIndex: 'amount', key: 'amount', editable: true },
        { title: '厚度（mm）', dataIndex: 'amount', key: 'amount', editable: true },
        { title: '长度（mm）', dataIndex: 'packageNumber', key: 'packgeNumber', editable: true },
        { title: '单基件数', dataIndex: 'packageNumber', key: 'packgeNumber', editable: true },
        { title: '理算重量（kg）', dataIndex: 'unit', key: 'unit', editable: true },
        { title: '单件重量（kg）', dataIndex: 'packageNumber', key: 'packgeNumber', editable: true },
        { title: '小计重量（kg）', dataIndex: 'amount', key: 'amount', editable: true },
        { title: '备注', dataIndex: 'unit', key: 'unit', editable: true }
    ];
    const questionnaire = (_: undefined, record: Record<string,  any>, index: number, e: any) => {
        setVisible(true);
        setRecord({ ...record, problemField: e, originalData: _ });
    }
    const columnsSetting = columns.map(col => {
        return {
            ...col,
            render:  (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            col.dataIndex === 'index' ? index + 1 : !col.editable? _ :  <span onDoubleClick={ (e) => { questionnaire( _ , record,  index, col.title) } }>{ _ }</span>)
        }  
    })
   
    return (
        <>
            <Page
                path="/tower-market/bidInfo"
                columns={ columnsSetting }
                extraOperation={
                    <Space>
                        <Button>导出</Button>
                        <Popconfirm
                            title="确认完成校核?"
                            onConfirm={ () => {} }
                            okText="确认"
                            cancelText="取消"
                        > 
                            <Button>完成校核</Button>
                        </Popconfirm>
                        <Button>返回上一级</Button>
                    </Space>
                }
                searchFormItems={[
                    {
                        name: 'startBidBuyEndTime',
                        label: '材料名称',
                        children: <DatePicker />
                    },
                    {
                        name: 'biddingStatus',
                        label: '材质',
                        children: <Input placeholder="请输入段号/构件编号进行查询" maxLength={200} />
                    },
                ]}
            />
            <QuestionnaireModal visible={ visible } record={ record } title={ title } modalCancel={ () => setVisible(false) }/>
        </>
    )
}