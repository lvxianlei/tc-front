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
            getAvailableInventoryList("", props?.spec);
        } 
    }, [props.visible])

    const { run: getAvailableInventoryList, data: AvailableInventoryData } = useRequest<{ [key: string]: any }>((
        lenRange: string = "",
        spec: string = ""
    ) => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-supply/angleConfigStrategy/ingredientsInventoryList`, {
                spec,
                lenRange
            });
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
                setSelectedRowKeysCheck([]);
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
                            data: selectedRowKeysCheck
                        })
                        setSelectedRowKeysCheck([]);
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
                columns={SelectMetersCloumn} dataSource={(AvailableInventoryData as any) || []} />
        </Modal>
    )
}