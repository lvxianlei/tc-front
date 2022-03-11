import React, { useEffect } from "react"
import { Button, Col, Layout, Menu, Popconfirm, Row } from "antd";
import styles from './AbstractFrame.module.less';
import layoutStyles from './Layout.module.less';
import { Link, Route, useHistory, useLocation } from "react-router-dom";
import { UserOutlined, BellOutlined } from '@ant-design/icons';
import AuthUtil from "../utils/AuthUtil";
import ctxConfig from "../app-ctx.config.jsonc"
import ctxRouter from "../app-router.config.jsonc"
import ChooseApplay from "../pages/chooseApply/ChooseApply"
import { useAuthorities, useDictionary, hasAuthority } from "../hooks"
const { Header, Sider, Content } = Layout
const filters = require.context("../filters", true, /.ts$/)
export default function (): JSX.Element {
    const history = useHistory()
    const location = useLocation()
    const authorities = useAuthorities()
    const dictionary = useDictionary()
    const logOut = () => {
        AuthUtil.removeTenantId();
        AuthUtil.removeSinzetechAuth();
        AuthUtil.removeRealName();
        AuthUtil.removeUserId();
        AuthUtil.removeTenantName();
        window.location.pathname = '/login';
    };

    const doFiltersAll = async (props: any) => {
        const doFilterHandlers: Promise<boolean>[] = filters
            .keys().filter((item: string) => item !== "./IFilter.ts")
            .map<Promise<boolean>>((filter: any): Promise<boolean> => {
                return filters(filter).default?.prototype?.doFilter?.(props)
            });
        const permits: boolean[] = await Promise.all(doFilterHandlers);
        for (let permit of permits) {
            if (!permit) {
                return false;
            }
        }
        return true;
    }

    useEffect(() => {
        doFiltersAll(history)
    }, [])

    const getMenuItemForAppName = () => {
        const currentApp = AuthUtil.getCurrentAppName()
        return ctxConfig.layout.menu.filter((item: any) => [currentApp, ""].includes(item.appName))
    }

    return <Layout>
        <Header className={styles.header}>
            <div style={{ position: 'absolute', width: '200px', height: '64px' }} className={layoutStyles.bk} />
            <div className={layoutStyles.logout}>
                <Row>
                    <Col>
                        <Link to={`/approvalm/management`} className={layoutStyles.btn}>我的审批</Link>
                    </Col>
                    <Col>
                        <Link to={`/homePage/notice`} className={layoutStyles.btn}><BellOutlined className={layoutStyles.icon} /></Link>
                    </Col>
                    <Col>
                        <Link to={`/homePage/personalCenter`} className={layoutStyles.btn}><UserOutlined className={layoutStyles.icon} />{AuthUtil.getRealName()}</Link>
                    </Col>
                    <Col>
                        <Popconfirm
                            title="确认退出登录?"
                            onConfirm={logOut}
                            okText="确认"
                            cancelText="取消"
                        >
                            <Button type="link" className={layoutStyles.btn}>退出</Button>
                        </Popconfirm>
                    </Col>
                </Row>
            </div>
        </Header>
        <Layout>
            {
                location.pathname === "/chooseApply" ? <ChooseApplay /> :
                    <>
                        <Sider
                            width={ctxConfig.layout.width}
                            theme="light"
                        >
                            <Menu
                                mode="inline"
                                theme={ctxConfig.layout.theme || "light"}
                                className={styles.menu}
                                style={{ width: ctxConfig.layout.width }}
                            >
                                {
                                    getMenuItemForAppName().filter((item: any) => hasAuthority(item.authority)).map((item: any): React.ReactNode => (
                                        (item.items && item.items.length)
                                            ?
                                            <Menu.SubMenu
                                                key={item.path}
                                                title={item.label}
                                                icon={<i className={`font_family iconfont icon-${item.icon} ${styles.icon}`}></i>}>
                                                {
                                                    item.items.map((subItem: any): React.ReactNode => (
                                                        hasAuthority(subItem.authority)
                                                            ?
                                                            <Menu.Item key={subItem.path} style={{ paddingLeft: "58px", fontWeight: 500 }} onClick={() => { }}>
                                                                <Link to={subItem.path}>{subItem.label}</Link>
                                                            </Menu.Item>
                                                            :
                                                            null
                                                    ))
                                                }
                                            </Menu.SubMenu>
                                            :
                                            <Menu.Item
                                                onClick={() => { }}
                                                className={styles.subMenu}
                                                key={item.path}
                                                icon={<i className={`iconfont icon-${item.icon}`}></i>}>
                                                <Link to={item.path}>{item.label}</Link>
                                            </Menu.Item>

                                    ))
                                }
                            </Menu>
                        </Sider>
                        <Layout style={{ padding: '0 24px 24px' }}>
                            <Content style={{ height: "100vh" }}>
                                {
                                    ctxRouter.routers.map((router: any): React.ReactNode => (
                                        router.path && <Route
                                            path={router.path}
                                            key={router.path}
                                            exact={router.exact}
                                            component={() => <>{JSON.stringify(router)}</>}
                                        />
                                    ))
                                }
                            </Content>
                        </Layout>
                    </>
            }
        </Layout>
    </Layout>
}