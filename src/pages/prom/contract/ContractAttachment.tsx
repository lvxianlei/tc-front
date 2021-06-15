/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import { Table, TableColumnType } from 'antd';
import React from 'react';
import isEqual from 'react-fast-compare';

import SummaryRenderUtil from '../../../utils/SummaryRenderUtil';

export interface IContractAttachment {
    readonly attachVos?: IAttachVo[];
}

interface IContractAttachmentProps extends IContractAttachment {}
interface IContractAttachmentState extends IContractAttachment {}

export interface IAttachVo {
    readonly id?: number;
    readonly name?: string;
    readonly username?: string;
    readonly fileSize?: string;
    readonly description?: string;
    readonly filePath?: string;
    readonly fileSuffix?: string;
}

/**
 * The attachments of The contract
 */
export default class ContractAttachment extends React.Component<IContractAttachmentProps, IContractAttachmentState> {

    public state: IContractAttachmentState = {
        attachVos: []
    };

    /**
     * @implements
     * @description Gets derived state from props
     * @param props 
     * @param prevState 
     * @returns derived state from props 
     */
    static getDerivedStateFromProps(props: IContractAttachmentProps, prevState: IContractAttachmentState): IContractAttachmentState | null {
        if (!isEqual(props.attachVos, prevState.attachVos)) {
            return {
                attachVos: [ ...props.attachVos || [] ]
            }
        }
        return null;
    }

    /**
     * @description Gets columns
     * @returns columns 
     */
    private getColumns(): TableColumnType<object>[] {
        return [ {
            key: 'name',
            title: '附件名称',
            dataIndex: 'name'
        }, {
            key: 'fileSize',
            title: '文件大小',
            dataIndex: 'fileSize',
        }, {
            key: 'fileUploadTime',
            title: '上传时间',
            dataIndex: 'fileUploadTime',
        }, {
            key: 'userName',
            title: '上传人员',
            dataIndex: 'userName'
        },  {
            key: 'description',
            title: '备注',
            dataIndex: 'description'
        }];
    }

    /**
     * @description Renders section
     * @returns  
     */
    private renderSection = (): React.ReactNode => {
        return <Table rowKey="id" dataSource={ this.state.attachVos } columns={ this.getColumns() } />;
    }

    /**
     * @description Renders ContractAttachment
     * @returns render 
     */
    public render(): React.ReactNode {
        return SummaryRenderUtil.renderSections([{
            title: '相关附件',
            render: this.renderSection
        }])
    }
}