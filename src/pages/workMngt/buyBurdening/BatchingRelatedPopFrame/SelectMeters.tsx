/**
 * 选择米数
 * author: mschange
 * time: 2022/4/21
 */
import React, { useState } from 'react';
import { Button, Form, message, Modal, Spin, Table } from 'antd';
import { EditProps } from "./index"
import { SelectMetersCloumn } from "./InheritOneIngredient.json";
import { CommonTable } from '../../../common';


export default function SelectMeters(props: EditProps): JSX.Element {
    const [selectedRowKeysCheck, setSelectedRowKeysCheck] = useState<any>([]);
    const rowSelectionCheck = {
        selectedRowKeys: selectedRowKeysCheck,
        onChange: (selectedRowKeys: React.Key[], selectedRows: any) => {
            setSelectedRowKeysCheck(selectedRowKeys)
        }
    };
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
                rowKey="meterNumber"
                columns={SelectMetersCloumn} dataSource={props?.meterNumber || []} />
        </Modal>
    )
}