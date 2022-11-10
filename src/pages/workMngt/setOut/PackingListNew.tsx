/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-放样列表-杆塔配段-包装清单-添加
*/

import React, { useEffect, useRef, useState } from 'react';
import { Space, Button, Input, Col, Row, message, Form, Checkbox, Spin, InputNumber, Descriptions, Modal, Select } from 'antd';
import { CommonAliTable, DetailContent, DetailTitle } from '../../common';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import { componentTypeOptions, packageTypeOptions } from '../../../configuration/DictionaryOptions';
import { IBundle, IPackingList, ITower } from './ISetOut';
import ReuseTower, { EditProps } from './ReuseTower';
import { chooseColumns, packingColumns } from './SetOutInformation.json';
import styles from './SetOut.module.less';

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
    const [reuse, setReuse] = useState<any>();
    const [packageAttributeName, setPackageAttributeName] = useState<string>('专用');
    const [packageWeight, setPackageWeight] = useState<number>(0);
    const [totalWelds, setTotalWelds] = useState<number>(0);
    const [btnLoading, setBtnLoading] = useState<boolean>(false);

    useEffect(() => {
        setPackageWeight(eval((showParts ? [...packagingData] : dataShowParts([...packagingData])).map(item => { return Number(item.totalWeight) }).join('+'))?.toFixed(3) || 0)
        setTotalWelds(eval((showParts ? [...packagingData] : dataShowParts([...packagingData])).filter(res => res.isMainPart === 1).map(item => { return Number(item.singleNum) }).join('+')) || 0)
    }, [JSON.stringify([...packagingData])]
    )

    const { loading, data } = useRequest<IPackingList>(() => new Promise(async (resole, reject) => {
        if (!location.state) {
            const data = await RequestUtil.get<IPackingList>(`/tower-science/packageStructure/structure/list?id=${params.packId}`);
            form.setFieldsValue({ ...data })
            setPackagingData(data?.packageRecordVOList || []);
            setPackageAttributeName(data?.packageAttributeName || '');
        }
        const list = await RequestUtil.get<IBundle[]>(`/tower-science/packageStructure/structureList`, { productId: params.productId, packageStructureId: params.packId });
        setStayDistrict(list.map((res, index) => {
            return {
                ...res,
                isChild: false,
                weldingStructureList: res.weldingStructureList?.map(item => { return { ...item, isChild: true } })
            }
        }));
        const data: any = await RequestUtil.get<[]>(`/tower-science/productSegment/distribution?productId=${params.productId}`);
        setUserList(data?.loftingProductSegmentList);
        resole(data);
    }))

    const detailData: IPackingList = data || {};

    const { data: materialNameLists } = useRequest<string[]>(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get<[]>(`/tower-science/packageStructure/materialNameList?productId=${params.productId}`);
        resole(data);
    }))

    const { data: structureSpecLists, run } = useRequest<string[]>(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get<[]>(`/tower-science/packageStructure/structureSpecList?productId=${params.productId}&materialName=${searchForm.getFieldsValue(true)?.materialSpec || ''}`);
        resole(data);
    }))

    // 添加
    const packaging = (record: IBundle, index: number) => {
        const data: IBundle = {
            ...record,
            pieceCode: record.code,
            description: record.description,
            length: record.length,
            structureSpec: record.structureSpec,
            productCategoryId: detailData.productCategoryId,
            productId: detailData.productId,
            structureCount: record.structureRemainingNum,
            id: '',
            weldingStructureList: record?.weldingStructureList?.map(res => {
                return {
                    ...res,
                    pieceCode: res.code,
                    description: res.description,
                    length: res.length,
                    structureSpec: res.structureSpec,
                    productCategoryId: detailData.productCategoryId,
                    productId: detailData.productId,
                    structureCount: res.structureRemainingNum,
                    id: '',
                }
            })
        }
        let find = packagingData.findIndex((res: IBundle) => {
            return res.businessId === data.businessId
        })
        if (find === -1) {
            packagingData.push(data)
        } else {
            packagingData[find] = {
                ...packagingData[find],
                id: '',
                structureCount: Number(packagingData[find].structureCount) + Number(data.structureRemainingNum),
                totalWeight: (Number(packagingData[find].structureCount) + Number(data.structureRemainingNum)) * Number(data.basicsWeight),
                weldingStructureList: packagingData[find].weldingStructureList?.map((res, ind) => {
                    return {
                        ...res,
                        id: '',
                        structureCount: Number(res.structureCount) + Number(data?.weldingStructureList && data?.weldingStructureList[ind].structureRemainingNum),
                        totalWeight: (Number(res.structureCount) + Number(data?.weldingStructureList && data?.weldingStructureList[ind].structureRemainingNum)) * Number(data.basicsWeight),
                    }
                })
            }
        }
        let newData: IBundle[] = JSON.parse(JSON.stringify(packagingData));
        if (showParts) {
            const list: IBundle[] = newData.filter(res => res.mainStructureId !== data.businessId).filter(res => res.businessId !== data.businessId)
            newData = [...list, ...dataShowParts(packagingData.filter(res => res.businessId === data.businessId))]
        }
        setPackagingData([...newData]);
        stayDistrict.splice(index, 1);
        const list = stayDistrict.filter(res => res.mainStructureId !== data.businessId)
        setStayDistrict([...list]);
        setSelectedRow([]);
        setSelectedRowKeys([]);
        setSelectWeight(0);
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
                    structureSpec: res.structureSpec,
                    productCategoryId: detailData.productCategoryId,
                    productId: detailData.productId,
                    structureCount: res.structureRemainingNum,
                    id: '',
                    isChild: false,
                    weldingStructureList: res?.weldingStructureList?.map(item => {
                        return {
                            ...item,
                            description: item.description,
                            length: item.length,
                            pieceCode: item.code,
                            structureSpec: item.structureSpec,
                            productCategoryId: detailData.productCategoryId,
                            productId: detailData.productId,
                            structureCount: item.structureRemainingNum,
                            isChild: true,
                            id: '',
                        }
                    })
                }
            })
            data?.forEach((record: IBundle) => {
                let find = packagingData.findIndex((res: IBundle) => {
                    return res.businessId === record.businessId
                })
                if (find === -1) {
                    packagingData = [...packagingData, record]
                } else {
                    packagingData[find] = {
                        ...packagingData[find],
                        id: '',
                        structureCount: Number(packagingData[find].structureCount) + Number(record.structureRemainingNum), totalWeight: (Number(packagingData[find].structureCount) + Number(record.structureRemainingNum)) * Number(record.basicsWeight),
                        weldingStructureList: packagingData[find].weldingStructureList?.map((res, index) => {
                            return {
                                ...res,
                                id: '',
                                structureCount: Number(res.structureCount) + Number(record?.weldingStructureList && record?.weldingStructureList[index].structureRemainingNum),
                                totalWeight: (Number(res.structureCount) + Number(record?.weldingStructureList && record?.weldingStructureList[index].structureRemainingNum)) * Number(record.basicsWeight),
                            }
                        })
                    }
                }
            })
            let newPackagingData: IBundle[] = JSON.parse(JSON.stringify(packagingData));
            if (showParts) {
                data.forEach(items => {
                    newPackagingData = newPackagingData.filter(res => res.mainStructureId !== items.businessId).filter(res => res.businessId !== items.businessId)
                    newPackagingData = [...newPackagingData, ...dataShowParts(packagingData.filter(res => res.businessId === items.businessId))]
                })
            }
            setPackagingData([...newPackagingData]);
            let list: IBundle[] = stayDistrict
            data?.forEach((record: IBundle) => {
                list = list.filter(res => res.businessId !== record.businessId).filter(item => item.mainStructureId !== record.businessId);
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
        if (num === Number(value.structureCount) / Number(value.singleNum || 1)) {
            packagingData.splice(index, 1);
            const list = packagingData.filter(res => res.mainStructureId !== value.businessId);
            setPackagingData([...list]);
        } else {
            packagingData[index] = {
                ...value,
                businessId: value.businessId,
                structureCount: value.structureCount - Number(num) * Number(value.singleNum || 1),
                totalWeight: (value.structureCount - Number(num) * Number(value.singleNum || 1)) * Number(value.basicsWeight),
                weldingStructureList: packagingData[index].weldingStructureList?.map((res, index) => {
                    return {
                        ...res,
                        businessId: res.businessId,
                        structureCount: Number(res.structureCount) - Number(num) * Number(res.singleNum || 1),
                        totalWeight: (Number(res.structureCount) - Number(num) * Number(res.singleNum || 1)) * Number(res.basicsWeight),
                    }
                })
            }
            let list: IBundle[] = []
            if (showParts) {
                list = packagingData.map(res => {
                    if (res.mainStructureId === packagingData[index].businessId && res.isChild) {
                        return {
                            ...res,
                            structureCount: Number(res.structureCount) - Number(num) * Number(res.singleNum || 1),
                            totalWeight: (Number(res.structureCount) - Number(num) * Number(res.singleNum || 1)) * Number(res.basicsWeight),
                        }
                    } else {
                        return res;
                    }
                })
            }
            setPackagingData(showParts ? [...list] : [...packagingData]);
        }
        if (value.id) {
            const newValue = await RequestUtil.get<IBundle>(`/tower-science/packageStructure/delRecord?packageRecordId=${value.id}`);
            const find: number = stayDistrict.findIndex((res: IBundle) => {
                return res.businessId === newValue.businessId
            })
            if (find === -1) {
                const data: IBundle = {
                    ...newValue,
                    structureRemainingNum: Number(num) * Number(value.singleNum || 1),
                    weldingStructureList: newValue.weldingStructureList?.map((res: IBundle, index: number) => {
                        return {
                            ...res,
                            structureRemainingNum: Number(num) * Number(res.singleNum || 1),
                        }
                    })
                }
                stayDistrict.push(data)
            } else {
                stayDistrict[find] = {
                    ...stayDistrict[find],
                    structureRemainingNum: Number(num) * Number(newValue.singleNum || 1) + Number(stayDistrict[find]?.structureRemainingNum || 0),
                    weldingStructureList: stayDistrict[find]?.weldingStructureList?.map((item, index) => {
                        return {
                            ...item,
                            structureRemainingNum: Number(num) * Number(item.singleNum || 1) + Number(item?.structureRemainingNum || 0)
                        }
                    })
                }
            }
            let newStayDistrict: IBundle[] = JSON.parse(JSON.stringify(stayDistrict));
            if (showParts) {
                const list: IBundle[] = newStayDistrict.filter(res => res.mainStructureId !== value.businessId).filter(res => res.businessId !== value.businessId)
                newStayDistrict = [...list, ...dataShowParts(stayDistrict.filter(res => res.businessId === value.businessId))]
            }
            setStayDistrict(newStayDistrict);
        } else {
            const find: number = stayDistrict.findIndex((res: IBundle) => {
                return res.businessId === value.businessId
            })
            if (find === -1) {
                const data: IBundle = {
                    ...value,
                    code: value.pieceCode,
                    structureRemainingNum: Number(num) * Number(value.singleNum || 1),
                    weldingStructureList: value.weldingStructureList?.map((res: IBundle, index: number) => {
                        return {
                            ...res,
                            code: res.pieceCode,
                            structureRemainingNum: Number(num) * Number(res.singleNum || 1),
                        }
                    })
                }
                stayDistrict.push(data)
            } else {
                stayDistrict[find] = {
                    ...stayDistrict[find],
                    code: value.pieceCode,
                    structureRemainingNum: Number(num) * Number(value.singleNum || 1) + Number(stayDistrict[find]?.structureRemainingNum || 0),
                    weldingStructureList: stayDistrict[find]?.weldingStructureList?.map((item, index) => {
                        return {
                            ...item,
                            code: item.pieceCode,
                            structureRemainingNum: Number(num) * Number(item.singleNum || 1) + Number(item?.structureRemainingNum || 0)
                        }
                    })
                }
            }
            let newStayDistrict: IBundle[] = JSON.parse(JSON.stringify(stayDistrict));
            if (showParts) {
                const list: IBundle[] = newStayDistrict.filter(res => res.mainStructureId !== value.businessId).filter(res => res.businessId !== value.businessId)
                newStayDistrict = [...list, ...dataShowParts(stayDistrict.filter(res => res.businessId === value.businessId))]
            }
            setStayDistrict(newStayDistrict);
        }
        setRemoveVisible(false);
        setRemoveIndex(undefined);
        setRemoveNum(0);
        setRemoveList({});
        setSelectedRow([]);
        setSelectedRowKeys([]);
    }

    // 批量移除
    const packRemove = () => {
        if (removeRow.length > 0) {
            let list: IBundle[] = packagingData
            removeRow?.forEach((value: IBundle, index: number) => {
                list = list.filter(res => res.businessId !== value.businessId).filter(item => item.mainStructureId !== value.businessId);
            })
            setPackagingData([...list]);
            removeRow?.forEach(async (value: IBundle, index: number) => {
                if (value.id) {
                    const newValue = await RequestUtil.get<IBundle>(`/tower-science/packageStructure/delRecord?packageRecordId=${value.id}`);
                    const find: number = stayDistrict.findIndex((res: IBundle) => {
                        return res.businessId === newValue.businessId
                    })
                    if (find === -1) {
                        stayDistrict.push(newValue)
                    } else {
                        stayDistrict[find] = {
                            ...stayDistrict[find],
                            code: value.pieceCode,
                            structureRemainingNum: Number(newValue?.structureCount) + Number(stayDistrict[find].structureRemainingNum),
                            weldingStructureList: stayDistrict[find]?.weldingStructureList?.map((item, index) => {
                                return {
                                    ...item,
                                    code: item.pieceCode,
                                    structureRemainingNum: Number(newValue.weldingStructureList && newValue.weldingStructureList[index]?.structureCount) + Number(item?.structureRemainingNum || 0),
                                }
                            })
                        }
                    }
                    let newStayDistrict: IBundle[] = JSON.parse(JSON.stringify(stayDistrict));
                    if (showParts) {
                        const list: IBundle[] = newStayDistrict.filter(res => res.mainStructureId !== value.businessId).filter(res => res.businessId !== value.businessId)
                        newStayDistrict = [...list, ...dataShowParts(stayDistrict.filter(res => res.businessId === value.businessId))]
                    }
                    setStayDistrict([...newStayDistrict]);
                } else {
                    const find: number = stayDistrict.findIndex((res: IBundle) => {
                        return res.businessId === value.businessId
                    })
                    if (find === -1) {
                        stayDistrict.push(value)
                    } else {
                        stayDistrict[find] = {
                            ...stayDistrict[find],
                            code: value.pieceCode,
                            structureRemainingNum: Number(value?.structureCount) + Number(stayDistrict[find].structureRemainingNum),
                            weldingStructureList: stayDistrict[find]?.weldingStructureList?.map((item, index) => {
                                return {
                                    ...item,
                                    code: item.pieceCode,
                                    structureRemainingNum: Number(value.weldingStructureList && value.weldingStructureList[index]?.structureCount) + Number(item?.structureRemainingNum || 0),
                                }
                            })
                        }
                    }
                    let newStayDistrict: IBundle[] = JSON.parse(JSON.stringify(stayDistrict));
                    if (showParts) {
                        const list: IBundle[] = newStayDistrict.filter(res => res.mainStructureId !== value.businessId).filter(res => res.businessId !== value.businessId)
                        newStayDistrict = [...list, ...dataShowParts(stayDistrict.filter(res => res.businessId === value.businessId))]
                    }
                    setStayDistrict([...newStayDistrict]);
                }
            })
            setRemoveRow([]);
            setRemoveRowKeys([]);
            setSelectedRow([]);
            setSelectedRowKeys([]);
        } else {
            message.warning('请选择要移除的数据')
        }
    }

    const onFinish = async (value: Record<string, any>) => {
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
        if (value.isCommonSegment?.indexOf('isCommonSegment') >= 0) {
            value.isCommonSegment = 1
        }
        if (value.structureSpecs) {
            value.structureSpecStr = value.structureSpecs.join(',')
        }
        if (value.segmentId) {
            value.segmentIdStr = value.segmentId.join(',')
        }
        if (value.type) {
            value.typeDictIdStr = value.type.join(',')
        }
        let list = await RequestUtil.get<IBundle[]>(`/tower-science/packageStructure/structureList`, { productId: params.productId, ...value, packageStructureId: params.packId });
        list = list.map(res => {
            const packagingRow = packagingData.filter(item => item.businessId === res.businessId);
            if (packagingRow.length > 0) {
                return {
                    ...res,
                    isChild: false,
                    structureRemainingNum: Number(res.packageRemainingNum) - Number(packagingRow[0].structureCount),
                    weldingStructureList: res.weldingStructureList?.map(item => { return { ...item, isChild: true } })
                }
            } else {
                return {
                    ...res,
                    isChild: false,
                    weldingStructureList: res.weldingStructureList?.map(item => { return { ...item, isChild: true } })
                }
            }
        })
        if (showParts) {
            setStayDistrict(dataShowParts(list));
        } else {
            setStayDistrict(list);
        }
    }

    const onSelectChange = (selectedRowKeys: string[], selectRows: IBundle[]) => {
        setSelectedRowKeys(selectedRowKeys);
        setSelectedRow(selectRows);
        setSelectWeight(eval((dataShowParts(selectRows) || [])?.map(item => {
            return Number(item.structureRemainingNum) * Number(item.basicsWeight)
        }).join('+'))?.toFixed(3) || 0);
    }

    const onRemoveSelectChange = (selectedRowKeys: string[], selectRows: IBundle[]) => {
        setRemoveRowKeys(selectedRowKeys);
        setRemoveRow(selectRows)
    }

    const handleModalOk = () => new Promise(async (resove, reject) => {
        try {
            const selectRows: ITower[] = await editRef.current?.onSubmit() || [];
            if (selectRows.length > 0) {
                setReuse(selectRows?.map(res => res?.id));
            }
            setVisible(false);
            form.setFieldsValue({ towers: selectRows.map(res => res.productNumber) })
            resove(true);
        } catch (error) {
            reject(false)
        }
    })

    const dataShowParts = (data: IBundle[]) => {
        let newData: IBundle[] = [];
        data.forEach((res: IBundle, index: number) => {
            if (res?.weldingStructureList && res?.weldingStructureList?.length > 0) {
                newData.push(...[
                    { ...res, isChild: false },
                    ...res.weldingStructureList.map(item => {
                        return {
                            ...item,
                            isChild: true
                        }
                    })
                ])
            } else {
                newData.push({ ...res, isChild: false })
            }
        })
        return newData
    }

    const isShowParts = (e: boolean) => {
        setShowParts(e);
        let newStayDistrict: IBundle[] = [];
        let newPackagingData: IBundle[] = []
        if (e) {
            newStayDistrict = dataShowParts(stayDistrict);
            newPackagingData = dataShowParts(packagingData);
        } else {
            newStayDistrict = stayDistrict.filter(res => res.isChild === false);
            newPackagingData = packagingData.filter(res => res.isChild === false);
        }

        setStayDistrict([...newStayDistrict]);
        setPackagingData([...newPackagingData]);
    }

    const save = async (tip: number) => {
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
                packageRecordSaveDTOList: showParts ? packagingData : dataShowParts(packagingData)
            };
            setBtnLoading(true);
            RequestUtil.post(`/tower-science/packageStructure`, value).then(res => {
                message.success('包装清单保存成功');
                setBtnLoading(false);
                if (tip === 0) {
                    history.goBack();
                } else {
                    history.go(0)
                }
            }).catch((error) => {
                console.log(error);
                setBtnLoading(false);
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
            <ReuseTower productId={params.productId} selectedKeys={reuse || []} id={detailData?.productCategoryId || ''} ref={editRef} />
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
        <DetailContent operation={[
            <Space direction="horizontal" size="small" key="operation">
                <Button type="ghost" onClick={() => history.goBack()}>关闭</Button>
                <Button type="primary" loading={btnLoading} onClick={() => {
                    save(0);
                }}>保存并关闭</Button>
                {params.packId ? null : <Button loading={btnLoading} type="primary" onClick={() => {
                    save(1);
                }}>保存并继续</Button>}
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
                        <Form.Item name="packageDescription">
                            <Input placeholder="请输入" maxLength={300} />
                        </Form.Item>
                    </Descriptions.Item>
                    <Descriptions.Item label="包属性">
                        <Form.Item name="packageAttributeName" rules={[{
                            "required": true,
                            "message": "请选择包属性"
                        }]}>
                            <Select placeholder="请选择包属性" onChange={(e) => { setPackageAttributeName(e?.toString() || '') }} style={{ width: "100%" }}>
                                <Select.Option value="公用" key="1">公用</Select.Option>
                                <Select.Option value="专用" key="2">专用</Select.Option>
                            </Select>
                        </Form.Item>
                    </Descriptions.Item>
                    <Descriptions.Item label="复用杆塔">
                        <Form.Item name="towers">
                            <Input addonBefore={<Button type="link" onClick={() => { setVisible(true) }} disabled={packageAttributeName === '专用'}>选择杆塔</Button>} disabled />
                        </Form.Item>
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
                    <Select placeholder="请选择" style={{ width: '150px' }} onChange={(e) => run(e)}>
                        {
                            materialNameLists && materialNameLists?.map((item: any) => {
                                return <Select.Option key={item} value={item}>{item}</Select.Option>
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item name="structureSpecs" label="规格" className={styles.rightPadding5}>
                    <Select placeholder="请选择" style={{ width: '150px' }} mode="multiple">
                        {
                            structureSpecLists && structureSpecLists?.map((item: any) => {
                                return <Select.Option key={item} value={item}>{item}</Select.Option>
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item name="segmentId" label="段名">
                    <Select placeholder="请选择" style={{ width: '150px' }} mode="multiple">
                        {userList && userList.map((item: any) => {
                            return <Select.Option key={item.segmentId} value={item.segmentId}>{item.segmentName}</Select.Option>
                        })}
                    </Select>
                </Form.Item>
                <Form.Item name="type" label="零件类型">
                    <Select placeholder="请选择" style={{ width: '150px' }} mode="multiple">
                        {componentTypeOptions?.map((item: any, index: number) =>
                            <Select.Option value={item.id} key={index}>{item.name}</Select.Option>
                        )}
                    </Select>
                </Form.Item>
                <Form.Item name="isCommonSegment">
                    <Checkbox.Group style={{ width: '100%' }}>
                        <Checkbox value="isCommonSegment" key="7" style={{ width: '100%' }}>公用段</Checkbox>
                    </Checkbox.Group>
                </Form.Item>
                <Form.Item name="minLength" label="长度范围" className={styles.rightPadding5}>
                    <Input type="number" min={0} placeholder="请输入" />
                </Form.Item>
                <Form.Item name="maxLength">
                    <Input type="number" min={0} placeholder="请输入" />
                </Form.Item>
                <Form.Item name="code" label="查询">
                    <Input placeholder="件号" maxLength={50} />
                </Form.Item>
                <Space direction="horizontal">
                    <Button type="primary" htmlType="submit">搜索</Button>
                    <Button type="ghost" htmlType="reset">重置</Button>
                </Space>
            </Form>
            <Row gutter={12}>
                <Col span={12}>
                    <Row className={styles.titleContent} justify="space-between">
                        <Col className={styles.title}>待选区</Col>
                        <Col>未包装数量：
                            <span className={styles.content}>{showParts ? stayDistrict?.length : dataShowParts(stayDistrict).length}</span>
                        </Col>
                        <Col>已选择：件数：
                            <span className={styles.content}>{dataShowParts(selectedRow).length}</span>
                        </Col>
                        <Col>重量：
                            <span className={styles.content}>{selectWeight}kg</span>
                        </Col>
                        <Col>电焊件：
                            <span className={styles.content}>{eval(dataShowParts(selectedRow).filter(res => res.isMainPart === 1).map(item => { return Number(item.singleNum) }).join('+'))}</span>
                        </Col>
                        <Col>
                            <Checkbox value="electricWelding" onChange={(e) => isShowParts(e.target.checked)} key="8">显示电焊件中的零件</Checkbox>
                        </Col>
                        <Col>
                            <Button type="primary" onClick={addTopack} ghost>添加</Button>
                        </Col>

                    </Row>
                    <CommonAliTable
                        haveIndex
                        rowKey='businessId'
                        style={{ overflow: "auto", maxHeight: 400 }}
                        columns={[
                            ...chooseColumns.map((item: any) => {
                                if (item.dataIndex === 'code') {
                                    if (!showParts) {
                                        return ({
                                            ...item,
                                            sorter: (a: any, b: any) => a.code.replace(/[^0-9]/ig, '') - b.code.replace(/[^0-9]/ig, ''),
                                            render: (_: number, record: any, key: number): React.ReactNode => (record.isMainPart === 1 ? <p className={styles.weldingGreen}>{_}</p> : <span>{_}</span>)
                                        })
                                    } else {
                                        return ({
                                            ...item,
                                            render: (_: number, record: any, key: number): React.ReactNode => (record.isMainPart === 1 ? <p className={styles.weldingGreen}>{_}</p> : <span>{_}</span>)
                                        })
                                    }

                                }
                                if (item.dataIndex === 'segmentName' && !showParts) {
                                    return ({
                                        ...item,
                                        sorter: (a: any, b: any) => a.segmentName - b.segmentName
                                    })
                                }
                                if (item.dataIndex === 'totalWeight' && !showParts) {
                                    return ({
                                        ...item,
                                        sorter: (a: any, b: any) => a.totalWeight - b.totalWeight
                                    })
                                }
                                if (item.dataIndex === 'length' && !showParts) {
                                    return ({
                                        ...item,
                                        sorter: (a: any, b: any) => a.length - b.length
                                    })
                                }
                                if (item.dataIndex === 'structureSpec' && !showParts) {
                                    return ({
                                        ...item,
                                        sorter: (a: any, b: any) => (a.structureSpec.split('*')[0].replace(/[^0-9]/ig, '') - b.structureSpec.split('*')[0].replace(/[^0-9]/ig, ''))
                                    })
                                }
                                if (item.dataIndex === 'structureSpec' && !showParts) {
                                    return ({
                                        ...item,
                                        sorter: (a: any, b: any) => a.structureSpec.length - b.structureSpec.length
                                    })
                                }
                                return item
                            }),
                            {
                                key: 'operation',
                                title: '操作',
                                dataIndex: 'operation',
                                fixed: 'right',
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
                            onChange: onSelectChange,
                            getCheckboxProps: (record: Record<string, any>) => !!record.isChild,
                        }}
                    />
                </Col>
                <Col span={12}>
                    <Row className={styles.titleContent} justify="space-between">
                        <Col span={4} className={styles.title}>包装区</Col>
                        <Col span={4}>包重量（kg）：
                            <span className={styles.content}>{packageWeight}</span>
                        </Col>
                        <Col span={4}> 包件数：
                            <span className={styles.content}>{showParts ? packagingData?.length : dataShowParts(packagingData).length}</span>
                        </Col>
                        <Col span={4}>电焊件：
                            {/* <span className={styles.content}>{(showParts ? packagingData : dataShowParts(packagingData)).filter(res => res.isMainPart === 1).length}</span> */}
                            <span className={styles.content}>{totalWelds}</span>
                        </Col>
                        <Col span={8}>
                            <Button className={styles.fastBtn} type="primary" onClick={packRemove} ghost>移除</Button>
                        </Col>
                    </Row>
                    <CommonAliTable
                        haveIndex
                        columns={[
                            ...packingColumns.map((item: any) => {
                                if (item.dataIndex === 'pieceCode') {
                                    return ({
                                        ...item,
                                        render: (_: number, record: any, key: number): React.ReactNode => (record.isMainPart === 1 ? <p className={styles.weldingGreen}>{_}</p> : <span>{_}</span>)
                                    })
                                }
                                return item
                            }),
                            {
                                key: 'operation',
                                title: '操作',
                                dataIndex: 'operation',
                                fixed: 'right',
                                width: 100,
                                render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                                    <Button type='link' disabled={record.isChild} onClick={() => { setRemoveVisible(true); setRemoveList(record); setRemoveIndex(index); setRemoveNum(Number(record.structureCount) / Number(record.singleNum || 1)); setMaxNum(Number(record.structureCount) / Number(record.singleNum || 1)); }}>移除</Button>
                                )
                            }
                        ] as any}
                        pagination={false}
                        dataSource={packagingData}
                        style={{ overflow: "auto", maxHeight: 400 }}
                        rowKey="businessId"
                        rowSelection={{
                            selectedRowKeys: removeRowKeys,
                            onChange: onRemoveSelectChange,
                            getCheckboxProps: (record: Record<string, any>) => !!record.isChild,
                        }}
                    />
                </Col>
            </Row>
        </DetailContent>
    </>
}