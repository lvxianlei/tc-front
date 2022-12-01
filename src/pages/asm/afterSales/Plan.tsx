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
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>(selectedKey?[selectedKey]:[]);
    const [selectedRows, setSelectedRows] = useState<any[]>(selectedKey?[{planNumber:selectedKey}]:[]);
    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: any[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows)
    }
    
    const columns = [
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
            key: 'businessUserName',
            title: '业务经理',
            dataIndex: 'businessUserName',
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
            path="/tower-science/productCategory/planNumber/listForSales"
            columns={columns}
            headTabs={[]}
            extraOperation={<span>已选：{selectedRows.length>0?selectedRows[0]?.planNumber:''}</span>}
            // refresh={refresh}
           
            tableProps={{
                scroll:{ y: 300 },
                rowKey:'planNumber',
                pagination:false,
                rowSelection: {
                    type:'radio',
                    selectedRowKeys: selectedKeys,
                    onChange: SelectChange
                }
            }}
            searchFormItems={[
                {
                    name: 'planNumber',
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










