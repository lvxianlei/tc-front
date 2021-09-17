import React from 'react';
import { Button, Space, Modal, Input } from 'antd';
import { DetailContent, CommonTable } from '../common';
import RequestUtil from '../../utils/RequestUtil';
import styles from './AssessmentTask.module.less';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';

export interface AssessmentInformationProps {}
export interface IAssessmentInformationRouteProps extends RouteComponentProps<AssessmentInformationProps>, WithTranslation {
    readonly id: number | string;
}

export interface AssessmentInformationState {
    readonly visible: boolean;
    readonly description?: string;
}
class AssessmentInformation extends React.Component<IAssessmentInformationRouteProps, AssessmentInformationState> {
    constructor(props: IAssessmentInformationRouteProps) {
        super(props)
    }

    public state: AssessmentInformationState = {
        visible: false
    }

    private modalCancel(): void {
        this.setState({
            visible: false
        })
    }

    public componentDidMount() {
        this.getInformation();
    }

    private async getInformation(): Promise<void> {
        const data = await RequestUtil.get(`/tower-market/bidInfo/${ this.props.id }`);
        this.setState({
            
        })
    }

     /**
     * @description Renders AbstractDetailComponent
     * @returns render 
     */
    public render(): React.ReactNode {
        return <>
            <Button type="link" onClick={ () => this.setState({ visible: true }) }>评估信息</Button>
            <Modal 
                visible={ this.state.visible } 
                width="40%" 
                title="评估信息" 
                footer={ <Button type="ghost" onClick={() => this.modalCancel() }>关闭</Button> } 
                onCancel={ () => this.modalCancel() }
            >
                <DetailContent>
                    <p>评估描述</p>
                    <Input.TextArea disabled value={ this.state.description } />
                    <p className={ styles.topPadding }>评估文件</p>
                    <CommonTable columns={[
                        { 
                            key: 'name', 
                            title: '附件', 
                            dataIndex: 'name',
                            width: 150 
                        },
                        { 
                            key: 'operation', 
                            title: '操作', 
                            dataIndex: 'operation', 
                            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                                <Space direction="horizontal" size="small">
                                    <Button type="link">下载</Button>
                                    <Button type="link">预览</Button>
                                </Space>
                        ) }
                    ]}
                        dataSource={ [] }
                    />
                </DetailContent>
            </Modal>
        </>
    }
}

export default withRouter(withTranslation('translation')(AssessmentInformation))
