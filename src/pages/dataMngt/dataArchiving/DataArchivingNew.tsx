/**
 * @author zyc
 * @copyright © 2022 
 * @description RD-资料管理-资料存档管理-上传/编辑/查看
 */

import React, { useImperativeHandle, forwardRef, useState } from "react";
import { Descriptions, Form, Input, Select, Spin } from 'antd';
import { BaseInfo, DetailContent } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './DataArchiving.module.less';
import { documentTypeOptions, drawingDataTypeOptions, productTypeOptions, referenceRoomOptions, voltageGradeOptions } from "../../../configuration/DictionaryOptions";
import { detailColumns } from './dataArchiving.json'

interface modalProps {
    readonly record?: any;
    readonly type?: 'new' | 'detail' | 'edit';
    getLoading: (loading: boolean) => void
}

export default forwardRef(function DataArchivingNew({ record, type, getLoading }: modalProps, ref) {
    const [form] = Form.useForm();
    const [towerSelects, setTowerSelects] = useState([]);
    const [planNums, setPlanNums] = useState<any>([]);

    const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-science/data/backup/${record?.id}`);
            form.setFieldsValue({
                ...result
            })
            ProjectNameChange(result?.projectName);
            planNumChange(result?.planNumber)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: type === 'new', refreshDeps: [record, type] })


    const { data: ProjectNames } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const nums: any = await RequestUtil.get(`/tower-science/loftingTask/projectNameList`);
        resole(nums)
    }), {})

    const ProjectNameChange = async (e: any) => {
        const data: any = await RequestUtil.get(`/tower-science/loftingTask/planNumberList?projectName=${e}`);
        setPlanNums(data || [])
    }

    const planNumChange = async (e: any) => {
        const data: any = await RequestUtil.get(`/tower-science/productCategory/product/category/list?planNumber=${e}`);
        setTowerSelects(data || [])
    }

    const onSave = () => new Promise(async (resolve, reject) => {
        try {
            form?.validateFields().then(async res => {
                const value = form.getFieldsValue(true);
                getLoading(true)
                await saveRun({
                    ...value,
                    id: data?.id
                })
                resolve(true);
            })

        } catch (error) {
            reject(error)
        }
    })

    const { run: saveRun } = useRequest<any>((data: any) => new Promise(async (resove, reject) => {
        try {
            RequestUtil.post(`/tower-science/data/backup`, data).then(res => {
                resove(true)
            }).catch(e => {
                getLoading(false)
                reject(e)
            })
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const resetFields = () => {
        form.resetFields();
    }

    useImperativeHandle(ref, () => ({ onSave, resetFields }), [ref, onSave, resetFields]);

    return <Spin spinning={loading}>
        <DetailContent>
            {
                type === 'detail' ?
                    <>
                        <BaseInfo dataSource={data || {}} columns={detailColumns} col={3} />
                    </>
                    :
                    <Form form={form}>
                        <Descriptions bordered column={3} size="small" className={styles.description}>
                            <Descriptions.Item label="状态">
                                <Form.Item name="status" initialValue={1} rules={[
                                    {
                                        "required": true,
                                        "message": "请选择状态"
                                    }
                                ]}>
                                    <Select placeholder="请选择状态">
                                        <Select.Option value={1} key={1}>正常</Select.Option>
                                        <Select.Option value={2} key={2}>变更</Select.Option>
                                        <Select.Option value={3} key={3}>无效</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Descriptions.Item>
                            <Descriptions.Item label="资料室">
                                <Form.Item name="resourceCenter" rules={[
                                    {
                                        "required": true,
                                        "message": "请选择资料室"
                                    }
                                ]}>
                                    <Select placeholder="请选择资料室">
                                        {referenceRoomOptions && referenceRoomOptions.map(({ id, name }, index) => {
                                            return <Select.Option key={index} value={id}>
                                                {name}
                                            </Select.Option>
                                        })}
                                    </Select>
                                </Form.Item>
                            </Descriptions.Item>
                            <Descriptions.Item label="资料类型">
                                <Form.Item name="resourceType" rules={[
                                    {
                                        "required": true,
                                        "message": "请选择资料类型"
                                    }
                                ]}>
                                    <Select placeholder="请选择资料类型">
                                        {drawingDataTypeOptions && drawingDataTypeOptions.map(({ id, name }, index) => {
                                            return <Select.Option key={index} value={id}>
                                                {name}
                                            </Select.Option>
                                        })}
                                    </Select>
                                </Form.Item>
                            </Descriptions.Item>
                            <Descriptions.Item label="柜号">
                                <Form.Item name="cabinetNo">
                                    <Input maxLength={10} />
                                </Form.Item>
                            </Descriptions.Item>
                            <Descriptions.Item label="箱号">
                                <Form.Item name="caseNo">
                                    <Input maxLength={10} />
                                </Form.Item>
                            </Descriptions.Item>
                            <Descriptions.Item label="文件类别">
                                <Form.Item name="fileCategory">
                                    <Select placeholder="请选择文件类别">
                                        {documentTypeOptions && documentTypeOptions.map(({ id, name }, index) => {
                                            return <Select.Option key={index} value={id}>
                                                {name}
                                            </Select.Option>
                                        })}
                                    </Select>
                                </Form.Item>
                            </Descriptions.Item>
                            <Descriptions.Item label="工程名称">
                                <Form.Item name="projectName">
                                    <Select
                                        showSearch
                                        placeholder="请选择工程名称"
                                        style={{ width: "150px" }}
                                        filterOption={(input, option) =>
                                            (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                                        }
                                        onChange={(e) => {
                                            ProjectNameChange(e)
                                            form.setFieldsValue({
                                                productCategoryId: '',
                                                planNumber: ''
                                            });
                                        }}>
                                        {ProjectNames && ProjectNames?.map((item: any, index: number) => {
                                            return <Select.Option key={index} value={item}>{item}</Select.Option>
                                        })}
                                    </Select>
                                </Form.Item>
                            </Descriptions.Item>
                            <Descriptions.Item label="计划号">
                                <Form.Item name="planNumber">
                                    <Select
                                        showSearch
                                        placeholder="请选择计划号"
                                        style={{ width: "150px" }}
                                        filterOption={(input, option) =>
                                            (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                                        }
                                        onChange={(e) => {
                                            planNumChange(e)
                                            form.setFieldsValue({
                                                productCategoryId: ''
                                            });
                                        }}>
                                        {planNums && planNums?.map((item: any, index: number) => {
                                            return <Select.Option key={index} value={item}>{item}</Select.Option>
                                        })}
                                    </Select>
                                </Form.Item>
                            </Descriptions.Item>
                            <Descriptions.Item label="塔型名称">
                                <Form.Item name="productCategoryId">
                                    <Select placeholder="请选择塔型名称" style={{ width: "150px" }} onChange={async (e) => {
                                        const data: any = towerSelects?.filter((res: any) => res?.productCategoryId === e)[0] || {}
                                        form.setFieldsValue({
                                            voltageGrade: data?.voltageGrade,
                                            customerCompany: data?.customerCompany,
                                            productType: data?.productType,
                                            productCategoryId: data?.productCategoryId,
                                            productCategoryName: data?.productCategoryName,
                                        })
                                    }}>
                                        {towerSelects && towerSelects?.map((item: any) => {
                                            return <Select.Option key={item.productCategoryId} value={item.productCategoryId}>{item.productCategoryName}</Select.Option>
                                        })}
                                    </Select>
                                </Form.Item>
                            </Descriptions.Item>
                            <Descriptions.Item label="电压等级">
                                <Form.Item name="voltageGrade">
                                    <Select placeholder="请选择电压等级">
                                        {voltageGradeOptions && voltageGradeOptions.map(({ id, name }, index) => {
                                            return <Select.Option key={index} value={id}>
                                                {name}
                                            </Select.Option>
                                        })}
                                    </Select>
                                </Form.Item>
                            </Descriptions.Item>
                            <Descriptions.Item label="产品类型">
                                <Form.Item name="productType">
                                    <Select placeholder="请选择产品类型">
                                        {productTypeOptions && productTypeOptions.map(({ id, name }, index) => {
                                            return <Select.Option key={index} value={id}>
                                                {name}
                                            </Select.Option>
                                        })}
                                    </Select>
                                </Form.Item>
                            </Descriptions.Item>
                            <Descriptions.Item label="客户名称">
                                <Form.Item name="customerCompany">
                                    <Input maxLength={100} />
                                </Form.Item>
                            </Descriptions.Item>
                            <Descriptions.Item span={3} label="备注">
                                <Form.Item name="description" >
                                    <Input.TextArea maxLength={800} />
                                </Form.Item>
                            </Descriptions.Item>
                        </Descriptions>
                    </Form>
            }
        </DetailContent>
    </Spin>
})