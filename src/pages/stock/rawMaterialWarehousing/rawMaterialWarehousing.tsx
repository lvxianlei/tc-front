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
        [total, setTotal] = useState(0),
        [pageSize, setPageSize] = useState<number>(10),
        [status, setStatus] = useState(''),//状态
        [Listdata, setListdata] = useState<any>([]),//数据
        [dateValue, setDateValue] = useState<any>([]),//时间
        [dateString, setDateString] = useState<any>([]),//时间字符串格式
        [keyword, setKeyword] = useState<any>('');//关键字搜索
    const columns = [
        {
            title: '序号',
            dataIndex: 'key',
            width: 50,
            render: (text: any, item: any, index: any) => {
                console.log(item, 'item')
                return <span>{index + 1}</span>
            }
        },
        {
            title: '收货单号',
            dataIndex: 'receiveNumber',
            width: 120,
        }, {
            title: '状态',
            dataIndex: 'receivingBatch',
            width: 120,
            render: (text: any, item: any, index: any) => {
                return item.receiveStatus == 0 ? '待完成' : '已完成'
            }
        }, {
            title: '最新状态变更时间',
            dataIndex: 'updateTime',
            width: 120,
        }, {
            title: '供应商',
            dataIndex: 'supplierName',
            width: 120,
        }, {
            title: '联系人',
            dataIndex: 'contactsUser',
            width: 120,
        }, {
            title: '联系电话',
            dataIndex: 'contactsPhone',
            width: 120,
        }, {
            title: '合同编号',
            dataIndex: 'contractNumber',
            width: 120,
        }, {
            title: '约定到货时间',
            dataIndex: 'receiveTime',
            width: 120,
        }, {
            title: '重量(吨)',
            dataIndex: 'weight',
            width: 120,
        }, {
            title: '价税合计(元)',
            dataIndex: 'price',
            width: 120,
        }, {
            title: '备注',
            dataIndex: 'remark',
            width: 120,
        }, {
            title: '操作',
            dataIndex: 'key',
            width: 40,
            fixed: 'right' as FixedType,
            render: (_: undefined, record: any): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Link to={`/stock/rawMaterialWarehousing/detail/${record.id}`}>详情</Link>
                </Space>
            )
        }
    ]
    //获取列表数据
    const loadData = async () => {
        console.log('请求数据')
        const data: any = await RequestUtil.get(`/tower-storage/receiveStock`, {
            current,
            pageSize,
            fuzzyQuery: keyword,
            receiveStatus: status,
            startStatusUpdateTime: dateString[0] ? dateString[0] + ' 00:00:00' : '',
            endStatusUpdateTime: dateString[1] ? dateString[1] + ' 23:59:59' : '',
        });
        setListdata(data.records);
        setTotal(data.total)
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
    }, [current, pageSize, status, dateString])
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
                            value={status ? status : ''}
                            onChange={(val) => { setStatus(val) }}
                        >
                            <Select.Option
                                value=""
                            >
                                全部
                            </Select.Option>
                            <Select.Option
                                value="0"
                            >
                                待完成
                            </Select.Option>
                            <Select.Option
                                value="1"
                            >
                                已完成
                            </Select.Option>
                        </Select>
                    </div>
                </div>
                <div className="search_item">
                    <span className="tip">关键字：</span>
                    <div className='selectOrInput'>
                        <Input
                            placeholder="收货单号/供应商/合同编号/联系人/联系电话"
                            value={keyword}
                            style={{width:260}}
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