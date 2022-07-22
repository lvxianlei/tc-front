/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react'
import { Button, message } from 'antd'
import RequestUtil from "../../../utils/RequestUtil"
import Edit from './Edit'
import { useHistory } from 'react-router-dom'
import { Page } from '../../common'
import { pages } from "./warehouse.json"
import Location from "./Location";
import StatiffStock from "./StatiffStock"
const Warehouse = () => {
    const history = useHistory()
    const [isModal, setIsModal] = useState(false);
    const [id, setId] = useState<string | null>(null);
    const [isModalVisitle, setIsModalVisitle] = useState<boolean>(false);
    const [isStatiffStockVisitle, setIsStatiffStockVisitle] = useState<boolean>(false);

    const cancelModal = () => {
        setIsModal(false)
        setId(null)
    }

    const cancelModalLocation = () => {
        setIsModalVisitle(false);
    }

    const cancelModalStatiffStock = () => {
        setIsStatiffStockVisitle(false);
    }

    const deleteItem = async (id: string) => {
        await RequestUtil.delete(`/tower-storage/warehouse?id=${id}`)
        message.success('删除成功')
        history.go(0)
    }

    return (<>
        {isModal && <Edit isModal={isModal} id={id} cancelModal={cancelModal} />}
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
            columns={[
                {
                    title: '序号',
                    dataIndex: 'index',
                    width: 50,
                    render: (text, item, index) => <>{index + 1}</>
                },
                ...pages,
                {
                    title: '操作',
                    dataIndex: 'operation',
                    fixed: "right",
                    width: 120,
                    render: (_text: any, item: any): React.ReactNode => <>
                        <Button
                            type="link"
                            className="btn-operation-link"
                            onClick={() => {
                                setIsModal(true)
                                setId(item.id)
                            }}
                        >编辑</Button>
                        <Button type="link" className="btn-operation-link" onClick={() => setIsModalVisitle(true)}>库位设置</Button>
                        <Button type="link" className="btn-operation-link" onClick={() => setIsStatiffStockVisitle(true)}>区位设置</Button>
                        <Button type="link" onClick={() => deleteItem(item.id)}
                        >删除</Button>
                    </>
                }
            ]}
            searchFormItems={[]}
        />
        <Location isModal={isModalVisitle} id="" cancelModal={() => cancelModalLocation()} />
        <StatiffStock isModal={isStatiffStockVisitle} id="" cancelModal={() => cancelModalStatiffStock()} />
    </>)
}

export default Warehouse;