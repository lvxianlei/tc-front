/**
 * 继承一次方案
 * author: mschange
 * time: 2022/4/21
 */
import React, { useEffect, useState } from 'react';
import { Button, Form, message, Modal, Spin, Table } from 'antd';
import { EditProps } from "./index"
import { InheritOneIngredientCloumn } from "./InheritOneIngredient.json";
import { CommonTable } from '../../../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../../utils/RequestUtil';


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

    useEffect(() => {
      if (props.visible) {
        getBatchingStrategy();
      }
    }, [props.visible])

    // 获取数据
    const { run: getBatchingStrategy, data: batchingStrategy } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/task/produce/matchingScore`, {
                produceId: props.id
            });
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    return (
        <Modal
            title={'请选择要继承的批次'}
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
                        if (selectedRowKeysCheck.length < 1) {
                            message.error("请您选择匹配度！");
                            return false;
                        }
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
                rowKey={"batchNumber"}
                rowSelection={{
                    type: "checkbox",
                    ...rowSelectionCheck,
                }}
                pagination={false}
                haveIndex columns={InheritOneIngredientCloumn} dataSource={(batchingStrategy as any) || []} />
        </Modal>
    )
}