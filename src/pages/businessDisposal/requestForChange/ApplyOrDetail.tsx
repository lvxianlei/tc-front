/**
 * @author zyc
 * @copyright © 2022 
 * @description 业务处置管理-明细变更申请-详情
 */

import React, { useImperativeHandle, forwardRef } from "react";
import { BaseInfo, CommonTable, DetailContent, OperationRecord } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './RequestForChange.module.less';
import { Spin } from "antd";

interface modalProps {
    readonly id?: any;
}

export default forwardRef(function ApplyOrDetail({ id }: modalProps, ref) {

    const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-science/productChange/${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id] })

    const detailColumns = [
        {
            "key": "drawTaskNum",
            "title": "确认任务编号",
            width: 50,
            dataIndex: "drawTaskNum"
        },
        {
            "key": "scTaskNum",
            "title": "营销任务编号",
            width: 80,
            dataIndex: "scTaskNum"
        },
        {
            "key": "internalNumber",
            "title": "内部合同编号",
            width: 80,
            dataIndex: "internalNumber"
        },
        {
            "key": "projectName",
            "title": "工程名称",
            width: 80,
            dataIndex: "projectName"
        },
        {
            "key": "changeExplain",
            "title": "变更说明",
            width: 80,
            dataIndex: "changeExplain"
        },
        {
            "key": "planNumber",
            "title": "计划号",
            width: 80,
            dataIndex: "planNumber"
        },
        {
            "key": "contractName",
            "title": "合同名称",
            width: 80,
            dataIndex: "contractName"
        },
        {
            "key": "aeName",
            "title": "业务员",
            width: 80,
            dataIndex: "aeName"
        },
        {
            "key": "description",
            "title": "备注",
            width: 80,
            dataIndex: "description"
        },
        {
            "key": "updateDescription",
            "title": "备注（修改后）",
            width: 80,
            dataIndex: "updateDescription",
            render: (record: Record<string, any>): React.ReactNode => {
                return record?.updateDescription ? <p className={styles?.red}>{record?.updateDescription}</p> : <p>{"-"}</p>
            }
        }
    ]
    const selectedColumns = [
        {
            "key": "changeTypeName",
            "title": "变更类型",
            width: 50,
            dataIndex: "changeTypeName"
        },
        {
            "key": "productNumber",
            "title": "杆塔号（修改前）",
            width: 80,
            dataIndex: "productNumber"
        },
        {
            "key": "changeProductNumber",
            "title": "杆塔号（修改后）",
            width: 80,
            dataIndex: "changeProductNumber",
            render: (_: any, record: Record<string, any>): React.ReactNode => (
                _ ? <p className={styles?.red}>{_}</p> : <p className={styles?.red}>{_}</p>
            )
        },
        {
            "key": "productCategoryName",
            "title": "塔型名（修改前）",
            width: 80,
            dataIndex: "productCategoryName"
        },
        {
            "key": "changeProductCategoryName",
            "title": "塔型名（修改后）",
            width: 80,
            dataIndex: "changeProductCategoryName",
            render: (_: any, record: Record<string, any>): React.ReactNode => (
                _ ? <p className={styles?.red}>{_}</p> : <p className={styles?.red}>{_}</p>
            )
        },
        {
            "key": "steelProductShape",
            "title": "塔型钢印号（修改前）",
            width: 80,
            dataIndex: "steelProductShape"
        },
        {
            "key": "changeSteelProductShape",
            "title": "塔型钢印号（修改后）",
            width: 80,
            dataIndex: "changeSteelProductShape",
            render: (_: any, record: Record<string, any>): React.ReactNode => (
                _ ? <p className={styles?.red}>{_}</p> : <p className={styles?.red}>{_}</p>
            )
        },
        {
            "key": "voltageGradeName",
            "title": "电压等级（修改前）",
            width: 80,
            dataIndex: "voltageGradeName"
        },
        {
            "key": "changeVoltageGradeName",
            "title": "电压等级（修改后）",
            width: 80,
            dataIndex: "changeVoltageGradeName",
            render: (_: any, record: Record<string, any>): React.ReactNode => (
                _ ? <p className={styles?.red}>{_}</p> : <p className={styles?.red}>{_}</p>
            )
        },
        {
            "key": "productTypeName",
            "title": "产品类型（修改前）",
            width: 80,
            dataIndex: "productTypeName"
        },
        {
            "key": "changeProductTypeName",
            "title": "产品类型（修改后）",
            width: 80,
            dataIndex: "changeProductTypeName",
            render: (_: any, record: Record<string, any>): React.ReactNode => (
                _ ? <p className={styles?.red}>{_}</p> : <p className={styles?.red}>{_}</p>
            )
        }
    ]

    useImperativeHandle(ref, () => ({}), [ref]);

    return <Spin spinning={loading}>
        <DetailContent className={styles.changeForm}>
            <BaseInfo dataSource={data || {}} columns={detailColumns} col={3} />
            <CommonTable
                haveIndex
                className={styles.bottom16}
                columns={selectedColumns}
                pagination={false}
                dataSource={data?.productChangeDetailList || []}
            />
            <OperationRecord title="操作信息" serviceId={id} serviceName="tower-science" />
        </DetailContent>
    </Spin>
})