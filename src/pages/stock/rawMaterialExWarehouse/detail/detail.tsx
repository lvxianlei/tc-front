import React, { useState, useEffect } from 'react';
import { Space, Button, TableColumnProps, Modal, Input, DatePicker, Select, message, Table } from 'antd';
import { Link, useHistory, useParams } from 'react-router-dom';
import { FixedType } from 'rc-table/lib/interface';
import ConfirmableButton from '../../../../components/ConfirmableButton';
import { Page } from '../../../common';
import { IClient } from '../../../IClient';
import RequestUtil from '../../../../utils/RequestUtil';
import '../../StockPublicStyle.less';

const { RangePicker } = DatePicker;
export default function RawMaterialStock(): React.ReactNode {
    const params = useParams<{ id: string }>();
    const history = useHistory(),
        [current, setCurrent] = useState(1),
        [total, setTotal] = useState(100),
        [pageSize, setPageSize] = useState<number>(10),
        [status, setStatus] = useState(''),//状态
        [dateValue, setDateValue] = useState<any>([]),//时间
        [dateString, setDateString] = useState<any>([]),//时间字符串格式
        [keyword, setKeyword] = useState<any>('');//关键字搜索
    const [departmentId, setDepartmentId] = useState('');//部门
    const [outStockStaffId, setPersonnelId] = useState('');//人员
    const [Listdata, setListdata] = useState<any[]>([]);//列表数据
    const [totalWeight, setTotalWeight] = useState<number>(0);//总重量
    const [MaterialShortageTotalWeight, setMaterialShortageTotalWeight] = useState<number>(0);//缺料总重量
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
            title: '品名',
            dataIndex: 'productName',
            width: 120,
            render: (text: any) => <a>{text}</a>,
        }, {
            title: '状态',
            dataIndex: 'outStockItemStatus',
            width: 120,
        }, {
            title: '最新状态变更',
            dataIndex: 'createTime',
            width: 160,
        }, {
            title: '规格',
            dataIndex: 'spec',
            width: 120,
        }, {
            title: '标准',
            dataIndex: 'standard',
            width: 120,
        }, {
            title: '材质',
            dataIndex: 'materialTexture',
            width: 120,
        }, {
            title: '长度(mm)',
            dataIndex: 'length',
            width: 120,
        }, {
            title: '宽度(mm)',
            dataIndex: 'width',
            width: 120,
        }, {
            title: '重量(吨)',
            dataIndex: 'weight',
            width: 120,
        }, {
            title: '炉批号',
            dataIndex: 'furnaceBatch',
            width: 120,
        }, {
            title: '内部合同号',
            dataIndex: 'contractNumber',
            width: 120,
        }, {
            title: '塔型',
            dataIndex: 'productCategoryId',
            width: 120,
        }, {
            title: '塔杆号',
            dataIndex: 'productNumber',
            width: 120,
        }, {
            title: '出库人',
            dataIndex: 'outStockStaffId',
            width: 120,
        },
        {
            title: '操作',
            width: 140,
            fixed: 'right' as FixedType,
            render: (_: undefined, record: object): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type='link'>出库</Button>
                    <Button type='link'>详情</Button>
                </Space>
            )
        }
    ]
    //获取列表数据
    const loadData = async () => {
        console.log('请求数据')
        const data: any = await RequestUtil.get(`/tower-storage/outStock/detail`, {
            current,
            size: pageSize,
            keyword,
            id: params.id,
            departmentId,
            outStockStaffId,
            selectName: keyword,
            status,
            updateTimeStart: dateString[0],
            updateTimeEnd: dateString[1],
        });
        setListdata(data.records);
        setTotal(data.total);
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
                    <span className="tip">出库人：</span>
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
                            value={outStockStaffId ? outStockStaffId : '请选择'}
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
                            style={{ width: "200px" }}
                            placeholder="品名/炉批号/内部合同号/杆塔号"
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
                <Button
                    className='func_btn'
                    type="primary"
                    ghost
                    onClick={() => {
                        history.go(-1)
                    }}
                >返回上一级</Button>
            </div>
            <div className="tip_public_Stock">
                <div>总重量： {totalWeight} 吨    缺料总重量：{MaterialShortageTotalWeight} 吨</div>
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