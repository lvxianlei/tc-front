/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, } from 'react'
import { Button, Table, Pagination, TableColumnProps, Row, Col, Select, } from 'antd';
import RequestUtil from '../../../utils/RequestUtil';
import ApplicationContext from "../../../configuration/ApplicationContext"
import { Key } from 'rc-select/lib/interface/generator';
import { useHistory } from 'react-router';
const { Option } = Select;
const ViewPanel = (): React.ReactNode => {
    const history = useHistory()
    let [columnsData, setColumnsData] = useState<any[]>([]);
    let [selects, setSelects] = useState<any>({
        materialNames: [],
        materialTextures: [],
        specs: [],
    });
    // let [total, setTotal] = useState(0);
    let [size, setSize] = useState(10);
    let [current, setCurrent] = useState(1);
    let [condition, setCondition] = useState('');
    let [materialTexture, setMaterialTexture] = useState('');
    let [productName, setProductName] = useState('');
    let [spec, setSpec] = useState('');
    let [standard, setStandard] = useState('');
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
            key: 'productName',
            title: '品名',
            dataIndex: 'productName',
        },
        {
            key: 'standard',
            title: '标准',
            dataIndex: 'standard'
        },
        {
            key: 'spec',
            title: '规格',
            dataIndex: 'spec',
        },
        {
            key: 'materialTexture',
            title: '材质',
            dataIndex: 'materialTexture'
        },
        {
            key: 'stockWeight',
            title: '库存重量（吨）',
            dataIndex: 'stockWeight'
        },
        {
            key: 'onWayWeight',
            title: '在途重量（吨）',
            dataIndex: 'onWayWeight'
        },
        {
            key: 'canUseWeight',
            title: '可用库存（吨）',
            dataIndex: 'canUseWeight'
        },
        {
            key: 'noPickWeight',
            title: '生产未领料（吨）',
            dataIndex: 'noPickWeight'
        },
        {
            key: 'safeWeight',
            title: '安全库存（吨）',
            dataIndex: 'safeWeight'
        },
        {
            key: 'typeName',
            title: '告警库存（吨）',
            dataIndex: 'typeName'
        },
        {
            key: 'currentProjectStage',
            title: '库存状态',
            dataIndex: 'currentProjectStage',
            render: (text, item: any, index) => {
                return (
                    <div>
                        {
                            item.type === 0 ?
                                <span style={{ padding: '5px 8px', backgroundColor: 'yello', color: '#fff' }}>告警库存</span> :
                                item.type === 1 ?
                                    <span style={{ padding: '5px 8px', backgroundColor: 'red', color: '#fff' }}>可用库存</span> :
                                    <span></span>
                        }
                    </div>
                )
            }
        },
    ]
    useEffect(() => {
        getColumnsData()
    }, [condition, materialTexture, productName, spec, standard, current, size,]);
    useEffect(() => {
        getSelectDetail()
    }, []);
    const getColumnsData = async () => {
        const data: any = await RequestUtil.get('/tower-storage/safetyStock/board', {
            current,
            size,
            condition,
            materialTexture,
            productName,
            spec,
            standard,
        })
        // setTotal(data.data)
        setColumnsData(data)
    }
    // 获取选择框信息
    const getSelectDetail = async () => {
        const data: any = await RequestUtil.get('/tower-system/material/selectDetail')
        setSelects(data)
    }
    // 重置
    const resetting = () => {
        setCurrent(1)
        setCondition('')
        setMaterialTexture('')
        setProductName('')
        setSpec('')
        setStandard('')
    }
    return (
        <div className='public_page'>
            <Row className='search_content'>
                <Col
                    xxl={6}
                    xl={6}
                    md={12}
                    className='search_item'
                >
                    <span className='tip'>材质：</span>
                    <Select
                        className='input'
                        value={materialTexture}
                        style={{ width: 120 }}
                        onChange={(value) => {
                            setMaterialTexture(value)
                        }}
                    >
                        <Option value={''}>全部</Option>
                        {
                            selects.materialNames.map((item: string) => {
                                return (
                                    <Option value={item} key={item}>{item}</Option>
                                )
                            })
                        }
                    </Select>
                </Col>
                <Col
                    xxl={6}
                    xl={6}
                    md={12}
                    className='search_item'
                >
                    <span className='tip'>标准：</span>
                    <Select
                        className='input'
                        value={standard}
                        style={{ width: 120 }}
                        onChange={(value) => {
                            setStandard(value)
                        }}
                    >
                        <Option value={''}>全部</Option>
                        {
                            (ApplicationContext.get().dictionaryOption as any)["111"].map((item: { id: string, name: string }) => ({
                                value: item.id,
                                label: item.name
                            })).map((t: { value: Key; label: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: any) => {
                                return (
                                    <Option value={t.value}>{t.label}</Option>
                                )
                            })
                        }
                    </Select>
                </Col>
                <Col
                    xxl={6}
                    xl={6}
                    md={12}
                    className='search_item'
                >
                    <span className='tip'>品名：</span>
                    <Select
                        className='input'
                        value={productName}
                        style={{ width: 120 }}
                        onChange={(value) => {
                            setProductName(value)
                        }}
                    >
                        <Option value={''}>全部</Option>
                        {
                            selects.materialTextures.map((item: string) => {
                                return (
                                    <Option value={item} key={item}>{item}</Option>
                                )
                            })
                        }
                    </Select>
                </Col>
                <Col
                    xxl={6}
                    xl={6}
                    md={12}
                    className='search_item'
                >
                    <span className='tip'>规格：</span>
                    <Select
                        className='input'
                        value={spec}
                        style={{ width: 120 }}
                        onChange={(value) => {
                            setSpec(value)
                        }}
                    >
                        <Option value={''}>全部</Option>
                        {
                            selects.specs.map((item: string) => {
                                return (
                                    <Option value={item} key={item}>{item}</Option>
                                )
                            })
                        }
                    </Select>
                </Col>
                <Col
                    xxl={6}
                    xl={6}
                    md={12}
                    className='search_item'
                >
                    <span className='tip'>库存情况：</span>
                    <Select
                        className='input'
                        value={condition}
                        style={{ width: 120 }}
                        onChange={(value) => {
                            setCondition(value)
                        }}
                    >
                        <Option value={''}>全部</Option>
                        <Option value={'0'}>正常</Option>
                        <Option value={'1'}>提醒</Option>
                        <Option value={'2'}>告警</Option>
                    </Select>
                </Col>
                <Col
                    className='search_btn_box'
                >
                    <Button
                        className='btn_item'
                        onClick={() => {
                            resetting()
                        }}
                    >重置</Button>
                </Col>
            </Row>
            <div className='public_content'>
                <div className='func_box'>
                    <div className='func'>
                        <Button
                            className='func_item'
                            type='primary'
                        >导出</Button>
                    </div>
                    <div className='func_right'>
                        <Button
                            className='func_right_item'
                            onClick={() => {
                                history.go(-1)
                            }}
                        >返回上一级</Button>
                    </div>
                </div>
                <Table
                    className='public_table'
                    scroll={{ x: true }}
                    columns={columns}
                    dataSource={columnsData}
                    pagination={false}
                    size='small'
                />
                <div className='page_content'>
                    <Pagination
                        className='page'
                        showSizeChanger
                        showQuickJumper
                        total={columnsData.length}
                        pageSize={size}
                        current={current}
                        onChange={(page: number, size: any) => {
                            setCurrent(page)
                            setSize(size)
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default ViewPanel;