/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-放样列表-杆塔配段-包装清单-添加
*/

import React, { useEffect, useState } from 'react';
import { Space, Button, Input, Col, Row, message, Form, Checkbox, Spin, InputNumber, Descriptions, Modal, Select } from 'antd';
import { CommonTable, DetailContent, DetailTitle } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import styles from './SetOut.module.less';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import { packageTypeOptions } from '../../../configuration/DictionaryOptions';
import { IBundle, IPackingList } from './ISetOut';

export default function PackingListNew(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string, productId: string, packId: string }>();
    const [form] = Form.useForm();
    let [packagingData, setPackagingData] = useState<IBundle[]>([]);
    let [stayDistrict, setStayDistrict] = useState<IBundle[]>([]);
    const location = useLocation<{ productCategoryName: string, productNumber: string }>();
    const [balesCode, setBalesCode] = useState<string>();
    const [packageType, setPackageType] = useState<string>();
    const [packageAttributeName, setPackageAttributeName] = useState<string>();
    const [visible, setVisible] = useState<boolean>(false);
    const [userList, setUserList] = useState([]);
    const [removeVisible, setRemoveVisible] = useState<boolean>(false);
    const [removeNum, setRemoveNum] = useState(0);
    const [removeList, setRemoveList] = useState({});
    const [removeIndex, setRemoveIndex] = useState<any>();
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [selectedRow, setSelectedRow] = useState<IBundle[]>([]);
    const [removeRowKeys, setRemoveRowKeys] = useState<string[]>([]);
    const [removeRow, setRemoveRow] = useState<IBundle[]>([]);
    const [selectWeight, setSelectWeight] = useState<number>(0);
    const [maxNum, setMaxNum] = useState<number>(0);

    const getTableDataSource = (filterValues: Record<string, any>) => new Promise(async (resole, reject) => {
        if (!location.state) {
            const data = await RequestUtil.get<IPackingList>(`/tower-science/packageStructure/structure/list?id=${params.packId}`);
            setPackagingData(data?.packageRecordVOList || []);
            setBalesCode(data?.balesCode || '');
            setPackageType(data?.packageType || '');
            setPackageAttributeName(data?.packageAttributeName)
            resole(data);
        } else {
            const BalesCode = await RequestUtil.get<string>(`/tower-science/packageStructure/nextBalesCode/${params.productId}`);
            setBalesCode(BalesCode);
            resole({ productCategoryName: location.state.productCategoryName, productNumber: location.state.productNumber });
        }
        const list = await RequestUtil.get<IBundle[]>(`/tower-science/packageStructure/structureList`, { productId: params.productId, ...filterValues, packageStructureId: params.packId });
        const newData = list.filter((item: IBundle) => !packagingData.some((ele: IBundle) => ele.id !== item.id))
        setStayDistrict(newData);
        const data: any = await RequestUtil.get<[]>(`/tower-science/productSegment/distribution?productId=${params.productId}`);
        setUserList(data?.loftingProductSegmentList);
    });

    useEffect(() => setBalesCode(balesCode), [JSON.stringify(balesCode)])

    const { loading, data } = useRequest<IPackingList>(() => getTableDataSource({}), {})

    const detailData: IPackingList = data || {};

    const chooseColumns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            fixed: 'left' as FixedType,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'segmentName',
            title: '段名',
            width: 150,
            dataIndex: 'segmentName'
        },
        {
            key: 'code',
            title: '构件编号',
            width: 150,
            dataIndex: 'code'
        },
        {
            key: 'materialName',
            title: '材料名称',
            width: 150,
            dataIndex: 'materialName'
        },
        {
            key: 'structureTexture',
            title: '材质',
            width: 150,
            dataIndex: 'structureTexture'
        },
        {
            key: 'structureSpec',
            title: '规格',
            width: 150,
            dataIndex: 'structureSpec'
        },
        {
            key: 'structureNum',
            title: '单段件数',
            width: 150,
            dataIndex: 'structureNum'
        },
        {
            key: 'width',
            title: '宽度',
            width: 150,
            dataIndex: 'width'
        },
        {
            key: 'thickness',
            title: '厚度',
            width: 150,
            dataIndex: 'thickness'
        },
        {
            key: 'length',
            title: '长度',
            width: 150,
            dataIndex: 'length'
        },
        {
            key: 'basicsWeight',
            title: '重量',
            width: 150,
            dataIndex: 'basicsWeight'
        },
        {
            key: 'electricWelding',
            title: '电焊',
            width: 150,
            dataIndex: 'electricWelding'
        },
        {
            key: 'bend',
            title: '火曲',
            width: 150,
            dataIndex: 'bend'
        },
        {
            key: 'rootClear',
            title: '清根',
            width: 150,
            dataIndex: 'rootClear'
        },
        {
            key: 'shovelBack',
            title: '铲背',
            width: 150,
            dataIndex: 'shovelBack'
        },
        {
            key: 'description',
            title: '备注',
            width: 150,
            dataIndex: 'description'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 100,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Button type="link" onClick={() => packaging(record, index)}>添加</Button>
            )
        }
    ]

    const packingColumns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            fixed: 'left' as FixedType,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'pieceCode',
            title: '构件编号',
            width: 150,
            dataIndex: 'pieceCode'
        },
        {
            key: 'materialSpec',
            title: '规格',
            width: 150,
            dataIndex: 'materialSpec'
        },
        {
            key: 'length',
            title: '长度',
            width: 150,
            dataIndex: 'length'
        },
        {
            key: 'num',
            title: '数量',
            width: 150,
            dataIndex: 'num'
        },
        {
            key: 'description',
            title: '备注',
            width: 150,
            dataIndex: 'description'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 100,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Button type='link' onClick={() => { setRemoveVisible(true); setRemoveList(record); setRemoveIndex(index); setRemoveNum(record.num); setMaxNum(record.num) }}>移除</Button>
            )
        }
    ]

    // 添加
    const packaging = (record: IBundle, index: number) => {
        const data: IBundle = {
            ...record,
            description: record.description,
            length: record.length,
            pieceCode: record.code,
            num: record.structureNum,
            materialSpec: record.structureSpec,
            productCategoryId: detailData.productCategoryId,
            productId: detailData.productId,
            structureId: record.id || record.topId,
            structureCount: record.structureNum,
            topId: record.id || record.topId,
            id: ''
        }
        if (packagingData?.length > 0) {
            let find = packagingData.findIndex((res: IBundle) => {
                return res.structureId === data.id || res.structureId === data.topId
            })
            if (find === -1) {
                packagingData.push(data)
            } else {
                packagingData[find] = {
                    ...packagingData[find],
                    num: Number(packagingData[find].num) + Number(data.num)
                }
            }
        } else {
            packagingData.push(data)
        }
        setPackagingData([...packagingData]);
        stayDistrict.splice(index, 1);
        setStayDistrict([...stayDistrict]);
    }

    // 批量添加 
    const addTopack = () => {
        if (selectedRow.length > 0) {
            const data: IBundle[] | undefined = selectedRow?.map((res: IBundle) => {
                return {
                    ...res,
                    description: res.description,
                    length: res.length,
                    pieceCode: res.code,
                    num: res.structureNum,
                    materialSpec: res.structureSpec,
                    productCategoryId: detailData.productCategoryId,
                    productId: detailData.productId,
                    structureId: res.id || res.topId || res.structureId,
                    structureCount: res.structureNum,
                    topId: res.id || res.structureId,
                    id: ''
                }
            })
            if (packagingData?.length > 0) {
                data?.forEach((record: IBundle) => {
                    let find = packagingData.findIndex((res: IBundle) => {
                        return res.structureId === record.id || res.structureId === record.topId
                    })
                    if (find === -1) {
                        packagingData = [...packagingData, record]
                    } else {
                        packagingData[find] = {
                            ...packagingData[find],
                            num: Number(packagingData[find].num) + Number(record.structureNum)
                        }
                    }
                })
            } else {
                packagingData = [...(data || [])]
            }
            setPackagingData([...packagingData]);
            data?.forEach((record: IBundle) => {
                stayDistrict.forEach((res: IBundle, index: number) => {
                    if (record.structureId === res.id || res.structureId === record.topId) {
                        stayDistrict.splice(index, 1);
                    }
                })
            })
            setStayDistrict(stayDistrict);
            setRemoveRow([]);
            setRemoveRowKeys([]);
            setSelectedRow([]);
            setSelectedRowKeys([]);
            setSelectWeight(0);
        } else {
            message.warning('请选择要添加的数据')
        }
    }


    // 移除
    const remove = async (value: Record<string, any>, index: number, num: number) => {
        if (num === value.num) {
            packagingData.splice(index, 1)
            setPackagingData([...packagingData]);
            if (value.id) {
                const newValue = await RequestUtil.get<IPackingList>(`/tower-science/packageStructure/delRecord?packageRecordId=${value.id}`);
                const newData: IPackingList = { ...newValue, structureNum: num };
                const find: number = stayDistrict.findIndex((res: IPackingList) => {
                    return res.id === newData.id
                })
                if (find === -1) {
                    setStayDistrict([...stayDistrict, newValue]);
                } else {
                    setStayDistrict([...stayDistrict.map((res: IPackingList, index: number) => {
                        if (index === find) {
                            return {
                                ...res,
                                structureNum: num + Number(res?.structureNum || 0)
                            }
                        } else {
                            return res
                        }
                    })]);
                }
            } else {
                const newData: IPackingList = { ...value, structureNum: num };
                const find: number = stayDistrict.findIndex((res: IPackingList) => {
                    return res.topId === newData.topId
                })
                if (find === -1) {
                    setStayDistrict([...stayDistrict, { ...value, id: value.topId || value.structureId }]);
                } else {
                    setStayDistrict([...stayDistrict.map((res: IPackingList, index: number) => {
                        if (index === find) {
                            return {
                                ...res,
                                id: value.topId || value.structureId,
                                structureNum: num + Number(res?.structureNum || 0)
                            }
                        } else {
                            return {
                                ...res,
                                id: value.topId || value.structureId
                            }
                        }
                    })]);
                }
            }
        } else {
            packagingData[index] = {
                ...value,
                id: value.topId || value.structureId,
                num: value.num - num
            }
            setPackagingData([...packagingData]);
            if (value.id) {
                const newValue = await RequestUtil.get<IPackingList>(`/tower-science/packageStructure/delRecord?packageRecordId=${value.id}`);
                const newData: IPackingList = { ...newValue, structureNum: num };
                const find: number = stayDistrict.findIndex((res: IPackingList) => {
                    return res.id === newData.id
                })
                if (find === -1) {
                    setStayDistrict([...stayDistrict, { ...newValue, structureNum: num }]);
                } else {
                    setStayDistrict([...stayDistrict.map((res: IPackingList, index: number) => {
                        if (index === find) {
                            return {
                                ...res,
                                structureNum: num + Number(res?.structureNum || 0)
                            }
                        } else {
                            return res
                        }
                    })]);
                }
            } else {
                const newData: IPackingList = { ...value, structureNum: num };
                const find: number = stayDistrict.findIndex((res: IPackingList) => {
                    return res.topId === newData.topId
                })
                if (find === -1) {
                    setStayDistrict([...stayDistrict, { ...value, structureNum: num, id: value.topId || value.structureId }]);
                } else {
                    setStayDistrict([...stayDistrict.map((res: IPackingList, index: number) => {
                        if (index === find) {
                            return {
                                ...res,
                                id: value.topId || value.structureId,
                                structureNum: num + Number(res?.structureNum || 0)
                            }
                        } else {
                            return {
                                ...res,
                                id: value.topId || value.structureId
                            }
                        }
                    })]);
                }
            }
        }
        setRemoveVisible(false);
        setRemoveIndex(undefined);
        setRemoveNum(0);
        setRemoveList({});
    }

    // 批量移除
    const packRemove = () => {
        if (removeRow.length > 0) {
            removeRow?.forEach(async (value: IBundle, index: number) => {
                packagingData.forEach((res: IBundle, index: number) => {
                    if (value.structureId === res.structureId) {
                        packagingData.splice(index, 1);
                    }
                })
                if (value.id) {
                    const newValue = await RequestUtil.get<IPackingList>(`/tower-science/packageStructure/delRecord?packageRecordId=${value.id}`);
                    const find: number = stayDistrict.findIndex((res: IPackingList) => {
                        return res.id === newValue.id
                    })
                    if (find === -1) {
                        stayDistrict = [...stayDistrict, { ...newValue }]
                    } else {
                        stayDistrict = [...stayDistrict.map((res: IPackingList, index: number) => {
                            if (index === find) {
                                return {
                                    ...res,
                                    structureNum: newValue?.structureNum
                                }
                            } else {
                                return res
                            }
                        })]
                    }

                    setStayDistrict([...stayDistrict]);
                } else {
                    const find: number = stayDistrict.findIndex((res: IPackingList) => {
                        return res.topId === value.topId
                    })
                    if (find === -1) {
                        stayDistrict = [...stayDistrict, { ...value, id: value.topId || value.structureId }]
                    } else {
                        stayDistrict = [...stayDistrict.map((res: IPackingList, index: number) => {
                            if (index === find) {
                                return {
                                    ...res,
                                    structureNum: value?.structureNum,
                                    id: value.topId || value.structureId
                                }
                            } else {
                                return {
                                    ...res,
                                    id: value.topId || value.structureId
                                }
                            }
                        })]
                    }
                    setStayDistrict([...stayDistrict]);
                }
            })

            setPackagingData([...packagingData]);
            setRemoveRow([]);
            setRemoveRowKeys([]);
            setSelectedRow([]);
            setSelectedRowKeys([]);
        } else {
            message.warning('请选择要移除的数据')
        }
    }

    const onFinish = (value: Record<string, any>) => {
        if (value.checkList?.indexOf('electricWelding') >= 0) {
            value.electricWelding = 1
        }
        if (value.checkList?.indexOf('bend') >= 0) {
            value.bend = 1
        }
        if (value.checkList?.indexOf('rootClear') >= 0) {
            value.rootClear = 1
        }
        if (value.checkList?.indexOf('shovelBack') >= 0) {
            value.shovelBack = 1
        }
        getTableDataSource({ ...value });
    }

    const packageChange = (e: string) => {
        setPackageType(e);
        const data: IBundle[] = packagingData.map((item: IBundle) => {
            return {
                ...item,
                packageType: e,
            }
        })
        setPackagingData([...data]);
    }

    const packageAttributeChange = (e: string) => {
        setPackageAttributeName(e);
        const data: IBundle[] = packagingData.map((item: IBundle) => {
            return {
                ...item,
                packageAttributeName: e,
            }
        })
        setPackagingData([...data]);
    }

    const numChange = (e: number, structureCount: number, index: number) => {
        packagingData[index] = {
            ...packagingData[index],
            num: e
        }
        setPackagingData([...packagingData])
    }

    const onSelectChange = (selectedRowKeys: string[], selectRows: IBundle[]) => {
        setSelectedRowKeys(selectedRowKeys);
        setSelectedRow(selectRows);
        setSelectWeight(eval((selectRows || [])?.map(item => { return Number(item.structureNum) * Number(item.basicsWeight) }).join('+')) || 0);
    }

    const onRemoveSelectChange = (selectedRowKeys: string[], selectRows: IBundle[]) => {
        setRemoveRowKeys(selectedRowKeys);
        setRemoveRow(selectRows)
    }


    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }

    return <>
        <Modal visible={removeVisible} title="移除" okText="确认" onCancel={() => { setRemoveNum(0); setRemoveVisible(false); }} onOk={() => remove(removeList, removeIndex, removeNum)}>
            <Row>
                <Col>数量</Col>
                <Col><InputNumber max={maxNum} value={removeNum} onChange={(e) => setRemoveNum(Number(e))} /></Col>
            </Row>
        </Modal>
        <DetailContent operation={[
            <Space direction="horizontal" size="small" >
                <Button type="primary" onClick={() => {
                    setVisible(true);
                    setPackageType(detailData?.packageType);
                    setPackageAttributeName(detailData?.packageAttributeName)
                }}>保存包</Button>
                <Button type="ghost" onClick={() => history.goBack()}>关闭</Button>
            </Space>
        ]}>
            <DetailTitle title="包装信息" />
            <Form form={form} className={styles.topPadding} onFinish={(value: Record<string, any>) => onFinish(value)}>
                <Descriptions style={{ width: '40%', position: 'absolute' }} title="" bordered size="small" column={2}>
                    <Descriptions.Item label="塔型">
                        {detailData?.productCategoryName}
                    </Descriptions.Item>
                    <Descriptions.Item label="杆塔号">
                        {detailData?.productNumber}
                    </Descriptions.Item>
                </Descriptions>
                <Form.Item name="checkList">
                    <Checkbox.Group style={{ width: '50%', position: 'absolute', right: '1%' }}>
                        <Row>
                            <Col span={6}>
                                <Checkbox value="electricWelding" key="1">是否电焊</Checkbox>
                            </Col>
                            <Col span={6}>
                                <Checkbox value="bend" key="2">是否火曲</Checkbox>
                            </Col>
                            <Col span={6}>
                                <Checkbox value="rootClear" key="3">是否清根</Checkbox>
                            </Col>
                            <Col span={6}>
                                <Checkbox value="shovelBack" key="4">是否铲背</Checkbox>
                            </Col>
                        </Row>
                    </Checkbox.Group>
                </Form.Item>
                <Row>
                    <Col span={3}>
                        <Form.Item name="materialSpec" label="材料名称" className={styles.rightPadding5}>
                            <Input placeholder="请输入" maxLength={20} />
                        </Form.Item>
                    </Col>
                    <Col offset={1} span={4}>
                        <Form.Item name="segmentId" label="段名">
                            <Select placeholder="请选择" style={{ width: '120px' }}>
                                {userList && userList.map((item: any) => {
                                    return <Select.Option key={item.id} value={item.segmentId}>{item.segmentName}</Select.Option>
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col offset={1} span={3}>
                        <Form.Item name="minLength" label="长度范围" className={styles.rightPadding5}>
                            <Input type="number" min={0} placeholder="请输入" />
                        </Form.Item>
                    </Col>
                    <Col span={2}>
                        <Form.Item name="maxLength">
                            <Input type="number" min={0} placeholder="请输入" />
                        </Form.Item>
                    </Col>
                    <Col offset={1} span={4}>
                        <Form.Item name="code" label="查询">
                            <Input placeholder="请输入" maxLength={50} />
                        </Form.Item>
                    </Col>
                    <Col offset={1} span={3}>
                        <Space direction="horizontal">
                            <Button type="primary" htmlType="submit">搜索</Button>
                            <Button type="ghost" htmlType="reset">重置</Button>
                        </Space>
                    </Col>
                </Row>
            </Form>
            <p className={styles.title}>
                <span>待选区</span>
                <span className={styles.description}>未分配：{stayDistrict.length}</span>
                <span className={styles.description}>已选择构件总重量：{selectWeight}吨</span>
                <Button className={styles.fastBtn} type="primary" onClick={addTopack} ghost>添加</Button>
            </p>
            <CommonTable
                columns={chooseColumns}
                pagination={false}
                dataSource={[...stayDistrict]}
                rowSelection={{
                    selectedRowKeys: selectedRowKeys,
                    type: "checkbox",
                    onChange: onSelectChange,
                }}
            />
            <p className={styles.title}>包装区
                <span className={styles.description}>已选择构件数：{packagingData.length}</span>
                <span className={styles.description}>已选择构件总重量：{eval(packagingData.map(item => { return Number(item.num) * Number(item.basicsWeight) }).join('+')) || 0}吨</span>
                <Button className={styles.fastBtn} type="primary" onClick={packRemove} ghost>移除</Button>
            </p>
            <CommonTable
                columns={packingColumns}
                pagination={false}
                dataSource={packagingData}
                rowKey="structureId"
                rowSelection={{
                    selectedRowKeys: removeRowKeys,
                    type: "checkbox",
                    onChange: onRemoveSelectChange,
                }} />
        </DetailContent>
        <Modal
            visible={visible}
            title="保存包"
            onCancel={() => {
                setVisible(false);
                setPackageType('');
            }}
            onOk={() => {
                if (packageType && packageAttributeName) {
                    const value = {
                        balesCode: balesCode,
                        id: params.packId,
                        productCategoryId: params.id,
                        packageType: packageType,
                        productCategoryName: detailData.productCategoryName,
                        productId: params.productId,
                        productNumber: detailData.productNumber,
                        packageRecordSaveDTOList: packagingData,
                        packageAttributeName: packageAttributeName
                    };
                    RequestUtil.post(`/tower-science/packageStructure`, value).then(res => {
                        message.success('包装清单保存成功');
                        setVisible(false);
                        history.goBack();
                    })
                } else {
                    message.warning('请选择包属性或包类型');
                }
            }}>
            <Row>
                <Col span={4}><span>捆号</span></Col>
                <Col span={8}>{balesCode} </Col>
                <Col span={4} offset={1}><span>包类型</span></Col>
                <Col span={7}>
                    <Select placeholder="请选择包类型" value={packageType} style={{ width: "100%" }} onChange={(e: string) => packageChange(e)}>
                        {packageTypeOptions && packageTypeOptions.map(({ id, name }, index) => {
                            return <Select.Option key={index} value={id}>
                                {name}
                            </Select.Option>
                        })}
                    </Select>
                </Col>
                <Col span={4}><span>包属性</span></Col>
                <Col span={8}>
                    <Select placeholder="请选择包属性" style={{ width: "100%" }} value={packageAttributeName} onChange={(e: string) => packageAttributeChange(e)}>
                        <Select.Option value="通用" key="1">通用</Select.Option>
                        <Select.Option value="专用包" key="2">专用包</Select.Option>
                    </Select>
                </Col>
            </Row>
        </Modal>
    </>
}