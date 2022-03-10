/**
 * @author zyc
 * @copyright © 2022
 * @description 提料-杆塔信息-配段
 */

import React, { useImperativeHandle, forwardRef, useState } from "react"
import { Spin, Form, Input, Row, Col, Button, message, Descriptions } from 'antd'
import { DetailTitle } from '../../common'
import RequestUtil from '../../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import styles from './TowerPickAssign.module.less';
import { IDetail, IMaterialDetail } from "./PickTower"

export interface EditProps {
    type: "new" | "detail",
    id: string,
    batchNo: boolean
}

export interface EditRefProps {
    onSubmit: () => void
    resetFields: () => void
}

export default forwardRef(function Edit({ type, id, batchNo }: EditProps, ref) {
    const [form] = Form.useForm();
    const [fastForm] = Form.useForm();
    const [fastLoading, setFastLoading] = useState(false);
    const [detailData, setDetailData] = useState<IDetail>();

    const { loading, data } = useRequest<IDetail>(() => new Promise(async (resole, reject) => {
        try {
            let result: IDetail = await RequestUtil.get<IDetail>(`/tower-science/materialProduct/${id}`)
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
            resole({
                ...result,
                materialDrawProductSegmentList: detailData
            })
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [type, id, batchNo] })

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
                    fastForm.resetFields();
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
                <Col span={14}>
                    <Form.Item name="fast" label="快速配段" rules={[{
                        pattern: /^[a-zA-Z0-9-,*()]*$/,
                        message: '仅可输入英文字母/数字/特殊字符',
                    }]}>
                        <Input style={{ width: '100%' }} disabled={type === 'detail'} />
                    </Form.Item>
                </Col>
                <Col offset={1} span={4}>
                    <Button type="primary" loading={fastLoading} disabled={type === 'detail'} onClick={fastWithSectoin} ghost>确定</Button>
                </Col>
            </Row>
        </Form>
        <Form form={form} className={styles.descripForm}>
            <DetailTitle title="塔腿配段信息" />
            <Row>
                <Col span={5}>
                    <Form.Item name="legNumberA" label="A" rules={[{
                        required: true,
                        message: '请输入塔腿A'
                    }, {
                        pattern: /^[0-9a-zA-Z]*$/,
                        message: '仅可输入数字/字母',
                    }]}>
                        <Input style={{ width: '100%' }} disabled={batchNo} />
                    </Form.Item>
                </Col>
                <Col span={1} />
                <Col span={5}>
                    <Form.Item name="legNumberB" label="B" rules={[{
                        required: true,
                        message: '请输入塔腿B'
                    }, {
                        pattern: /^[0-9a-zA-Z]*$/,
                        message: '仅可输入数字/字母',
                    }]}>
                        <Input style={{ width: '100%' }} disabled={batchNo} />
                    </Form.Item>
                </Col>
                <Col span={1} />
                <Col span={5}>
                    <Form.Item name="legNumberC" label="C" rules={[{
                        required: true,
                        message: '请输入塔腿C'
                    }, {
                        pattern: /^[0-9a-zA-Z]*$/,
                        message: '仅可输入数字/字母',
                    }]}>
                        <Input style={{ width: '100%' }} disabled={batchNo} />
                    </Form.Item>
                </Col>
                <Col span={1} />
                <Col span={5}>
                    <Form.Item name="legNumberD" label="D" rules={[{
                        required: true,
                        message: '请输入塔腿D'
                    }, {
                        pattern: /^[0-9a-zA-Z]*$/,
                        message: '仅可输入数字/字母',
                    }]}>
                        <Input style={{ width: '100%' }} disabled={batchNo} />
                    </Form.Item>
                </Col>
            </Row>
            <DetailTitle title={'塔身配段信息'} />
            <Descriptions title="" bordered size="small" colon={false} column={2}>
                <Descriptions.Item label="塔型">
                    <span>{detailData?.productCategoryName}</span>
                </Descriptions.Item>
                <Descriptions.Item label="杆塔号">
                    <span>{detailData?.productNumber}</span>
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
                                    <Input maxLength={2} placeholder="请输入" disabled={batchNo} />
                                </Form.Item>
                            </Descriptions.Item>
                        </>
                    })
                }
            </Descriptions>
        </Form>
    </Spin>
})