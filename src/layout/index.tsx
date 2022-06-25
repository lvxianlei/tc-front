import React, { memo, useCallback, useEffect, useState } from "react"
import { Avatar, Breadcrumb, Col, Dropdown, Layout, Menu, Row } from "antd";
import { MenuUnfoldOutlined, DownOutlined } from "@ant-design/icons"
import styles from './Layout.module.less';
import { Link, Route, useHistory, useLocation } from "react-router-dom";
import AuthUtil from "../utils/AuthUtil";
import ctxConfig from "../app-ctx.config.jsonc"
import ctxRouter from "../app-router.config.jsonc"
import ChooseApplay from "../pages/chooseApply/ChooseApply"
import { useAuthorities, useDictionary, hasAuthority } from "../hooks"
import AsyncPanel from "../AsyncPanel";
import Logo from "./logo.png"
import { getMenuItemByPath, getRouterItemByPath } from "../utils";
import Cookies from "js-cookie";
const { Header, Sider, Content } = Layout
const filters = require.context("../filters", true, /.ts$/)

const renderRoute: any = (module: string | undefined, authority: any) => () => (
    <>
        {
            (hasAuthority(authority) || authority === "all") && <AsyncPanel module={module} />
        }
    </>
)

const SiderMenu: React.FC = () => {
    const location = useLocation()
    const [selectedSubMenuItem, setSelectedSubMenuItem] = useState<React.Key[]>([location.pathname, `/${location.pathname.split("/")[1]}`])
    const [selectedDarkMenuItem, setSelectedDarkMenuItem] = useState([`/${location.pathname.split("/")[1]}/${location.pathname.split("/")[2]}`])

    const getMenuItemForAppName = () => {
        const currentApp = AuthUtil.getCurrentAppName()
        return ctxConfig.layout.menu.filter((item: any) => [currentApp, ""].includes(item.appName))
    }

    const handleOpenChange = useCallback((openKeys: React.Key[]) => setSelectedSubMenuItem(openKeys), [setSelectedSubMenuItem, selectedSubMenuItem])

    useEffect(() => {
        setSelectedSubMenuItem([location.pathname, `/${location.pathname.split("/")[1]}`]);
        setSelectedDarkMenuItem([`/${location.pathname.split("/")[1]}/${location.pathname.split("/")[2]}`])
    }, [JSON.stringify(location)])

    return <Menu
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
                        icon={<i className={`font_family iconfont icon-${item.icon} ${styles.icon}`} style={{ position: "relative", top: 1, marginRight: 6 }}></i>}>
                        {
                            item.items.map((subItem: any): React.ReactNode => (
                                hasAuthority(subItem.authority) && <Menu.Item
                                    key={subItem.path}
                                    style={{ paddingLeft: "58px", fontWeight: 500 }}
                                    onClick={() => {
                                        if (subItem.path?.split('://')[0] === 'http') {
                                            window.location.href = subItem.path;
                                            setSelectedDarkMenuItem(selectedDarkMenuItem)
                                        } else {
                                            setSelectedDarkMenuItem([subItem.path] as any)
                                        }
                                    }}>
                                    <Link to={item.path?.split('://')[0] === 'http' ? selectedDarkMenuItem : subItem.path}>{subItem.label}</Link>
                                </Menu.Item>
                            ))
                        }
                    </Menu.SubMenu>
                    :
                    <Menu.Item
                        onClick={() => {
                            if (item.path?.split('://')[0] === 'http') {
                                window.location.href = item.path;
                                setSelectedDarkMenuItem(selectedDarkMenuItem)
                            } else {
                                setSelectedDarkMenuItem([item.path] as any)
                            }
                        }}
                        className={styles.subMenu}
                        key={item.path}
                        icon={<i className={`font_family iconfont icon-${item.icon}`} style={{ position: "relative", top: 1, marginRight: 6 }}></i>}>
                        <Link to={item.path?.split('://')[0] === 'http' ? selectedDarkMenuItem : item.path}>{item.label}</Link>
                    </Menu.Item>
            ))
        }
    </Menu>
}

