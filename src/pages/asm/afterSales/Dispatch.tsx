import React, { useState } from 'react';
import { Button, Modal, Form, Input, message } from 'antd';
import { useHistory } from 'react-router-dom';
import { Page } from '../../common';


export default function Dispatch({ onSelect, selectedKey = [], ...props }: any): JSX.Element {

    const [ visible, setVisible ] = useState<boolean>(false);
    const [ form ] = Form.useForm();
    const [filterValue, setFilterValue] = useState<any>({});
    const history = useHistory();
    const [detailData, setDetailData] = useState<any[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>(selectedKey?[selectedKey?.afterSaleUserId]:[]);
    const [selectedRows, setSelectedRows] = useState<any[]>(selectedKey?[{...selectedKey,name:selectedKey?.afterSaleUser}]:[]);
    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: any[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows)
    }
    const columns = [
        {
            key: 'name',
            title: '姓名',
            width: 150,
            dataIndex: 'name'
        },
        {
            key: 'phone',
            title: '手机号',
            width: 150,
            dataIndex: 'phone'
        },
        {
            key: 'type',
            title: '未完成工单',
            dataIndex: 'type',
            width: 120
        },
        {
            key: 'type',
            title: '当前所在地址',
            dataIndex: 'type',
            width: 250
        },
        {
            key: 'type',
            title: '距离',
            dataIndex: 'type',
            width: 250
        },
        {
            key: 'type',
            title: '未完工程',
            dataIndex: 'type',
            width: 250
        }
    ]


    return <>
    <Modal 
        visible={ visible } 
        title="选择派工人员" 
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
                message.error('未选择派工人员！')
            }
        }}
        width='60%'
    >
             
        <Page
            path="/tower-system/employee"
            columns={columns}
            headTabs={[]}
            extraOperation={<span>已选：{selectedRows.length>0?selectedRows[0]?.name:''}</span>}
            // refresh={refresh}
          
            tableProps={{
                rowKey:'userId',
                rowSelection: {
                    type:'radio',
                    selectedRowKeys: selectedKeys,
                    onChange: SelectChange
                }
            }}
            searchFormItems={[
                {
                    name: 'name',
                    label: '模糊查询项',
                    children: <Input maxLength={50} placeholder="请输入姓名进行查询" />
                },
                {
                    name: 'type',
                    label: '未完成工单',
                    children: <Input maxLength={50} placeholder="请输入未完成工单进行查询" />
                }
            ]}
            filterValue={filterValue}
            onFilterSubmit={(values: Record<string, any>) => {
                setFilterValue(values);
                return values;
            }}
        />
    </Modal>
    <Button type='primary'  onClick={()=>setVisible(true)}>派工</Button>
    </>
}










