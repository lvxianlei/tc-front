/**
 * @author zyc
 * @copyright © 2021 
 * @description 公告通知弹窗
*/
import React from 'react';
import { Button, Space, Modal, Tree, Table, Col, Row, Descriptions } from 'antd';
import RequestUtil from '../../utils/RequestUtil';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { IDept } from '../dept/dept/DepartmentMngt';
import { DataNode } from 'antd/lib/tree';
import { RowSelectionType } from 'antd/lib/table/interface';
import { IAnnouncement } from '../announcement/AnnouncementMngt';
import styles from './NoticeModal.module.less';
import { Attachment } from '.';



export interface NoticeModalProps { }
export interface INoticeModalRouteProps extends RouteComponentProps<NoticeModalProps>, WithTranslation {
    readonly detailData?: IAnnouncement;
}

export interface NoticeModalState {
    // readonly detailData?: IAnnouncement[];
    readonly visible?: boolean;
}

class NoticeModal extends React.Component<INoticeModalRouteProps, NoticeModalState> {

    public state: NoticeModalState = {
        visible: true
    }

    async componentDidMount() {
        // const data: IAnnouncement[] = await RequestUtil.get(`/tower-system/notice/staff/notice`);
        // this.setState({
        //     detailData: data
        // })
    }

    protected wrapRole2DataNode(roles: (any & DataNode)[] = []): DataNode[] {
        roles && roles.forEach((role: any & DataNode): void => {
            role.title = role.name;
            role.key = role.id;
            if (role.children && role.children.length > 0) {
                this.wrapRole2DataNode(role.children);
            }
        });
        return roles;
    }

     /**
     * @description Renders AbstractDetailComponent
     * @returns render 
     */
    public render(): React.ReactNode {
        return <Modal
            visible={this.state.visible}
            width="40%"
            title="公告通知"
            footer={null}
            closable={ false }
            className={ styles.noticemodal }
        >
            <Descriptions bordered column={1} className={ styles.heightScroll }>
                <Descriptions.Item label="标题">
                    { this.props.detailData?.title }
                </Descriptions.Item>
                <Descriptions.Item label="内容">
                    { this.props.detailData?.content }
                </Descriptions.Item>
                <Descriptions.Item label="附件">
                    <Attachment title="" dataSource={ this.props.detailData?.attachVos }/>
                    <Button type="primary" className={ styles.btn } onClick={() => {
                        this.setState({
                            visible: false
                        })
                    }}>关闭</Button>
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    }
}

export default withRouter(withTranslation('translation')(NoticeModal))
