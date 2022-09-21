import React, { useState } from 'react';
import { Button, Modal, Form, Input, message } from 'antd';
import { useHistory } from 'react-router-dom';
import { CommonTable, Page } from '../../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';


export default function HandSelect({ onSelect, selectedKey = [], ...props }: any): JSX.Element {

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
    const [dataSource, setDataSource] = useState<any[]>([])
    const { loading } = useRequest<any>(() => new Promise(async (resole, reject) => {
            const list: any = await RequestUtil.get(`/tower-as/issue/list`);
            setDataSource(list)
            resole({});
    }), {})
    const columns = [
        {
            key: 'name',
            title: '责任部门',
            width: 150,
            dataIndex: 'name'
        },
        {
            key: 'name',
            title: '责任人',
            width: 150,
            dataIndex: 'name'
        },
        {
            key: 'name',
            title: '责任人岗位',
            width: 150,
            dataIndex: 'name'
        }
    ]


    return <>
    <Modal 
        visible={ visible } 
        title="选择责任人" 
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
                message.error('未选择责任人！')
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
            dataSource = {[...dataSource]}
        />
    </Modal>
    <Button type='link'  onClick={()=>setVisible(true)}>手动选择</Button>
    </>
}










