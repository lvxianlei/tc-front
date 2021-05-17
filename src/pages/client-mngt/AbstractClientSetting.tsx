/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import { Input, Select } from 'antd';
import React from 'react';
import { RouteComponentProps } from 'react-router';

import AbstractFillableComponent, { IAbstractFillableComponentState, IFormItemGroup } from '../../components/AbstractFillableComponent';

export interface IAbstractClientSettingState extends IAbstractFillableComponentState {
    readonly client?: IClient;
}

export interface IClient {
    readonly id?: number;
    readonly description?: string;
    readonly linkman?: string;
    readonly name?: string;
    readonly phone?: string;
    readonly type?: number;
}

/**
 * Abstract Client Setting
 */
export default abstract class AbstractClientSetting<P extends RouteComponentProps, S extends IAbstractClientSettingState> extends AbstractFillableComponent<P, S> {

    public state: S = {
        client: undefined
    } as S;

    /**
     * @override
     * @description Gets return path
     * @returns return path 
     */
    protected getReturnPath(): string {
        return '/client/mngt/';
    }

    /**
     * @implements
     * @description Gets form item groups
     * @returns form item groups 
     */
    public getFormItemGroups(): IFormItemGroup[][] {
        const client: IClient | undefined = this.state.client;
        return [[{
            title: '基础信息',
            itemProps: [{
                label: '客户名称',
                name: 'name',
                initialValue: client?.name,
                rules: [{
                    required: true,
                    message: '请输入客户名称'
                }],
                children: <Input/>
            }, {
                label: '客户类型',
                name: 'type',
                initialValue: client?.type,
                children: (
                    <Select>
                        <Select.Option value={ 1 }>国内客户</Select.Option>
                        <Select.Option value={ 2 }>国际客户</Select.Option>
                    </Select>
                )
            }, {
                label: '备注',
                name: 'description',
                initialValue: client?.description,
                children: <Input.TextArea rows={ 5 } showCount={ true } maxLength={ 300 } placeholder="请输入备注信息"/>
            }]
        }], [{
            title: '首要联系人',
            itemProps: [{
                label: '联系人姓名',
                name: 'linkman',
                initialValue: client?.linkman,
                children: <Input/>
            }, {
                label: '手机号码',
                name: 'phone',
                initialValue: client?.phone,
                children: <Input/>
            }]
        }]];
    }
}