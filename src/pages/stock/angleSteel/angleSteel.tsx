/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Button, Col, Pagination, Row, Select, TableColumnProps, Table, } from 'antd'
import { CommonTable } from '../../common'
// import { Page } from '../../common'
import { baseInfo, material } from './configurationData.json'
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
        ...baseInfo
    ]
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
            <div className='func'>
                      <span>配料基础配置</span>  
                    </div>
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
            {/* <Page
                path="/"
                columns={
                    [
                       ...material
                    ]
                }
                searchFormItems={[]}
            /> */}
        </div>
        
    )



}

export default AngleSteel;