/**
 * 继承一次方案
 * author: mschange
 * time: 2022/4/21
 */
import React, { useState } from 'react';
import { Button, Form, Modal, Spin, Table } from 'antd';
import { EditProps } from "./index"
import { InheritOneIngredientCloumn } from "./InheritOneIngredient.json";
import { CommonTable } from '../../../common';


export default function InheritOneIngredient(props: EditProps): JSX.Element {
    const [selectedRowKeysCheck, setSelectedRowKeysCheck] = useState<any>([]);
    const [selectedRowsCheck, setSelectedRowsCheck] = useState<any>([]);
    const rowSelectionCheck = {
        selectedRowKeys: selectedRowKeysCheck,
        onChange: (selectedRowKeys: React.Key[], selectedRows: any) => {
            setSelectedRowKeysCheck(selectedRowKeys)
            setSelectedRowsCheck(selectedRows);
        },
        getCheckboxProps: (record: any) => ({
            disabled: record.notConfigured <= 0, // Column configuration not to be checked
            name: record.name,
        }),
    };
    return (
        <Modal
            title={'一次配料方案'}
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
                        setSelectedRowKeysCheck([])
                        setSelectedRowsCheck([]);
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
                            data: {
                                selectedRowKeysCheck,
                                selectedRowsCheck
                            }
                        })
                        setSelectedRowKeysCheck([])
                        setSelectedRowsCheck([]);
                    }}
                >
                    继承方案
                </Button>
            ]}
        >
            <p>查询到批次已发生变更，请手动选择要继承的批次</p>
            <CommonTable
                rowSelection={{
                    type: "radio",
                    ...rowSelectionCheck,
                }}
                pagination={false}
                haveIndex columns={InheritOneIngredientCloumn} dataSource={props?.inheritScheme || []} />
        </Modal>
    )
}