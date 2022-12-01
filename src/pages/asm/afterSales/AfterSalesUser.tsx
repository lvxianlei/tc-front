import React, { useState } from 'react';
import { Button, Modal, Form, Input, message, Select } from 'antd';
import { useHistory } from 'react-router-dom';
import { Page } from '../../common';

export default function AfterSalesUser({ onSelect, selectedKey = [], ...props }: any): JSX.Element {

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
            key: 'countOrder',
            title: '未完成工单',
            dataIndex: 'countOrder',
            width: 120
        },
        {
            key: 'address',
            title: '当前地址',
            dataIndex: 'address',
            width: 250
        },
        {
            key: 'distance',
            title: '距离',
            dataIndex: 'distance',
            width: 250
        },
        {
            key: 'project',
            title: '未完工程',
            dataIndex: 'project',
            width: 250
        }
    ]


    return <>
    <Modal 
        visible={ visible } 
        title="选择售后人员" 
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
                message.error('未选择售后人员！')
            }
        }}
        width='60%'
    >
             
        <Page
            path="/tower-as/employee/employeeOrderList"
            columns={columns}
            headTabs={[]}
            extraOperation={<span>已选：{selectedRows.length>0?selectedRows[0]?.name:''}</span>}
            // refresh={refresh}
            
            tableProps={{
                pagination:false,
                rowKey:'userId',
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
                    children: <Input maxLength={50} placeholder="请输入姓名/手机号进行查询" />
                },
                {
                    name: 'isFree',
                    label: '未完成工单',
                    children:  <Select placeholder="请选择"  style={{ width: "150px" }}>
                        <Select.Option value={1}>无</Select.Option>
                        <Select.Option value={0}>有</Select.Option>
                    </Select>
                }
            ]}
            filterValue={filterValue}
            onFilterSubmit={(values: Record<string, any>) => {
                setFilterValue(values);
                return values;
            }}
        />
    </Modal>
    <Button type='link'  onClick={()=>setVisible(true)}>选择售后人员</Button>
    </>
}










