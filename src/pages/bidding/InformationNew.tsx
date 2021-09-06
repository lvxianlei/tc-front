import React from "react";
import { useHistory } from "react-router-dom";
import { Button, TableColumnProps, Row } from 'antd';
import { EditTable } from '../common'
import { Detail, BaseInfo, BaseInfoItemProps } from '../common'
export default function InfomationNew(): JSX.Element {
    const history = useHistory()
    const columns: TableColumnProps<object>[] = [
        {
            title: '状态',
            dataIndex: 'productStatus',
            render: (productStatus: number): React.ReactNode => {
                return productStatus === 1 ? '待下发' : productStatus === 2 ? '审批中' : '已下发'
            }
        },
        { title: '线路名称', dataIndex: 'lineName' },
        { title: '产品类型', dataIndex: 'productTypeName' },
        { title: '塔型', dataIndex: 'productShape' },
        { title: '杆塔号', dataIndex: 'productNumber' },
        { title: '电压等级（KV）', dataIndex: 'voltageGradeName' },
        { title: '呼高（米）', dataIndex: 'productHeight' },
        { title: '单位', dataIndex: 'unit' },
        {
            title: '数量',
            dataIndex: 'num',
            render: (num: number | string): React.ReactNode => {
                return num == -1 ? '' : num;
            }
        },
        { title: '单价', dataIndex: 'price' },
        { title: '金额', dataIndex: 'totalAmount' },
        { title: '标段', dataIndex: 'tender' },
        { title: '备注', dataIndex: 'description' }
    ]
    const baseInfoData: BaseInfoItemProps[] = [
        {
            name: 'contractNumber',
            label: '项目名称',
            type: 'string',
            value: 'baseInfo?.contractNumber'
        },
        {
            name: 'internalNumber',
            label: '项目单位',
            type: 'string',
            value: 'baseInfo?.internalNumber'
        },
        {
            name: 'projectName',
            label: '项目编号',
            type: 'string',
            value: 'baseInfo?.projectName'
        },
        {
            name: 'simpleProjectName',
            label: '数量',
            type: 'number',
            value: 'baseInfo?.simpleProjectName'
        },
        {
            name: 'winBidTypeName',
            label: '单位',
            type: 'string',
            value: 'baseInfo?.winBidTypeName'
        },
        {
            name: 'saleTypeName',
            label: '货物类别',
            value: 'baseInfo?.saleTypeName'
        },
        {
            name: 'customerCompany',
            label: '招标文件传递方式',
            value: 'baseInfo?.customerInfoVo?.customerCompany'
        },
        {
            name: 'customerLinkman',
            label: '价格范围（元/吨）',
            value: 'baseInfo?.customerInfoVo?.customerLinkman'
        },
        {
            name: 'customerPhone',
            label: '验收执行标准及验收方法',
            value: 'baseInfo?.customerInfoVo?.customerPhone'
        },
        {
            name: 'signCustomerName',
            label: '原材料执行标准',
            value: 'baseInfo?.signCustomerName'
        },
        {
            name: 'signContractTime',
            label: '包装要求',
            value: 'baseInfo?.signContractTime'
        },
        {
            name: 'signUserName',
            label: '是否有合同版本',
            value: 'baseInfo?.signUserName'
        },
        {
            name: 'deliveryTime',
            label: '货款结算条件及方式',
            value: 'baseInfo?.deliveryTime'
        },
        {
            name: 'reviewTime',
            label: '特殊材质',
            value: 'baseInfo?.reviewTime'
        },
        {
            name: 'countryCode',
            label: '其他',
            value: 'baseInfo?.countryCode'
        },
        {
            name: 'regionName',
            label: '审批状态',
            value: 'baseInfo?.regionName'
        },
        {
            name: 'chargeType',
            label: '备注',
            value: 'baseInfo?.chargeType === ChargeType.ORDER_TOTAL_WEIGHT'
        }
    ]
    return <Detail
        operation={[
            <Button key="save" type="default">保存</Button>,
            <Button key="new" onClick={() => history.goBack()}>取消</Button>
        ]}
        tabItems={[{
            label: '', key: 1, content: <>
                <BaseInfo dataSource={baseInfoData} edit />
                <EditTable columns={columns} dataSource={[]} />
                <Row>附件</Row>
                <EditTable columns={columns} dataSource={[]} />
            </>
        }]} />
}