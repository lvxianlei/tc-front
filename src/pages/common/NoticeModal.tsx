/**
 * @author zyc
 * @copyright © 2021 
 * @description 公告通知弹窗
*/
import React from 'react';
import { Button, Modal, Descriptions } from 'antd';
import RequestUtil from '../../utils/RequestUtil';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { IAnnouncement } from '../announcement/AnnouncementMngt';
import styles from './NoticeModal.module.less';
import { Attachment } from '.';



export interface NoticeModalProps { }
export interface INoticeModalRouteProps extends RouteComponentProps<NoticeModalProps>, WithTranslation {
    readonly detailData?: IAnnouncement;
}

export interface NoticeModalState {
    readonly visible?: boolean;
}

class NoticeModal extends React.Component<INoticeModalRouteProps, NoticeModalState> {

    public state: NoticeModalState = {
        visible: true
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
            closable={false}
            className={styles.noticemodal}
        >
            <Descriptions bordered column={1} className={styles.heightScroll}>
                <Descriptions.Item label="标题">
                    {this.props.detailData?.title}
                </Descriptions.Item>
                <Descriptions.Item label="内容">
                    {this.props.detailData?.content}
                </Descriptions.Item>
                <Descriptions.Item label="附件">
                    <Attachment title="" dataSource={this.props.detailData?.attachVos} />
                    <Button className={styles.btn} onClick={() => {
                        RequestUtil.post(`/tower-system/notice/staff/read`, { id: this.props.detailData?.id }).then(res => {
                            this.setState({
                                visible: false
                            })
                        })
                    }}>关闭</Button>
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    }
}

export default withRouter(withTranslation('translation')(NoticeModal))
