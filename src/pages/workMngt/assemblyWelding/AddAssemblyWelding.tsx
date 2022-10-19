/**
 * @author zyc
 * @copyright © 2022
 * @description 工作管理-组焊列表-组焊清单-添加组焊
 */

import React, { useEffect, useState } from 'react';
import { Space, Input, Select, Button, Form, Row, Col, InputNumber, Radio, Popconfirm, message, Spin, Checkbox } from 'antd';
import { CommonAliTable, DetailContent, DetailTitle } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './AssemblyWelding.module.less';
import { useHistory, useParams } from 'react-router-dom';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import { IComponentList, IResponseData, ISegmentNameList } from './IAssemblyWelding';
import { compoundTypeOptions } from '../../../configuration/DictionaryOptions';

export default function AddAssemblyWelding(): React.ReactNode {
    const params = useParams<{ id: string, productCategoryId: string, segmentId?: string }>();
    const [weldingDetailedStructureList, setWeldingDetailedStructureList] = useState<IComponentList[]>();
    const [mainPartId, setMainPartId] = useState<string>('');
    const [componentList, setComponentList] = useState<IComponentList[]>([]);
    const [form] = Form.useForm();
    const history = useHistory();
    const [settingData, setSettingData] = useState<IComponentList[]>([]);
    const [segment, setSegment] = useState<string>('');
    const [checked, setChecked] = useState<boolean>(false);
    const [toLeftNum, setToLeftNum] = useState<number[]>([]);
    const [toRightNum, setToRightNum] = useState<number[]>([]);
    const [leftSelectedRowKeys, setLeftSelectedRowKeys] = useState<string[]>([]);
    const [leftSelectedRows, setLeftSelectedRows] = useState<any[]>([]);
    const [rightSelectedRowKeys, setRightSelectedRowKeys] = useState<string[]>([]);
    const [rightSelectedRows, setRightSelectedRows] = useState<any[]>([]);
    const type = window.location.pathname.split('/')[7];

    const { loading, data } = useRequest<ISegmentNameList[]>(() => new Promise(async (resole, reject) => {
        const data: ISegmentNameList[] = await RequestUtil.get(`/tower-science/welding/getWeldingSegment?weldingId=${params.id}`);
        if (params.segmentId) {
            const result: IComponentList[] = await RequestUtil.get(`/tower-science/welding/getStructureById`, { segmentId: params.segmentId, flag: type === 'apply' ? 1 : 0 });
            setWeldingDetailedStructureList([...result]);
            toLeftNum.length = result.length;
            toLeftNum.fill(0);
            setToLeftNum(toLeftNum)
            setSettingData([...result]);
            const baseData = await RequestUtil.get<IResponseData>(`/tower-science/welding/getDetailedById`, { weldingId: params.id, segmentId: params.segmentId });
            setMainPartId(baseData.records[0]?.mainPartId || '');
            form.setFieldsValue({ ...baseData.records[0], segmentName: [] });
            setSegment(baseData?.records[0]?.segmentId + ',' + baseData?.records[0]?.segmentName)
            getComponentList({})
        } else {
            setWeldingDetailedStructureList([]);
            segmentChange(['all'], data)
        }
        resole(data);
    }), {})

    const segmentNameList: ISegmentNameList[] = data || [];

    useEffect(() => {
        isShowZero(componentList, checked)
    }, [checked])

    const componentColumns = [
        {
            title: '段名',
            dataIndex: 'segmentName',
            key: 'segmentName',
            width: 80
        },
        {
            title: '构件编号',
            dataIndex: 'code',
            key: 'code',
            width: 120
        },
        {
            title: '材料名称',
            dataIndex: 'materialName',
            key: 'materialName'
        },
        {
            title: '材质',
            dataIndex: 'structureTexture',
            key: 'structureTexture'
        },
        {
            title: '单段件数',
            dataIndex: 'basicsPartNum',
            key: 'basicsPartNum',
            width: 100
        },
        {
            title: '剩余数量',
            dataIndex: 'basicsPartNumNow',
            key: 'basicsPartNumNow',
            type: 'number',
            width: 100
        },
        {
            title: '备注',
            dataIndex: 'description',
            key: 'description'
        },
        {
            title: '移动数量',
            dataIndex: 'toRightNum',
            key: 'toRightNum',
            type: 'number',
            fixed: 'right' as FixedType,
            width: 100,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <InputNumber min={0} size="small" value={toRightNum && toRightNum[index]} onChange={(e) => {
                    setToRightNum(toRightNum?.map((res: number, ind: number) => {
                        if (index === ind) {
                            return Number(e)
                        } else {
                            return res || 0
                        }
                    }))
                }} />
            )
        },
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            fixed: 'right' as FixedType,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Space>
                    <Button type="link" disabled={leftSelectedRows.length > 0 || rightSelectedRows.length > 0} onClick={() => addComponent(record, 1)}>右移</Button>
                    <Button type="link" disabled={leftSelectedRows.length > 0 || rightSelectedRows.length > 0} onClick={() => {
                        toRightNum && toRightNum[index] > 0 && onMove('批量右移', toRightNum && toRightNum[index], record, index);
                    }}>批量移动</Button>
                </Space>

            )
        }
    ]

    const columns = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>),
            width: 80
        },
        {
            title: '零件号',
            dataIndex: 'code',
            key: 'code',
            width: 100
        },
        {
            title: '材料',
            dataIndex: 'materialName',
            key: 'materialName',
            width: 80
        },
        {
            title: '材质',
            dataIndex: 'structureTexture',
            key: 'structureTexture',
            width: 80
        },
        {
            title: '规格',
            dataIndex: 'structureSpec',
            key: 'structureSpec',
            width: 100
        },
        {
            title: '长（mm）',
            dataIndex: 'length',
            key: 'length',
            width: 80
        },
        {
            title: '宽（mm）',
            dataIndex: 'width',
            key: 'width',
            width: 80
        },
        {
            title: '厚度（mm）',
            dataIndex: 'width',
            key: 'width',
            width: 100
        },
        {
            title: '单组件数',
            dataIndex: 'singleNum',
            key: 'singleNum',
            width: 80
        },
        {
            title: '备注',
            dataIndex: 'description',
            key: 'description'
        },
        {
            title: '是否主件',
            dataIndex: 'isMainPart',
            key: 'isMainPart',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Radio
                    key={record.structureId}
                    checked={weldingDetailedStructureList && weldingDetailedStructureList[index].isMainPart === 1}
                    onChange={(e) => {
                        let newWeldingDetailedStructureList: IComponentList[] = weldingDetailedStructureList || [];
                        if (e.target.checked) {
                            setMainPartId(record.code);
                            newWeldingDetailedStructureList = newWeldingDetailedStructureList.map((item: IComponentList, ind: number) => {
                                if (index === ind) {
                                    return {
                                        ...item,
                                        isMainPart: 1
                                    }
                                } else {
                                    return {
                                        ...item,
                                        isMainPart: 0
                                    }
                                }
                            })
                        } else {
                            newWeldingDetailedStructureList[index] = {
                                ...newWeldingDetailedStructureList[index],
                                isMainPart: 0
                            }
                        }
                        setWeldingDetailedStructureList([...newWeldingDetailedStructureList])
                        setSegment(record.segmentId + ',' + record.segmentName)
                        form.setFieldsValue({ 'segmentGroupNum': record.basicsPartNum });
                    }}></Radio>
            )
        },
        {
            title: '电焊长度（mm）',
            dataIndex: 'weldingLength',
            key: 'weldingLength'
        },
        {
            title: '移动数量',
            dataIndex: 'toLeftNum',
            key: 'toLeftNum',
            type: 'number',
            fixed: 'right' as FixedType,
            width: 100,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <InputNumber min={0} size="small" max={Number(record.singleNum)} value={toLeftNum && toLeftNum[index]} onChange={(e) => {
                    setToLeftNum(toLeftNum?.map((res: number, ind: number) => {
                        if (index === ind) {
                            return Number(e)
                        } else {
                            return res
                        }
                    }))
                }} />
            )
        },
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            fixed: 'right' as FixedType,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Space>
                    <Popconfirm
                        title="确认移除?"
                        onConfirm={() => removeRow(record, index, 1)}
                        okText="移除"
                        cancelText="取消"
                        disabled={leftSelectedRows.length > 0 || rightSelectedRows.length > 0}
                    >
                        <Button type="link" disabled={leftSelectedRows.length > 0 || rightSelectedRows.length > 0}>移除</Button>
                    </Popconfirm>
                    <Button type="link" disabled={leftSelectedRows.length > 0 || rightSelectedRows.length > 0} onClick={() => {
                        toLeftNum && toLeftNum[index] > 0 && onMove('批量移除', toLeftNum && toLeftNum[index], record, index);
                    }}>批量移动</Button>
                </Space>
            )
        }
    ]

    /**
     * @description 获取构件明细列表 
     */
    const getComponentList = (values: Record<string, any>) => {
        if (form && values.length > 0) {
            form.validateFields(['segmentName']).then(async res => {
                let data: IComponentList[] = await RequestUtil.post(`/tower-science/welding/getStructure`, {
                    weldingSegmentDTOS: values,
                    productCategoryId: params.productCategoryId,
                    segmentId: params.segmentId || ''
                });
                if (params.segmentId && type === 'edit') {
                    settingData.forEach((items: IComponentList) => {
                        data = data.map((item: IComponentList) => {
                            if (items.structureId === item.id) {
                                return {
                                    ...item,
                                    basicsPartNumNow: Number(item.basicsPartNumNow || 0) + Number(items.singleNum || 0)
                                }
                            } else {
                                return {
                                    ...item,
                                    basicsPartNumNow: Number(item.basicsPartNumNow || 0)
                                }
                            }
                        })
                    })
                }
                data = data.map(res => {
                    const weldingDetailedStructureListNew: IComponentList[] = weldingDetailedStructureList?.filter(item => item.structureId === res.id) || [];
                    if (weldingDetailedStructureListNew.length > 0) {
                        return {
                            ...res,
                            basicsPartNumNow: Number(res.basicsPartNumNow) - Number(weldingDetailedStructureListNew[0].singleNum)
                        }
                    } else {
                        return { ...res }
                    }
                })
                let newData = data.filter(res => {
                    return Number(res.basicsPartNumNow) !== 0
                })
                setComponentList(checked ? [...data] : [...newData])
                toRightNum.length = checked ? data.length : newData.length;
                toRightNum.fill(0);
                setToRightNum(toRightNum)
            })
        }
    }

    /**
    * @descriptions 可选构件明细右移
    */
    const addComponent = (record: Record<string, any>, num: number) => {
        let newWeldingDetailedStructureList: IComponentList[] = weldingDetailedStructureList || [];
        let weldingLength: number = form?.getFieldsValue(true)?.electricWeldingMeters;
        let weight: number = Number(form.getFieldsValue(true).singleGroupWeight || 0) + (Number(record.basicsWeight) || 0) * (Number(num) || 1);
        let isNewComponent: boolean = newWeldingDetailedStructureList.every((items: IComponentList) => {
            return record.id !== items.structureId;
        })
        let newComponentList: IComponentList = isNewComponent ? {
            ...record,
            id: '',
            structureId: record.id,
            singleNum: num,
            isMainPart: 0,
            weldingLength: record.weldingEdge
        } : {}
        newWeldingDetailedStructureList = newWeldingDetailedStructureList.map((item: IComponentList) => {
            if (item.structureId === record.id) {
                return {
                    ...item,
                    singleNum: Number(item.singleNum) + Number(num),
                    basicsPartNumNow: Number(record.basicsPartNumNow || 0)
                }
            } else {
                return {
                    ...item,
                    basicsPartNumNow: Number(record.basicsPartNumNow || 0)
                }
            }
        })
        form.setFieldsValue({ 'singleGroupWeight': weight?.toFixed(3), 'electricWeldingMeters': (Number(weldingLength || 0) + (Number(num) || 1) * Number(record.weldingEdge || 0))?.toFixed(3) });
        const newList = Object.keys(newComponentList).length > 0 ? [...newWeldingDetailedStructureList, newComponentList] : [...newWeldingDetailedStructureList]
        setWeldingDetailedStructureList([...newList]);
        toLeftNum.length = newList.length;
        toLeftNum.fill(0);
        setToLeftNum(toLeftNum)
        const list = componentList?.map((res: IComponentList) => {
            if (res.id === record.id) {
                return {
                    ...res,
                    basicsPartNumNow: Number(res.basicsPartNumNow) - Number(num)
                }
            } else {
                return res
            }
        })
        const noZero = list.filter(res => {
            return Number(res.basicsPartNumNow) !== 0
        })
        setComponentList(checked ? [...list] : noZero)
        toRightNum.length = checked ? list.length : noZero.length;
        toRightNum.fill(0);
        setToRightNum(toRightNum)
    }

    /**
     * @description 构件信息移除行 
     */
    const removeRow = async (record: Record<string, any>, index: number, num: number) => {
        let weight: number = Number(form.getFieldsValue(true).singleGroupWeight || 0) - (Number(record.basicsWeight) * Number(num) || 0);
        let electricWeldingMeters: number = Number(form.getFieldsValue(true).electricWeldingMeters || 0) - Number(record.weldingLength || 0) * Number(num);
        form.setFieldsValue({ 'singleGroupWeight': weight?.toFixed(3), 'electricWeldingMeters': electricWeldingMeters?.toFixed(4) });
        if (Number(record.singleNum) === Number(num)) {
            weldingDetailedStructureList?.splice(index, 1);
            setWeldingDetailedStructureList([...weldingDetailedStructureList || []])
            toLeftNum.length = weldingDetailedStructureList?.length || 0;
            toLeftNum.fill(0);
            setToLeftNum(toLeftNum)
        } else {
            setWeldingDetailedStructureList(weldingDetailedStructureList?.map((res: IComponentList) => {
                if (res.structureId === record.structureId) {
                    return {
                        ...res,
                        singleNum: Number(res.singleNum) - num
                    }
                } else {
                    return res
                }
            }))
            toLeftNum.length = weldingDetailedStructureList?.length || 0;
            toLeftNum.fill(0);
            setToLeftNum(toLeftNum)
        }
        if ((componentList || []).map(res => res.id).findIndex((value) => value === record.structureId) === -1) {
            let values = form.getFieldsValue(true).segmentName;
            if (values && values.length > 0) {
                values = values.filter((res: string) => res !== 'all')
                values = values.map((res: string) => {
                    return {
                        segmentName: res.split(',')[0],
                        segmentId: res.split(',')[1],
                    }
                })
                let data: IComponentList[] = await RequestUtil.post(`/tower-science/welding/getStructure`, {
                    weldingSegmentDTOS: values,
                    productCategoryId: params.productCategoryId,
                    segmentId: params.segmentId || ''
                });
                data = data.filter(res => { return res.id === record.structureId });
                const newList = [
                    {
                        ...data[0],
                        basicsPartNumNow: num
                    },
                    ...componentList
                ]
                const noZero = newList.filter(res => {
                    return Number(res.basicsPartNumNow) !== 0
                })
                setComponentList(checked ? newList : noZero)
                toRightNum.length = checked ? newList.length : noZero.length;
                toRightNum.fill(0);
                setToRightNum(toRightNum)
            } else {
                const noZero = componentList.filter(res => {
                    return Number(res.basicsPartNumNow) !== 0
                })
                setComponentList(checked ? componentList : noZero)
                toRightNum.length = checked ? componentList.length : noZero.length;
                toRightNum.fill(0);
                setToRightNum(toRightNum)
            }
        } else {
            const newData = componentList?.map((res: IComponentList) => {
                if (res.id === record.structureId) {
                    return {
                        ...res,
                        basicsPartNumNow: Number(res.basicsPartNumNow) + Number(num)
                    }
                } else {
                    return res
                }
            })
            const noZero = newData.filter(res => {
                return Number(res.basicsPartNumNow) !== 0
            })
            setComponentList(checked ? newData : noZero)
            toRightNum.length = checked ? newData.length : noZero.length;
            toRightNum.fill(0);
            setToRightNum(toRightNum)
        }
    }

    /**
     * @description 保存
     */
    const save = (tip: string) => {
        if (form) {
            form?.validateFields().then(res => {
                const values = form?.getFieldsValue(true);
                const segmentList = segment?.split(',');
                if (weldingDetailedStructureList && weldingDetailedStructureList?.filter(item => item && item['isMainPart'] === 1).length < 1) {
                    message.warning('请选择主件');
                } else {
                    const value = {
                        weldingId: params.id,
                        ...values,
                        id: type === 'apply' ? '' : params.segmentId,
                        componentId: mainPartId,
                        mainPartId: mainPartId,
                        segmentName: segmentList[1],
                        segmentId: segmentList[0],
                        weldingDetailedStructureList: [...(weldingDetailedStructureList?.map((res: IComponentList) => {
                            return {
                                ...res,
                                segmentName: segmentList[1],
                                segmentId: segmentList[0],
                                singleWeldingNum: Number(res.singleNum) * Number(form.getFieldsValue(true).segmentGroupNum)
                            }
                        }) || [])]
                    }
                    RequestUtil.post(`/tower-science/welding`, { ...value }).then(res => {
                        message.success('添加成功');
                        if (tip === 'goOn') {
                            setComponentList([]);
                            setWeldingDetailedStructureList([]);
                            setMainPartId('');
                            form.resetFields(['componentId', 'electricWeldingMeters', 'segmentName', 'singleGroupWeight', 'segmentGroupNum']);
                        } else {
                            history.goBack();
                        }
                    })
                }
            })
        }
    }

    const segmentChange = (values: Record<string, any>, segmentNames: ISegmentNameList[]) => {
        if (values.length > 0) {
            if (values.findIndex((value: string) => value === 'all') !== -1) {
                const selected = segmentNames?.map(item => {
                    return item.name + ',' + item.id
                })
                form.setFieldsValue({
                    segmentName: ['all', ...selected]
                })
                values = selected.map((res: string) => {
                    return {
                        segmentName: res.split(',')[0],
                        segmentId: res.split(',')[1],
                    }
                })
                getComponentList(values)
            } else {
                values = values.map((res: string) => {
                    return {
                        segmentName: res.split(',')[0],
                        segmentId: res.split(',')[1],
                    }
                })
                getComponentList(values)
            }
        } else {
            setComponentList([]);
            setToLeftNum([])
        }
    }

    const onMove = (title: string, num: number, moveRecord: Record<string, any>, removeIndex: number) => {
        if (title === '批量右移') {
            addComponent(moveRecord, num);
            setToRightNum(toRightNum?.map((res: number, ind: number) => {
                if (removeIndex === ind) {
                    return 0
                } else {
                    return res
                }
            }));
        } else {
            removeRow(moveRecord, removeIndex || 0, num);
            setToLeftNum(toLeftNum?.map((res: number, ind: number) => {
                if (removeIndex === ind) {
                    return 0
                } else {
                    return res
                }
            }))
        }
    }

    const batchMove = async () => {
        if (rightSelectedRows.length > 0) {
            let newWeld = weldingDetailedStructureList;
            rightSelectedRows.map(async record => {
                const index = weldingDetailedStructureList?.findIndex((obj) => {
                    return obj.structureId === record.structureId
                })
                let weight: number = Number(form.getFieldsValue(true).singleGroupWeight || 0) - (Number(record.basicsWeight) || 0) * Number(record.singleNum);
                let electricWeldingMeters: number = Number(form.getFieldsValue(true).electricWeldingMeters || 0) - Number(record.weldingLength || 0) * Number(record.singleNum);
                form.setFieldsValue({ 'singleGroupWeight': weight?.toFixed(3), 'electricWeldingMeters': electricWeldingMeters?.toFixed(4) });
                if (weldingDetailedStructureList && weldingDetailedStructureList[index || 0]?.singleNum === record.singleNum) {
                    newWeld?.splice(index || 0, 1);
                } else {
                    newWeld = newWeld?.map((res: IComponentList) => {
                        if (res.structureId === record.structureId) {
                            return {
                                ...res,
                                singleNum: Number(res.singleNum) - Number(record.singleNum)
                            }
                        } else {
                            return res
                        }
                    })
                }

            })
            setWeldingDetailedStructureList([...newWeld || []])
            toLeftNum.length = newWeld?.length || 0;
            toLeftNum.fill(0);
            setToLeftNum(toLeftNum)
            const data = await processData();
            const noZero = data.filter(res => {
                return Number(res.basicsPartNumNow) !== 0;
            })
            setComponentList(checked ? [...data] : [...noZero])
            toRightNum.length = checked ? data.length : noZero.length;
            toRightNum.fill(0);
            setToRightNum(toRightNum)
            setRightSelectedRows([]);
            setRightSelectedRowKeys([]);
        } else {
            //componentList -> weldingDetailedStructureList
            let newcom = componentList;
            let newWeldingDetailedStructureList: IComponentList[] = weldingDetailedStructureList || [];
            const newLeftSelectedRows = leftSelectedRows.filter(res => res.basicsPartNumNow > 0)
            newLeftSelectedRows.map(record => {
                let weldingLength: number = form?.getFieldsValue(true)?.electricWeldingMeters;
                let weight: number = Number(form.getFieldsValue(true).singleGroupWeight || 0) + (Number(record.basicsWeight) || 0) * (Number(record.basicsPartNumNow) || 1);
                let isNewComponent: boolean = newWeldingDetailedStructureList.every((items: IComponentList) => {
                    return record.id !== items.structureId;
                })
                let newComponentList: IComponentList = isNewComponent ? {
                    ...record,
                    id: '',
                    structureId: record.id,
                    singleNum: record.basicsPartNumNow,
                    isMainPart: 0,
                    weldingLength: record.weldingEdge
                } : {}
                newWeldingDetailedStructureList = newWeldingDetailedStructureList.map((item: IComponentList) => {
                    if (item.structureId === record.id) {
                        return {
                            ...item,
                            singleNum: Number(item.singleNum) + Number(record.basicsPartNumNow),
                            basicsPartNumNow: Number(record.basicsPartNumNow || 0)
                        }
                    } else {
                        return {
                            ...item,
                            basicsPartNumNow: Number(record.basicsPartNumNow || 0)
                        }
                    }
                })
                form.setFieldsValue({ 'singleGroupWeight': weight?.toFixed(3), 'electricWeldingMeters': (Number(weldingLength || 0) + (Number(record.basicsPartNumNow) || 1) * Number(record.weldingEdge || 0))?.toFixed(3) });
                newWeldingDetailedStructureList = Object.keys(newComponentList).length > 0 ? [...newWeldingDetailedStructureList, newComponentList] : [...newWeldingDetailedStructureList];
                newcom = newcom?.map((res: IComponentList) => {
                    if (res.id === record.id) {
                        return {
                            ...res,
                            basicsPartNumNow: Number(res.basicsPartNumNow) - Number(record.basicsPartNumNow)
                        }
                    } else {
                        return res
                    }
                })
            })
            setWeldingDetailedStructureList(newWeldingDetailedStructureList)
            toLeftNum.length = newWeldingDetailedStructureList?.length || 0;
            toLeftNum.fill(0);
            setToLeftNum(toLeftNum)
            const noZero = newcom.filter(res => {
                return Number(res.basicsPartNumNow) !== 0
            })
            setComponentList(checked ? [...newcom] : noZero);
            toRightNum.length = checked ? newcom.length : noZero.length;
            toRightNum.fill(0);
            setToRightNum(toRightNum)
            setLeftSelectedRows([]);
            setLeftSelectedRowKeys([]);
        }
    }

    const processData = () => {
        let newCom = componentList;
        return new Promise<IComponentList[]>(async (resolve) => {
            let data: IComponentList[] = [];
            let values = form.getFieldsValue(true).segmentName;
            if (values && values.length > 0) {
                values = values.filter((res: string) => res !== 'all')
                values = values.map((res: string) => {
                    return {
                        segmentName: res.split(',')[0],
                        segmentId: res.split(',')[1],
                    }
                })
                data = await RequestUtil.post(`/tower-science/welding/getStructure`, {
                    weldingSegmentDTOS: values,
                    productCategoryId: params.productCategoryId,
                    segmentId: params.segmentId || ''
                });
            }
            rightSelectedRows.map(async record => {
                if ((newCom || []).map(res => res.id).findIndex((value) => value === record.structureId) === -1) {
                    if (values && values.length > 0) {
                        const newData = data?.filter(res => { return res.id === record.structureId });
                        newCom = [
                            {
                                ...newData[0],
                                basicsPartNumNow: record.singleNum
                            },
                            ...newCom
                        ]
                    } else {
                        newCom = [...newCom]
                    }
                } else {
                    newCom = newCom?.map((res: IComponentList) => {
                        if (res.id === record.structureId) {
                            return {
                                ...res,
                                basicsPartNumNow: Number(res.basicsPartNumNow) + Number(record.singleNum)
                            }
                        } else {
                            return res
                        }
                    })
                }
            })
            resolve(newCom)
        })
    }

    const isShowZero = (data: IComponentList[], isCheck: boolean) => {
        setChecked(isCheck);
        if (isCheck) {
            segmentChange(form.getFieldsValue(true)?.segmentName, segmentNameList);
        } else {
            let newData = data.filter(res => {
                return Number(res.basicsPartNumNow) !== 0
            })
            setComponentList([...newData])
            toRightNum.length = newData.length;
            toRightNum.fill(0);
            setToRightNum(toRightNum)
        }
    }

    return <Spin spinning={loading}>
        <DetailContent operation={[
            <Space direction="horizontal" size="small" className={styles.bottomBtn}>
                <Button key="cancel" type="ghost" onClick={() => history.goBack()}>返回</Button>
                <Button key="save" type="primary" onClick={() => save('back')}>保存并返回</Button>
                {params.segmentId ? null : <Button key="saveC" type="primary" onClick={() => save('goOn')}>保存并继续</Button>}
            </Space>
        ]}>
            <DetailTitle title="组焊信息" />
            <Form form={form} layout="inline" className={styles.informationForm}>
                <Form.Item name="componentId" label="组件号">
                    <Input placeholder="自动产生" maxLength={10} disabled />
                </Form.Item>
                <Form.Item name="electricWeldingMeters" label="电焊米数（mm）" rules={[{
                    "required": true,
                    "message": "请输入电焊米数"
                }]}>
                    <Input placeholder="自动计算" disabled />
                </Form.Item>
                <Form.Item name="segmentName" label="段号" initialValue={["all"]}>
                    <Select placeholder="请选择" style={{ width: '200px' }}
                        mode="multiple" onChange={() => segmentChange(form.getFieldsValue(true)?.segmentName, segmentNameList)} >
                        <Select.Option key={'all'} value={'all'}>全部</Select.Option>
                        {segmentNameList.map((item: any) => {
                            return <Select.Option key={item.name + ',' + item.id} value={item.name + ',' + item.id}>{item.name}</Select.Option>
                        })}
                    </Select>
                </Form.Item>
                <Form.Item name="singleGroupWeight" label="单组重量（kg）" rules={[{
                    "required": true,
                    "message": "请输入单组重量"
                }]}>
                    <Input placeholder="自动计算" disabled />
                </Form.Item>
                <Form.Item name="segmentGroupNum" label="单段组数" rules={[{
                    "required": true,
                    "message": "请输入单段组数"
                }]}>
                    <InputNumber min={1} placeholder="请输入" />
                </Form.Item>
                <Form.Item name="weldingType" label="组焊类型" rules={[{
                    "required": true,
                    "message": "请选择组焊类型"
                }]}>
                    <Select placeholder="请选择" style={{ width: '150px' }}>
                        {compoundTypeOptions?.map((item: any, index: number) => <Select.Option value={item.id} key={index}>{item.name}</Select.Option>)}
                    </Select>
                </Form.Item>
                <Form.Item name="weldGrade" label="焊缝等级" rules={[{
                    "required": true,
                    "message": "请选择焊缝等级"
                }]}>
                    <Select placeholder="请选择" style={{ width: '150px' }}>
                        <Select.Option key={0} value={'无'}>无</Select.Option>
                        <Select.Option key={1} value={'一级焊缝'}>一级焊缝</Select.Option>
                        <Select.Option key={2} value={'二级焊缝'}>二级焊缝</Select.Option>
                        <Select.Option key={3} value={'外观二级'}>外观二级</Select.Option>
                        <Select.Option key={4} value={'三级焊缝'}>三级焊缝</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
            <DetailTitle
                title={
                    <div>构件信息
                        <Checkbox
                            checked={checked}
                            value={checked}
                            onChange={(e) => {
                                isShowZero(componentList, e.target.checked);
                            }}
                            style={{ fontSize: '14px', paddingLeft: '16px', fontWeight: 'lighter' }}
                        >显示剩余数量为0的构件{checked}
                        </Checkbox>
                        <Button type='primary' style={{ left: '55%' }} onClick={batchMove} ghost>批量移动</Button>
                    </div>
                }
            />
            <Row gutter={12}>
                <Col span={12} >
                    <CommonAliTable
                        haveIndex
                        columns={componentColumns}
                        dataSource={componentList}
                        style={{ height: 600, overflow: 'auto' }}
                        pagination={false}
                        code={1}
                        rowSelection={{
                            selectedRowKeys: leftSelectedRowKeys,
                            onChange: (selectedRowKeys: string[], selectRows: any[]) => {
                                setLeftSelectedRowKeys(selectedRowKeys);
                                setLeftSelectedRows(selectRows)
                            },
                            getCheckboxProps: () => rightSelectedRows.length > 0
                        }}
                    />
                </Col>
                <Col span={12}>
                    <CommonAliTable
                        columns={columns}
                        rowKey="structureId"
                        dataSource={[...(weldingDetailedStructureList || [])]}
                        pagination={false}
                        style={{ height: 600, overflow: 'auto' }}
                        rowSelection={{
                            selectedRowKeys: rightSelectedRowKeys,
                            onChange: (selectedRowKeys: string[], selectRows: any[]) => {
                                setRightSelectedRowKeys(selectedRowKeys);
                                setRightSelectedRows(selectRows)
                            },
                            getCheckboxProps: () => leftSelectedRows.length > 0
                        }}
                    />

                </Col>
            </Row>
        </DetailContent>
    </Spin>
}