import React from 'react';
import { Button, Space, Modal, Input } from 'antd';
import { DetailContent, CommonTable } from '../common';
import RequestUtil from '../../utils/RequestUtil';
import styles from './AssessmentTask.module.less';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { IFileList } from './AssessmentTaskDetail';

interface IResponse {
    readonly id?: string;
    readonly assessInfo?: string;
    readonly status?: string;
    readonly assessFileList?: IFileList[];
}

export interface AssessmentInformationProps {}
export interface IAssessmentInformationRouteProps extends RouteComponentProps<AssessmentInformationProps>, WithTranslation {
    readonly id: number | string;
}

export interface AssessmentInformationState {
    readonly visible: boolean;
    readonly description?: string;
    readonly assessFileList?: IFileList[];
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

    private async modalShow(): Promise<void> {
        const data: IResponse = await RequestUtil.get<IResponse>(`/tower-science/assessTask/infoDetail/${ this.props.id }`);
        this.setState({
            visible: true,
            assessFileList: data.assessFileList,
            description: data.assessInfo
        })
    }

     /**
     * @description Renders AbstractDetailComponent
     * @returns render 
     */
    public render(): React.ReactNode {
        return <>
            <Button type="link" onClick={ () => this.modalShow() }>评估信息</Button>
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
                            width: 350 
                        },
                        { 
                            key: 'operation', 
                            title: '操作', 
                            dataIndex: 'operation', 
                            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                                <Space direction="horizontal" size="small">
                                    <Button type="link" onClick={ () => window.open(record.filePath) }>下载</Button>
                                    {
                                        record.fileSuffix === 'pdf' ? <Button type="link" onClick={ () => window.open(record.filePath) }>预览</Button> : null
                                    }
                                </Space>
                        ) }
                    ]}
                        dataSource={ this.state.assessFileList }
                        pagination={ false }
                    />
                </DetailContent>
            </Modal>
        </>
    }
}

export default withRouter(withTranslation('translation')(AssessmentInformation))
