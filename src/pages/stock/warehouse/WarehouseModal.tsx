/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Col, Row, Select, Modal, Input, Button, Table, TableColumnProps, } from 'antd';
import { RouteProps } from '../public';
import RequestUtil from "../../../utils/RequestUtil"
import './WarehouseModal.less';
import AuthUtil from '../../../utils/AuthUtil';
const { Option } = Select;

interface Props extends RouteProps {
    isModal: boolean,
    cancelModal: Function,
    id: string | null,
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
    });//基本信息
    let [personInfo, setPersonInfo] = useState<any>({
        reservoirName: '',//库区
        locatorName: '',//库位
    });//负责人信息
    let [libraryList, setLibraryList] = useState<any[]>([{}]);//库位库区
    let [department, setDepartment] = useState<any[]>([{}]);//库位库区
    let [keeperList, setKeeperList] = useState([{
        userId: '',
        departmentId: '',
    }, {
        userId: '',
        departmentId: '',
    }]);//保管员信息
    const columns: TableColumnProps<object>[] = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (text, item, index) => {
                return <span>{index + 1}</span>
            }
        },
        {
            key: 'warehouseName',
            title: '库区',
            dataIndex: 'warehouseName',
        },
        {
            key: 'reservoirName',
            title: '库位',
            dataIndex: 'reservoirName'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            render: (text, item, index) => {
                return (
                    <span
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
    useEffect(() => {
        getDepartment()
    }, [])
    const getDepartment = async () => {
        console.log('00000000000000000')
        const data: any = await RequestUtil.get(`/sinzetech-user/department/tree`, {
            tenantId: AuthUtil.getTenantId()
        })
        setDepartment(data)
    }
    // 基本信息改变
    const baseInfoChange = (ev: any, type: string, key: string,) => {
        if (type === 'input') {
            baseInfo[key] = ev.target.value;
        } else if (type === 'select') {
            baseInfo[key] = ev;
        }
        baseInfo = { ...baseInfo }
        setBaseInfo(baseInfo)
    }
    // 保存
    const submit = async () => {
        const result: any = await RequestUtil.get(`/tower-storage/warehouse`, {
            ...baseInfo,
            item: libraryList,
            staffs: keeperList,
            person: personInfo,
        })
        props.cancelModal()
    }
    return (
        <div>
            <Modal
                className='WarehouseModal'
                title={"创建"}
                visible={props.isModal}
                onOk={() => {
                    submit()
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
                            md={8}
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
                            md={8}
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
                            md={8}
                            className='search_item'
                        >
                            <span className='tip'>*分类：</span>
                            <Select
                                className='input'
                                // value={this.state.entryStatus}
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
                            md={8}
                            className='search_item'
                        >
                            <span className='tip'>*车间：</span>
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
                        </Col>
                        <Col
                            md={8}
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
                                {
                                    department.map((item, index) => {
                                        return (
                                            <Option value={item.id} key={index}>{item.title}</Option>
                                        )
                                    })
                                }
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
                                                        userId: '',
                                                        departmentId: '',
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