import React, { memo, useCallback, useEffect, useState } from "react"
import { Breadcrumb, Button, Col, Layout, Menu, Popconfirm, Row } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons"
import styles from './Layout.module.less';
import layoutStyles from './Layout.module.less';
import { Link, Route, useHistory, useLocation } from "react-router-dom";
import { UserOutlined, BellOutlined } from '@ant-design/icons';
import AuthUtil from "../utils/AuthUtil";
import ctxConfig from "../app-ctx.config.jsonc"
import ctxRouter from "../app-router.config.jsonc"
import ChooseApplay from "../pages/chooseApply/ChooseApply"
import { useAuthorities, useDictionary, hasAuthority } from "../hooks"
import AsyncPanel from "../AsyncPanel";
import Logo from "./logo.png"
const { Header, Sider, Content } = Layout
const filters = require.context("../filters", true, /.ts$/)

const renderRoute: any = (module: string | undefined, authority: any) => () => (
    <>
        {
            (hasAuthority(authority) || authority === "all") && <AsyncPanel module={module} />
        }
    </>
)

const Container: React.FC = memo(() => <Layout style={{ backgroundColor: "#fff" }}>
    <Content style={{ height: "100vh" }}>
        {
            ctxRouter.routers.map((router: any): React.ReactNode => {
                return (
                    router.path && <Route
                        path={router.path}
                        key={router.path}
                        exact={router.exact}
                        component={renderRoute(router.module, router.authority)}
                    />
                )
            })
        }
    </Content>
</Layout>)

const Hbreadcrumb = memo(() => {

    return <Breadcrumb>
    </Breadcrumb>
})

export default function (): JSX.Element {
    const history = useHistory()
    const location = useLocation()
    const authorities = useAuthorities()
    const dictionary = useDictionary()
    const [selectedSubMenuItem, setSelectedSubMenuItem] = useState<React.Key[]>([location.pathname, `/${location.pathname.split("/")[1]}`])
    const [selectedDarkMenuItem, setSelectedDarkMenuItem] = useState([location.pathname])
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

    const handleOpenChange = useCallback((openKeys: React.Key[]) => setSelectedSubMenuItem(openKeys), [setSelectedSubMenuItem, selectedSubMenuItem])

    return <Layout style={{ backgroundColor: "#fff" }}>
        <Header className={styles.header}>
            <h1
                className={styles.logoStyle}
                style={{ width: ctxConfig.layout.width }}
                onClick={() => history.replace("/chooseApply")}>
                <img className={styles.logo} src={Logo} />
            </h1>
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
                            style={{ backgroundColor: ctxConfig.layout.theme }}
                        >
                            <Menu
                                mode="inline"
                                theme={ctxConfig.layout.theme || "light"}
                                openKeys={selectedSubMenuItem as any}
                                selectedKeys={selectedDarkMenuItem}
                                onOpenChange={handleOpenChange}
                                style={{ width: ctxConfig.layout.width, backgroundColor: ctxConfig.layout.theme }}
                            >
                                {
                                    getMenuItemForAppName().filter((item: any) => hasAuthority(item.authority)).map((item: any): React.ReactNode => (
                                        (item.items && item.items.length)
                                            ?
                                            <Menu.SubMenu
                                                key={item.path}
                                                title={item.label}
                                                style={{
                                                    backgroundColor: ctxConfig.layout.theme,
                                                    margin: 0
                                                }}
                                                icon={<i className={`font_family iconfont icon-${item.icon} ${styles.icon}`}></i>}>
                                                {
                                                    item.items.map((subItem: any): React.ReactNode => (
                                                        hasAuthority(subItem.authority) && <Menu.Item
                                                            key={subItem.path}
                                                            style={{ paddingLeft: "58px", fontWeight: 500 }}
                                                            onClick={() => setSelectedDarkMenuItem([subItem.path] as any)}>
                                                            <Link to={subItem.path}>{subItem.label}</Link>
                                                        </Menu.Item>
                                                    ))
                                                }
                                            </Menu.SubMenu>
                                            :
                                            <Menu.Item
                                                onClick={() => setSelectedDarkMenuItem([item.path] as any)}
                                                className={styles.subMenu}
                                                key={item.path}
                                                icon={<i className={`iconfont icon-${item.icon}`}></i>}>
                                                <Link to={item.path}>{item.label}</Link>
                                            </Menu.Item>
                                    ))
                                }
                            </Menu>
                        </Sider>
                        <Container />
                    </>
            }
        </Layout>
    </Layout>
}