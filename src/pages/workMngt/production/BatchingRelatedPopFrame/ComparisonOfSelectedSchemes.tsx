/**
 * 已选方案对比
 * author: mschange
 * time: 2022/4/21
 */
import React, { useState } from 'react';
import { Button, Form, message, Modal, Spin, Table } from 'antd';
import { EditProps } from "./index"
import { ComparisonOfSelectedSchemesCloumn } from "./InheritOneIngredient.json";
import { CommonTable } from '../../../common';


export default function ComparisonOfSelectedSchemes(props: EditProps): JSX.Element {
    const [selectedRowKeysCheck, setSelectedRowKeysCheck] = useState<any>([]);
    const rowSelectionCheck = {
        selectedRowKeys: selectedRowKeysCheck,
        onChange: (selectedRowKeys: React.Key[], selectedRows: any) => {
            setSelectedRowKeysCheck(selectedRowKeys)
        }
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
                        if (selectedRowKeysCheck.length < 1) {
                            message.error("请您选择方案！");
                            return false;
                        }
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
                    type: "radio",
                    ...rowSelectionCheck,
                }}
                rowKey="key"
                pagination={false}
                columns={[
                    {
                        key: 'index',
                        title: '方案',
                        dataIndex: 'index',
                        fixed: "left",
                        width: 50,
                        render: (_a: any, _b: any, index: number): React.ReactNode => {
                            return (
                                <span>
                                    {index + 1}
                                </span>
                            )
                        }
                    },
                    ...ComparisonOfSelectedSchemesCloumn.map((item: any) => {
                        if (item.dataIndex === "surplusMaaterial") {
                            return ({
                                title: item.title,
                                dataIndex: item.dataIndex,
                                width: 50,
                                render: (_: any, record: any): React.ReactNode => {
                                    return (
                                        <span>{ record[item.dataIndex] }mm</span>)
                                }
                            })
                        }
                        if (item.dataIndex === "calculation") {
                            return ({
                                title: item.title,
                                dataIndex: item.dataIndex,
                                width: 50,
                                render: (_: any, record: any): React.ReactNode => {
                                    return (
                                        <span>{ record[item.dataIndex] }%</span>)
                                }
                            })
                        }
                        return item;
                    })
                ]} dataSource={props?.schemeComparison || []} />
        </Modal>
    )
}