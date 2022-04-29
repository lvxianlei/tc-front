/**
 * 已配方案
 * author: mschange
 * time: 2022/4/21
 */
import React, { useState } from 'react';
import { Button, Form, Modal, Spin, Table } from 'antd';
import { EditProps } from "./index"
import { AllocatedSchemeCloumn } from "./InheritOneIngredient.json";
import { CommonTable } from '../../../common';

export default function AllocatedScheme(props: EditProps): JSX.Element {

    return (
        <Modal
            title={'已配方案'}
            visible={props?.visible}
            width={1200}
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
                        props?.hanleInheritSure(false)
                    }}
                >
                    关闭
                </Button>
            ]}
        >
            <CommonTable
                pagination={false}
                haveIndex columns={AllocatedSchemeCloumn} dataSource={props?.allocatedScheme || []} />
        </Modal>
    )
}