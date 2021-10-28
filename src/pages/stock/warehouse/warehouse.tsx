/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Button, Pagination, TableColumnProps, Table, } from 'antd'
import RequestUtil from "../../../utils/RequestUtil"
import { RouteProps } from '../public'
import WarehouseModal from './WarehouseModal'
const Warehouse = (props: RouteProps) => {
    // const history = useHistory()
    const [columnsData, setColumnsData] = useState([]);
    const [total, setTotal] = useState(0);
    const [size, setSize] = useState(10);
    const [current, setCurrent] = useState(1);
    const [isModal, setIsModal] = useState(false);
    const [id, setId] = useState<string | null>(null);
    const columns: TableColumnProps<object>[] = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (text, item, index) => {
                return <span>{index + 1}</span>
            }
        },
        {
            key: 'warehouseNumber',
            title: '编号',
            dataIndex: 'warehouseNumber',
        },
        {
            key: 'name',
            title: '仓库名称',
            dataIndex: 'name'
        },
        {
            key: 'warehouseCategoryName',
            title: '分类',
            dataIndex: 'warehouseCategoryName',
        },
        {
            key: 'personName',
            title: '负责人',
            dataIndex: 'personName'
        },
        {
            key: 'staffName',
            title: '保管员', 
            dataIndex: 'staffName'
        },
        {
            key: 'shopName',
            title: '车间',
            dataIndex: 'shopName',
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            align: 'center',
            render: (_text: any, item: any, index: number): React.ReactNode => {
                return (
                    <div className='operation'>
                        <span
                            className='yello'
                            onClick={() => {
                                setIsModal(true)
                                setId(item.id)
                            }}
                        >编辑</span>
                        <span
                            className='yello'
                            onClick={() => {
                                setIsModal(true)
                                setId(item.id)
                            }}
                        >删除</span>
                    </div>
                )
            }
        }
    ]
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
    const cancelModal = () => {
        setIsModal(false)
        setId(null)
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
                            onClick={() => {
                                setIsModal(true)
                                setId(null)
                            }}
                        >创建</Button>
                        <Button
                            className='func_right_item'
                            onClick={() => {
                                props.history.go(-1)
                            }}
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
            {
                isModal ?
                    <WarehouseModal
                        {...props}
                        isModal={isModal}
                        id={id}
                        cancelModal={cancelModal}
                    /> : null
            }
        </div>
    )
}

export default Warehouse;