import React, { useState } from 'react';
import { Button, Modal, Form, Input, Steps, message, Space } from 'antd';
import { useHistory } from 'react-router-dom';
import { CommonTable, Page } from '../../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import styles from './tower.module.less';
const { Step } = Steps
export default function Tower({ onSelect, selectedKey = [], planNumber , ...props}: any): JSX.Element {

    const [ visible, setVisible ] = useState<boolean>(false);
    const [ form ] = Form.useForm();
    const [filterValue, setFilterValue] = useState<any>({});
    const history = useHistory();
    const [detailData, setDetailData] = useState<any[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>(selectedKey);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [selectKeys, setSelectKeys] = useState<React.Key[]>(selectedKey);
    const [selectRows, setSelectRows] = useState<any[]>([]);
    const [current,setCurrent] = useState<number>(0)
    const SelectedChange = (selectedRowKeys: React.Key[], selectedRows: any[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows)
    }
    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: any[]): void => {
        setSelectKeys(selectedRowKeys);
        setSelectRows(selectedRows)
    }
    const [page, setPage] = useState({
        current: 1,
        size: 20,
        total: 0
    })

    const [filterValues, setFilterValues] = useState<Record<string, any>>();

    const { loading, data, run } = useRequest<any[]>((pagenation: any, filterValue: Record<string, any>) => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get<any>(`/tower-science/product/lofting`, { current: pagenation?.current || 1, size: pagenation?.size || 20, productCategoryId: selectedRows[0]?.productCategoryId, ...filterValue });
        setPage({ ...data });
        resole(data?.records);
    }), {manual:true})
    const handleChangePage = (current: number, pageSize: number) => {
        setPage({ ...page, current: current, size: pageSize });
        run({ current: current, size: pageSize, productCategoryId:selectedRows[0]?.productCategoryId })
    }
    const columns = [
        {
            key: 'productCategoryName',
            title: '塔型',
            width: 150,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'voltageGradeName',
            title: '电压等级',
            width: 150,
            dataIndex: 'voltageGradeName'
        }
    ]
    const towerColumns = [
        {
            key: 'productNumber',
            title: '杆塔',
            width: 150,
            dataIndex: 'productNumber'
        },
        {
            key: 'voltageGradeName',
            title: '电压等级',
            width: 150,
            dataIndex: 'voltageGradeName'
        }
    ]
    const steps = [
        {
          title: '选择塔型',
        },
        {
          title: '选择杆塔',
        }
    ];
    const next = () => {
        if(selectedRows.length===0){
            return message.error('未选择塔型！')
        }
        setCurrent(current + 1);
        if(current===0){
            console.log(selectedRows)
            run({current:1, pageSize:20,productCategoryId:selectedRows[0]?.productCategoryId})
        }
    };

    const prev = () => {
        setCurrent(current - 1);
    };
    const onFinish = (value: Record<string, any>) => {
        run({current:1, pageSize:20, fuzzyMsg:value});
    }
    const renderContent =()=> {
        if(current !== steps.length - 1 ){
            return <Page
            path={`/tower-science/productCategory/list/${planNumber}`}
            columns={columns}
            headTabs={[]}
            extraOperation={<span>已选：{selectedRows.length>0?selectedRows[0]?.productCategoryName:''}</span>}
            // refresh={refresh}
          
            tableProps={{
                rowKey:'productCategoryId',
                rowSelection: {
                    type:'radio',
                    selectedRowKeys: selectedKeys,
                    onChange: SelectedChange
                }
            }}
            searchFormItems={[
                {
                    name: 'name',
                    label: '模糊查询项',
                    children: <Input maxLength={50} placeholder="请输入塔型名称进行查询" />
                }
            ]}
            filterValue={filterValue}
            onFilterSubmit={(values: Record<string, any>) => {
                setFilterValue(values);
                return values;
            }}
        />
        }else{
            return <>
            <Form form={ form } onFinish={ onFinish } layout="inline" className={ styles.topForm }>
                <Form.Item name="fuzzyMsg" label="模糊查询项">
                    <Input placeholder="请输入杆塔号进行查询"/>
                </Form.Item>
                <Space direction="horizontal">
                    <Button type="primary" htmlType="submit">搜索</Button>
                    <Button type="ghost" htmlType="reset">重置</Button>
                </Space>
            </Form>
            <span>已选：{selectedRows.length>0?selectedRows[0]?.productCategoryName:''}/{selectRows.length>0?selectRows[0]?.productNumber:''}</span>
            <CommonTable
                columns={towerColumns}
                dataSource={data}
                pagination={{
                    current: page.current,
                    pageSize: page.size,
                    total: page?.total,
                    showSizeChanger: true,
                    onChange: handleChangePage
                }}
                rowSelection={{
                    selectedRowKeys: selectKeys,
                    type: "radio",
                    onChange: SelectChange,
                }}
                rowKey={(record: any) => record.id}
                size="small"
                loading={loading}
            />
        </>
        }
    }
    return <>
    <Modal 
        visible={ visible } 
        title="选择塔型" 
        onCancel={ () => { 
            setVisible(false); 
            setSelectKeys([])
            setSelectRows([])
            setSelectedKeys([])
            setSelectedRows([])
            setCurrent(0)
        }} 
        onOk={ () => {
            setVisible(false); 
            console.log(selectedRows)
            onSelect(selectedRows)
            setDetailData([])
        }}
        footer={false}
        width='60%'
    >
        <Steps current={current}>
            <Steps current={current}>
                {steps.map(item => (
                    <Step key={item.title} title={item.title} />
                ))}
            </Steps>
        </Steps>    
        {/* {current !== steps.length - 1 ?<Page
            path="/tower-science/loftingList"
            columns={columns}
            headTabs={[]}
            extraOperation={<span>已选：{selectedRows.length>0?selectedRows[0]?.name:''}</span>}
            // refresh={refresh}
          
            tableProps={{
                
                rowSelection: {
                    type:'radio',
                    selectedRowKeys: selectedKeys,
                    onChange: SelectedChange
                }
            }}
            searchFormItems={[
                {
                    name: 'name',
                    label: '模糊查询项',
                    children: <Input maxLength={50} placeholder="请输入塔型名称进行查询" />
                }
            ]}
            filterValue={filterValue}
            onFilterSubmit={(values: Record<string, any>) => {
                setFilterValue(values);
                return values;
            }}
        />:

        <Page
            path="/tower-science/product/lofting"
            columns={towerColumns}
            requestData={{productCategoryId: selectRows[0]?.id}}
            headTabs={[]}
            extraOperation={<span>已选：{selectedRows.length>0?selectedRows[0]?.name:''}/{selectRows.length>0?selectRows[0]?.name:''}</span>}
            // refresh={refresh}
          
            tableProps={{
                
                rowSelection: {
                    type:'radio',
                    selectedRowKeys: selectKeys,
                    onChange: SelectChange
                }
            }}
            searchFormItems={[
                {
                    name: 'type',
                    label: '模糊查询项',
                    children: <Input maxLength={50} placeholder="请输入杆塔名称进行查询" />
                }
            ]}
            filterValue={filterValue}
            onFilterSubmit={(values: Record<string, any>) => {
                setFilterValue(values);
                return values;
            }}
        />} */}
        {renderContent()}
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            下一步
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={() => {
            if(selectRows.length>0){
                setVisible(false); 
                console.log(selectedRows)
                onSelect({
                    selectedRows,
                    selectRows
                })
                setDetailData([])
            }
            else {
                message.error('未选择杆塔号！')
            }
          }}>
            确定
          </Button>
        )}
        {current > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
            上一步
          </Button>
        )}
    </Modal>
    <Button type='link'  onClick={()=>{
        // setSelectKeys([])
        // setSelectRows([])
        // setSelectedKeys([])
        // setSelectedRows([])
        // setCurrent(0)
        setVisible(true)
    }}>选择杆塔</Button>
    </>
}










