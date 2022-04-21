/**
 * 已选方案对比
 * author: mschange
 * time: 2022/4/21
 */
import React, { useState } from 'react';
import { Button, Form, Modal, Spin, Table } from 'antd';
import { EditProps } from "./index"
import { ComparisonOfSelectedSchemesCloumn } from "./InheritOneIngredient.json";
import { CommonTable } from '../../../common';


export default function ComparisonOfSelectedSchemes(props: EditProps): JSX.Element {
    const [selectedRowKeysCheck, setSelectedRowKeysCheck] = useState<any>([]);
    const rowSelectionCheck = {
        selectedRowKeys: selectedRowKeysCheck,
        onChange: (selectedRowKeys: React.Key[], selectedRows: any) => {
            setSelectedRowKeysCheck(selectedRowKeys)
        },
        getCheckboxProps: (record: any) => ({
            disabled: record.notConfigured <= 0, // Column configuration not to be checked
            name: record.name,
        }),
    };
    return (
        <Modal
            title={'已选方案对比'}
            visible={props?.visible}
            width={1000}
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
                        console.log("dsdsdsd")
                        props?.hanleInheritSure({
                            code: true,
                            // data为传递回的数据
                            data: "222"
                        })
                    }}
                >
                    确认
                </Button>
            ]}
        >
            <CommonTable
                rowSelection={{
                    type: "radio",
                    ...rowSelectionCheck,
                }}
                pagination={false}
                columns={ComparisonOfSelectedSchemesCloumn} dataSource={[]} />
        </Modal>
    )
}