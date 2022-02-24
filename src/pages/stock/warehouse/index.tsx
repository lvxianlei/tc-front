/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react'
import { Button, TableColumnProps, message } from 'antd'
import RequestUtil from "../../../utils/RequestUtil"
import WarehouseModal from './WarehouseModal'
import { useHistory } from 'react-router-dom'
import { Page } from '../../common'
const Warehouse = () => {
    const history = useHistory()
    const [size, setSize] = useState(10);
    const [current, setCurrent] = useState(1);
    const [isModal, setIsModal] = useState(false);
    const [id, setId] = useState<string | null>(null);
    const columns: TableColumnProps<object>[] = [
        {
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (text, item, index) => <>{index + 1}</>
        },
        {
            title: '编号',
            dataIndex: 'warehouseNumber',
        },
        {
            title: '仓库名称',
            dataIndex: 'name'
        },
        {
            title: '分类',
            dataIndex: 'warehouseCategoryName',
        },
        {
            key: 'personName',
            title: '负责人',
            dataIndex: 'personName'
        },
        {
            title: '保管员',
            dataIndex: 'staffName'
        },
        {
            title: '车间',
            dataIndex: 'shopName',
        },
        {
            title: '操作',
            dataIndex: 'operation',
            fixed: "right",
            width: 120,
            render: (_text: any, item: any, index: number): React.ReactNode => {
                return (
                    <>
                        <Button
                            type="link"
                            className="btn-operation-link"
                            onClick={() => {
                                setIsModal(true)
                                setId(item.id)
                            }}
                        >编辑</Button>
                        <Button type="link" onClick={() => deleteItem(item.id)}
                        >删除</Button>
                    </>
                )
            }
        }
    ]

    const getColumnsData = async () => {
        const data: any = await RequestUtil.get('/tower-storage/warehouse', {
            current,
            size,
        })
        history.go(0)
    }

    const cancelModal = () => {
        setIsModal(false)
        setId(null)
    }

    const deleteItem = async (id: string) => {
        await RequestUtil.delete(`/tower-storage/warehouse?id=${id}`)
        message.success('删除成功')
        getColumnsData()
    }

    return (<>
        {
            isModal && <WarehouseModal
                isModal={isModal} id={id}
                cancelModal={cancelModal}
                getColumnsData={getColumnsData}
            />
        }
        <Page
            extraOperation={<>
                <Button
                    type="primary"
                    onClick={() => {
                        setIsModal(true)
                        setId(null)
                    }}
                >创建</Button>
                <Button
                    onClick={() => history.go(-1)}
                >返回</Button>
            </>}
            path="/tower-storage/warehouse"
            columns={columns}
            searchFormItems={[]}
        /></>)
}

export default Warehouse;