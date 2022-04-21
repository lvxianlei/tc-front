/**
 * 选择仓库
 * author: mschange
 * time: 2022/4/21
 */
import React, { useState } from 'react';
import { Button, Checkbox, DatePicker, Form, Modal, Spin, Table } from 'antd';
import { EditProps } from "./index"
import { SelectWarehouseCloumn } from "./InheritOneIngredient.json";
import { CommonTable } from '../../../common';
import moment from 'moment';


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
            disabled: record.notConfigured <= 0, // Column configuration not to be checked
            name: record.name,
        }),
    };
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
                    type: "checkbox",
                    ...rowSelectionCheck,
                }}
                pagination={false}
                haveIndex columns={SelectWarehouseCloumn} dataSource={[]}
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