/**
 * @author zyc
 * @copyright © 2022
 * @description 提料-杆塔信息-配段
 */

import React, { useImperativeHandle, forwardRef, useState } from "react"
import { Spin, Form, Input, Row, Col, InputNumber, Button, message } from 'antd'
import { DetailTitle } from '../../common'
import RequestUtil from '../../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import styles from './TowerPickAssign.module.less';
import { IDetail, IMaterialDetail } from "./PickTower"

export interface EditProps {
    type: "new" | "detail",
    id: string
}

export interface EditRefProps {
    onSubmit: () => void
    resetFields: () => void
}

export default forwardRef(function Edit({ type, id }: EditProps, ref) {
    const [form] = Form.useForm();
    const [fastForm] = Form.useForm();
    const [fastLoading, setFastLoading] = useState(false)

    const { loading, data } = useRequest<IDetail>(() => new Promise(async (resole, reject) => {
        try {
            let result: IDetail = await RequestUtil.get<IDetail>(`/tower-science/product/material/${id}`)
            const detailData: IMaterialDetail[] | undefined = result && result.materialDrawProductSegmentList && result.materialDrawProductSegmentList.map((item: IMaterialDetail) => {
                return {
                    ...item,
                }
            })
            form.setFieldsValue({
                legWeightA: result?.legWeightA,
                legWeightB: result?.legWeightB,
                legWeightC: result?.legWeightC,
                legWeightD: result?.legWeightD,
                detailData: detailData
            });
            resole({
                ...result,
                materialDrawProductSegmentList: detailData
            })
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id] })

    const { run: saveRun } = useRequest<{ [key: string]: any }>((postData: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-aps/work/center/info`, { ...postData, id: data })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            let baseData = await form.validateFields();
            const assignedList = form.getFieldsValue(true).assignedList;
            const value = assignedList.map((res: any, index: number) => {
                return {
                    ...res,
                    user: res.user === 0 ? assignedList[assignedList.findIndex((item: any) => item.user === 0) - 1].user : res.user,
                    specificationName: res.specificationName === 4 ? assignedList[assignedList.findIndex((item: any) => item.specificationName === 4) - 1].specificationName : res.specificationName
                }
            })
            console.log(value)
            await saveRun({})
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
        if ((/[(,*-]+\*[0-9]+|[(,*-]+\*[a-zA-Z()-*,]+|^[,*)-]*[0-9a-zA-Z]/g).test(inputString)) {
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
                // delSameObjValue(list)
                console.log(delSameObjValue([...list]));
                setFastLoading(false)
            }, 1000)
        }
    }

    return <Spin spinning={loading}>
        {type === 'new' ? <Form form={fastForm}>
            <Row>
                <Col span={14}>
                    <Form.Item name="fast" label="快速配段" rules={[{
                        pattern: /^[a-zA-Z0-9-,*()]*$/,
                        message: '仅可输入英文字母/数字/特殊字符',
                    }]}>
                        <Input style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
                <Col offset={2} span={4}>
                    <Button type="primary" loading={fastLoading} onClick={fastWithSectoin} ghost>确定</Button>
                </Col>
            </Row>
        </Form>
            : null}
        <Form form={form}>
            <DetailTitle title="塔腿配段信息" />
            <Row>
                <Col span={5}>
                    <Form.Item name="legWeightA" label="A" rules={[{
                        required: true,
                        message: '请输入塔腿A'
                    }, {
                        pattern: /^[0-9a-zA-Z]*$/,
                        message: '仅可输入数字/字母',
                    }]}>
                        <Input style={{ width: '100%' }} disabled={type === 'detail'} />
                    </Form.Item>
                </Col>
                <Col span={1} />
                <Col span={5}>
                    <Form.Item name="legWeightB" label="B" rules={[{
                        required: true,
                        message: '请输入塔腿B'
                    }, {
                        pattern: /^[0-9a-zA-Z]*$/,
                        message: '仅可输入数字/字母',
                    }]}>
                        <Input style={{ width: '100%' }} disabled={type === 'detail'} />
                    </Form.Item>
                </Col>
                <Col span={1} />
                <Col span={5}>
                    <Form.Item name="legWeightC" label="C" rules={[{
                        required: true,
                        message: '请输入塔腿C'
                    }, {
                        pattern: /^[0-9a-zA-Z]*$/,
                        message: '仅可输入数字/字母',
                    }]}>
                        <Input style={{ width: '100%' }} disabled={type === 'detail'} />
                    </Form.Item>
                </Col>
                <Col span={1} />
                <Col span={5}>
                    <Form.Item name="legWeightD" label="D" rules={[{
                        required: true,
                        message: '请输入塔腿D'
                    }, {
                        pattern: /^[0-9a-zA-Z]*$/,
                        message: '仅可输入数字/字母',
                    }]}>
                        <Input style={{ width: '100%' }} disabled={type === 'detail'} />
                    </Form.Item>
                </Col>
            </Row>
            <DetailTitle title={'塔身配段信息'} />
            <Row>
                <Col span={1} />
                <Col span={11}>
                    <Form.Item name="productCategoryName" label="塔型">
                        <span>{data?.productCategoryName}</span>
                    </Form.Item>
                </Col>
                <Col span={1} />
                <Col span={11}>
                    <Form.Item name="productNumber" label="杆塔号">
                        <span>{data?.productNumber}</span>
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Form.List name="detailData">
                    {
                        (fields, { add, remove }) => fields.map(
                            field => (
                                <>
                                    <Col span={1}></Col>
                                    <Col span={11}>
                                        <Form.Item name={[field.name, 'segmentName']} label='段号'>
                                            <span>{data?.materialDrawProductSegmentList && data?.materialDrawProductSegmentList[field.name].segmentName}</span>
                                        </Form.Item>
                                    </Col>
                                    <Col span={1}></Col>
                                    <Col span={11}>
                                        <Form.Item name={[field.name, 'count']} label='段数' initialValue={[field.name, 'count']} >
                                            <InputNumber min={0} precision={0} style={{ width: '100%' }} disabled={type === 'detail'} />
                                        </Form.Item>
                                    </Col>
                                </>
                            )
                        )
                    }
                </Form.List>
            </Row>
        </Form>
    </Spin>
})