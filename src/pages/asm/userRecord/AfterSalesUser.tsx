import React, { useState } from 'react';
import { Button, Modal, Form, Input, message } from 'antd';
import { useHistory } from 'react-router-dom';
import { Page } from '../../common';


export default function AfterSalesUser({ onSelect, selectedKey = [], ...props }: any): JSX.Element {

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
            title: '部门',
            width: 150,
            dataIndex: 'deptName'
        },
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
            key: 'stationName',
            title: '岗位',
            dataIndex: 'stationName',
            width: 120
        }
    ]


    return <>
    <Modal 
        visible={ visible } 
        title="选择员工" 
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
                message.error('未选择员工！')
            }
        }}
        width='60%'
    >
             
        <Page
            path="/tower-system/employee"
            columns={columns}
            headTabs={[]}
            extraOperation={<span>已选：{selectedRows.length>0?selectedRows.map(item=>item?.name)?.join(','):''}</span>}
            // refresh={refresh}
          
            tableProps={{
                
                rowSelection: {
                    type:'checkbox',
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
                // {
                //     name: 'workOrder',
                //     label: '未完成工单',
                //     children: 
                // }
            ]}
            filterValue={filterValue}
            onFilterSubmit={(values: Record<string, any>) => {
                setFilterValue(values);
                return values;
            }}
        />
    </Modal>
    <Button type='primary'  onClick={()=>setVisible(true)}>添加员工</Button>
    </>
}










