import React, { useState, useEffect } from 'react';
import { Space, Button, TableColumnProps, Modal, Input, DatePicker, Select, message, Table } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import { FixedType } from 'rc-table/lib/interface';
import ConfirmableButton from '../../../components/ConfirmableButton';
import { Page } from '../../common';
import { IClient } from '../../IClient';
import RequestUtil from '../../../utils/RequestUtil';
import '../StockPublicStyle.less';
const { RangePicker } = DatePicker;

export default function RawMaterialStock(): React.ReactNode {
    const history = useHistory()
    const [current, setCurrent] = useState(1);
    const [total, setTotal] = useState(100);
    const [pageSize, setPageSize] = useState<number>(10);
    const [dateValue, setDateValue] = useState<any>([]);//时间
    const [dateString, setDateString] = useState<any>([]);//时间字符串格式
    const [keyword, setKeyword] = useState<any>('');//关键字搜索
    const [status, setStatus] = useState('');//状态
    const [departmentId, setDepartmentId] = useState('');//部门
    const [personnelId, setPersonnelId] = useState('');//人员
    const columns = [
        {
            title: '序号',
            dataIndex: 'key',
            width: 50,
        },
        {
            title: '余料出库编号',
            dataIndex: 'name',
            width: 120,
            render: (text: any) => <a>{text}</a>,
        }, {
            title: '生产批次',
            dataIndex: 'receivingBatch',
            width: 120,
        }, {
            title: '状态',
            dataIndex: 'key',
            width: 120,
        }, {
            title: '最新状态变更时间',
            dataIndex: 'key',
            width: 130,
        }, {
            title: '材质',
            dataIndex: 'key',
            width: 120,
        }, {
            title: '规格',
            dataIndex: 'key',
            width: 120,
        }, {
            title: '应收余料长度',
            dataIndex: 'key',
            width: 120,
        }, {
            title: '实收余料长度',
            dataIndex: 'key',
            width: 120,
        }, {
            title: '入库人',
            dataIndex: 'key',
            width: 120,
        },
        {
            title: '操作',
            dataIndex: 'key',
            width: 120,
            fixed: 'right' as FixedType,
            render: (_: undefined, record: object): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Link to={``}>入库</Link>
                    <Link to={``}>详情</Link>
                </Space>
            )
        }
    ]
    const Listdata = [
        {
            name: '仓库1',
            key: '1',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '1',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '1',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '1',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '1',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '1',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '1',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '1',
            receivingBatch: '2021-1223-TT'
        }, {
            name: '仓库1',
            key: '1',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '1',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '1',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '1',
            receivingBatch: '2021-1223-TT'
        }, {
            name: '仓库1',
            key: '1',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '1',
            receivingBatch: '2021-1223-TT'
        },
    ]
    //获取列表数据
    const loadData = async () => {
        console.log('请求数据')
        const data: any[] = await RequestUtil.get(`/tower-system/dictionary/allDictionary`, {
            current,
            pageSize,
            keyword,
            dateString
        });
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
    }
    //进入页面刷新
    useEffect(() => {
        loadData()
    }, [current, pageSize])
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
                                value="1"
                            >
                                状态1
                            </Select.Option>
                            <Select.Option
                                value="2"
                            >
                                状态2
                            </Select.Option>
                            <Select.Option
                                value="3"
                            >
                                状态3
                            </Select.Option>
                        </Select>
                    </div>
                </div>
                <div className="search_item">
                    <span className="tip">入库人：</span>
                    <div className='selectOrInput'>
                        <Select
                            className="select"
                            style={{ width: "100px" }}
                            value={departmentId ? departmentId : '请选择'}
                            onChange={(val) => { setDepartmentId(val) }}
                        >
                            <Select.Option
                                value="1"
                            >
                                部门1
                            </Select.Option>
                            <Select.Option
                                value="2"
                            >
                                部门2
                            </Select.Option>
                            <Select.Option
                                value="3"
                            >
                                部门3
                            </Select.Option>
                        </Select>-
                        <Select
                            className="select"
                            style={{ width: "100px" }}
                            value={personnelId ? personnelId : '请选择'}
                            onChange={(val) => { setPersonnelId(val) }}
                        >
                            <Select.Option
                                value="1"
                            >
                                人员1
                            </Select.Option>
                            <Select.Option
                                value="2"
                            >
                                人员2
                            </Select.Option>
                            <Select.Option
                                value="3"
                            >
                                人员3
                            </Select.Option>
                        </Select>
                    </div>
                </div>
                <div className="search_item">
                    <span className="tip">关键字：</span>
                    <div className='selectOrInput'>
                        <Input
                            placeholder="生产批次/余料入库编号"
                            value={keyword}
                            onChange={(e) => {
                                setKeyword(e.target.value)
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