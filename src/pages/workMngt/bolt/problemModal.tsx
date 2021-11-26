/* eslint-disable react-hooks/exhaustive-deps */
import { Modal, Input, Row, Col, message, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import RequestUtil from '../../../utils/RequestUtil';

export default function BoltDetailProblem(props: { cancelModal: (refresh?: boolean) => void; id: string | null }) {
    // 提交问题单表头
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
            title: '操作部门',
            width: 150,
            dataIndex: 'createDeptName',
        },
        {
            title: '操作人',
            width: 150,
            dataIndex: 'createUser',
        },
        {
            title: '操作时间',
            width: 150,
            dataIndex: 'createTime',
        },
        {
            title: '问题单状态',
            width: 150,
            dataIndex: 'status',
            render: ((text: any, item: any, index: any) => {
                return <span>
                    {
                        item.status === 1 ?
                            '待修改' :
                            item.status === 2 ?
                                '已修改' :
                                item.status === 3 ?
                                    '已拒绝' :
                                    item.status === 4 ?
                                        '已删除' : ''
                    }
                </span>
            })
        },
        {
            title: '备注',
            dataIndex: 'description',
            width: 120,
        },
    ]
    const [columnsData, setColumnsData] = useState<any[]>([])
    const [contentObj, setContentObj] = useState<any>({})
    useEffect(() => {
        if (props.id) {
            getDetail()
        }
    }, [])
    /**
     * 获取详情
     */
    const getDetail = async () => {
        let data: any = await RequestUtil.get('/tower-science/boltRecord/issueDetail', {
            keyId: props.id,
            problemField: '',
        })
        setColumnsData(data.issueRecordVOList)
        setContentObj(data)
    }
    /**
     * 螺栓信息添加
     */
    const onSubmit = async () => {
        if (!contentObj.newValue) {
            message.error('请填写校对后信息')
            return
        }
        if (props.id) {
            await RequestUtil.post('/tower-science/boltRecord/saveIssue', {
                ...contentObj,
            })
            message.success('操作成功')
            props.cancelModal(true)
        }
    }
    /**
     * 
     * @param value 对象值
     * @param key 对象key属性
     */
    const changecontentObj = (value: string, key: string) => {
        contentObj[key] = value
        setContentObj(contentObj)
    }
    return (
        <div>
            <Modal
                className='Modal_hugao'
                visible={true}
                width={1000}
                title="提交问题"
                onCancel={() => { props.cancelModal() }}
                onOk={() => onSubmit()}
                okText="确定"
                cancelText="关闭"
            >
                <div className="public_page">
                    <div className='public_table_item' style={{ paddingTop: 0 }}>
                        <h3>问题信息</h3>
                        <Row className='search_content'>
                            <Col
                                xxl={12}
                                xl={12}
                                md={12}
                                className='search_item'
                            >
                                <span className='tip'>问题字段：</span>
                                <Input
                                    placeholder='无扣长（mm）'
                                    maxLength={20}
                                    value={contentObj.problemFieldName}
                                    disabled
                                />
                            </Col>
                            <Col
                                xxl={12}
                                xl={12}
                                md={12}
                                className='search_item'
                            >
                                <span className='tip'>原字段信息：</span>
                                <Input
                                    placeholder='请输入'
                                    value={contentObj.currentValue}
                                    maxLength={20}
                                    disabled
                                />
                            </Col>
                            <Col
                                xxl={12}
                                xl={12}
                                md={12}
                                className='search_item'
                            >
                                <span className='tip'>备注：</span>
                                <Input
                                    placeholder='请输入'
                                    value={contentObj.description}
                                    maxLength={50}
                                    onChange={(ev) => {
                                        changecontentObj(ev.target.value.trim(), 'description')
                                    }}
                                />
                            </Col>
                            <Col
                                xxl={12}
                                xl={12}
                                md={12}
                                className='search_item'
                            >
                                <span className='tip'>校对后信息 *：</span>
                                <Input
                                    placeholder='请输入'
                                    value={contentObj.newValue}
                                    maxLength={20}
                                    onChange={(ev) => {
                                        changecontentObj(ev.target.value.trim(), 'newValue')
                                    }}
                                />
                            </Col>
                        </Row>
                    </div>
                    <div className="public_table_item">
                        <h3>操作信息</h3>
                        <Table
                            scroll={{ x: true }}
                            className='public_table'
                            columns={columns}
                            dataSource={columnsData}
                            pagination={false}
                            size='small'
                        />
                    </div>
                </div>
            </Modal>
        </div>
    )
}