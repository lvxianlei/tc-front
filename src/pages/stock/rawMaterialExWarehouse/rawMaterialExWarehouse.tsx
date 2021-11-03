import React, { useState, useEffect } from 'react';
import { Space, Button, TableColumnProps, Modal, Input, DatePicker, Select, message, Table } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import { FixedType } from 'rc-table/lib/interface';
import RequestUtil from '../../../utils/RequestUtil';
import AuthUtil from '../../../utils/AuthUtil';
import '../StockPublicStyle.less';
const { RangePicker } = DatePicker;

export default function RawMaterialStock(): React.ReactNode {
    const history = useHistory()
    const [current, setCurrent] = useState(1);
    const [total, setTotal] = useState(0);
    const [pageSize, setPageSize] = useState<number>(10);
    const [dateValue, setDateValue] = useState<any>([]);//时间
    const [dateString, setDateString] = useState<any>([]);//时间字符串格式
    const [keyword, setKeyword] = useState<any>('');//关键字搜索
    const [status, setStatus] = useState('');//状态
    const [departmentId, setDepartmentId] = useState('');//部门
    const [applyStaffId, setPersonnelId] = useState('');//人员
    const [Listdata, setListdata] = useState<any[]>([]);//列表数据
    const [departmentList, setDepartmentList] = useState<any[]>([]);//部门数据
    const [userList, setuserList] = useState<any[]>([]);//申请人数据数据
    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            width: 50,
            render: (text: any, item: any, index: any) => {
                console.log(item, 'item')
                return <span>{index + 1}</span>
            }
        },
        {
            title: '领料编号',
            dataIndex: 'pickingNumber',
            width: 120,
        }, {
            title: '生产批次',
            dataIndex: 'productionBatch',
            width: 120,
        }, {
            title: '状态',
            dataIndex: 'outStockStatus',
            width: 120,
            render: (text: any, item: any, index: any) => {
                return <span>{text == 0 ? '待完成' : '已完成'}</span>
            }
        }, {
            title: '最新状态变更时间',
            dataIndex: 'updateTime',
            width: 120,
        }, {
            title: '申请人',
            dataIndex: 'applyStaffName',
            width: 120,
        },
        {
            title: '操作',
            dataIndex: 'key',
            width: 40,
            fixed: 'right' as FixedType,
            render: (_: undefined, record: any): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Link to={`/stock/rawMaterialExWarehouse/detail/${record.id}`}>明细</Link>
                </Space>
            )
        }
    ]
    //获取列表数据
    const loadData = async () => {
        console.log('请求数据')
        const data: any = await RequestUtil.get(`/tower-storage/outStock`, {
            current,
            size: pageSize,
            applyStaffId,
            departmentId,
            status,
            updateTimeStart: dateString[0] ? dateString[0] + ' 00:00:00' : '',
            updateTimeEnd: dateString[1] ? dateString[1] + ' 23:59:59' : '',
            selectName: keyword,
        });
        setListdata(data.records);
        setTotal(data.total);
    }
    //获取部门数据
    const getDepartment = async () => {
        const data: any = await RequestUtil.get(`/sinzetech-user/department`, {
            tenantId: AuthUtil.getTenantId(),
        });
        setDepartmentList(data)
    }
    //获取部门部门中的人
    const getUser = async (department: any) => {
        const data: any = await RequestUtil.get(`/sinzetech-user/user`, {
            departmentId: department,
        });
        setuserList(data.records)
    }
    // 重置
    const reset = () => {
        setCurrent(1);
        setPageSize(10);
        setStatus('');
        setDateValue([]);
        setDateString([]);
        setKeyword('');
        setDepartmentId('');
        setPersonnelId('');
        setuserList([]);
    }
    useEffect(() => {
        getDepartment()
    }, [])
    //进入页面刷新
    useEffect(() => {
        loadData()
    }, [current, pageSize, applyStaffId, status, dateString])
    return (
        <div id="RawMaterialStock">
            <div className="Search_public_Stock">
                <div className="search_item">
                    <span className="tip">最新状态变更时间：</span>
                    <div className='selectOrInput'>
                        <RangePicker
                            value={dateValue}
                            onChange={(date, dateString) => {
                                console.log(date, dateString)
                                setDateValue(date)
                                setDateString(dateString)
                            }}
                        ></RangePicker>
                    </div>
                </div>
                <div className="search_item">
                    <span className="tip">状态：</span>
                    <div className='selectOrInput'>
                        <Select
                            className="select"
                            style={{ width: "100px" }}
                            value={status ? status : '请选择'}
                            onChange={(val) => { setStatus(val) }}
                        >
                            <Select.Option
                                value="0"
                            >
                                待完成
                            </Select.Option>
                            <Select.Option
                                value="2"
                            >
                                已完成
                            </Select.Option>
                        </Select>
                    </div>
                </div>
                <div className="search_item">
                    <span className="tip">申请人：</span>
                    <div className='selectOrInput'>
                        <Select
                            className="select"
                            style={{ width: "100px" }}
                            value={departmentId ? departmentId : '请选择'}
                            onChange={(val) => { setDepartmentId(val); setPersonnelId(''); setuserList([]); getUser(departmentId) }}
                        >
                            {
                                departmentList.map((item, index) => {
                                    return (
                                        <Select.Option key={index} value={item.id}>{item.name}</Select.Option>
                                    )
                                })
                            }
                        </Select>-
                        <Select
                            className="select"
                            style={{ width: "100px" }}
                            value={applyStaffId ? applyStaffId : '请选择'}
                            onChange={(val) => { setPersonnelId(val) }}
                        >
                            {
                                userList.map((item, index) => {
                                    return (
                                        <Select.Option value={item.id} key={index}>{item.name}</Select.Option>
                                    )
                                })
                            }
                        </Select>
                    </div>
                </div>
                <div className="search_item">
                    <span className="tip">关键字：</span>
                    <div className='selectOrInput'>
                        <Input
                            placeholder="领料编号/生产批次"
                            value={keyword}
                            onChange={(e) => {
                                setKeyword(e.target.value)
                            }}
                            onPressEnter={() => {
                                loadData()
                            }}
                        >
                        </Input>
                    </div>
                </div>
                <div className="search_item">
                    <div className='search_Reset'>
                        <Button
                            className="btn"
                            type="primary"
                            onClick={() => { loadData() }}
                        >查询</Button>
                        <Button
                            className="btn"
                            type="primary"
                            ghost
                            onClick={reset}
                        >重置</Button>
                    </div>
                </div>
            </div>
            <div className="func_public_Stock">
                <Button
                    type="primary"
                    className='func_btn'
                    onClick={() => { }}
                >导出</Button>
            </div>
            <div className="page_public_Stock">
                <Table
                    columns={columns}
                    dataSource={Listdata}
                    size='small'
                    rowClassName={(item, index) => {
                        return index % 2 ? 'aaa' : ''
                    }}
                    scroll={
                        {
                            y: 400
                        }
                    }
                    pagination={{
                        size: 'small',
                        defaultPageSize: 5,
                        showQuickJumper: true,
                        current: current,
                        total: total,
                        pageSize: pageSize,
                        pageSizeOptions: ['10', '20', '50', '100'],
                        showSizeChanger: true,
                        onChange: (page, pageSize) => {
                            console.log(page, pageSize)
                            setCurrent(page);
                            setPageSize(Number(pageSize));
                        }
                    }}
                />
            </div>
        </div>
    )
}