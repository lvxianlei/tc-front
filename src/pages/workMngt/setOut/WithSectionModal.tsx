/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-放样列表-杆塔配段-配段
*/
import React from 'react';
import { Button, Space, Modal, Form, Input, FormInstance, Descriptions } from 'antd';
import { DetailContent } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import styles from './TowerLoftingAssign.module.less';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import useRequest from '@ahooksjs/use-request';

export interface WithSectionModalProps {}
export interface IWithSectionModalRouteProps extends RouteComponentProps<WithSectionModalProps>, WithTranslation {
    readonly id: number | string;
}

export interface WithSectionModalState {
    readonly visible: boolean;
    readonly description?: string;
}

class WithSectionModal extends React.Component<IWithSectionModalRouteProps, WithSectionModalState> {
   
    private form: React.RefObject<FormInstance> = React.createRef<FormInstance>();

    private getForm = (): FormInstance | null => {
        return this.form?.current;
    }

    constructor(props: IWithSectionModalRouteProps) {
        super(props)
    }

    public state: WithSectionModalState = {
        visible: false
    }

    private modalCancel(): void {
        this.setState({
            visible: false
        })
    }

    private async modalShow(): Promise<void> {
        // const data = await RequestUtil.get(`/tower-market/bidInfo/${ this.props.id }`);
        this.setState({
            visible: true
        })
    }

     /**
     * @description Renders AbstractDetailComponent
     * @returns render 
     */
    public render(): React.ReactNode {
        return <>
            <Button type="link" onClick={ () => this.modalShow() } ghost>配段</Button>
            <Modal
                visible={ this.state.visible } 
                width="40%" 
                title="配段" 
                footer={ <Space>
                    <Button type="ghost" onClick={() => this.modalCancel() }>关闭</Button>
                    <Button type="ghost" onClick={() => {  } }>保存</Button>
                    <Button type="ghost" onClick={() => this.modalCancel() }>保存并提交</Button>
                </Space> } 
                onCancel={ () => this.modalCancel() }
            >
                <DetailContent>
                    <p>配段信息</p>
                    <Form ref={ this.form } className={ styles.descripForm }>
                        <Descriptions title="" bordered size="small" colon={ false } column={ 2 }>
                                <Descriptions.Item label="塔型">    
                                    <span>JC30153B</span>
                                </Descriptions.Item>
                                <Descriptions.Item label="杆塔号">    
                                    <span>JC30153B</span>
                                </Descriptions.Item>
                                <Descriptions.Item label="段号">    
                                    <Form.Item name="reason">
                                        <span>JC30153B</span>
                                    </Form.Item>
                                </Descriptions.Item>
                                <Descriptions.Item label="段数">    
                                    <Form.Item name="reason">
                                        <Input placeholder="请输入"/>
                                    </Form.Item>
                                </Descriptions.Item>
                        </Descriptions>
                    </Form>
                   
                </DetailContent>
            </Modal>
        </>
    }
}

export default withRouter(withTranslation('translation')(WithSectionModal))
