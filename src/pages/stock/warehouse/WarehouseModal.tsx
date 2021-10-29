/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Col, Row, Select, Modal, Input, Button, Table, TableColumnProps, message, } from 'antd';
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
//     warehouseNumber: string,//仓库编号
//     name: string,//仓库名称
//     warehouseCategoryId: string,//仓库分类id
//     shopId: string,//车间id
// }

const WarehouseModal = (props: Props) => {
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
            key: 'reservoirName',
            title: '库区',
            dataIndex: 'reservoirName',
            render: (text, item: any, index) => {
                return (
                    <Input
                        value={item.reservoirName}
                        onChange={(ev) => {
                            changeInputList(ev, item, 'reservoirName', index)
                        }}
                    />
                )
            }
        },
        {
            key: 'locatorName',
            title: '库位',
            dataIndex: 'locatorName',
            render: (text, item: any, index) => {
                return (
                    <Input
                        value={item.locatorName}
                        onChange={(ev) => {
                            changeInputList(ev, item, 'locatorName', index)
                        }}
                    />
                )
            }
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            render: (text, item, index) => {
                return (
                    <span
                        hidden={columnsData.length === 1}
                        className='yello'
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
    let [columnsData, setColumnsData] = useState<any[]>([{
        reservoirName: '',
        locatorName: '',
        key: '1'
    }]);
    let [baseInfo, setBaseInfo] = useState<any>({
        warehouseNumber: '',//仓库编号
        name: '',//仓库名称
        warehouseCategoryId: '',//仓库分类id
        shopId: '',//车间id
    });//基本信息
    let [department, setDepartment] = useState<any[]>([{}]);//部门列表
    let [departmentId, setDepartmentId] = useState<any>(null);//部门
    let [userList, setUserList] = useState<any[]>([{}]);//用户列表
    let [userId, setUserId] = useState<any>(null);//部门
    let [staffs, setStaffs] = useState([
        {
            departmentId: '',//部门
            userId: '',//人员
        }
    ]);//保管员信息
    useEffect(() => {
        getDepartment()
    }, [])
    // 获取部门信息
    const getDepartment = async () => {
        const data: any = await RequestUtil.get(`/sinzetech-user/department/tree`, {
            tenantId: AuthUtil.getTenantId()
        })
        setDepartment(data)
    }
    // 获取部门下用户信息
    const getUserList = async () => {
        const data: any = await RequestUtil.get(`/sinzetech-user/user`, {
            departmentId,
        })
        setUserList(data.records)
    }
    // 库区库位信息监听
    const changeInputList = (ev: React.ChangeEvent<HTMLInputElement>, item: any, key: string, index: number) => {
        console.log(columnsData, 'columnsDatacolumnsData')
        columnsData[index][key] = ev.target.value;
        columnsData = [...columnsData]
        setColumnsData(columnsData)
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
        if (!baseInfo.warehouseNumber) {
            message.error('请输入仓库编号')
            return;
        }
        if (!baseInfo.name) {
            message.error('请输入仓库名称')
            return;
        }
        if (!baseInfo.warehouseCategoryId) {
            message.error('请选择分类')
            return;
        }
        if (!baseInfo.shopId) {
            message.error('请选择车间')
            return;
        }
        if (!userId) {
            message.error('请选择负责人')
            return;
        }
        if (staffs.some(item=>!item.userId)) {
            message.error('请完善保管员信息')
            return;
        }
        if (columnsData.some(item=>!item.reservoirName || !item.locatorName)) {
            message.error('请完善保管员信息')
            return;
        }
        if (props.id) {
            await RequestUtil.put(`/tower-storage/warehouse`, {
                id: props.id,
                ...baseInfo,
                warehouseDetail: columnsData,
                staffs,
                person: {
                    departmentId,
                    userId,
                },
            })
        } else {
            await RequestUtil.post(`/tower-storage/warehouse`, {
                ...baseInfo,
                warehouseDetail: columnsData,
                staffs,
                person: {
                    departmentId,
                    userId,
                },
            })
        }
        props.cancelModal()
    }
    return (
        <div>
            <Modal
                className='WarehouseModal'
                title={props.id ? "编辑" : "创建"}
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
                                value={baseInfo.warehouseNumber}
                                onChange={(ev) => {
                                    baseInfoChange(ev, 'input', 'warehouseNumber')
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
                                value={baseInfo.warehouseCategoryId}
                                onChange={(value) => {
                                    baseInfoChange(value, 'select', 'warehouseCategoryId')
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
                                value={baseInfo.shopId}
                                style={{ width: 120 }}
                                onChange={(value) => {
                                    baseInfoChange(value, 'select', 'shopId')
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
                            style={{ marginTop: 0 }}
                        >
                            <span className='tip'>负责人*：</span>
                            <Select
                                className='input'
                                value={departmentId}
                                style={{ width: 120 }}
                                onChange={(value) => {
                                    setDepartmentId(value)
                                    getUserList()
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
                                value={userId}
                                style={{ width: 120, marginLeft: 10 }}
                                onChange={(value) => {
                                    setUserId(value)
                                }}
                            >
                                {
                                    userList.map((item, index) => {
                                        return (
                                            <Option value={item.tenantId} key={index}>{item.name}</Option>
                                        )
                                    })
                                }
                            </Select>
                        </Col>
                    </Row>
                </div>
                <div className='content keeper'>
                    <h3>保管员信息</h3>
                    {
                        staffs.map((item, index) => {
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
                                        style={{ width: 120 }}
                                        onChange={(value) => {
                                            
                                        }}
                                    >
                                        {
                                            userList.map((item, index) => {
                                                return (
                                                    <Option value={item.tenantId} key={index}>{item.name}</Option>
                                                )
                                            })
                                        }
                                    </Select>
                                    {
                                        staffs.length - 1 === index ?
                                            <Button
                                                className='button'
                                                onClick={() => {
                                                    staffs = [...staffs, {
                                                        departmentId: '',//部门
                                                        userId: '',//人员
                                                    }]
                                                    setStaffs(staffs)
                                                }}
                                            >新增</Button> :
                                            <Button
                                                className='button'
                                                onClick={() => {
                                                    staffs.splice(index, 1)
                                                    staffs = [...staffs]
                                                    setStaffs(staffs)
                                                }}
                                            >删除</Button>
                                    }
                                </div>
                            )
                        })
                    }
                </div>
                <div className='content public_page'>
                    <h3>
                        库区库位信息
                        <Button
                            className='button'
                            onClick={() => {
                                columnsData = [...columnsData, {
                                    reservoirName: '',
                                    locatorName: '',
                                }]
                                console.log(columnsData, 'columnsDatacolumnsData')
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