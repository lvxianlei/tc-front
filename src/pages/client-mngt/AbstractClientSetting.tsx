/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import { Input, Select } from 'antd';
import { FormProps, RuleObject } from 'antd/lib/form';
import { StoreValue } from 'antd/lib/form/interface';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import { clientTypeOptions } from '../../configuration/DictionaryOptions';
import AbstractFillableComponent, { IAbstractFillableComponentState, IFormItemGroup } from '../../components/AbstractFillableComponent';
import { IClient } from '../../configuration/IClient';
export interface IAbstractClientSettingState extends IAbstractFillableComponentState {
    readonly client?: IClient;
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
     * @description 验证业主联系电话格式
     */
     public checkcustomerPhone = (value: StoreValue): Promise<void | any> =>{
        return new Promise(async (resolve, reject) => {  // 返回一个promise
            const regPhone: RegExp = /^1[3|4|5|8][0-9]\d{8}$/;
            const regTel: RegExp = /^\d{3}-\d{8}|\d{4}-\d{7}$/;
            if(regPhone.test(value) || regTel.test(value) ) {
                resolve(true)
            } else 
                resolve(false)
        }).catch(error => {
            Promise.reject(error)
        })
    }

    /**
     * @override
     * @description Gets form props
     * @returns form props 
     */
     protected getFormProps(): FormProps {
        return {
            ...super.getFormProps(),
            labelCol:{ 
                span: 6 
            },
            wrapperCol: {
                offset: 1
            }
        };
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
                },
                {
                  pattern: /^[^\s]*$/,
                  message: '禁止输入空格',
                }
        ],
                children: <Input maxLength={100}/>
            }, {
                label: '客户类型',
                name: 'type',
                initialValue: client?.type || clientTypeOptions && clientTypeOptions.length > 0 && clientTypeOptions[0].id,
                rules: [{
                    required: true,
                    message: '请选择客户类型'
                }],
                children: (
                    <Select>
                        { clientTypeOptions && clientTypeOptions.map(({ id, name }, index) => {
                            return <Select.Option key={ index } value={ id }>
                                { name }
                            </Select.Option>
                        }) }
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
                rules: [{
                    required: true,
                    message: '请输入联系人姓名'
                },
                {
                  pattern: /^[^\s]*$/,
                  message: '禁止输入空格',
                }],
                children: <Input maxLength={20}/>
            }, {
                label: '手机号码',
                name: 'phone',
                rules: [{
                    required: true,
                    message: '请输入手机号'
                    // validator: (rule: RuleObject, value: StoreValue, callback: (error?: string) => void) => {
                    //     this.checkcustomerPhone(value).then(res => {
                    //         if (res) {
                    //             callback()
                    //         } else {
                    //             callback('手机号码格式有误')
                    //         }
                    //     })
                    // }
                },
                {
                  pattern: /^[^\s]*$/,
                  message: '禁止输入空格',
                }],
                initialValue: client?.phone,
                children: <Input maxLength={20}/>
            }]
        }]];
    }
}