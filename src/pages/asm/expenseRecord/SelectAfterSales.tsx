import React, { useState } from 'react';
import { Button, Modal, Form, Input, message } from 'antd';
import { Page } from '../../common';


export default function Dept({ onSelect, selectedKey = [], ...props }: any): JSX.Element {

    const [ visible, setVisible ] = useState<boolean>(false);
    const [ form ] = Form.useForm();
    const [filterValue, setFilterValue] = useState<any>({});
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>(selectedKey);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: any[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows)
    }
    const columns = [
        {
            key: 'wordOrderNumber',
            title: '工单编号',
            width: 150,
            dataIndex: 'wordOrderNumber'
        },
        {
            key: 'planNumber',
            title: '计划号',
            width: 150,
            dataIndex: 'planNumber'
        },
        {
            key: 'projectName',
            title: '工程名称',
            width: 150,
            dataIndex: 'projectName'
        },
        {
            key: 'afterSaleUser',
            title: '售后人员',
            width: 150,
            dataIndex: 'afterSaleUser'
        }
    ]


    return <>
    <Modal 
        visible={ visible } 
        title="选择售后工单" 
        onCancel={ () => { 
            setVisible(false);
            setSelectedKeys([])
            setSelectedRows([])
            form.resetFields(); 
        }} 
        onOk={ () => {
            if(selectedRows.length>0){
                setVisible(false); 
                console.log(selectedRows)
                onSelect(selectedRows)
            }
            else {
                message.error('未选择售后工单！')
            }
        }}
        width='60%'
    >
             
        <Page
            path="/tower-as/workOrder"
            columns={columns}
            headTabs={[]}
            extraOperation={<span>已选：{selectedRows.length>0?selectedRows[0]?.name:''}</span>}
            tableProps={{
                rowSelection: {
                    type:'radio',
                    selectedRowKeys: selectedKeys,
                    onChange: SelectChange
                }
            }}
            searchFormItems={[
                {
                    name: 'fuzzyQuery',
                    label: '模糊查询项',
                    children: <Input maxLength={50} placeholder="请输入工单编号/计划号进行查询" />
                }
            ]}
            filterValue={filterValue}
            onFilterSubmit={(values: Record<string, any>) => {
                setFilterValue(values);
                return values;
            }}
        />
    </Modal>
    <Button type='link' onClick={()=>setVisible(true)}>选择售后工单</Button>
    </>
}










