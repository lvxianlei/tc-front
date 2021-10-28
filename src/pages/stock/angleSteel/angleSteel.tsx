/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Button, Col, Pagination, Row, Select, TableColumnProps, Table } from 'antd'
import { CommonTable } from '../../common'
import RequestUtil from "../../../utils/RequestUtil"
import { RouteProps } from '../public'
const { Option } = Select;
const AngleSteel = (props: RouteProps) => {
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
            key: 'policy',
            title: '策略项',
            dataIndex: 'policy',
        },
        {
            key: 'configData',
            title: '配置数据',
            dataIndex: 'configData',
        },
        {
            key: 'description',
            title: '说明',
            dataIndex: 'description'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            align: 'center',
        }]
    useEffect(() => {
        getColumnsData()
    }, [current, size]);
    const getColumnsData = async () => {
        const data: any = await RequestUtil.get('/tower-supply/angleConfigStrategy', {
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
                <CommonTable         
                    columns={columns}
                    dataSource={columnsData}
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

        </div>
    )


}

export default AngleSteel;