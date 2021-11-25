import { Button, Input, message, Modal, Select } from 'antd';
import TextArea from 'rc-textarea';
import React, { useState } from 'react';
import { useHistory, useParams, } from 'react-router-dom';
import RequestUtil from '../../../utils/RequestUtil';
import { Page } from '../../common';
import './BoltDetailList.less';

export default function BoltCheck(): React.ReactNode {
    const params = useParams<{ id: string, }>();
    const history = useHistory()
    const columns = [
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
            dataIndex: 'typeName',
        },
        {
            title: '呼高m',
            width: 150,
            dataIndex: 'name',
        },
        {
            title: '基数',
            width: 150,
            dataIndex: 'level',
        },
        {
            title: '总重',
            width: 150,
            dataIndex: 'specs',
        },
        {
            title: '说明',
            dataIndex: 'unbuckleLength',
            width: 120,
        },
        {
            title: '操作',
            width: 120,
            dataIndex: 'operation',
            render: (text: any, item: any,) => {
                return (
                    <div className='operation'>
                        <span
                            onClick={() => {
                                history.push('')
                            }}
                        >删除</span>
                        <span
                            onClick={() => {
                                history.push('')
                            }}
                        >编辑</span>
                        <span
                            onClick={() => {
                                history.push(`/workMngt/boltList/boltListing/${params.id}/${item.id}`)
                            }}
                        >螺栓明细</span>
                    </div>
                )
            }
        },
    ]
    const [visible, setVisible] = useState<boolean>(false);//添加弹框显示
    const [callHeight, setCallHeight] = useState<number | string>('');//呼高
    const [towerTagNo, setTowerTagNo] = useState<any>([]);//塔位号
    const [towerTagList, setTowerTagList] = useState<any>([]);//塔位列表
    const [explain, setExplain] = useState<any>('');//说明
    const [refresh, setRefresh] = useState(false);
    /**
     * 完成
     */
    const successCheck = async () => {
        await RequestUtil.put('/tower-science/boltRecord/completeCheck', {
        })
    }
    // 添加
    const onSubmit = async () => {
        if (!callHeight) {
            message.error("请输入呼高")
            return
        }
        if (towerTagNo.length == 0) {
            message.error("请选择塔位号")
            return
        }
        await RequestUtil.post('/tower-science/boltRecord/saveBasicHeight', {
            basicHeight: callHeight,
            productIdList: towerTagNo,
            description: explain,
            productCategoryId: params.id
        })
        setRefresh(!refresh)
        onCancel()
    }
    // 获取塔位号
    const getBoltlist = async () => {
        let ary = await RequestUtil.get('/tower-science/product/listByBolt', {
            productCategoryId: params.id
        })
        setTowerTagList(ary)
    }
    // 弹框取消
    const onCancel = () => {
        setVisible(false)
        setTowerTagNo([])
        setExplain('')
        setCallHeight('')
    }
    return (
        <div>
            <Page
                path={`/tower-science/boltRecord/basicHeight/${params.id}`}
                columns={columns}
                refresh={refresh}
                exportPath={`/tower-science/boltRecord/exportBoltList/${params.id}`}
                extraOperation={
                    <div>
                        <Button type="primary" ghost onClick={() => { successCheck() }} style={{ marginLeft: 10, }}>完成</Button>
                        <Button type="primary" ghost onClick={() => { setVisible(true); getBoltlist() }} style={{ marginLeft: 10, }}>添加</Button>
                        <Button type="primary" ghost onClick={() => { history.go(-1) }} style={{ marginLeft: 10, }}>返回上一级</Button>
                    </div>
                }
                headTabs={[]}
                searchFormItems={[]}
            />
            <Modal
                className='Modal_hugao'
                visible={visible}
                width="50%"
                title="添加"
                onCancel={() => { onCancel(); }}
                onOk={() => onSubmit()}
                okText="确定"
                cancelText="关闭"
            >
                <div className="add_HuGao">
                    <div className="tr">
                        <div className="td">
                            <div className="title">呼高*</div>
                            <div className="val">
                                <Input
                                    className="input"
                                    placeholder="请输入"
                                    bordered={false}
                                    maxLength={3}
                                    value={callHeight}
                                    onChange={(e) => {
                                        setCallHeight(e.target.value.replace(/\D/g, ''))
                                    }}
                                ></Input>
                            </div>
                        </div>
                        <div className="td">
                            <div className="title">塔位号*</div>
                            <div className="val">
                                <Select
                                    className='input'
                                    style={{ width: '100%' }}
                                    mode="multiple"
                                    maxLength={3}
                                    value={towerTagNo}
                                    onChange={(value) => {
                                        if (value.length > 99) {
                                            message.error('塔位号最多99个')
                                            return
                                        }
                                        console.log(value)
                                        setTowerTagNo(value)
                                    }}
                                >
                                    {
                                        towerTagList.map((item: any, index: any) => {
                                            return <Select.Option value={item.id} key={index}>{item.productNumber}</Select.Option>
                                        })
                                    }
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div className="tr">
                        <div className="td">
                            <div className="title">说明</div>
                            <div className="val">
                                <TextArea
                                    className="TextArea"
                                    placeholder="请输入"
                                    style={{ width: '100%' }}
                                    maxLength={400}
                                    value={explain}
                                    onChange={(e) => {
                                        setExplain(e.target.value)
                                    }}
                                ></TextArea>
                            </div>
                        </div>
                        <div className="td">
                            <div className="title"></div>
                            <div className="val">
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}