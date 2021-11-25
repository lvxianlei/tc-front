import { Modal, Input, Select, Row, Col, message } from 'antd';
import React, { useState } from 'react';
import RequestUtil from '../../../utils/RequestUtil';
import './BoltDetailList.less';

export default function BoltDetailAdd(props: { cancelModal: (refresh?: boolean) => void; id: string | null }) {
    const [contentObj, setContentObj] = useState<any>({})
    /**
     * 螺栓信息添加
     */
    const onSubmit = async () => {
        if (props.id) {
            await RequestUtil.put('/tower-science/loftingTemplate/delete', {
                ...contentObj,
            })
        } else {
            await RequestUtil.put('/tower-science/loftingTemplate/delete', {
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
                                style={{ width: 120 }}
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
            </Modal>
        </div>
    )
}