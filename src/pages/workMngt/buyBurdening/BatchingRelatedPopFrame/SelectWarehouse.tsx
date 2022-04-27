/**
 * 选择仓库
 * author: mschange
 * time: 2022/4/21
 */
import React, { useEffect, useState } from 'react';
import { Button, Checkbox, DatePicker, Form, Modal, Spin, Table } from 'antd';
import { EditProps } from "./index"
import { SelectWarehouseCloumn } from "./InheritOneIngredient.json";
import { CommonTable } from '../../../common';
import moment from 'moment';
import RequestUtil from '../../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';


export default function SelectWarehouse(props: EditProps): JSX.Element {
    const [selectedRowKeysCheck, setSelectedRowKeysCheck] = useState<any>([]);
    const [inventory, setInventory] = useState<boolean>(false);
    const [inventoryTime, setInventoryTime] = useState<string>("");
    const rowSelectionCheck = {
        selectedRowKeys: selectedRowKeysCheck,
        onChange: (selectedRowKeys: React.Key[], selectedRows: any) => {
            setSelectedRowKeysCheck(selectedRowKeys)
        },
        getCheckboxProps: (record: any) => ({
            name: record.name,
        }),
    };

    useEffect(() => {
        if (props.visible) {
            getBatchingStrategy();
        } 
    }, [props.visible])

    // 获取所有的仓库
    const { run: getBatchingStrategy, data: batchingStrategy } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/warehouse/getWarehouses`);
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
            title={'选择仓库'}
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
                    type: "checkbox",
                    ...rowSelectionCheck,
                }}
                pagination={false}
                rowKey="id"
                columns={[
                    {
                        key: 'index',
                        title: '序号',
                        dataIndex: 'index',
                        fixed: "left",
                        width: 80,
                        render: (_a: any, _b: any, index: number): React.ReactNode => {
                            return (
                                <span>
                                    {index + 1}
                                </span>
                            )
                        }
                    },
                    ...SelectWarehouseCloumn
                ]} dataSource={(batchingStrategy as any) || []}
            />
            <Checkbox style={{ marginTop: 12 }} onChange={(e) => {
                setInventory(e.target.checked)
                if (!e.target.checked) setInventoryTime("")
            }}>允许使用在途库存</Checkbox>
            <div>
                <span style={{ marginRight: 8 }}>在途库存最晚到货时间</span><DatePicker value={inventoryTime ? moment(inventoryTime) : undefined} disabled={!inventory} onChange={(date, dateString) => {
                    setInventoryTime(dateString);
                }}/>
            </div>
        </Modal>
    )
}