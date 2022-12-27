/**
 * 选择米数
 * author: mschange
 * time: 2022/4/21
 */
import React, { useEffect, useState } from 'react';
import { Button, Form, message, Modal, Spin, Table } from 'antd';
import { EditProps } from "./index"
import { SelectMetersCloumn } from "./InheritOneIngredient.json";
import { CommonTable } from '../../../common';
import RequestUtil from '../../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';


export default function SelectMeters(props: EditProps): JSX.Element {
    const [selectedRowKeysCheck, setSelectedRowKeysCheck] = useState<any>([]);
    const rowSelectionCheck = {
        selectedRowKeys: selectedRowKeysCheck,
        onChange: (selectedRowKeys: React.Key[], selectedRows: any) => {
            setSelectedRowKeysCheck(selectedRowKeys)
        }
    };
    
    useEffect(() => {
        if (props.visible) {
            getBatchingStrategy();
        } 
    }, [props.visible])

    // 获取所有的仓库
    const { run: getBatchingStrategy, data: batchingStrategy } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/materialStock/getIssuedAvailableInventoryList`);
            let v = [];
            for (let i = 0; i < result.length; i += 1) {
                v.push(result[i].id);
            }
            setSelectedRowKeysCheck(v);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    return (
        <Modal
            title={'选择原材料米数'}
            visible={props?.visible}
            width={400}
            maskClosable={false}
            onCancel={() => {
                props?.hanleInheritSure({
                    code: false
                })
            }}
            footer={[
                <Button
                    key="back"
                    onClick={() => {
                        props?.hanleInheritSure({
                            code: false
                        })
                    }}
                >
                    取消
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={() => {
                        props?.hanleInheritSure({
                            code: true,
                            // data为传递回的数据
                            data: selectedRowKeysCheck
                        })
                    }}
                >
                    确认
                </Button>
            ]}
        >
            <CommonTable
                rowSelection={{
                    type: "checkbox",
                    ...rowSelectionCheck,
                }}
                pagination={false}
                rowKey="length"
                columns={SelectMetersCloumn} dataSource={(batchingStrategy as any) || []} />
        </Modal>
    )
}