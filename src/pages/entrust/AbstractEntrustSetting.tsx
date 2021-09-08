/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import { Button, Col, DatePicker, Input, message, Row, Space } from 'antd';
import { FormProps } from 'antd/lib/form';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import AbstractFillableComponent, { IAbstractFillableComponentState, IFormItemGroup } from '../../components/AbstractFillableComponent';
import moment from 'moment';
import Dragger from 'antd/lib/upload/Dragger';
import AuthUtil from '../../utils/AuthUtil';
import styles from './AbstractEntrustSetting.module.less';
import { InboxOutlined } from '@ant-design/icons';
import RequestUtil from '../../utils/RequestUtil';
export interface IAbstractEntrustSettingState extends IAbstractFillableComponentState {
    readonly entrust?: IEntrust;
    readonly attachList?: IAttachVo[];
}

export interface IEntrust {
    readonly projectName?: string;
    readonly projectStartTime?: string;
    readonly projectEndTime?: string;
    readonly attachVoList?: IAttachVo[];
}

export interface IAttachVo {
    readonly id?: number | string;
    readonly originalName?:	string;
    readonly name?:	string;
    readonly fileUploadTime?: string;
    readonly fileSuffix?: string;
    readonly fileSize?: number;	
    readonly size?: number;	
    readonly filePath?:	string;
    readonly link?:	string;
    readonly description?: string;
    readonly userName?: string;
}

/**
 * Abstract Entrust Setting
 */
export default abstract class AbstractEntrustSetting<P extends RouteComponentProps, S extends IAbstractEntrustSettingState> extends AbstractFillableComponent<P, S> {

    public state: S = {
        entrust: undefined
    } as S;

    /**
     * @override
     * @description Gets return path
     * @returns return path 
     */
    protected getReturnPath(): string {
        return '/outsource/entrust';
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
    
    public deleteAttach = async (values: Record<string, any>, index: number): Promise<void> => {
        const attachList: IAttachVo[] | undefined= this.state?.attachList;
        if(values.id) {
            await RequestUtil.delete(`/tower-system/attach?ids=${ values.attachId }`);
        }
        attachList && attachList.splice(index, 1);
        this.setState({
            attachList: attachList
        })
    }

    /**
     * @description Renders extra operation area
     * @returns extra operation area 
     */
    protected renderExtraOperationArea(): React.ReactNode {
        return null;
    }

    abstract onFinishSubmit(): void;

    /**
     * @description Gets primary operation button
     * @returns primary operation button
     */
    protected getPrimaryOperationButton(): React.ReactNode {
        return <Space direction="horizontal" size="large" > 
            <Button type="primary" htmlType="submit">保存</Button>
            <Button type="primary" htmlType="button" onClick={ () => this.onFinishSubmit() }>提交</Button>
        </Space>;
    }

    /**
     * @implements
     * @description Gets form item groups
     * @returns form item groups 
     */
    public getFormItemGroups(): IFormItemGroup[][] {
        const entrust: IEntrust | undefined = this.state.entrust;
        return [[{
                title: '委托信息',
                itemProps: [{
                    label: '工程名称',
                    name: 'projectName',
                    initialValue: entrust?.projectName,
                    rules: [{
                        required: true,
                        message: '请输入工程名称'
                    }],
                    children: <Input />
                }, {
                    label: '工程周期',
                    name: 'projectTime',
                    initialValue: entrust?.projectStartTime ? [moment(entrust?.projectStartTime), moment(entrust?.projectEndTime)] : '',
                    rules: [{
                        required: true,
                        message: '请选择工程周期'
                    }],
                    children: <DatePicker.RangePicker />
                }, {
                    label: '资料包',
                    name: 'attachVoList',
                    initialValue: entrust?.attachVoList,
                    rules: [{
                        required: true,
                        message: '请上传资料'
                    }],
                    children: 
                    <Dragger 
                        name='file' 
                        multiple={ true } 
                        action= { () => {
                            const baseUrl: string | undefined = process.env.REQUEST_API_PATH_PREFIX;
                            return baseUrl+'/sinzetech-resource/oss/put-file'
                        } } 
                        headers={
                            {
                                'Authorization': `Basic ${ AuthUtil.getAuthorization() }`,
                                'Tenant-Id': AuthUtil.getTenantId(),
                                'Sinzetech-Auth': AuthUtil.getSinzetechAuth()
                            }
                        }
                        className={ styles.upload_section } 
                        showUploadList={ false }
                        onChange={ (info) => {const { status } = info.file;
                            if (status === 'done') {
                                message.success(`${info.file.name} file uploaded successfully.`);
                                let attachList: IAttachVo[] | undefined = this.state.attachList || [];
                                const resData: IAttachVo | undefined = info.file.response.data;
                                attachList.push({ 
                                    filePath: resData?.name,
                                    fileSize: resData?.size,
                                    fileSuffix: resData?.name?.slice(resData?.name?.lastIndexOf('.') + 1, resData?.name.length),
                                    fileUploadTime: resData?.fileUploadTime,
                                    name: resData?.originalName,	
                                    userName: resData?.userName })
                                this.setState({
                                    attachList: attachList
                                })
                            } else if (status === 'error') {
                                message.error(`${info.file.name} file upload failed.`);
                            }} }
                    >
                        <p className={ styles.upload_drag_icon }>
                            <InboxOutlined />
                        </p>
                        <p className={ styles.upload_text }>点击或拖动文件上传</p>
                        <p className={ styles.upload_hint }>
                            支持单个或批量上传
                        </p>
                        <p className={ styles.upload_point }>
                            （工程图纸、加工配基表、塔杆明细）
                        </p>
                    </Dragger>
                }]
            }],
            [{
                title: '已上传资料包',
                itemProps: [{
                    label: '',
                    children: <>
                        { this.state.attachList ? 
                            <>{ this.state.attachList.map<React.ReactNode>((items: IAttachVo, index: number): React.ReactNode => {
                                    return <Row justify="center" gutter={24} key={ index }>
                                        <Col span={6}>{ items.name }</Col>
                                        <Col span={6}>{ items.fileUploadTime }</Col>
                                        <Col span={6}>
                                            <Button type="link" onClick={ () => this.deleteAttach(items, index) }>
                                                删除
                                            </Button>
                                        </Col>
                                    </Row>
                                })
                            }</> 
                            : "暂无资料包"
                        }
                    </>
                }]
            }
        ]]
    }
}