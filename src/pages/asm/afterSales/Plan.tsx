import React, { useState } from 'react';
import { Button, Modal, Form, Input, message } from 'antd';
import { useHistory } from 'react-router-dom';
import { Page } from '../../common';


export default function Plan({ onSelect, selectedKey = [], ...props }: any): JSX.Element {

    const [ visible, setVisible ] = useState<boolean>(false);
    const [ form ] = Form.useForm();
    const [filterValue, setFilterValue] = useState<any>({});
    const history = useHistory();
    const [detailData, setDetailData] = useState<any[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>(selectedKey);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: any[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows)
    }
    
    const columns = [
        {
            key: 'name',
            title: '计划号',
            width: 150,
            dataIndex: 'name'
        },
        {
            key: 'employeeNames',
            title: '工程名称',
            width: 150,
            dataIndex: 'employeeNames'
        },
        {
            key: 'type',
            title: '业务经理',
            dataIndex: 'type',
            width: 120
        }
    ]


    return <>
    <Modal 
        visible={ visible } 
        title="选择计划" 
        onCancel={ () => { 
            setVisible(false); 
            setDetailData([])
            setSelectedKeys([])
            setSelectedRows([])
            form.resetFields(); 
        }} 
        onOk={ () => {
            if(selectedRows.length>0){
                setVisible(false); 
                console.log(selectedRows)
                onSelect(selectedRows)
                setDetailData([])
            }
            else {
                message.error('未选择计划！')
            }
        }}
        width='60%'
    >
             
        <Page
            path="/tower-science/productCategory/planNumber/list"
            columns={columns}
            headTabs={[]}
            extraOperation={<span>已选：{selectedRows.length>0?selectedRows[0]?.name:''}</span>}
            // refresh={refresh}
          
            tableProps={{
                rowKey:'index',
                rowSelection: {
                    type:'radio',
                    selectedRowKeys: selectedKeys,
                    onChange: SelectChange
                }
            }}
            searchFormItems={[
                {
                    name: 'type',
                    label: '模糊查询项',
                    children: <Input maxLength={50} placeholder="请输入计划号/工程名称进行查询" />
                }
            ]}
            filterValue={filterValue}
            onFilterSubmit={(values: Record<string, any>) => {
                setFilterValue(values);
                return values;
            }}
            
        />
    </Modal>
    <Button type='link'  onClick={()=>setVisible(true)}>选择计划</Button>
    </>
}










