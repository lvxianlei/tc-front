<<<<<<< HEAD
import React, { useState } from 'react'
import { Button, Spin, Space, Modal, Form, message, Image, Descriptions } from 'antd';
import { AddEditDetail } from "./supplier-mngt.json"
import { Page } from '../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../utils/RequestUtil';

export default function SupplierAdd(): React.ReactNode {
    return (
        <div>
            <Descriptions title="供应商基础信息" bordered column={2} labelStyle={{ textAlign: 'center' }}>
                <Descriptions.Item label="供应商编号">Zhou Maomao</Descriptions.Item>
                <Descriptions.Item label="供应商名称 *">Zhou Maomao</Descriptions.Item>
                <Descriptions.Item label="供应商类型 *">Zhou Maomao</Descriptions.Item>
                <Descriptions.Item label="质量保证体系 *">Zhou Maomao</Descriptions.Item>
                <Descriptions.Item label="联系人 *">Zhou Maomao</Descriptions.Item>
                <Descriptions.Item label="联系电话 *">Zhou Maomao</Descriptions.Item>
                <Descriptions.Item label="主要供货产品 *">Zhou Maomao</Descriptions.Item>
                <Descriptions.Item label="备注">Zhou Maomao</Descriptions.Item>
            </Descriptions>
            <Descriptions title="供应商账户信息" bordered column={2} labelStyle={{ textAlign: 'center' }}>
                <Descriptions.Item label="开户银行 *">Zhou Maomao</Descriptions.Item>
                <Descriptions.Item label="银行账号 *">Zhou Maomao</Descriptions.Item>
            </Descriptions>
            <Page
                path="/tower-supply/supplier/{supplierId}"
                columns={
                    [
                        ...AddEditDetail
                    ]
                }
                searchFormItems={[]}
            />
        </div>
    )
=======
import React, { useState } from 'react'
import { Button, Spin, Space, Modal, Form, message, Image } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { BaseInfo, DetailContent, CommonTable, DetailTitle } from '../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../utils/RequestUtil';
import TextArea from 'antd/lib/input/TextArea';

export default function SupplierAdd(): React.ReactNode {
    return (
        <div>
            123
        </div>
    )
>>>>>>> 25ed075f42dd4f88cf9cc91386a97f3540db2079
}