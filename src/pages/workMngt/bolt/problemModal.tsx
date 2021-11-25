import { Modal, Input, Row, Col, message, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import RequestUtil from '../../../utils/RequestUtil';
import './BoltDetailList.less';

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
    const [columnsData, setColumnsData] = useState<any[]>([])
    const [contentObj, setContentObj] = useState<any>({})
    useEffect(() => {
        if (props.id) {
            getDetail()
        }
    }, [props.id])
    /**
     * 获取详情
     */
    const getDetail = () => {
        setColumnsData([])
    }
    /**
     * 螺栓信息添加
     */
    const onSubmit = async () => {
        if (props.id) {
            await RequestUtil.put('/tower-science/', {
                ...contentObj,
            })
        } else {
            await RequestUtil.put('/tower-science/', {
                ...contentObj,
                id: props.id,
            })
        }
        message.success('操作成功')
        props.cancelModal(true)
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
                title="添加"
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
                                    placeholder='请输入'
                                    value={contentObj.name}
                                    maxLength={20}
                                    onChange={(ev) => {
                                        changecontentObj(ev.target.value.trim(), 'name')
                                    }}
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
                                    value={contentObj.name}
                                    maxLength={20}
                                    onChange={(ev) => {
                                        changecontentObj(ev.target.value.trim(), 'name')
                                    }}
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
                                    value={contentObj.specs}
                                    maxLength={20}
                                    onChange={(ev) => {
                                        changecontentObj(ev.target.value.trim(), 'specs')
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
                                    value={contentObj.unbuckleLength}
                                    maxLength={20}
                                    onChange={(ev) => {
                                        changecontentObj(ev.target.value.trim(), 'unbuckleLength')
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