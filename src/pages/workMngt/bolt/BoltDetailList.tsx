import { Button, Col, Input, message, Modal, Popconfirm, Row, Select } from 'antd';
import TextArea from 'rc-textarea';
import React, { useState } from 'react';
import { useHistory, useParams, } from 'react-router-dom';
import AuthUtil from '../../../utils/AuthUtil';
import RequestUtil from '../../../utils/RequestUtil';
import { Page } from '../../common';

export default function BoltCheck(): React.ReactNode {
    const params = useParams<{ id: string, status: string, boltLeader: string }>();
    const history = useHistory()
    const columns: any[] = [
        {
            title: '序号',
            dataIndex: 'index',
            width: 100,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => {
                return <span>{index + 1}</span>
            }
        },
        {
            title: '塔位号',
            width: 150,
            dataIndex: 'productNames',
        },
        {
            title: '呼高m',
            width: 150,
            dataIndex: 'basicHeight',
        },
        {
            title: '基数',
            width: 150,
            dataIndex: 'num',
        },
        {
            title: '总重',
            width: 150,
            dataIndex: 'totalWeight',
        },
        {
            title: '说明',
            dataIndex: 'description',
            width: 120,
        },
        {
            title: '操作',
            width: 120,
            dataIndex: 'operation',
            fixed: 'right',
            render: (text: any, item: any,) => {
                return (
                    <div className='operation'>
                        <Popconfirm
                            placement="bottomRight"
                            title='确认删除?'
                            onConfirm={() => {
                                deleteItem(item.id)
                            }}
                            okText="是"
                            cancelText="否"
                        >
                            <span
                                hidden={params.status === '2' && params.boltLeader === userId ? false : true}
                                style={{ color: '#FF8C00', marginRight: 10, cursor: 'pointer' }}
                            >删除</span>
                        </Popconfirm>
                        <span
                            style={{ color: '#FF8C00', marginRight: 10, cursor: 'pointer' }}
                            hidden={params.status === '2' && params.boltLeader === userId ? false : true}
                            onClick={() => {
                                setId(item.id)
                                setbasicHeight(item.basicHeight)
                                setdescription(item.description)
                                setVisible(true)
                                let idList: string[] = item.productNumVOList.map((item: { id: string }) => item.id)
                                setproductIdList(idList)
                                getBoltlist(item.id)
                            }}
                        >编辑</span>
                        <span
                            style={{ color: '#FF8C00', marginRight: 10, cursor: 'pointer' }}
                            onClick={() => {
                                history.push(`/workMngt/boltList/boltListing/${params.id}/${item.id}/${params.boltLeader}/${params.status}`)
                            }}
                        >螺栓明细</span>
                    </div>
                )
            }
        },
    ]
    const userId = AuthUtil.getUserId();
    const [id, setId] = useState<string | null>(null);//添加弹框显示
    const [visible, setVisible] = useState<boolean>(false);//添加弹框显示
    const [basicHeight, setbasicHeight] = useState<number | string>('');//呼高
    const [productIdList, setproductIdList] = useState<any>([]);//塔位号
    const [towerTagList, setTowerTagList] = useState<any>([]);//塔位列表
    const [description, setdescription] = useState<any>('');//说明
    const [refresh, setRefresh] = useState(false);
    /**
     * 完成
     */
    const successCheck = async () => {
        await RequestUtil.get('/tower-science/boltRecord/complete', {
            id: params.id,
        })
        message.success('操作成功')
        history.go(-1)
    }
    // 添加
    const onSubmit = async () => {
        if (!basicHeight) {
            message.error("请输入呼高")
            return
        }
        if (!productIdList.length) {
            message.error("请选择塔位号")
            return
        }
        if (id) {
            await RequestUtil.put('/tower-science/boltRecord/updateBasicHeight', {
                basicHeight,
                productIdList,
                description,
                productCategoryId: params.id,
                id,
            })
        } else {
            await RequestUtil.post('/tower-science/boltRecord/saveBasicHeight', {
                basicHeight,
                productIdList,
                description,
                productCategoryId: params.id,
            })
        }
        setRefresh(!refresh)
        onCancel()
    }
    /**
     * 删除
     * @param heightId 
     */
    const deleteItem = async (heightId: string) => {
        await RequestUtil.delete(`/tower-science/boltRecord/deleteHeight?heightId=${heightId}&productCategoryId=${params.id}`)
        message.success('操作成功')
        setRefresh(!refresh)
    }
    // 获取塔位号
    const getBoltlist = async (heightId?: string) => {
        let ary = await RequestUtil.get('/tower-science/product/listByBolt', {
            productCategoryId: params.id,
            heightId,
        })
        setTowerTagList(ary)
    }
    // 弹框取消
    const onCancel = () => {
        setId(null)
        setVisible(false)
        setproductIdList([])
        setdescription('')
        setbasicHeight('')
    }
    return (
        <div>
            <Page
                path={`/tower-science/boltRecord/basicHeight/${params.id}`}
                columns={columns}
                refresh={refresh}
                exportPath={`/tower-science/boltRecord/basicHeight/${params.id}`}
                extraOperation={
                    <div>
                        <Button
                            type="primary"
                            ghost
                            onClick={() => { successCheck() }}
                            style={{ marginLeft: 10, }}
                            hidden={params.status === '2' && params.boltLeader === userId ? false : true}
                        >完成</Button>
                        <Button
                            type="primary"
                            ghost
                            onClick={() => { setVisible(true); getBoltlist() }}
                            style={{ marginLeft: 10, }}
                            hidden={params.status === '2' && params.boltLeader === userId ? false : true}
                        >添加</Button>
                        <Button type="primary" ghost onClick={() => { history.go(-1) }} style={{ marginLeft: 10, }}>返回上一级</Button>
                    </div>
                }
                headTabs={[]}
                searchFormItems={[]}
            />
            <Modal
                visible={visible}
                width={1000}
                title={id ? "编辑" : "添加"}
                onCancel={() => { onCancel(); }}
                onOk={() => onSubmit()}
                okText="确定"
                cancelText="关闭"
            >
                <div className='public_page'>
                    <Row className='search_content'>
                        <Col
                            md={12}
                            className='search_item'
                        >
                            <span className='tip'>呼高*：</span>
                            <Input
                                placeholder='请输入'
                                className='input'
                                value={basicHeight}
                                maxLength={3}
                                onChange={(ev) => {
                                    let height = ev.target.value.replace(/\D/g, '')
                                    if (Number(height) === 0) {
                                        height = ''
                                    }
                                    setbasicHeight(height)
                                }}
                            />
                        </Col>
                        <Col
                            md={12}
                            className='search_item'
                        >
                            <span className='tip'>塔位号*：</span>
                            <Select
                                className='input'
                                style={{ width: '100%' }}
                                mode="multiple"
                                maxLength={3}
                                value={productIdList}
                                onChange={(value) => {
                                    if (value.length > 99) {
                                        message.error('塔位号最多99个')
                                        return
                                    }
                                    console.log(value)
                                    setproductIdList(value)
                                }}
                            >
                                {
                                    towerTagList.map((item: any, index: any) => {
                                        return <Select.Option value={item.id} key={index}>{item.productNumber}</Select.Option>
                                    })
                                }
                            </Select>
                        </Col>
                        <Col
                            md={24}
                            className='search_item'
                        >
                            <span className='tip'>说明：</span>
                            <TextArea
                                className="input"
                                placeholder="请输入"
                                maxLength={400}
                                value={description}
                                onChange={(e) => {
                                    setdescription(e.target.value)
                                }}
                            />
                        </Col>
                    </Row>
                </div>
            </Modal>
        </div>
    )
}