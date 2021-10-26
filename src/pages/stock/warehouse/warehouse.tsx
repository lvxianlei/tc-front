/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Button, Col, Pagination, Row, Select, TableColumnProps, Table, } from 'antd'
import RequestUtil from "../../../utils/RequestUtil"
import { RouteProps } from '../public'
import WarehouseModal from './WarehouseModal'
const { Option } = Select;
const Warehouse = (props: RouteProps) => {
    // const history = useHistory()
    const [columnsData, setColumnsData] = useState([]);
    const [total, setTotal] = useState(0);
    const [size, setSize] = useState(10);
    const [current, setCurrent] = useState(1);
    const [isModal, setIsModal] = useState(false);
    const columns: TableColumnProps<object>[] = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
        },
        {
            key: 'projectName',
            title: '编号',
            dataIndex: 'projectName',
        },
        {
            key: 'projectNumber',
            title: '仓库名称',
            dataIndex: 'projectNumber'
        },
        {
            key: 'projectType',
            title: '分类',
            dataIndex: 'projectType',
        },
        {
            key: 'bidBuyEndTime',
            title: '负责人',
            dataIndex: 'bidBuyEndTime'
        },
        {
            key: 'biddingEndTime',
            title: '保管员',
            dataIndex: 'biddingEndTime'
        },
        {
            key: 'currentProjectStage',
            title: '车间',
            dataIndex: 'currentProjectStage',
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            render: (_text: any, item: any, index: number): React.ReactNode => {
                return (
                    <div>
                        <span>编辑</span>
                        <span>删除</span>
                    </div>
                )
            }
        }]
    useEffect(() => {
        getColumnsData()
    }, [current, size]);
    const getColumnsData = async () => {
        const data: any = await RequestUtil.get('/tower-storage/warehouse', {
            current,
            size,
        })
        setTotal(data.data)
        setColumnsData(data.records)
    }
    const cancelModal = () =>{
        setIsModal(false)
    }
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
                            onClick={()=>{
                                setIsModal(true)
                            }}
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
                        onChange={(page: number, size: any) => {
                            setCurrent(page)
                            setSize(size)
                        }}
                    />
                </div>
            </div>
            <WarehouseModal
                {...props}
                isModal={isModal}
                cancelModal={cancelModal}
            />
        </div>
    )
}

export default Warehouse;