const Hbreadcrumb = memo(() => {
    const location = useLocation()
    const pathSnippets: string[] = location.pathname.split('/').filter((i: string) => i);
    const selectedMenuItem = getMenuItemByPath(ctxConfig.layout.menu, `/${pathSnippets[0]}`)
    return <div className={styles.breadcrumb}>
        {
            location.pathname !== "/chooseApply" && (
                <>
                    <MenuUnfoldOutlined
                        style={{
                            fontSize: "18px",
                            color: "#fff",
                            lineHeight: "40px",
                            verticalAlign: "middle",
                            padding: "0 10px"
                        }} />
                    <Breadcrumb separator="/" className={styles.breadcrumb}>
                        {
                            selectedMenuItem
                                ?
                                <Breadcrumb.Item key={selectedMenuItem.path}>
                                    {selectedMenuItem.label}
                                </Breadcrumb.Item>
                                :
                                null
                        }
                        {
                            pathSnippets.map<React.ReactNode>((item: string, index: number): React.ReactNode => {
                                let path: string = `/${pathSnippets.slice(0, index + 1).join('/')}`;
                                const routerItem = getRouterItemByPath(path);
                                return (
                                    routerItem
                                        ?
                                        <Breadcrumb.Item key={path}>
                                            {
                                                path === location.pathname
                                                    ?
                                                    routerItem.name
                                                    :
                                                    <Link to={path}>{routerItem.name}</Link>

                                            }
                                        </Breadcrumb.Item>
                                        :
                                        null
                                );
                            })
                        }
                    </Breadcrumb>
                </>
            )
        }
    </div>
})

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
        AuthUtil.removeSinzetechToken();
        Cookies.remove('DHWY_TOKEN', { domain: '.dhwy.cn' })
        Cookies.remove('DHWY_TOKEN', { domain: 'localhost' })
        Cookies.remove('ACCOUNT', { domain: '.dhwy.cn' })
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

    const menu = (
        <Menu>
            <Menu.Item>
                <p style={{ textAlign: "center", height: "24px", lineHeight: "24px", margin: 0 }} onClick={() => history.push("/homePage/personalCenter")}>
                    个人信息
                </p>
            </Menu.Item>
            <Menu.Item>
                <p style={{ textAlign: "center", height: "24px", lineHeight: "24px", margin: 0 }} onClick={() => history.push("/changePage/personalPassWord")}>
                    修改密码
                </p>
            </Menu.Item>
            <Menu.Item>
                <p style={{ textAlign: "center", height: "24px", lineHeight: "24px", margin: 0 }} onClick={() => logOut()}>
                    退出账号
                </p>
            </Menu.Item>
        </Menu>
    );
    return <Layout style={{ backgroundColor: "#fff", height: "100%" }}>
        <Header className={styles.header}>
            <h1
                className={styles.logoStyle}
                style={{ width: ctxConfig.layout.width }}
                onClick={() => history.replace("/chooseApply")}>
                <img className={styles.logo} src={Logo} />
            </h1>
            <Hbreadcrumb />
            {
                location.pathname !== "/chooseApply" && (
                    <>
                        <div className={styles.logout}>
                            <Row>
                                <Col>
                                    <Link to={`/approvalm/management`}>
                                        <span className={`iconfont icon-wodeshenpi ${styles.approval}`}></span>
                                    </Link>

                                </Col>
                                <Col>
                                    <Link to={`/homePage/notice`}>
                                        <span className={`iconfont icon-wodexiaoxi ${styles.approval}`} style={{ marginRight: 16 }}></span>
                                    </Link>
                                </Col>
                                <Col>
                                    <Dropdown overlay={menu} placement="bottomCenter">
                                        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                            <Avatar size={20} style={{ backgroundColor: "#FF8C00", verticalAlign: 'middle', fontSize: 12, position: "relative", top: -1 }} gap={4}>{AuthUtil.getAccount() ? AuthUtil.getAccount().split("")[0].toLocaleUpperCase() : ""}</Avatar>
                                            <span style={{ marginLeft: 4, fontSize: 14, marginRight: 16, color: "#fff" }}>{AuthUtil.getAccount()}<DownOutlined /></span>
                                        </a>
                                    </Dropdown>
                                </Col>
                            </Row>
                        </div>
                    </>
                )
            }
        </Header>
        <Layout style={{ height: "100%", backgroundColor: "#fff" }}>
            {
                location.pathname === "/chooseApply" ? <ChooseApplay /> :
                    <>
                        <Sider
                            width={ctxConfig.layout.width}
                            theme="light"
                            style={{ backgroundColor: ctxConfig.layout.theme }}
                        >
                            <SiderMenu />
                        </Sider>
                        <Layout style={{ backgroundColor: "#fff", height: "100%", overflow: "hidden", position: "relative" }}>
                            <Content
                                style={{
                                    height: "100%",
                                    boxSizing: "border-box",
                                    padding: "16px",
                                    overflowY: "auto"
                                }}>
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
                        </Layout>
                    </>
            }
        </Layout>
    </Layout>
}