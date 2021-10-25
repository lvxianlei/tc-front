import React, { useState } from 'react'
import { Button, Table, Pagination, TableColumnProps, } from 'antd'
const ViewPanel = (): React.ReactNode => {
    // const history = useHistory()
    const [columnsData, setColumnsData] = useState([]);
    const [total, setTotal] = useState(0);
    const [size, setSize] = useState(10);
    const [current, setCurrent] = useState(1);
    const columns: TableColumnProps<object>[] = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
        },
        {
            key: 'projectName',
            title: '品名',
            dataIndex: 'projectName',
        },
        {
            key: 'projectNumber',
            title: '标准',
            dataIndex: 'projectNumber'
        },
        {
            key: 'projectType',
            title: '规格',
            dataIndex: 'projectType',
        },
        {
            key: 'bidBuyEndTime',
            title: '材质',
            dataIndex: 'bidBuyEndTime'
        },
        {
            key: 'biddingEndTime',
            title: '库存重量（吨）',
            dataIndex: 'biddingEndTime'
        },
        {
            key: 'biddingEndTime',
            title: '在途重量（吨）',
            dataIndex: 'biddingEndTime'
        },
        {
            key: 'biddingEndTime',
            title: '可用库存（吨）',
            dataIndex: 'biddingEndTime'
        },
        {
            key: 'biddingEndTime',
            title: '生产未领料（吨）',
            dataIndex: 'biddingEndTime'
        },
        {
            key: 'biddingEndTime',
            title: '安全库存（吨）',
            dataIndex: 'biddingEndTime'
        },
        {
            key: 'biddingEndTime',
            title: '告警库存（吨）',
            dataIndex: 'biddingEndTime'
        },
        {
            key: 'currentProjectStage',
            title: '库存状态',
            dataIndex: 'currentProjectStage',
        },
    ]


    return (
        <div className='public_page'>
            <div className='public_content'>
                <div className='func_box'>
                    <div className='func'>
                        <Button
                            className='func_item'
                            type='primary'
                        >导出</Button>
                    </div>
                    <div className='func_right'>
                        <Button
                            className='func_right_item'
                        >创建</Button>
                        <Button
                            className='func_right_item'
                        >返回上一级</Button>
                    </div>
                </div>
                <Table
                    className='public_table'
                    scroll={{ x: true }}
                    columns={columns}
                    dataSource={columnsData}
                    pagination={false}
                    size='small'
                />
                <div className='page_content'>
                    <Pagination
                        className='page'
                        showSizeChanger
                        showQuickJumper
                        total={total}
                        pageSize={size}
                        current={current}
                    />
                </div>
            </div>
        </div>
    )
}

export default ViewPanel;