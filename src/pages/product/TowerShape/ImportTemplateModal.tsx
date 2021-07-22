/**
 * @author zyc
 * @copyright © 2021
 */

import { Button, FormInstance, Modal, Select, } from 'antd';
import React from 'react';
import tower from '../../../../public/tower.png';
import componentDetail from '../../../../public/componentDetail.png';
import RequestUtil from '../../../utils/RequestUtil';
import styles from './AbstractTowerShapeSetting.module.less';
import layoutStyles from '../../../layout/Layout.module.less';
import AuthUtil from '../../../utils/AuthUtil';

export interface IImportTemplateModalProps {
    readonly id?: number | string;
}

export interface IImportTemplateModalState {
    readonly isModalVisible: boolean;
    readonly preview?: string;
}

enum Template {
    COMPONENT_DETAILS = 1,
    TOWER = 2
}

export default abstract class ImportTemplateModal<P extends IImportTemplateModalProps, S extends IImportTemplateModalState> extends React.Component<P,S> {

    private form: React.RefObject<FormInstance> = React.createRef<FormInstance>();

    /**
     * @protected
     * @description Gets form
     * @returns form 
     */
    protected getForm(): FormInstance | null {
        return this.form?.current;
    }
    
    /**
     * @constructor
     * Creates an instance of ImportTemplateModal.
     * @param props 
     */
    constructor(props: P) {
        super(props);
        this.state = this.getState();
    }

    /**
     * @description Gets state, it can override.
     */
    protected getState(): S {
        return {
            isModalVisible: false,
            preview: componentDetail
        } as S;
    }

    /**
     * @description 取消操作 
     * @param event 
     */
    public handleCancel = (): void => {
        this.setState ({
            isModalVisible: false
        })
    };

    /**
     * @description 确定
     * @param event 
     */
     public confirmDownload = async (): Promise<void> => {
        const preview: string | undefined = this.state.preview;
        if(preview === componentDetail) {
            return fetch(`${process.env.REQUEST_API_PATH_PREFIX?.replace(/\/*$/, '/') || ''.replace(/\/*$/, '/')}${`/tower-data-archive/productCategory/drawComponent/exportTemplate`.replace(/^\/*/, '')}`, {
                mode: 'cors',
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
                  'Tenant-Id': AuthUtil.getTenantId(),
                  'Sinzetech-Auth': AuthUtil.getSinzetechAuth(),
                }
            }).then((res) => {
                return res.blob();
            }).then((data) => {
                let blobUrl = window.URL.createObjectURL(data);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.download = '构件明细模板';
                a.href = blobUrl;
                a.click();
                if(document.body.contains(a)) {
                    document.body.removeChild(a);
                }
            })
        }
        this.setState ({
            isModalVisible: false
        })
    };

    /**
     * @description 显示弹窗 
     * @param event 
     */
    public showModal = async (): Promise<void> => {
        this.setState({
            isModalVisible: true
        })
    }
    
    public render(): React.ReactNode {
        return (
            <>
                <Button onClick={ this.showModal } type="ghost">导入模板下载</Button>
                <Modal 
                    title="杆塔配段" 
                    visible={ this.state.isModalVisible }
                    onOk={ this.confirmDownload }
                    onCancel={ this.handleCancel }
                    width="80%"
                >
                    <Select placeholder="请选择工程状态" defaultValue={ Template.COMPONENT_DETAILS } onChange={ (value) => {
                        if(value === Template.COMPONENT_DETAILS) {
                            this.setState({
                                preview: componentDetail
                            })
                        } else {
                            this.setState({
                                preview: tower
                            })
                        }
                    } }>
                        <Select.Option value={ Template.COMPONENT_DETAILS }>构件明细模板</Select.Option>
                        {/* <Select.Option value={ Template.TOWER }>塔型杆塔模板</Select.Option> */}
                    </Select>
                    <div className={ styles.imgwidth }>
                        <img src={ this.state.preview } alt="" />
                    </div>
                    {/* <iframe/> */}
                </Modal> 
            </>
        );
    }
}
