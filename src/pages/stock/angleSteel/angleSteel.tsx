/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Button, Col, Pagination, Row, Select, TableColumnProps, Table, } from 'antd'
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
        // const column: TableColumnProps<object>[] = [
        //     {
        //         key: 'index',
        //         title: '序号',
        //         dataIndex: 'index',
        //         width: 50,
        //         render: (text, item, index) => {
        //             return <span>{index + 1}</span>
        //         }
        //     },
        //     {
        //         key: 'materialTexture',
        //         title: '材质',
        //         dataIndex: 'materialTexture',
        //     },
        //     {
        //         key: 'thickness',
        //         title: "厚度mm",
        //         dataIndex: "thickness",
        //     },
        //     {
        //         key: 'width',
        //         title: "宽度mm",
        //         dataIndex: "width",
        //     },
        //     {
        //         key: 'clampLoss',
        //         title: "夹钳总耗损mm",
        //         dataIndex: "clampLoss",
        //     },
        //     {
        //         key: 'edgeLoss',
        //         title: "每刀口耗损mm",
        //         dataIndex: "edgeLoss",
        //     },
        //     {
        //         key: 'description',
        //         title: "备注",
        //         dataIndex: "description",
        //     },
        //     {
        //         key: 'operation',
        //         title: '操作',
        //         dataIndex: 'operation',
        //         align: 'center',
        //         render: (_text: any, item: any, index: number): React.ReactNode => {
        //             return (
        //                 <div className='operation'>
        //                     <span
        //                         onClick={() => {
        //                             setIsModal(true)
        //                             setId(item.id)
        //                         }}
        //                     >编辑</span>
        //                 </div>
        //             )
        //         }
        //     }]
    useEffect(() => {
        getColumnsData()
    }, [current, size]);
    const getColumnsData = async () => {
        const data: any = await RequestUtil.get('/tower-storage/angleSteel', {
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
                    <span>配料基础配置</span>
                    </div>
                    <div className='func_right'>
                        <Button
                            className='func_right_item'
                            onClick={() => {
                                setIsModal(true)
                                setId(null)
                            }}
                        >添加</Button>
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
          
        </div>
    )

    
}

export default AngleSteel;