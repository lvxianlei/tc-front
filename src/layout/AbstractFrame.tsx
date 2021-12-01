/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import { Button, Col, Layout, Popconfirm, Row } from 'antd';
import { SiderTheme } from 'antd/lib/layout/Sider';
import React from 'react';

import ApplicationContext from '../configuration/ApplicationContext';
import EventBus from '../utils/EventBus';
import styles from './AbstractFrame.module.less';
import layoutStyles from './Layout.module.less';
import { UserOutlined, BellOutlined } from '@ant-design/icons';
import AuthUtil from '../utils/AuthUtil';
import { Link } from 'react-router-dom';
import NoticeModal from '../pages/common/NoticeModal';
import { IAnnouncement } from '../pages/announcement/AnnouncementMngt';
import RequestUtil from '../utils/RequestUtil';


export interface IAbstractFrameProps { }
export interface IAbstractFrameState {
    readonly collapsed: boolean;
    readonly detailData: IAnnouncement[]
}

export default abstract class AbstractFrame<
    P extends IAbstractFrameProps = {},
    S extends IAbstractFrameState = IAbstractFrameState
    > extends React.Component<P, S> {

    constructor(props: P) {
        super(props);
        this.state = this.getState();
    }

    protected getState(): S {
        return {
            collapsed: false
        } as S;
    }

    /**
     * @description Renders logo
     * @returns logo 
     */
    abstract renderLogo(): React.ReactNode;

    /**
     * @description Renders navigation panel
     * @returns navigation panel 
     */
    abstract renderNavigationPanel(): React.ReactNode;

    /**
     * @description Renders content panel
     * @returns content panel 
     */
    abstract renderContentPanel(): React.ReactNode;

    /**
     * @description Renders header panel
     * @returns header panel 
     */
    abstract renderHeaderPanel(): React.ReactNode;

    /**
     * @description Renders footer panel
     * @returns footer panel 
     */
    abstract renderFooterPanel(): React.ReactNode;

    public async componentDidMount(): Promise<void> {
        super.componentDidMount && super.componentDidMount();
        EventBus.addListener('menu/collapsed', this.onCollapsed, this);
        const data: IAnnouncement[] = await RequestUtil.get(`/tower-system/notice/staff/notice`);
        this.setState({
            detailData: data
        })
    }

    public componentWillUnmount() {
        EventBus.removeListener('menu/collapsed', this.onCollapsed, this);
    }

    protected onCollapsed(collapsed: boolean): void {
        this.setState({
            collapsed: collapsed
        });
    }

    /**
     * @protected
     * @description Gets menu container width
     * @returns menu container width 
     */
    protected getMenuContainerWidth(): number {
        return ApplicationContext.get().layout?.navigationPanel?.props?.width || 200;
    }

    /**
     * @protected
     * @description Gets menu theme
     * @returns menu theme 
     */
    protected getMenuTheme(): SiderTheme {
        return ApplicationContext.get().layout?.navigationPanel?.props?.theme || 'light';
    }
    
    protected logOut(): void {
        AuthUtil.removeTenantId();
        AuthUtil.removeSinzetechAuth();
        AuthUtil.removeRealName();
        AuthUtil.removeUserId();
        window.location.pathname = '/login';
    };

    /**
     * @description Renders abstract frame
     * @returns render 
     */
    public render(): React.ReactNode {
        return (
            <Layout className={layoutStyles.height100}>
                <div style={{ position: 'absolute', width: '200px', height:'64px' }} className={ layoutStyles.bk }/>
                <div className={layoutStyles.logout}>
                    <Row>
                        <Col>
                            <Link to={`/approvalm/management`} className={ layoutStyles.btn }>我的审批</Link>
                        </Col>
                        <Col>
                            <Link to={`/homePage/notice`} className={ layoutStyles.btn }><BellOutlined className={ layoutStyles.icon }/></Link>
                        </Col>
                        <Col>
                            <Link to={`/homePage/personalCenter`} className={ layoutStyles.btn }><UserOutlined className={ layoutStyles.icon }/>{ AuthUtil.getRealName() }</Link>
                        </Col>
                        <Col>
                            <Popconfirm
                                title="确认退出登录?"
                                onConfirm={ this.logOut }
                                okText="确认"
                                cancelText="取消"
                            >
                                <Button type="link" className={ layoutStyles.btn }>退出</Button>
                            </Popconfirm>
                        </Col>
                    </Row>
                </div>
                { this.state.detailData && this.state.detailData.map((res: IAnnouncement, index: number) => {
                    return <NoticeModal detailData={ res } key={ index }/>
                }) }
                <Layout.Header className={styles.header}>
                    <Layout>
                        <Layout.Sider className={styles.logo} theme={this.getMenuTheme()} collapsedWidth={48} width={this.getMenuContainerWidth()}>
                            {this.renderLogo()}
                        </Layout.Sider>
                        <Layout.Content className={styles.headerContent}>
                            {this.renderHeaderPanel()}
                        </Layout.Content>
                    </Layout>
                </Layout.Header>
                <Layout>
                    <Layout.Sider theme={this.getMenuTheme()} collapsed={this.state.collapsed}
                        collapsedWidth={48}
                        style={{ backgroundColor: "#F8F8F8" }}
                        width={this.getMenuContainerWidth()}>
                        <div className={styles.navigation}>
                            {this.renderNavigationPanel()}
                        </div>
                        {/* <Layout.Footer>
                        { this.renderFooterPanel() }
                    </Layout.Footer> */}
                    </Layout.Sider>
                    <Layout.Content className={styles.content}>
                        {this.renderContentPanel()}
                    </Layout.Content>
                </Layout>
                {/**
                <Layout.Header>
                    { this.renderHeaderPanel() }
                </Layout.Header>
                <Layout>
                    <Layout.Sider theme="light" width={ this.getMenuContainerWidth() }>
                        { this.renderNavigationPanel() }
                    </Layout.Sider>
                    <Layout>
                        <Layout.Content className={ styles.content }>
                            { this.renderContentPanel() }
                        </Layout.Content>
                        <Layout.Footer>
                            { this.renderFooterPanel() }
                        </Layout.Footer>
                    </Layout>
                </Layout>
                */}
               
            </Layout>
        );
    }
}