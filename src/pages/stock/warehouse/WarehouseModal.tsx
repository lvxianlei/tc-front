/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { Col, Row, Select, Modal, Input, Button, Table, TableColumnProps, } from 'antd';
import { RouteProps } from '../public';
import './WarehouseModal.less';
const { Option } = Select;

interface Props extends RouteProps {
    isModal: boolean,
    cancelModal: Function,
}

// interface BaseInfo {
//     warehouseNo: string,//仓库编号
//     name: string,//仓库名称
//     warehouseCategoryId: string,//仓库分类id
//     shopId: string,//车间id
// }

const WarehouseModal = (props: Props) => {
    // const history = useHistory()
    let [columnsData, setColumnsData] = useState<any[]>([{}]);
    let [baseInfo, setBaseInfo] = useState<any>({
        warehouseNo: '',//仓库编号
        name: '',//仓库名称
        warehouseCategoryId: '',//仓库分类id
        shopId: '',//车间id
    });
    let [keeperList, setKeeperList] = useState([{
        bumen: '',
        renyuan: '',
    }, {
        bumen: '',
        renyuan: '',
    }]);
    const columns: TableColumnProps<object>[] = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
        },
        {
            key: 'projectName',
            title: '库区',
            dataIndex: 'projectName',
        },
        {
            key: 'projectNumber',
            title: '库位',
            dataIndex: 'projectNumber'
        },
        {
            key: 'projectNumber',
            title: '操作',
            dataIndex: 'projectNumber',
            render: (text, item, index) => {
                return (
                    <span
                        style={{ color: '#FF8C00', cursor: 'pointer' }}
                        onClick={() => {
                            columnsData.splice(index, 1)
                            columnsData = [...columnsData]
                            setColumnsData(columnsData)
                        }}
                    >删除</span>
                )
            }
        },
    ]
    // 基本信息改变
    const baseInfoChange = (ev: any, type: string, key: string,) => {
        if (type === 'input') {
            baseInfo[key] = ev.target.value;
            baseInfo = { ...baseInfo }
            setBaseInfo(baseInfo)
        } else if (type === 'select') {

        }
    }
    return (
        <div>
            <Modal
                className='WarehouseModal'
                title={"创建"}
                visible={props.isModal}
                onOk={() => {
                    // props.setIsModal(true)
                }}
                onCancel={() => {
                    props.cancelModal()
                }}
                okText='保存'
                cancelText='关闭'
            >
                <div className='content public_page'>
                    <h3>基本信息</h3>
                    <Row className='search_content'>
                        <Col
                            xl={8}
                            className='search_item'
                        >
                            <span className='tip'>*仓库编号：</span>
                            <Input
                                className='input'
                                placeholder='请输入'
                                value={baseInfo.warehouseNo}
                                onChange={(ev) => {
                                    baseInfoChange(ev, 'input', 'warehouseNo')
                                }}
                            />
                        </Col>
                        <Col
                            xl={8}
                            className='search_item'
                        >
                            <span className='tip'>*仓库名称：</span>
                            <Input
                                className='input'
                                placeholder='请输入'
                                value={baseInfo.name}
                                onChange={(ev) => {
                                    baseInfoChange(ev, 'input', 'name')
                                }}
                            />
                        </Col>
                        <Col
                            xl={8}
                            className='search_item'
                        >
                            <span className='tip'>*分类：</span>
                            <Select
                                className='input'
                                // value={this.state.entryStatus}
                                style={{ width: 120 }}
                                onChange={(value) => {
                                    baseInfoChange(value, 'input', 'name')
                                }}
                            >
                                <Option value={''}>全部</Option>
                                <Option value={0}>未生成</Option>
                                <Option value={1}>已生成</Option>
                            </Select>
                        </Col>
                        <Col
                            xl={8}
                            className='search_item'
                        >
                            <span className='tip'>*发票号：</span>
                            <Input
                                className='input'
                                placeholder='请输入'
                            />
                        </Col>
                        <Col
                            xl={8}
                            className='search_item'
                        >
                            <span className='tip'>负责人：</span>
                            <Select
                                className='input'
                                // value={this.state.entryStatus}
                                style={{ width: 120 }}
                                onChange={(value) => {
                                }}
                            >
                                <Option value={''}>全部</Option>
                                <Option value={0}>未生成</Option>
                                <Option value={1}>已生成</Option>
                            </Select>
                            <Select
                                className='input'
                                // value={this.state.entryStatus}
                                style={{ width: 120, marginLeft: 10 }}
                                onChange={(value) => {
                                }}
                            >
                                <Option value={''}>全部</Option>
                                <Option value={0}>未生成</Option>
                                <Option value={1}>已生成</Option>
                            </Select>
                        </Col>
                    </Row>
                </div>
                <div className='content keeper'>
                    <h3>保管员信息</h3>
                    {
                        keeperList.map((item, index) => {
                            return (
                                <div className='keeper_item' key={Math.random()}>
                                    <span className='tip'>保管员</span>
                                    <Select
                                        className='input'
                                        // value={this.state.entryStatus}
                                        style={{ width: 120 }}
                                        onChange={(value) => {
                                        }}
                                    >
                                        <Option value={''}>全部</Option>
                                        <Option value={0}>未生成</Option>
                                        <Option value={1}>已生成</Option>
                                    </Select>
                                    <Select
                                        className='input'
                                        // value={this.state.entryStatus}
                                        style={{ width: 120 }}
                                        onChange={(value) => {
                                        }}
                                    >
                                        <Option value={''}>全部</Option>
                                        <Option value={0}>未生成</Option>
                                        <Option value={1}>已生成</Option>
                                    </Select>
                                    {
                                        keeperList.length - 1 === index ?
                                            <Button
                                                className='button'
                                                onClick={() => {
                                                    keeperList = [...keeperList, {
                                                        bumen: '',
                                                        renyuan: '',
                                                    }]
                                                    setKeeperList(keeperList)
                                                }}
                                            >新增</Button> :
                                            <Button
                                                className='button'
                                                onClick={() => {
                                                    keeperList.splice(index, 1)
                                                    keeperList = [...keeperList]
                                                    setKeeperList(keeperList)
                                                }}
                                            >删除</Button>
                                    }
                                </div>
                            )
                        })
                    }
                </div>
                <div className='content '>
                    <h3>
                        库区库位信息
                        <Button
                            className='button'
                            onClick={() => {
                                columnsData = [...columnsData, {}]
                                setColumnsData(columnsData)
                            }}
                        >添加行</Button>
                    </h3>
                    <Table
                        className='public_table'
                        scroll={{ x: true }}
                        columns={columns}
                        dataSource={columnsData}
                        pagination={false}
                        size='small'
                    />
                </div>
            </Modal>
        </div>
    )
}

export default WarehouseModal;