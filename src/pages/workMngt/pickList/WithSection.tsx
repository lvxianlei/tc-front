/**
 * @author lxy
 * @copyright © 2022
 * @description 提料-杆塔信息-配段
 */

import React, { useImperativeHandle, forwardRef, useState } from "react"
import { Spin, Form, Input, Row, Col, Button, message, Descriptions, Select } from 'antd'
import { DetailTitle } from '../../common'
import RequestUtil from '../../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import styles from './TowerPickAssign.module.less';
import { IDetail, IMaterialDetail } from "./PickTower"
import { patternTypeOptions } from "../../../configuration/DictionaryOptions"

export interface EditProps {
    type: "new" | "detail" | "edit",
    id: string,
    // batchNo: boolean,
    productCategoryId: string
}

export interface EditRefProps {
    onSubmit: () => void
    resetFields: () => void
}

export default forwardRef(function Edit({ type, id, productCategoryId }: EditProps, ref) {
    const [form] = Form.useForm();
    const [fastForm] = Form.useForm();
    const [fastLoading, setFastLoading] = useState(false);
    const [detailData, setDetailData] = useState<IDetail>();
    const [basicHeightList, setBasicHeightList] = useState<any[]>([]);
    const [productList, setProductList] = useState<any[]>([]);
    const [productNumber, setProductNumber] = useState<any>('');
    const { loading, data } = useRequest<IDetail>(() => new Promise(async (resole, reject) => {
        try {
            let result: any = {};
            if (type === 'new') {
                const data = await RequestUtil.get<any[]>(`/tower-science/materialProduct/getBasicHeightProduct?productCategoryId=${productCategoryId}`);
                console.log(1)
                if (data && data.length > 0 && data[0]?.materialProductVOList && data[0]?.materialProductVOList.length > 0) {
                    result = await RequestUtil.get<IDetail>(`/tower-science/materialProduct/${data[0]?.materialProductVOList[0].id}`)
                    const detailData: IMaterialDetail[] | undefined = result && result.materialDrawProductSegmentList && result.materialDrawProductSegmentList.map((item: IMaterialDetail) => {
                        return {
                            ...item
                        }
                    })
                    form.setFieldsValue({
                        // legNumberA: result?.legNumberA,
                        // legNumberB: result?.legNumberB,
                        // legNumberC: result?.legNumberC,
                        // legNumberD: result?.legNumberD,
                        productSegmentListDTOList: detailData?.map((item: any) => {
                            return {
                                ...item,
                                count: 0
                            }
                        })
                    });
                    setDetailData({
                        ...result,
                        materialDrawProductSegmentList: detailData?.map((item: any) => {
                            return {
                                ...item,
                                count: 0
                            }
                        })
                    })
                }
                setBasicHeightList(data)

            } else {
                result = await RequestUtil.get<IDetail>(`/tower-science/materialProduct/${id}`)
                const detailData: IMaterialDetail[] | undefined = result && result.materialDrawProductSegmentList && result.materialDrawProductSegmentList.map((item: IMaterialDetail) => {
                    return {
                        ...item
                    }
                })
                form.setFieldsValue({
                    legNumberA: result?.legNumberA,
                    legNumberB: result?.legNumberB,
                    legNumberC: result?.legNumberC,
                    legNumberD: result?.legNumberD,
                    productSegmentListDTOList: detailData
                });
                setDetailData({
                    ...result,
                    materialDrawProductSegmentList: detailData
                })

            }

            resole({
                ...result,
                materialDrawProductSegmentList: detailData
            })
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [type, id] })

    const { run: saveRun } = useRequest<{ [key: string]: any }>((postData: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-science/materialProduct/material/segment/save`, { ...postData })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            await fastForm.validateFields();
            let baseData = await form.validateFields();
            const productSegmentListDTOList = form.getFieldsValue(true).productSegmentListDTOList;
            const value = productSegmentListDTOList.map((res: any, index: number) => {
                return {
                    ...res
                }
            })
            await saveRun({
                legNumberA: baseData.legNumberA,
                legNumberB: baseData.legNumberB,
                legNumberC: baseData.legNumberC,
                legNumberD: baseData.legNumberD,
                productCategoryId: detailData?.productCategory,
                productId: detailData?.productId,
                productIdList: detailData?.productIdList,
                productSegmentListDTOList: value
            })
            resolve(true);
        } catch (error) {
            reject(false)
        }
    })

    const resetFields = () => {
        form.resetFields();
    }

    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, onSubmit, resetFields]);

    const delSameObjValue = (list: IMaterialDetail[]) => {
        let target: IMaterialDetail[] = [];
        let keysArr = new Set(list.map(item => item.segmentName));
        keysArr.forEach(item => {
            const arr = list.filter(keys => keys.segmentName == item);
            const sum = arr.reduce((total, currentValue) => total + Number(currentValue.count), 0)
            target.push({
                segmentName: item,
                count: Number(sum)
            })
        })
        return target;
    }

    const fastWithSectoin = () => {
        setFastLoading(true)
        const inputString: string = fastForm.getFieldsValue(true).fast;
        if (inputString) {
            if ((/[(,*-]+\*[0-9]+|[(,*-]+\*[a-zA-Z()-*,]+|^[*),]+/g).test(inputString)) {
                message.error('请输入正确格式');
                setFastLoading(false);
            } else {
                const inputList = inputString.split(',');
                let list: IMaterialDetail[] = [];
                inputList.forEach((res: string) => {
                    const newRes = res.split('*')[0].replace(/\(|\)/g, "");
                    if ((/^[0-9]+-[0-9]+$/).test(newRes)) {
                        const length = Number(newRes.split('-')[0]) - Number(newRes.split('-')[1]);
                        if (length <= 0) {
                            let num = Number(newRes.split('-')[0]);
                            let t = setInterval(() => {
                                list.push({
                                    segmentName: (num++).toString(),
                                    count: Number(res.split('*')[1]) || 1
                                })
                                if (num > Number(newRes.split('-')[1])) {
                                    clearInterval(t);
                                }
                            }, 0)
                        } else {
                            let num = Number(newRes.split('-')[0])
                            let t = setInterval(() => {
                                list.push({
                                    segmentName: (num--).toString(),
                                    count: Number(res.split('*')[1]) || 1
                                })
                                if (num < Number(newRes.split('-')[1])) {
                                    clearInterval(t);
                                }
                            }, 0)
                        }
                    } else {
                        list.push({
                            segmentName: newRes,
                            count: Number(res.split('*')[1]) || 1
                        })
                    }

                })
                setTimeout(() => {
                    const newList = [
                        ...(data?.materialSegmentList?.map(res => {
                            return { ...res, count: Number(res.count || 0) }
                        }) || []),
                        ...list
                    ];
                    const finalList = delSameObjValue(newList);
                    form.setFieldsValue({
                        ...form.getFieldsValue(true),
                        productSegmentListDTOList: [...finalList]
                    })
                    setDetailData({
                        ...detailData,
                        materialDrawProductSegmentList: [...finalList]
                    })
                    fastForm.resetFields(['fast']);
                    setFastLoading(false)
                }, 1000)
            }
        } else {
            message.warning('请输入需快速配段的信息')
            setFastLoading(false)
        }
    }

    return <Spin spinning={loading}>
        <Form form={fastForm}>
            <Row>
                {type === 'new' ? <>
                    <Form.Item name="basicHeight" label="杆塔" rules={[{
                        required: true,
                        message: '请选择呼高'
                    }]}>
                        <Select placeholder="请选择呼高" style={{ width: '150px' }} getPopupContainer={triggerNode => triggerNode.parentNode} onChange={(e) => {
                            const data = basicHeightList?.filter(res => res.basicHeight === e);
                            setProductList(data && data[0].materialProductVOList)
                            fastForm.setFieldsValue({
                                productId: []
                            })
                        }}>
                            {basicHeightList && basicHeightList?.map(({ basicHeight }, index) => {
                                return <Select.Option key={index} value={basicHeight || ''}>
                                    {basicHeight}
                                </Select.Option>
                            })}
                        </Select>
                    </Form.Item>
                    {/* </Col> */}
                    {/* <Col span={5}> */}
                    <Form.Item name="productId" rules={[{
                        required: true,
                        message: '请选择杆塔'
                    }]}>
                        <Select placeholder="请选择杆塔" mode="multiple" style={{ width: '150px' }} getPopupContainer={triggerNode => triggerNode.parentNode} onChange={(e: any) => {
                            if (Array.from(e)?.findIndex(res => res === 'all') !== -1) {
                                fastForm?.setFieldsValue({
                                    productId: [...productList?.map(res => {
                                        return res?.id + ',' + res?.productNumber
                                    }) || [], 'all']
                                })
                                setProductNumber(productList?.map((res: any) => res.productNumber).join(','))
                                setDetailData({
                                    ...detailData,
                                    productNumber: productList?.map((res: any) => res.productNumber),
                                    productIdList: productList?.map((res: any) => res.id)
                                })
                            } else {
                                const productId = fastForm.getFieldsValue(true).productId;
                                setProductNumber(productId?.map((res: string) => res.split(',')[1]).join(','))
                                setDetailData({
                                    ...detailData,
                                    productNumber: productId?.map((res: string) => res.split(',')[1]),
                                    productIdList: productId?.map((res: string) => res.split(',')[0])
                                })
                            }
                        }}>
                            <Select.Option key={999} value={'all'}>全部</Select.Option>
                            {productList && productList.map(({ id, productNumber }, index) => {
                                return <Select.Option key={index} value={id + ',' + productNumber || ''}>
                                    {productNumber}
                                </Select.Option>
                            })}
                        </Select>
                    </Form.Item>
                </> : null}
                <Col offset={type === 'new' ? 1 : 0} span={6}>
                    <Form.Item name="fast" label="快速配段" rules={[{
                        pattern: /^[a-zA-Z0-9-,*()]*$/,
                        message: '仅可输入英文字母/数字/特殊字符',
                    }]}>
                        <Input style={{ width: '100%' }} disabled={type === 'detail'} />
                    </Form.Item>
                </Col>
                <Col offset={2} span={4}>
                    <Button type="primary" loading={fastLoading} disabled={type === 'detail'} onClick={fastWithSectoin} ghost>确定</Button>
                </Col>
            </Row>
        </Form>
        <Form form={form} className={styles.descripForm}>
            <DetailTitle title="塔腿配段信息" />
            <Row>
                <Col span={5}>
                    <Form.Item name="legNumberA" label="A" rules={[{
                        pattern: /^[0-9a-zA-Z]*$/,
                        message: '仅可输入数字/字母',
                    }]}>
                        <Input style={{ width: '100%' }} disabled={type === 'detail'} />
                    </Form.Item>
                </Col>
                <Col span={1} />
                <Col span={5}>
                    <Form.Item name="legNumberB" label="B" rules={[{
                        pattern: /^[0-9a-zA-Z]*$/,
                        message: '仅可输入数字/字母',
                    }]}>
                        <Input style={{ width: '100%' }} disabled={type === 'detail'} />
                    </Form.Item>
                </Col>
                <Col span={1} />
                <Col span={5}>
                    <Form.Item name="legNumberC" label="C" rules={[{
                        pattern: /^[0-9a-zA-Z]*$/,
                        message: '仅可输入数字/字母',
                    }]}>
                        <Input style={{ width: '100%' }} disabled={type === 'detail'} />
                    </Form.Item>
                </Col>
                <Col span={1} />
                <Col span={5}>
                    <Form.Item name="legNumberD" label="D" rules={[{
                        pattern: /^[0-9a-zA-Z]*$/,
                        message: '仅可输入数字/字母',
                    }]}>
                        <Input style={{ width: '100%' }} disabled={type === 'detail'} />
                    </Form.Item>
                </Col>
            </Row>
            <DetailTitle title={'塔身配段信息'} />
            <Descriptions title="" bordered size="small" colon={false} column={2}>
                <Descriptions.Item label="塔型">
                    <span>{detailData?.productCategoryName}</span>
                </Descriptions.Item>
                <Descriptions.Item label="杆塔号">
                    <span>{type === 'new' ? productNumber : detailData?.productNumber}</span>
                </Descriptions.Item>
                {
                    [...detailData?.materialDrawProductSegmentList || []]?.map((items: IMaterialDetail, index: number) => {
                        return <>
                            <Descriptions.Item key={index + '_' + id} label="段号">
                                <Form.Item name={["productSegmentListDTOList", index, "segmentName"]}>
                                    <span>{items.segmentName}</span>
                                </Form.Item>
                            </Descriptions.Item>
                            <Descriptions.Item key={index} label="段数">
                                <Form.Item key={index + '_' + id} name={["productSegmentListDTOList", index, "count"]} initialValue={items.count} rules={[{
                                    required: true,
                                    message: '请输入段数 '
                                }, {
                                    pattern: /^[0-9]*$/,
                                    message: '仅可输入数字',
                                }]}>
                                    <Input maxLength={2} placeholder="请输入" disabled={type === 'detail'} />
                                </Form.Item>
                            </Descriptions.Item>
                        </>
                    })
                }
            </Descriptions>
        </Form>
    </Spin>
})