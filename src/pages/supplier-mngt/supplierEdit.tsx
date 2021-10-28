import React, { useState } from 'react'
import { Button, Spin, Space, Modal, Form, message, Image, Descriptions } from 'antd';
import { AddEditDetail } from "./supplier-mngt.json"
import { Page } from '../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../utils/RequestUtil';

//put请求

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
                path="/tower-supply/supplier"
                columns={
                    [
                        ...AddEditDetail
                    ]
                }
                searchFormItems={[]}
            />
        </div>
    )
}