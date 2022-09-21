import React, { useState } from 'react';
import { Button, Modal, Form, Input, message } from 'antd';
import { Page } from '../../../common';


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
            key: 'name',
            title: '部门名称',
            width: 150,
            dataIndex: 'name'
        }
    ]


    return <>
    <Modal 
        visible={ visible } 
        title="选择部门" 
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
                message.error('未选择部门！')
            }
        }}
        width='60%'
    >
             
        <Page
            path="/tower-as/dept"
            columns={columns}
            headTabs={[]}
            extraOperation={<span>已选：{selectedRows.length>0?selectedRows.map(item=>item.name).join(','):''}</span>}
            tableProps={{
                pagination:false,
                rowSelection: {
                    type:'checkbox',
                    selectedRowKeys: selectedKeys,
                    onChange: SelectChange
                }
            }}
            searchFormItems={[
                {
                    name: 'name',
                    label: '模糊查询项',
                    children: <Input maxLength={50} placeholder="请输入部门名称进行查询" />
                }
            ]}
            filterValue={filterValue}
            onFilterSubmit={(values: Record<string, any>) => {
                setFilterValue(values);
                return values;
            }}
        />
    </Modal>
    <Button type='link' onClick={()=>setVisible(true)}>选择部门</Button>
    </>
}










