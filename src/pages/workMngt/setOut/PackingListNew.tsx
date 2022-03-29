/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-放样列表-杆塔配段-包装清单-添加
*/

import React, { useRef, useState } from 'react';
import { Space, Button, Input, Col, Row, message, Form, Checkbox, Spin, InputNumber, Descriptions, Modal, Select } from 'antd';
import { CommonTable, DetailContent, DetailTitle } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import styles from './SetOut.module.less';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import { packageTypeOptions } from '../../../configuration/DictionaryOptions';
import { IBundle, IPackingList } from './ISetOut';
import ReuseTower, { EditProps } from './ReuseTower';
import { chooseColumns, packingColumns } from './SetOutInformation.json';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

export default function PackingListNew(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string, productId: string, packId: string }>();
    const [searchForm] = Form.useForm();
    const [form] = Form.useForm();
    let [packagingData, setPackagingData] = useState<IBundle[]>([]);
    let [stayDistrict, setStayDistrict] = useState<IBundle[]>([]);
    const location = useLocation<{ productCategoryName: string, productNumber: string }>();
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
    const editRef = useRef<EditProps>();
    const [showParts, setShowParts] = useState<boolean>(false);
    const [reuse, setReuse] = useState<[]>();

    const getTableDataSource = (filterValues: Record<string, any>) => new Promise(async (resole, reject) => {
        if (!location.state) {
            const data = await RequestUtil.get<IPackingList>(`/tower-science/packageStructure/structure/list?id=${params.packId}`);
            setPackagingData(data?.packageRecordVOList || []);
        }
        const list = await RequestUtil.get<IBundle[]>(`/tower-science/packageStructure/structureList`, { productId: params.productId, ...filterValues, packageStructureId: params.packId });
        const newData = list.filter((item: IBundle) => !packagingData.some((ele: IBundle) => ele.id !== item.id));
        setStayDistrict(newData.map((res, index) => {
            return {
                ...res,
                isChild: false,
                weldingStructureList: res.weldingStructureList?.map(item => { return { ...item, isChild: true } })
            }
        }));
        const data: any = await RequestUtil.get<[]>(`/tower-science/productSegment/distribution?productId=${params.productId}`);
        setUserList(data?.loftingProductSegmentList);
        resole(data);
    });

    const { loading, data } = useRequest<IPackingList>(() => getTableDataSource({}), {})

    const detailData: IPackingList = data || {};

    // 添加
    const packaging = (record: IBundle, index: number) => {
        const data: IBundle = {
            ...record,
            description: record.description,
            length: record.length,
            pieceCode: record.code,
            materialSpec: record.structureSpec,
            productCategoryId: detailData.productCategoryId,
            productId: detailData.productId,
            structureCount: record.structureRemainingNum,
            id: '',
            weldingStructureList: record?.weldingStructureList?.map(res => {
                return {
                    ...res,
                    description: res.description,
                    length: res.length,
                    pieceCode: res.code,
                    materialSpec: res.structureSpec,
                    productCategoryId: detailData.productCategoryId,
                    productId: detailData.productId,
                    structureCount: res.structureRemainingNum,
                    id: '',
                }
            })
        }
        let newData: IBundle[] = [];
        if (packagingData?.length > 0) {
            let find = packagingData.findIndex((res: IBundle) => {
                return res.businessId === data.businessId
            })
            if (find === -1) {
                if (showParts) {
                    newData = [...packagingData, ...packagingDataShowParts([data])]
                } else {
                    packagingData.push(data)
                    newData = packagingData
                }
            } else {
                packagingData[find] = {
                    ...packagingData[find],
                    structureCount: Number(packagingData[find].structureCount) + Number(data.structureRemainingNum),
                    weldingStructureList: packagingData[find].weldingStructureList?.map((res, index) => {
                        return {
                            ...res,
                            structureCount: Number(res.structureCount) + Number(data?.weldingStructureList && data?.weldingStructureList[index].structureRemainingNum),
                        }
                    })
                }
                newData = packagingData.map(items => {
                    if (items.mainStructureId === data.businessId && items.isChild) {
                        const getData = data?.weldingStructureList && data?.weldingStructureList.filter(res => res.businessId === items.businessId)[0];
                        return {
                            ...items,
                            structureCount: Number(items.structureCount) + Number(getData?.structureRemainingNum)
                        }
                    } else {
                        return items;
                    }
                })
            }
        } else {
            packagingData.push(data)
            newData = showParts ? packagingDataShowParts([...packagingData]) : packagingData
        }
        setPackagingData([...newData]);
        stayDistrict.splice(index, 1);
        const list = stayDistrict.filter(res => res.mainStructureId !== data.businessId)
        setStayDistrict([...list]);
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
                    materialSpec: res.structureSpec,
                    productCategoryId: detailData.productCategoryId,
                    productId: detailData.productId,
                    structureCount: res.structureRemainingNum,
                    id: '',
                    weldingStructureList: res?.weldingStructureList?.map(item => {
                        return {
                            ...item,
                            description: item.description,
                            length: item.length,
                            pieceCode: item.code,
                            materialSpec: item.structureSpec,
                            productCategoryId: detailData.productCategoryId,
                            productId: detailData.productId,
                            structureCount: item.structureRemainingNum,
                            id: '',
                        }
                    })
                }
            })
            if (packagingData?.length > 0) {
                data?.forEach((record: IBundle) => {
                    let find = packagingData.findIndex((res: IBundle) => {
                        return res.businessId === record.businessId
                    })
                    if (find === -1) {
                        packagingData = [...packagingData, record]
                    } else {
                        packagingData[find] = {
                            ...packagingData[find],
                            structureCount: Number(packagingData[find].structureCount) + Number(record.structureRemainingNum),
                            weldingStructureList: packagingData[find].weldingStructureList?.map((res, index) => {
                                return {
                                    ...res,
                                    structureCount: Number(res.structureRemainingNum) + Number(record?.weldingStructureList && record?.weldingStructureList[index].structureRemainingNum),
                                }
                            })
                        }
                    }
                })
            } else {
                packagingData = [...(data || [])]
            }
            let newPackagingData: IBundle[] = []
            if (showParts) {
                newPackagingData = packagingDataShowParts(packagingData);
            } else {
                newPackagingData = [...packagingData];
            }
            setPackagingData([...newPackagingData]);
            let list: IBundle[] = stayDistrict
            data?.forEach((record: IBundle) => {
                stayDistrict.forEach((res: IBundle, index: number) => {
                    if (record.businessId === res.businessId) {
                        list.splice(index, 1);
                        list = list.filter(res => res.mainStructureId !== record.businessId)
                    }
                })
            })
            setStayDistrict([...list]);
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
        if (num === Number(value.structureCount) / Number(value.singleNum)) {
            packagingData.splice(index, 1);
            const list = packagingData.filter(res => res.mainStructureId !== value.businessId);
            setPackagingData([...list]);
            if (value.id) {
                const newValue = await RequestUtil.get<IBundle>(`/tower-science/packageStructure/delRecord?packageRecordId=${value.id}`);
                const newData: IBundle = { ...newValue, structureRemainingNum: num };
                const find: number = stayDistrict.findIndex((res: IBundle) => {
                    return res.businessId === newData.businessId
                })
                if (find === -1) {
                    let data = showParts ? stayDistrictShowParts([newValue]) : [newValue]
                    setStayDistrict([...stayDistrict, ...data]);
                } else {
                    setStayDistrict([...stayDistrict.map((res: IBundle, index: number) => {
                        if (index === find) {
                            return {
                                ...res,
                                structureRemainingNum: num + Number(res?.structureRemainingNum || 0),
                                weldingStructureList: packagingData[find].weldingStructureList?.map((res, index)=>{
                                    return {
                                        ...res,
                                        structureCount: Number(res.structureRemainingNum) + Number(value?.weldingStructureList && value?.weldingStructureList[index].structureRemainingNum),
                                    }
                                })
                            }
                        } else {
                            return res;
                        }
                    })]);
                }
            } else {
                const newData: IBundle = { ...value, structureRemainingNum: num };
                const find: number = stayDistrict.findIndex((res: IBundle) => {
                    return res.businessId === newData.businessId
                })
                if (find === -1) {
                    let data = showParts ? stayDistrictShowParts([{ ...value, businessId:value.businessId }]) : [{ ...value, businessId: value.businessId }]
                    setStayDistrict([...stayDistrict, ...data]);
                } else {
                    let data: IBundle[] = [...stayDistrict.map((res: IBundle, index: number) => {
                        if (index === find) {
                            const getData = res?.weldingStructureList && res?.weldingStructureList.filter(items => items.businessId === res.businessId)[0];
                            return {
                                ...res,
                                businessId: value.businessId,
                                structureRemainingNum: Number(num) * Number(res.singleNum || 1) + Number(res?.structureRemainingNum || 0),
                                weldingStructureList: res?.weldingStructureList?.map((item, index) => {
                                    return {
                                        ...item,
                                        structureRemainingNum: Number(num) * Number(item.singleNum || 1) + Number(getData?.structureRemainingNum || 0)
                                    }
                                })
                            }
                        } else {
                            return res;
                        }
                    })]
                    if (showParts) {
                        data = data.map(items => {
                            if (items.mainStructureId === value.businessId && items.isChild) {
                                return {
                                    ...items,
                                    structureRemainingNum: Number(num) * Number(items.singleNum || 1) + Number(items?.structureRemainingNum || 0),
                                }
                            } else {
                                return items;
                            }
                        })
                    }
                    setStayDistrict(data);
                }
            }
        } else {
            packagingData[index] = {
                ...value,
                businessId: value.businessId,
                structureCount: value.structureCount - Number(num) * Number(value.singleNum || 1),
                weldingStructureList: packagingData[index].weldingStructureList?.map((res, index) => {
                    return {
                        ...res,
                        structureCount: Number(res.structureCount) - Number(num) * Number(res.singleNum || 1),
                    }
                })
            }
            let list: IBundle[] = []
            if (showParts) {
                list = packagingData.map(res => {
                    if (res.mainStructureId === packagingData[index].businessId && res.isChild) {
                        return {
                            ...res,
                            structureCount: Number(res.structureCount) - Number(num) * Number(res.singleNum || 1)
                        }
                    } else {
                        return res;
                    }
                })
            }
            setPackagingData(showParts ? list : [...packagingData]);
            if (value.id) {
                const newValue = await RequestUtil.get<IBundle>(`/tower-science/packageStructure/delRecord?packageRecordId=${value.id}`);
                const newData: IBundle = { ...newValue, structureRemainingNum: num };
                const find: number = stayDistrict.findIndex((res: IBundle) => {
                    return res.businessId === newData.businessId
                })
                if (find === -1) {
                    let data = showParts ? stayDistrictShowParts([{ ...newValue, structureRemainingNum: num }]) : [{ ...newValue, structureRemainingNum: num }]
                    setStayDistrict([...stayDistrict, ...data]);
                } else {
                    setStayDistrict([...stayDistrict.map((res: IBundle, index: number) => {
                        if (index === find) {
                            return {
                                ...res,
                                structureRemainingNum: num + Number(res?.structureRemainingNum || 0)
                            }
                        } else {
                            return res;
                        }
                    })]);
                }
            } else {
                const newData: IBundle = { ...value, structureRemainingNum: num };
                const find: number = stayDistrict.findIndex((res: IBundle) => {
                    return res.businessId === newData.businessId
                })
                if (find === -1) {
                    const data: IBundle[] = [{
                        ...value,
                        structureRemainingNum: Number(num) * Number(value.singleNum || 1),
                        businessId: value.businessId,
                        weldingStructureList: value.weldingStructureList?.map((res: IBundle, index: number) => {
                            return {
                                ...res,
                                structureRemainingNum: Number(num) * Number(res.singleNum || 1),
                            }
                        })
                    }]
                    let newData = showParts ? stayDistrictShowParts(data) : data
                    setStayDistrict([...stayDistrict, ...newData]);
                } else {
                    let data: IBundle[] = [...stayDistrict.map((res: IBundle, index: number) => {
                        if (index === find) {
                            const getData = res?.weldingStructureList && res?.weldingStructureList.filter(items => items.businessId === res.businessId)[0];
                            return {
                                ...res,
                                businessId: value.businessId,
                                structureRemainingNum: Number(num) * Number(res.singleNum || 1) + Number(res?.structureRemainingNum || 0),
                                weldingStructureList: res?.weldingStructureList?.map((item, index) => {
                                    return {
                                        ...item,
                                        structureRemainingNum: Number(num) * Number(item.singleNum || 1) + Number(getData?.structureRemainingNum || 0),
                                    }
                                })
                            }
                        } else {
                            return res;
                        }
                    })]
                    if (showParts) {
                        data = data.map(items => {
                            if (items.mainStructureId === value.businessId && items.isChild) {
                                return {
                                    ...items,
                                    structureRemainingNum: Number(num) * Number(items.singleNum || 1) + Number(items?.structureRemainingNum || 0),
                                }
                            } else {
                                return items;
                            }
                        })
                    }
                    setStayDistrict(data);
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
                    if (value.businessId === res.businessId) {
                        packagingData.splice(index, 1);
                    }
                })
                if (value.id) {
                    const newValue = await RequestUtil.get<IBundle>(`/tower-science/packageStructure/delRecord?packageRecordId=${value.id}`);
                    const find: number = stayDistrict.findIndex((res: IBundle) => {
                        return res.businessId === newValue.businessId
                    })
                    if (find === -1) {
                        stayDistrict = [...stayDistrict, { ...newValue }]
                    } else {
                        stayDistrict = [...stayDistrict.map((res: IBundle, index: number) => {
                            if (index === find) {
                                return {
                                    ...res,
                                    structureRemainingNum: newValue?.structureRemainingNum
                                }
                            } else {
                                return res
                            }
                        })]
                    }

                    setStayDistrict([...stayDistrict]);
                } else {
                    const find: number = stayDistrict.findIndex((res: IBundle) => {
                        return res.businessId === value.businessId
                    })
                    if (find === -1) {
                        stayDistrict = [...stayDistrict, { ...value, businessId: value.businessId }]
                    } else {
                        stayDistrict = [...stayDistrict.map((res: IBundle, index: number) => {
                            if (index === find) {
                                return {
                                    ...res,
                                    structureRemainingNum: value?.structureRemainingNum
                                }
                            } else {
                                return res
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
        if (value.checkList?.indexOf('squash') >= 0) {
            value.squash = 1
        }
        if (value.checkList?.indexOf('chamfer') >= 0) {
            value.chamfer = 1
        }
        getTableDataSource({ ...value });
    }

    const onSelectChange = (selectedRowKeys: string[], selectRows: IBundle[]) => {
        setSelectedRowKeys(selectedRowKeys);
        setSelectedRow(selectRows);
        setSelectWeight(eval((selectRows || [])?.map(item => { return Number(item.structureRemainingNum) * Number(item.basicsWeight) }).join('+')) || 0);
    }

    const onRemoveSelectChange = (selectedRowKeys: string[], selectRows: IBundle[]) => {
        setRemoveRowKeys(selectedRowKeys);
        setRemoveRow(selectRows)
    }

    const handleModalOk = () => new Promise(async (resove, reject) => {
        try {
            const selectKeys: [] = await editRef.current?.onSubmit() || []
            setReuse(selectKeys);
            setVisible(false);
            resove(true);
        } catch (error) {
            reject(false)
        }
    })

    const stayDistrictShowParts = (data: IBundle[]) => {
        let newStayDistrict: IBundle[] = [];
        data.forEach((res: IBundle, index: number) => {
            if (res?.weldingStructureList && res?.weldingStructureList?.length > 0) {
                newStayDistrict.push(...[
                    { ...res, isChild: false },
                    ...res.weldingStructureList.map(item => {
                        return {
                            ...item,
                            isChild: true
                        }
                    })
                ])
            } else {
                newStayDistrict.push({ ...res, isChild: false })
            }
        })
        return newStayDistrict
    }

    const packagingDataShowParts = (data: IBundle[]) => {
        let newPackagingData: IBundle[] = []
        data.forEach((res: IBundle, index: number) => {
            if (res?.weldingStructureList && res?.weldingStructureList?.length > 0) {
                newPackagingData.push(...[
                    { ...res, isChild: false },
                    ...res.weldingStructureList.map(item => {
                        return {
                            ...item,
                            isChild: true
                        }
                    })
                ])
            } else {
                newPackagingData.push({ ...res, isChild: false })
            }
        })
        return newPackagingData;
    }

    const isShowParts = (e: CheckboxChangeEvent) => {
        setShowParts(e.target.checked);
        let newStayDistrict: IBundle[] = [];
        let newPackagingData: IBundle[] = []
        if (e.target.checked) {
            newStayDistrict = stayDistrictShowParts(stayDistrict);
            newPackagingData = packagingDataShowParts(packagingData);
        } else {
            newStayDistrict = stayDistrict.filter(res => res.isChild === false);
            newPackagingData = packagingData.filter(res => res.isChild === false);
        }

        setStayDistrict([...newStayDistrict]);
        setPackagingData([...newPackagingData]);
    }

    const save = async () => {
        if (form) {
            const data = await form.validateFields();
            const value = {
                ...data,
                id: params.packId,
                productCategoryId: params.id,
                productCategoryName: detailData.productCategoryName,
                productId: params.productId,
                productNumber: detailData.productNumber,
                productIdList: reuse,
                packageRecordSaveDTOList: showParts ? packagingData : packagingDataShowParts(packagingData)
            };
            RequestUtil.post(`/tower-science/packageStructure`, value).then(res => {
                message.success('包装清单保存成功');
                setVisible(false);
                history.goBack();
            })
        }
    }

    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }

    return <>
        <Modal
            destroyOnClose
            visible={visible}
            title="复用杆塔"
            footer={<Space>
                <Button key="back" onClick={() => {
                    setVisible(false)
                }}>
                    取消
                </Button>
                <Button type='primary' onClick={handleModalOk} ghost>保存</Button>
            </Space>}
            className={styles.tryAssemble}
            onCancel={() => {
                setVisible(false)
            }}>
            <ReuseTower productId={params.productId} id={detailData?.productCategoryId || ''} ref={editRef} />
        </Modal>
        <Modal
            visible={removeVisible}
            title="移除"
            okText="确认"
            onCancel={() => {
                setRemoveNum(0);
                setRemoveVisible(false);
            }}
            onOk={() => remove(removeList, removeIndex, removeNum)}
        >
            <Row>
                <Col>数量</Col>
                <Col><InputNumber max={maxNum} value={removeNum} onChange={(e) => setRemoveNum(Number(e))} /></Col>
            </Row>
        </Modal>
        <DetailContent key="packinglistnew" operation={[
            <Space direction="horizontal" size="small" >
                <Button type="ghost" onClick={() => history.goBack()}>关闭</Button>
                <Button type="primary" onClick={() => {
                    save()
                }}>保存并关闭</Button>
                <Button type="primary" onClick={() => {

                }}>保存并继续</Button>
            </Space>
        ]}>
            <DetailTitle title="包装信息" />
            <Form form={form} className={styles.descripForm}>
                <Descriptions title="" bordered size="small" column={7}>
                    <Descriptions.Item label="塔型">
                        {detailData?.productCategoryName}
                    </Descriptions.Item>
                    <Descriptions.Item label="杆塔号">
                        {detailData?.productNumber}
                    </Descriptions.Item>
                    <Descriptions.Item label="包号">
                        <Form.Item name="balesCode">
                            <Input placeholder="自动生成" disabled />
                        </Form.Item>
                    </Descriptions.Item>
                    <Descriptions.Item label="包类型">
                        <Form.Item name="packageType" rules={[{
                            "required": true,
                            "message": "请选择包类型"
                        }]}>
                            <Select placeholder="请选择包类型" style={{ width: "100%" }}>
                                {packageTypeOptions && packageTypeOptions.map(({ id, name }, index) => {
                                    return <Select.Option key={index} value={id}>
                                        {name}
                                    </Select.Option>
                                })}
                            </Select>
                        </Form.Item>
                    </Descriptions.Item>
                    <Descriptions.Item label="包说明">
                        <Form.Item name="packageDescription" rules={[{
                            "required": true,
                            "message": "请输入包说明"
                        }]}>
                            <Input placeholder="请输入" maxLength={300} />
                        </Form.Item>
                    </Descriptions.Item>
                    <Descriptions.Item label="包属性">
                        <Form.Item name="packageAttributeName" rules={[{
                            "required": true,
                            "message": "请选择包属性"
                        }]}>
                            <Select placeholder="请选择包属性" style={{ width: "100%" }}>
                                <Select.Option value="公用" key="1">公用</Select.Option>
                                <Select.Option value="专用" key="2">专用</Select.Option>
                            </Select>
                        </Form.Item>
                    </Descriptions.Item>
                    <Descriptions.Item label="复用杆塔">
                        <Button type="link" onClick={() => { setVisible(true) }} disabled={form.getFieldsValue(true).packageAttributeName === '专用'}>选择杆塔</Button>
                    </Descriptions.Item>
                </Descriptions>
            </Form>
            <DetailTitle title="筛选区" style={{ padding: "8px 0px" }} />
            <Form form={searchForm} layout="inline" onFinish={(value: Record<string, any>) => onFinish(value)}>
                <Form.Item name="checkList">
                    <Checkbox.Group style={{ width: '100%' }}>
                        <Row>
                            <Col span={4}>
                                <Checkbox value="electricWelding" key="1">电焊</Checkbox>
                            </Col>
                            <Col span={4}>
                                <Checkbox value="bend" key="2">火曲</Checkbox>
                            </Col>
                            <Col span={4}>
                                <Checkbox value="rootClear" key="4">清根</Checkbox>
                            </Col>
                            <Col span={4}>
                                <Checkbox value="shovelBack" key="4">铲背</Checkbox>
                            </Col>
                            <Col span={4}>
                                <Checkbox value="squash" key="5">打扁</Checkbox>
                            </Col>
                            <Col span={4}>
                                <Checkbox value="chamfer" key="6">切角</Checkbox>
                            </Col>
                        </Row>
                    </Checkbox.Group>
                </Form.Item>
                <Form.Item name="materialSpec" label="材料名称" className={styles.rightPadding5}>
                    <Input placeholder="请输入" maxLength={20} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="segmentId" label="段名">
                    <Select placeholder="请选择" style={{ width: '100%' }}>
                        {userList && userList.map((item: any) => {
                            return <Select.Option key={item.id} value={item.segmentId}>{item.segmentName}</Select.Option>
                        })}
                    </Select>
                </Form.Item>
                <Form.Item name="segmentId">
                    <Checkbox value="electricWelding" key="7" style={{ width: '100%' }}>公用段</Checkbox>
                </Form.Item>
                <Form.Item name="minLength" label="长度范围" className={styles.rightPadding5}>
                    <Input type="number" min={0} placeholder="请输入" />
                </Form.Item>
                <Form.Item name="maxLength">
                    <Input type="number" min={0} placeholder="请输入" />
                </Form.Item>
                <Form.Item name="code" label="查询">
                    <Input placeholder="构件编号" maxLength={50} />
                </Form.Item>
                <Space direction="horizontal">
                    <Button type="primary" htmlType="submit">搜索</Button>
                    <Button type="ghost" htmlType="reset">重置</Button>
                </Space>
            </Form>
            <p className={styles.titleContent}>
                <span className={styles.title}>待选区</span>
                <span className={styles.description}>未包装数量：
                    <span className={styles.content}>{stayDistrict.length}</span>
                </span>
                <span className={styles.description}>已选择：件数：
                    <span className={styles.content}>{selectWeight}</span>
                </span>
                <span className={styles.description}>重量：
                    <span className={styles.content}>{selectWeight}kg</span>
                </span>
                <span className={styles.description}>电焊件：
                    <span className={styles.content}>{selectWeight}</span>
                </span>
                <p style={{ width: '100%', display: 'inline', paddingLeft: '20px' }}>
                    <Checkbox value="electricWelding" onChange={(e) => isShowParts(e)} key="8">显示电焊件中的零件</Checkbox>
                </p>
                <Button className={styles.fastBtn} type="primary" onClick={addTopack} ghost>添加</Button>
            </p>
            <CommonTable
                haveIndex
                rowKey='businessId'
                columns={[
                    ...chooseColumns.map((item: any) => {
                        if (item.dataIndex === 'code') {
                            return ({
                                ...item,
                                render: (_: number, record: any, key: number): React.ReactNode => (record.isWelding === 1 ? <p className={styles.weldingGreen}>{_}</p> : <span>{_}</span>)
                            })
                        }
                        return item
                    }),
                    {
                        key: 'operation',
                        title: '操作',
                        dataIndex: 'operation',
                        fixed: 'right' as FixedType,
                        width: 100,
                        render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                            <Button type="link" disabled={record.isChild} onClick={() => packaging(record, index)}>添加</Button>
                        )
                    }
                ]}
                pagination={false}
                dataSource={[...stayDistrict]}
                rowSelection={{
                    selectedRowKeys: selectedRowKeys,
                    type: "checkbox",
                    onChange: onSelectChange,
                    getCheckboxProps: (record: Record<string, any>) => ({
                        disabled: record.isChild === true
                    }),
                }}
            />
            <p className={styles.titleContent}>
                <span className={styles.title}>包装区</span>
                <span className={styles.description}>包重量（kg）：
                    <span className={styles.content}>{eval(packagingData.map(item => { return Number(item.num) * Number(item.basicsWeight) }).join('+')) || 0}</span>
                </span>
                <span className={styles.description}> 包件数：
                    <span className={styles.content}>{packagingData.length}</span>
                </span>
                <span className={styles.description}>电焊件：
                    <span className={styles.content}>{selectWeight}</span>
                </span>
                <Button className={styles.fastBtn} type="primary" onClick={packRemove} ghost>移除</Button>
            </p>
            <CommonTable
                haveIndex
                columns={[
                    ...packingColumns.map((item: any) => {
                        if (item.dataIndex === 'pieceCode') {
                            return ({
                                ...item,
                                render: (_: number, record: any, key: number): React.ReactNode => (record.isWelding === 1 ? <p className={styles.weldingGreen}>{_}</p> : <span>{record.isWelding}</span>)
                            })
                        }
                        return item
                    }),
                    {
                        key: 'operation',
                        title: '操作',
                        dataIndex: 'operation',
                        fixed: 'right' as FixedType,
                        width: 100,
                        render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                            <Button type='link' disabled={record.isChild} onClick={() => { setRemoveVisible(true); setRemoveList(record); setRemoveIndex(index); setRemoveNum(Number(record.structureCount) / Number(record.singleNum)); setMaxNum(Number(record.structureCount) / Number(record.singleNum)) }}>移除</Button>
                        )
                    }
                ]}
                pagination={false}
                dataSource={packagingData}
                rowKey="businessId"
                rowSelection={{
                    selectedRowKeys: removeRowKeys,
                    type: "checkbox",
                    onChange: onRemoveSelectChange,
                    getCheckboxProps: (record: Record<string, any>) => ({
                        disabled: record.isChild === true
                    }),
                }}
            />
        </DetailContent>
    </>
}