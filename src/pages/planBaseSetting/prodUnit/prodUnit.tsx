/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, } from 'react'
import { Button, TableColumnProps, Input, message, Popconfirm, } from 'antd';
import RequestUtil from '../../../utils/RequestUtil';
import ProdUnitAdd from './add';
import { Page } from '../../common';
const ProdUnit = (): React.ReactNode => {
    const columns: TableColumnProps<object>[] = [
        {
            title: '生产单元名称',
            dataIndex: 'name',
        },
        {
            title: '产力值',
            dataIndex: 'productivity'
        },
        {
            title: '操作',
            dataIndex: 'operation',
            align: 'center',
            render: (text, item: any, index) => {
                return (
                    <div className='operation'>
                        <span
                            style={{ color: '#FF8C00', marginRight: 10, cursor: 'pointer', }}
                            onClick={() => {
                                setIsModal(true)
                                setId(item.id)
                            }}
                        >编辑</span>
                        <Popconfirm
                            title='确定删除吗？'
                            onConfirm={() => {
                                deleteItem(item.id)
                            }}
                            okText='是'
                            cancelText='否'
                        >
                            <span style={{ color: '#FF8C00', marginRight: 10, cursor: 'pointer', }}>删除</span>
                        </Popconfirm>
                    </div>
                )
            }
        },
    ]
    let [isModal, setIsModal] = useState<boolean>(false)
    let [id, setId] = useState<string | null>(null)
    const [filterValue, setFilterValue] = useState<any>({})
    const [refresh, setRefresh] = useState<boolean>(false)
    /**
     * 
     * @param isRefresh 
     */
    const cancelModal = (isRefresh?: boolean) => {
        setIsModal(false)
        setId(null)
        if (isRefresh) {
            setRefresh(!refresh)
        }
    }
    /**
     * 
     * @param id 
     */
    const deleteItem = async (id: string) => {
        await RequestUtil.delete(`/tower-aps/productionUnit/${id}`)
        message.success('操作成功')
        setRefresh(!refresh)
    }
    /**
     * 
     * @param value 
     * @returns 
     */
    const onFilterSubmit = (value: any) => {
        setFilterValue({ ...filterValue, ...value })
        return value
    }
    return (
        <div className='public_page'>
            <Page
                path="/tower-aps/productionUnit"
                filterValue={filterValue}
                columns={columns}
                refresh={refresh}
                onFilterSubmit={onFilterSubmit}
                extraOperation={
                    <div>
                        <Button
                            type="primary"
                            ghost
                            onClick={() => { setIsModal(true) }}
                            style={{ marginLeft: 10, }}
                        >添加</Button>
                    </div>
                }
                searchFormItems={[
                    {
                        name: 'fuzzyMsg',
                        label: '查询',
                        children: <Input placeholder="生产单元名称" style={{ width: 300 }} />
                    }
                ]}
            />
            {
                isModal ?
                    <ProdUnitAdd
                        cancelModal={cancelModal}
                        id={id}
                    /> : null
            }
        </div>
    )
}

export default ProdUnit;