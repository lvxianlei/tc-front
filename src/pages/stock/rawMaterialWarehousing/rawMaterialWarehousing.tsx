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
    const history = useHistory(),
        [current, setCurrent] = useState(1),
        [total, setTotal] = useState(100),
        [pageSize, setPageSize] = useState<number>(10),
        [status, setStatus] = useState(''),//状态
        [dateValue, setDateValue] = useState<any>([]),//时间
        [dateString, setDateString] = useState<any>([]),//时间字符串格式
        [keyword, setKeyword] = useState<any>('');//时间字符串格式
    const columns = [
        {
            title: '序号',
            dataIndex: 'key',
            width: 50,
        },
        {
            title: '收货单号',
            dataIndex: 'name',
            width: 120,
            render: (text: any) => <a>{text}</a>,
        }, {
            title: '状态',
            dataIndex: 'receivingBatch',
            width: 120,
        }, {
            title: '最新状态变更时间',
            dataIndex: 'key',
            width: 120,
        }, {
            title: '供应商',
            dataIndex: 'key',
            width: 120,
        }, {
            title: '联系人',
            dataIndex: 'key',
            width: 120,
        }, {
            title: '联系电话',
            dataIndex: 'key',
            width: 120,
        }, {
            title: '合同编号',
            dataIndex: 'key',
            width: 120,
        }, {
            title: '约定到货时间',
            dataIndex: 'key',
            width: 120,
        }, {
            title: '重量(度)',
            dataIndex: 'key',
            width: 120,
        },
        {
            title: '操作',
            dataIndex: 'key',
            width: 40,
            fixed: 'right' as FixedType,
            render: (_: undefined, record: object): React.ReactNode => (
                <Space direction="horizontal" size="small">
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
            key: '2',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '3',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '4',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '15',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '6',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '17',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '51',
            receivingBatch: '2021-1223-TT'
        }, {
            name: '仓库1',
            key: '18',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '8',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '9',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '10',
            receivingBatch: '2021-1223-TT'
        }, {
            name: '仓库1',
            key: '31',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '51',
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
        setKeyword('')
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
                    <span className="tip">状态： </span>
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
                    <span className="tip">关键字：</span>
                    <div className='selectOrInput'>
                        <Input
                            placeholder="收货单号/供应商/合同编号"
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
                            onClick={reset}
                        >重置</Button>
                    </div>
                </div>
            </div>
            <div className="func_public_Stock">
                <Button
                    type="primary"
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