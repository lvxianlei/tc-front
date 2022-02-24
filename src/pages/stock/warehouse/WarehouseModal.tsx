/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Col, Row, Select, Modal, Input, Button, Table, TableColumnProps, message, } from 'antd';
import RequestUtil from "../../../utils/RequestUtil"
import './WarehouseModal.less';
import AuthUtil from '../../../utils/AuthUtil';
import ApplicationContext from '../../../configuration/ApplicationContext';
import { Key } from 'rc-select/lib/interface/generator';
import { warehouseOptions } from '../../../configuration/DictionaryOptions';
// import { SelectValue } from 'antd/lib/select';
const { Option } = Select;

interface Props {
    isModal: boolean,
    cancelModal: Function,
    getColumnsData: Function,
    id: string | null,
}

// interface StaffsItem {
//     departmentId: SelectValue,
//     userId: SelectValue,
//     userList: any[],
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
            title: () => {
                return (
                    <div>库区<span style={{ color: 'red' }}>*</span></div>
                )
            },
            dataIndex: 'reservoirName',
            render: (text, item: any, index) => {
                return (
                    <Input
                        value={item.reservoirName}
                        maxLength={50}
                        onChange={(ev) => {
                            changeInputList(ev, item, 'reservoirName', index)
                        }}
                    />
                )
            }
        },
        {
            key: 'locatorName',
            title: () => {
                return (
                    <div>库位<span style={{ color: 'red' }}>*</span></div>
                )
            },
            dataIndex: 'locatorName',
            render: (text, item: any, index) => {
                return (
                    <Input
                        value={item.locatorName}
                        maxLength={50}
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
        locatorName: ''
    }]);//库区信息
    let [baseInfo, setBaseInfo] = useState<any>({
        warehouseNumber: '',//仓库编号
        name: '',//仓库名称
        warehouseCategoryId: '',//仓库分类id
        shopId: '',//车间id
    });//基本信息
    let [department, setDepartment] = useState<any[]>([]);//部门列表
    let [departmentId, setDepartmentId] = useState<any>(null);//负责人部门
    let [userList, setUserList] = useState<any[]>([]);//用户列表
    let [userId, setUserId] = useState<any>(null);//负责人id
    let [staffs, setStaffs] = useState<any[]>([
        {
            departmentId: '',//部门
            departmentName: '',
            userId: '',//人员
            userName: '',
            userList: [],
            id: null,
        }
    ]);//保管员信息
    useEffect(() => {
        getDepartment()
    }, [])
    // 如果有id，就获取详情
    useEffect(() => {
        if (props.id) {
            getDetail()
        }
    }, [])
    // 获取详情
    const getDetail = async () => {
        let data: any = await RequestUtil.get(`/tower-storage/warehouse/${props.id}`)
        baseInfo.name = data.name;
        baseInfo.warehouseNumber = data.warehouseNumber;
        baseInfo.warehouseCategoryId = data.warehouseCategoryId;
        baseInfo.shopId = data.shopId;
        setDepartmentId(data.person.departmentId)
        //回显需要拿到部门id获取用户数据
        getUserList(data.departmentId)
        setUserId(data.person.userId)
        setBaseInfo(baseInfo)
        let userStaffs = data.staffs.map((item: any) => {
            return {
                departmentId: item.departmentId,
                departmentName: item.departmentName,
                userId: item.userId,
                userName: item.userName,
                userList: [],
                id: item.id,
            }
        })
        setStaffs(userStaffs)
        setColumnsData(data.warehouseDetails)
    }
    // 获取部门信息
    const getDepartment = async () => {
        const data: any = await RequestUtil.get(`/tower-system/department`, {
            tenantId: AuthUtil.getTenantId()
        })
        setDepartment(data)
    }
    // 获取部门下用户信息
    const getUserList = async (departmentId: any, index: number | null = null) => {
        const data: any = await RequestUtil.get(`/tower-system/employee`, {
            departmentId,
        })
        if (index === null) {
            setUserList(data.records)
        } else {
            staffs[index].userList = data.records;
            staffs = [...staffs]
            setStaffs(staffs)
        }
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
        if (staffs.some(item => !item.userId)) {
            message.error('请完善保管员信息')
            return;
        }
        if (columnsData.some(item => !item.reservoirName || !item.locatorName)) {
            message.error('请完善库区库位信息')
            return;
        }
        if (props.id) {
            await RequestUtil.put(`/tower-storage/warehouse`, {
                id: props.id,
                ...baseInfo,
                warehouseDetails: columnsData,
                staffs: staffs.map((item) => { return { departmentId: item.departmentId, userId: item.userId } }),
                person: {
                    departmentId,
                    userId,
                },
            })
        } else {
            await RequestUtil.post(`/tower-storage/warehouse`, {
                ...baseInfo,
                warehouseDetails: columnsData,
                staffs: staffs.map((item) => { return { departmentId: item.departmentId, userId: item.userId } }),
                person: {
                    departmentId,
                    userId,
                },
            })
        }
        props.getColumnsData()
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
                            <span className='tip'>仓库编号<span style={{ color: 'red' }}>*</span>：</span>
                            <Input
                                className='input'
                                placeholder='请输入'
                                value={baseInfo.warehouseNumber}
                                maxLength={50}
                                onChange={(ev) => {
                                    baseInfoChange(ev, 'input', 'warehouseNumber')
                                }}
                            />
                        </Col>
                        <Col
                            md={8}
                            className='search_item'
                        >
                            <span className='tip'>仓库名称<span style={{ color: 'red' }}>*</span>：</span>
                            <Input
                                className='input'
                                placeholder='请输入'
                                value={baseInfo.name}
                                maxLength={50}
                                onChange={(ev) => {
                                    baseInfoChange(ev, 'input', 'name')
                                }}
                            />
                        </Col>
                        <Col
                            md={8}
                            className='search_item'
                        >
                            <span className='tip'>分类<span style={{ color: 'red' }}>*</span>：</span>
                            <Select
                                className='input'
                                value={baseInfo.warehouseCategoryId ? baseInfo.warehouseCategoryId : '请选择'}
                                onChange={(value) => {
                                    baseInfoChange(value, 'select', 'warehouseCategoryId')
                                }}
                            >
                                {
                                    warehouseOptions?.map((item: { id: string, name: string }) => ({
                                        value: item.id,
                                        label: item.name
                                    })).map((t: { value: Key; label: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: any) => {
                                        return (
                                            <Option value={t.value} key={i}>{t.label}</Option>
                                        )
                                    })
                                }
                            </Select>
                        </Col>
                        <Col
                            md={8}
                            className='search_item'
                        >
                            <span className='tip'>车间<span style={{ color: 'red' }}>*</span>：</span>
                            <Select
                                className='input'
                                value={baseInfo.shopId ? baseInfo.shopId : '请选择'}
                                style={{ width: 120 }}
                                onChange={(value) => {
                                    baseInfoChange(value, 'select', 'shopId')
                                }}
                            >
                                {
                                    department.map((item, index) => {
                                        return (
                                            <Option value={item.id} key={index}>{item.name}</Option>
                                        )
                                    })
                                }
                            </Select>
                        </Col>
                        <Col
                            md={16}
                            className='search_item'
                            style={{ marginTop: 0 }}
                        >
                            <span className='tip'>负责人<span style={{ color: 'red' }}>*</span>：</span>
                            <Select
                                className='input'
                                value={departmentId ? departmentId : '请选择'}
                                style={{ width: 260 }}
                                onChange={(value) => {
                                    setDepartmentId(value)
                                    setUserId(null)
                                    getUserList(value)
                                }}
                            >
                                {
                                    department.map((item, index) => {
                                        return (
                                            <Option value={item.id} key={index}>{item.name}</Option>
                                        )
                                    })
                                }
                            </Select>
                            <Select
                                className='input'
                                value={userId ? userId : '请选择'}
                                style={{ width: 120, marginLeft: 10 }}
                                onChange={(value) => {
                                    setUserId(value)
                                }}
                            >
                                {
                                    userList.map((item, index) => {
                                        return (
                                            <Option value={item.id} key={index}>{item.name}</Option>
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
                                    <span className='tip'>保管员<span style={{ color: 'red' }}>*</span></span>
                                    <Select
                                        className='input'
                                        value={item.departmentName ? item.departmentName : item.departmentId ? item.departmentId : '请选择'}
                                        style={{ width: 120 }}
                                        onChange={(value) => {
                                            staffs[index].departmentId = value;
                                            staffs[index].userId = '';
                                            staffs = [...staffs]
                                            setStaffs(staffs)
                                            getUserList(value, index)
                                        }}
                                    >
                                        {
                                            department.map((item, index) => {
                                                return (
                                                    <Option value={item.id} key={index}>{item.name}</Option>
                                                )
                                            })
                                        }
                                    </Select>
                                    <Select
                                        className='input'
                                        value={item.userName ? item.userName : item.userId ? item.userId : '请选择'}
                                        style={{ width: 120 }}
                                        onChange={(value) => {
                                            staffs[index].userId = value;
                                            staffs = [...staffs]
                                            setStaffs(staffs)
                                        }}
                                    >
                                        {
                                            item.userList.map((item: any, index: number) => {
                                                return (
                                                    <Option value={item.id} key={index}>{item.name}</Option>
                                                )
                                            })
                                        }
                                    </Select>
                                    {
                                        staffs.length - 1 === index && staffs.length < 10 && staffs.length !== 1 ?
                                            (
                                                <div>
                                                    <Button
                                                        className='button'
                                                        onClick={() => {
                                                            staffs.splice(index, 1)
                                                            staffs = [...staffs]
                                                            setStaffs(staffs)
                                                        }}
                                                    >删除</Button>
                                                    <Button
                                                        className='button'
                                                        onClick={() => {
                                                            staffs = [...staffs, {
                                                                departmentId: '',//部门
                                                                userId: '',//人员
                                                                id: null,
                                                                userList: [],
                                                            }]
                                                            setStaffs(staffs)
                                                        }}
                                                    >新增</Button>
                                                </div>
                                            ) :
                                            staffs.length === 1 ?
                                                <Button
                                                    className='button'
                                                    onClick={() => {
                                                        staffs = [...staffs, {
                                                            departmentId: '',//部门
                                                            userId: '',//人员
                                                            id: null,
                                                            userList: [],
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