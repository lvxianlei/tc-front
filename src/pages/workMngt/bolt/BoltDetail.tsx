import { Button, Modal, Input, Select, Table } from 'antd';
import React, { useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import RequestUtil from '../../../utils/RequestUtil';
import { Page } from '../../common';
import './BoltDetailList.less';

export default function BoltCheck(): React.ReactNode {
    const match: any = useRouteMatch()
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
            title: '螺栓类型',
            width: 150,
            dataIndex: 'typeName',
        },
        {
            title: '名称',
            width: 150,
            dataIndex: 'name',
        },
        {
            title: '等级',
            width: 150,
            dataIndex: 'level',
        },
        {
            title: '规格',
            width: 150,
            dataIndex: 'specs',
        },
        {
            title: '无扣长（mm）',
            dataIndex: 'unbuckleLength',
            width: 120,
        },
        {
            title: '小计',
            width: 150,
            dataIndex: 'specs',
        },
        {
            title: '合计',
            width: 150,
            dataIndex: 'specs',
        },
        {
            title: '单重（kg）',
            width: 150,
            dataIndex: 'specs',
        },
        {
            title: '合计重（kg）',
            width: 150,
            dataIndex: 'specs',
        },
        {
            title: '备注',
            width: 150,
            dataIndex: 'specs',
        },
        {
            title: '操作',
            width: 120,
            dataIndex: 'operation',
            render: () => {
                return (
                    <div className='operation'>
                        <span
                            onClick={() => {
                            }}
                        >删除</span>
                    </div>
                )
            }
        },
    ]
    // 提交问题单表头
    const columnsTow = [
        {
            title: '序号',
            dataIndex: 'index',
            width: 100,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => {
                return <span>{index + 1}</span>
            }
        },
        {
            title: '操作部门',
            width: 150,
            dataIndex: 'typeName',
        },
        {
            title: '操作人',
            width: 150,
            dataIndex: 'name',
        },
        {
            title: '操作时间',
            width: 150,
            dataIndex: 'level',
        },
        {
            title: '问题单状态',
            width: 150,
            dataIndex: 'specs',
        },
        {
            title: '备注',
            dataIndex: 'unbuckleLength',
            width: 120,
        },
    ]
    const [visible, setVisible] = useState<boolean>(false);//添加弹框显示
    const [problemVisible, setProblemVisible] = useState<boolean>(false);//提交问题弹框显示
    // 弹框取消
    const onCancel = () => {
        setVisible(false)
    }
    // 螺栓信息添加
    const onSubmit = () => {

    }
    return (
        <div>
            <Page
                path={`/tower-science/boltRecord/basicHeight/${match.params.id}`}
                columns={columns}
                extraOperation={
                    <div>
                        <Button type="primary" ghost>模板下载</Button>
                        <Button type="primary" ghost onClick={() => { }} style={{ marginLeft: 10, }}>编辑/锁定</Button>
                        <Button type="primary" ghost onClick={() => { }} style={{ marginLeft: 10, }}>导入</Button>
                        <Button type="primary" ghost onClick={() => { setVisible(true) }} style={{ marginLeft: 10, }}>添加</Button>
                        <Button type="primary" ghost onClick={() => { history.go(-1) }} style={{ marginLeft: 10, }}>返回上一级</Button>
                    </div>
                }
                headTabs={[]}
                searchFormItems={[]}
            />
            {/* 螺栓添加 */}
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
                            <div className="title">螺栓类型*</div>
                            <div className="val">
                                <Select
                                    className='input'
                                    style={{ width: '100%' }}
                                    // mode="multiple"
                                    maxLength={3}
                                    // value={towerTagNo}
                                    onChange={(value) => {
                                    }}
                                >
                                    {/* {
                                        towerTagList.map((item: any, index: any) => {
                                            return <Select.Option value={item.id} key={index}>{item.productNumber}</Select.Option>
                                        })
                                    } */}

                                    <Select.Option value={155} key={155}>螺栓类型1</Select.Option>
                                    <Select.Option value={152} key={152}>螺栓类型2</Select.Option>
                                    <Select.Option value={154} key={154}>螺栓类型3</Select.Option>
                                </Select>
                            </div>
                        </div>
                        <div className="td">
                            <div className="title">名称*</div>
                            <div className="val">
                                <Input
                                    className="input"
                                    placeholder="请输入"
                                    bordered={false}
                                    maxLength={10}
                                    // value={callHeight}
                                    onChange={(e) => {
                                        // setCallHeight(e.target.value.replace(/\D/g, ''))
                                    }}
                                ></Input>
                            </div>
                        </div>
                    </div>
                    <div className="tr">
                        <div className="td">
                            <div className="title">规格*</div>
                            <div className="val">
                                <Input
                                    className="input"
                                    placeholder="请输入"
                                    bordered={false}
                                    maxLength={20}
                                    // value={callHeight}
                                    onChange={(e) => {
                                        // setCallHeight(e.target.value.replace(/\D/g, ''))
                                    }}
                                ></Input>
                            </div>
                        </div>
                        <div className="td">
                            <div className="title">无扣长</div>
                            <div className="val">
                                <Input
                                    className="input"
                                    placeholder="请输入"
                                    bordered={false}
                                    maxLength={3}
                                    // value={callHeight}
                                    onChange={(e) => {
                                        // setCallHeight(e.target.value.replace(/\D/g, ''))
                                    }}
                                ></Input>
                            </div>
                        </div>
                    </div>
                    <div className="tr">
                        <div className="td">
                            <div className="title">等级*</div>
                            <div className="val">
                                <Input
                                    className="input"
                                    placeholder="请输入"
                                    bordered={false}
                                    maxLength={20}
                                    // value={callHeight}
                                    onChange={(e) => {
                                        // setCallHeight(e.target.value.replace(/\D/g, ''))
                                    }}
                                ></Input>
                            </div>
                        </div>
                        <div className="td">
                            <div className="title">单重*</div>
                            <div className="val">
                                <Input
                                    className="input"
                                    placeholder="请输入"
                                    bordered={false}
                                    maxLength={4}
                                    // value={callHeight}
                                    onChange={(e) => {
                                        // setCallHeight(e.target.value.replace(/\D/g, ''))
                                    }}
                                ></Input>
                            </div>
                        </div>
                    </div>
                    <div className="tr">
                        <div className="td">
                            <div className="title">小计*</div>
                            <div className="val">
                                <Input
                                    className="input"
                                    placeholder="请输入"
                                    bordered={false}
                                    maxLength={4}
                                    // value={callHeight}
                                    onChange={(e) => {
                                        // setCallHeight(e.target.value.replace(/\D/g, ''))
                                    }}
                                ></Input>
                            </div>
                        </div>
                        <div className="td">
                            <div className="title">合计*</div>
                            <div className="val">
                                <Input
                                    className="input"
                                    placeholder="请输入"
                                    bordered={false}
                                    maxLength={4}
                                    // value={callHeight}
                                    onChange={(e) => {
                                        // setCallHeight(e.target.value.replace(/\D/g, ''))
                                    }}
                                ></Input>
                            </div>
                        </div>
                    </div>
                    <div className="tr">
                        <div className="td">
                            <div className="title">总重(kg)*</div>
                            <div className="val">
                                <Input
                                    className="input"
                                    placeholder="自动计算"
                                    bordered={false}
                                    disabled
                                ></Input>
                            </div>
                        </div>
                        <div className="td">
                            <div className="title">备注*</div>
                            <div className="val">
                                <Input
                                    className="input"
                                    placeholder="请输入"
                                    bordered={false}
                                    maxLength={100}
                                    // value={callHeight}
                                    onChange={(e) => {
                                        // setCallHeight(e.target.value.replace(/\D/g, ''))
                                    }}
                                ></Input>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
            {/* 提交问题 */}
            <Modal
                className='Modal_hugao'
                visible={problemVisible}
                width="60%"
                title="提交问题"
                onCancel={() => { onCancel(); }}
                onOk={() => onSubmit()}
                okText="提交问题"
                cancelText="关闭"
            >
                <div className='title_ON'>
                    问题信息
                </div>
                <div className="add_HuGao">
                    <div className="tr">
                        <div className="td">
                            <div className="title">问题字段*</div>
                            <div className="val">
                                <Input
                                    className="input"
                                    placeholder="请输入"
                                    bordered={false}
                                    maxLength={20}
                                    // value={callHeight}
                                    onChange={(e) => {
                                        // setCallHeight(e.target.value.replace(/\D/g, ''))
                                    }}
                                ></Input>
                            </div>
                        </div>
                        <div className="td">
                            <div className="title">原字段信息</div>
                            <div className="val">
                                <Input
                                    className="input"
                                    placeholder="请输入"
                                    bordered={false}
                                    maxLength={3}
                                    // value={callHeight}
                                    onChange={(e) => {
                                        // setCallHeight(e.target.value.replace(/\D/g, ''))
                                    }}
                                ></Input>
                            </div>
                        </div>
                    </div>
                    <div className="tr">
                        <div className="td">
                            <div className="title">备注</div>
                            <div className="val">
                                <Input
                                    className="input"
                                    placeholder="请输入"
                                    bordered={false}
                                    maxLength={10}
                                    // value={callHeight}
                                    onChange={(e) => {
                                        // setCallHeight(e.target.value.replace(/\D/g, ''))
                                    }}
                                ></Input>
                            </div>
                        </div>
                        <div className="td">
                            <div className="title">校对后信息*</div>
                            <div className="val">
                                <Input
                                    className="input"
                                    placeholder="请输入"
                                    bordered={false}
                                    maxLength={10}
                                    // value={callHeight}
                                    onChange={(e) => {
                                        // setCallHeight(e.target.value.replace(/\D/g, ''))
                                    }}
                                ></Input>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='title_ON'>
                    操作信息
                </div>
                <Table
                    scroll={{ x: true }}
                    className='public_table'
                    columns={columnsTow}
                    // dataSource={columnsData}
                    pagination={false}
                    size='small'
                >

                </Table>
            </Modal>
        </div>
    )
}