import React, { useState } from 'react';
import { Button, Modal, Form, Input, message } from 'antd';
import { useHistory } from 'react-router-dom';
import { CommonTable, Page } from '../../../common';
import { productTypeOptions } from '../../../../configuration/DictionaryOptions';


export default function Dept({ onSelect, selectedKey = [], ...props }: any): JSX.Element {

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
            title: '责任部门',
            width: 150,
            dataIndex: 'name'
        }
    ]


    return <>
    <Modal 
        visible={ visible } 
        title="选择产品类型" 
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
                message.error('未选择产品类型！')
            }
        }}
        width='60%'
    >
        <span>已选：{selectedRows.length>0?selectedRows.map((item:any)=>{
                return item.name
            })?.join(','):''}</span>
        <CommonTable
            columns={columns}
            rowSelection={{
                
                type:'checkbox',
                selectedRowKeys: selectedKeys,
                onChange: SelectChange
            }}
            pagination={false}
            dataSource = {productTypeOptions}
        />
    </Modal>
    <Button type='link'  onClick={()=>setVisible(true)}>选择产品类型</Button>
    </>
}










