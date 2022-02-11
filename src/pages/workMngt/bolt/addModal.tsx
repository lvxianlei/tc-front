import { Modal, Input, Select, Row, Col, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import RequestUtil from '../../../utils/RequestUtil';
import './bolt.less';

export default function BoltDetailAdd(props: { cancelModal: (refresh?: boolean) => void; id: string | null, item: any }) {
    const [contentObj, setContentObj] = useState<any>({})
    const params = useParams<{ id: string, boltId: string }>();
    /**
     * 螺栓信息添加
     */
    const onSubmit = async () => {
        if (!contentObj.type) {
            message.error('请选择类型')
            return
        }
        if (!contentObj.name) {
            message.error('请输入名称')
            return
        }
        if (!contentObj.specs) {
            message.error('请输入规格')
            return
        }
        if (!contentObj.level) {
            message.error('请输入等级')
            return
        }
        if (!contentObj.singleWeight) {
            message.error('请输入单重')
            return
        }
        if (!contentObj.subtotal) {
            message.error('请输入小计')
            return
        }
        if (!contentObj.total) {
            message.error('请输入合计')
            return
        }
        if (!contentObj.totalWeight) {
            message.error('请输入总重')
            return
        }
        delete contentObj.greenColumn
        delete contentObj.redColumn
        delete contentObj.typeName
        delete contentObj.yellowColumn
        delete contentObj.id
        if (props.id) {
            await RequestUtil.put('/tower-science/boltRecord', {
                ...contentObj,
                id: props.id,
                basicHeightId: params.id,
                productCategoryId: params.boltId,
            })
        } else {
            await RequestUtil.post('/tower-science/boltRecord', {
                ...contentObj,
                basicHeightId: params.id,
                productCategoryId: params.boltId,
            })
        }
        message.success('操作成功')
        props.cancelModal(true)
    }
    useEffect(() => {
        setContentObj(props.item)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    /**
     * 
     * @param value 对象值
     * @param key 对象key属性
     */
    const changecontentObj = (value: string, key: string) => {
        contentObj[key] = value;
        setContentObj({ ...contentObj })
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
                <div className="public_page bolt_add_modal">
                    <div className='public_table_item' style={{ paddingTop: 0 }}>
                        <h3>螺栓信息</h3>
                        <Row className='search_content'>
                            <Col
                                xxl={12}
                                xl={12}
                                md={12}
                                className='search_item'
                            >
                                <span className='tip'>类型*：</span>
                                <Select
                                    className='input'
                                    value={contentObj.type ? contentObj.type : '请选择'}
                                    onChange={(value) => {
                                        changecontentObj(value, 'type')
                                    }}
                                >
                                    <Select.Option value={'1'}>普通</Select.Option>
                                    <Select.Option value={'2'}>防盗</Select.Option>
                                </Select>
                            </Col>
                            <Col
                                xxl={12}
                                xl={12}
                                md={12}
                                className='search_item'
                            >
                                <span className='tip'>名称*：</span>
                                <Input
                                    placeholder='请输入'
                                    className='input'
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
                                <span className='tip'>规格*：</span>
                                <Input
                                    placeholder='请输入'
                                    className='input'
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
                                <span className='tip'>无扣长：</span>
                                <Input
                                    className='input'
                                    placeholder='请输入'
                                    value={contentObj.unbuckleLength}
                                    maxLength={20}
                                    onChange={(ev) => {
                                        changecontentObj(ev.target.value.trim(), 'unbuckleLength')
                                    }}
                                />
                            </Col>
                            <Col
                                xxl={12}
                                xl={12}
                                md={12}
                                className='search_item'
                            >
                                <span className='tip'>等级*：</span>
                                <Input
                                    placeholder='请输入'
                                    className='input'
                                    value={contentObj.level}
                                    maxLength={20}
                                    onChange={(ev) => {
                                        changecontentObj(ev.target.value.trim(), 'level')
                                    }}
                                />
                            </Col>
                            <Col
                                xxl={12}
                                xl={12}
                                md={12}
                                className='search_item'
                            >
                                <span className='tip'>单重*：</span>
                                <Input
                                    placeholder='请输入'
                                    className='input'
                                    value={contentObj.singleWeight}
                                    maxLength={20}
                                    onChange={(ev) => {
                                        changecontentObj(ev.target.value.trim(), 'singleWeight')
                                    }}
                                />
                            </Col>
                            <Col
                                xxl={12}
                                xl={12}
                                md={12}
                                className='search_item'
                            >
                                <span className='tip'>小计*：</span>
                                <Input
                                    placeholder='请输入'
                                    className='input'
                                    value={contentObj.subtotal}
                                    maxLength={20}
                                    onChange={(ev) => {
                                        changecontentObj(ev.target.value.trim(), 'subtotal')
                                    }}
                                />
                            </Col>
                            <Col
                                xxl={12}
                                xl={12}
                                md={12}
                                className='search_item'
                            >
                                <span className='tip'>合计*：</span>
                                <Input
                                    className='input'
                                    placeholder='请输入'
                                    value={contentObj.total}
                                    maxLength={20}
                                    onChange={(ev) => {
                                        changecontentObj(ev.target.value.trim(), 'total')
                                    }}
                                />
                            </Col>
                            <Col
                                xxl={12}
                                xl={12}
                                md={12}
                                className='search_item'
                            >
                                <span className='tip'>总重（kg）*：</span>
                                <Input
                                    className='input'
                                    placeholder='请输入'
                                    value={contentObj.totalWeight}
                                    maxLength={20}
                                    onChange={(ev) => {
                                        changecontentObj(ev.target.value.trim(), 'totalWeight')
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
                                    className='input'
                                    placeholder='请输入'
                                    value={contentObj.assessUser}
                                    maxLength={20}
                                    onChange={(ev) => {
                                        changecontentObj(ev.target.value.trim(), 'assessUser')
                                    }}
                                />
                            </Col>
                        </Row>
                    </div>
                </div>
            </Modal>
        </div>
    )
}