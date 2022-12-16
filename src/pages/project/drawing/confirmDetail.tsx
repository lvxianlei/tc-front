import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Space, Modal, Form, Upload, message } from 'antd'
import { CommonTable, DetailTitle, BaseInfo } from '../../common'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import AuthUtil from '../../../utils/AuthUtil'
import { patternTypeOptions, productTypeOptions, towerStructureOptions, voltageGradeOptions } from '../../../configuration/DictionaryOptions';
import { productGroupDetail, productGroupRow } from "./drawing.json"
export default function ConfirmDetail() {
    const [visible, setVisible] = useState<boolean>(false);
    const [rowId, setRowId] = useState('');
    const [tableDataSource, setTableDataSource] = useState<object[]>([]);
    const [weight, setWeight] = useState<string>('0');
    const [confirmData, setConfirmData] = useState<any[]>([{
        otherWeightBg: 0,
        otherWeightPt: 0,
        otherWeightXxp: 0,
        otherWeightPat: 0,
        otherWeightFd: 0,
        otherWeightGdxg: 0,
        otherWeightXg: 0,
        otherWeightQtsm: 0,
        otherWeightDdssgkb: 0,
        otherWeightLs: 0,
        legWeightA: 0,
        legWeightB: 0,
        legWeightC: 0,
        legWeightD: 0,
        description: '',
    }]);
    const [form] = Form.useForm();
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([])
    const [edit, setEdit] = useState('添加');

    const handleModalOk = async () => {
        try {
            if (edit === '添加') {
                const value = await form.validateFields();
                const submitData = value?.confirmList.map((item: any) => {
                    return {
                        ...item,
                        pattern: value?.pattern,
                        productCategory: value?.productCategory,
                        productType: value?.productType,
                        steelProductShape: value?.steelProductShape,
                        voltageLevel: value?.voltageLevel,
                        lineName: value?.lineName,
                        drawTaskId: params.id,
                        structure: value?.structure
                    }
                })
                await RequestUtil.post(`/tower-science/drawProductDetail/saveBatch`, submitData)
                form.setFieldsValue({
                    pattern: '',
                    productCategory: '',
                    productType: '',
                    steelProductShape: '',
                    voltageLevel: '',
                    lineName: '',
                    confirmList: [{
                        otherWeightBg: 0,
                        otherWeightPt: 0,
                        otherWeightXxp: 0,
                        otherWeightPat: 0,
                        otherWeightFd: 0,
                        otherWeightGdxg: 0,
                        otherWeightXg: 0,
                        otherWeightQtsm: 0,
                        otherWeightDdssgkb: 0,
                        otherWeightLs: 0,
                        legWeightA: 0,
                        legWeightB: 0,
                        legWeightC: 0,
                        legWeightD: 0,
                        bodyWeight: 0,
                        description: '',
                    }]
                })
                setConfirmData([{
                    otherWeightBg: 0,
                    otherWeightPt: 0,
                    otherWeightXxp: 0,
                    otherWeightPat: 0,
                    otherWeightFd: 0,
                    otherWeightGdxg: 0,
                    otherWeightXg: 0,
                    otherWeightQtsm: 0,
                    otherWeightDdssgkb: 0,
                    otherWeightLs: 0,
                    legWeightA: 0,
                    legWeightB: 0,
                    legWeightC: 0,
                    legWeightD: 0,
                    bodyWeight: 0,
                    description: '',
                }])
                setVisible(false)
                message.success('添加成功！')
                run();
            } else {
                const value = await form.validateFields();
                const submitData = value?.confirmList.map((item: any) => {
                    return {
                        ...item,
                        pattern: value?.pattern,
                        productCategory: value?.productCategory,
                        productType: value?.productType,
                        steelProductShape: value?.steelProductShape,
                        voltageLevel: value?.voltageLevel,
                        lineName: value?.lineName,
                        drawTaskId: params.id,
                        id: rowId,
                        structure: value?.structure
                    }
                })
                await RequestUtil.post(`/tower-science/drawProductDetail/save`, submitData[0])
                form.setFieldsValue({
                    pattern: '',
                    productCategory: '',
                    productType: '',
                    steelProductShape: '',
                    voltageLevel: '',
                    lineName: '',
                    description: '',
                    confirmList: [{
                        otherWeightBg: 0,
                        otherWeightPt: 0,
                        otherWeightXxp: 0,
                        otherWeightPat: 0,
                        otherWeightFd: 0,
                        otherWeightGdxg: 0,
                        otherWeightXg: 0,
                        otherWeightDdssgkb: 0,
                        otherWeightQtsm: 0,
                        otherWeightLs: 0,
                        legWeightA: 0,
                        legWeightB: 0,
                        legWeightC: 0,
                        legWeightD: 0,
                        bodyWeight: 0,
                        description: '',
                    }]
                })
                setConfirmData([{
                    otherWeightBg: 0,
                    otherWeightPt: 0,
                    otherWeightXxp: 0,
                    otherWeightPat: 0,
                    otherWeightFd: 0,
                    otherWeightGdxg: 0,
                    otherWeightXg: 0,
                    otherWeightQtsm: 0,
                    otherWeightDdssgkb: 0,
                    otherWeightLs: 0,
                    legWeightA: 0,
                    legWeightB: 0,
                    legWeightC: 0,
                    legWeightD: 0,
                    bodyWeight: 0,
                    description: '',
                }])
                setRowId('')
                setVisible(false)
                message.success('修改成功！')
                run();
                // value['id'] = id;
                // tableDataSource.push(value);
                // let number = '0';
                // tableDataSource.forEach((item:any)=>{
                //     number = (parseFloat(item.totalWeight)+parseFloat(number)).toFixed(2)
                // })
                // setWeight(number);
                // setTableDataSource(tableDataSource);
                // form.resetFields();
                // setVisible(false);
            }

        } catch (error) {
            console.log(error)
        }
    }

    const handleModalCancel = () => {
        setVisible(false);
        form.resetFields();
        setConfirmData([{
            otherWeightBg: 0,
            otherWeightPt: 0,
            otherWeightXxp: 0,
            otherWeightPat: 0,
            otherWeightFd: 0,
            otherWeightGdxg: 0,
            otherWeightXg: 0,
            otherWeightQtsm: 0,
            otherWeightLs: 0,
            otherWeightDdssgkb: 0,
            legWeightA: 0,
            legWeightB: 0,
            legWeightC: 0,
            legWeightD: 0,
            description: '',
        }]
        )
    }

    const params = useParams<{ id: string, status: string, confirmId: string }>()
    const userId = AuthUtil.getUserInfo().user_id;
    const { loading, data, run } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-science/drawProductDetail/getDetailListById?drawTaskId=${params.id}`)
        setTableDataSource(data?.drawProductDetailList.map((item: any, index: number) => {
            return {
                ...item,
                key: index.toString(),
                index: index,
                legConfigurationA: item.legConfigurationA ? item.legConfigurationA : 0,
                legConfigurationB: item.legConfigurationB ? item.legConfigurationB : 0,
                legConfigurationC: item.legConfigurationC ? item.legConfigurationC : 0,
                legConfigurationD: item.legConfigurationD ? item.legConfigurationD : 0,
                otherWeightBg: item.otherWeightBg ? item.otherWeightBg : 0,
                otherWeightPt: item.otherWeightPt ? item.otherWeightPt : 0,
                otherWeightXxp: item.otherWeightXxp ? item.otherWeightXxp : 0,
                otherWeightPat: item.otherWeightPat ? item.otherWeightPat : 0,
                otherWeightFd: item.otherWeightFd ? item.otherWeightFd : 0,
                otherWeightDdssgkb: item.otherWeightDdssgkb ? item.otherWeightDdssgkb : 0,
                otherWeightGdxg: item.otherWeightGdxg ? item.otherWeightGdxg : 0,
                otherWeightXg: item.otherWeightXg ? item.otherWeightXg : 0,
                otherWeightQtsm: item.otherWeightQtsm ? item.otherWeightQtsm : 0,
                otherWeightLs: item.otherWeightLs ? item.otherWeightLs : 0,
                monomerWeight: item.monomerWeight ? item.monomerWeight : 0,
                totalWeight: item.totalWeight ? item.totalWeight : 0,
            }
        }));
        let totalNumber = '0';
        data?.drawProductDetailList.forEach((item: any) => {
            totalNumber = (parseFloat(item.totalWeight) + parseFloat(totalNumber)).toFixed(2)
        })
        setWeight(totalNumber);
        resole(data);
    }), {
        manual: true
    })

    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: any[]): void => {
        setSelectedKeys(selectedRowKeys)
    }

    return <>
        <DetailTitle title="确认明细" />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <Space>
                <span>总基数：{tableDataSource.length}基</span>
                <span>总重量：{weight}kg</span>
            </Space>
            <Space>
                <Upload
                    action={() => {
                        const baseUrl: string | undefined = process.env.REQUEST_API_PATH_PREFIX;
                        return baseUrl + '/tower-science/drawProductDetail/import'
                    }}
                    headers={
                        {
                            'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
                            'Tenant-Id': AuthUtil.getTenantId(),
                            'Sinzetech-Auth': AuthUtil.getSinzetechAuth()
                        }
                    }
                    data={{ drawTaskId: params.id }}
                    showUploadList={false}
                    onChange={async (info) => {
                        if (info.file.response && !info.file.response?.success) {
                            message.warning(info.file.response?.msg)
                        }
                        if (info.file.response && info.file.response?.success) {
                            if (info.file.response && info.file.response?.success) {

                            }
                        }
                    }}
                >
                    <Button type="primary" disabled={userId !== params.confirmId} ghost >导入</Button>
                </Upload>
                <Button type='primary' ghost onClick={() => {
                    setEdit('添加')
                    setVisible(true)
                }}>添加</Button>
                <Button type='primary' onClick={
                    async () => {
                        await RequestUtil.delete(`/tower-science/drawProductDetail?ids=${selectedKeys.join(',')}`,)
                        message.success('删除成功！')
                        run()
                    }
                } ghost>批量删除</Button>
            </Space>
        </div>
        <CommonTable
            columns={productGroupDetail}
            dataSource={[...tableDataSource]} pagination={false} rowSelection={{
                selectedRowKeys: selectedKeys,
                onChange: SelectChange
            }} />
        <Modal
            visible={visible}
            title={edit}
            onOk={handleModalOk}
            onCancel={handleModalCancel}
            width={1101}>
            <BaseInfo
                form={form}
                edit
                col={3}
                columns={productGroupRow}
                dataSource={{}} />
        </Modal>
    </>
}
