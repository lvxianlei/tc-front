import React, { memo, useCallback, useEffect, useState } from "react"
import { Avatar, Breadcrumb, Col, Dropdown, Layout, Menu, Row } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined, DownOutlined, createFromIconfontCN } from "@ant-design/icons"
import { Link, Route, Switch, useHistory, useLocation } from "react-router-dom";
import AuthUtil from "../utils/AuthUtil";
import ctxConfig from "../app-ctx.config.jsonc"
import ctxRouter from "../app-router.config.jsonc"
import ChooseApplay from "../pages/chooseApply/ChooseApply"
import { useAuthorities, useDictionary, hasAuthority } from "../hooks"
import AsyncPanel from "../AsyncPanel";
import Logo from "./logo.png"
import { getMenuItemByPath, getRouterItemByPath } from "../utils";
import Cookies from "js-cookie";
import styles from './Layout.module.less';
import useRequest from "@ahooksjs/use-request";
import RequestUtil from "@utils/RequestUtil";

const IconFont = createFromIconfontCN({
    scriptUrl: [
        "//at.alicdn.com/t/font_2771956_r1mkfqj4xwf.js"
    ]
})

const { Header, Sider, Content } = Layout
const filters = require.context("../filters", true, /.ts$/)

const renderRoute: any = (module: string | undefined, authority: any) => () => (
    <>
        {
            (hasAuthority(authority) || authority === "all") && <AsyncPanel module={module} />
        }
    </>
)

const SiderMenu: React.FC<{ isOpend: boolean }> = ({ isOpend }) => {
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
        style={{ backgroundColor: ctxConfig.layout.theme }}
    >
        {
            getMenuItemForAppName().filter((item: any) => hasAuthority(item.authority)).map((item: any): React.ReactNode => (
                (item.items && item.items.length)
                    ?
                    <Menu.SubMenu
                        key={item.path}
                        title={item.label}
                        icon={<IconFont type={`icon-${item.icon}`} style={{ fontSize: 16 }} />}>
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
                        key={item.path}
                        icon={<IconFont type={`icon-${item.icon}`} style={{ fontSize: 16 }} />}>
                        <Link to={item.path?.split('://')[0] === 'http' ? selectedDarkMenuItem : item.path}>{item.label}</Link>
                    </Menu.Item>
            ))
        }
    </Menu>
}

const Hbreadcrumb = memo(({ isOpend, onClick }: { isOpend: boolean, onClick: (opend: boolean) => void }) => {
    const location = useLocation()
    const pathSnippets: string[] = location.pathname.split('/').filter((i: string) => i);
    const selectedMenuItem = getMenuItemByPath(ctxConfig.layout.menu, `/${pathSnippets[0]}`)
    return <div className={styles.breadcrumb}>
        {
            location.pathname !== "/chooseApply" && (
                <>
                    {isOpend ? <MenuUnfoldOutlined
                        onClick={() => onClick(false)}
                        style={{
                            fontSize: "18px",
                            color: "#fff",
                            lineHeight: "40px",
                            verticalAlign: "middle",
                            padding: "0 10px"
                        }} /> : <MenuFoldOutlined
                        style={{
                            fontSize: "18px",
                            color: "#fff",
                            lineHeight: "40px",
                            verticalAlign: "middle",
                            padding: "0 10px"
                        }}
                        onClick={() => onClick(true)} />}
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
    useAuthorities()
    useDictionary()
    const [isOpend, setIsOpend] = useState<boolean>(false)

    const { run: tenantRun } = useRequest<any>((tenantId: string) => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.post(`/sinzetech-user/user/setDefaultTenant?tenantId=${tenantId}`)
            const reLogin = await RequestUtil.post(
                '/sinzetech-auth/oauth/token',
                {
                    grant_type: "password",
                    tenant_id: tenantId,
                    username: AuthUtil.getUserInfo().username,
                    password: AuthUtil.getUserInfo().password
                },
                {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Tenant-Id': tenantId
                }
            )
            resole(reLogin)
        } catch (error) {
            reject(false)
        }
    }), { manual: true })

    const logOut = () => {
        AuthUtil.removeTenantId();
        AuthUtil.removeSinzetechAuth();
        AuthUtil.removeRealName();
        AuthUtil.removeUserInfo();
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
                return filters(filter).default?.prototype?.doFilter?.({ ...props, history })
            });
        const permits: boolean[] = await Promise.all(doFilterHandlers);
        for (let permit of permits) {
            if (!permit) {
                return false;
            }
        }
        return true;
    }

    const handleClick = (opend: boolean) => setIsOpend(opend)

    const handleUseTenants = async (tenantInfo: any) => {
        const {
            access_token,
            refresh_token,
            user_id,
            tenant_id,
            tenant_name,
            tenants,
            ...result
        } = await tenantRun(tenantInfo.tenantId)
        Cookies.set('DHWY_TOKEN', access_token, { domain: '.dhwy.cn' })
        Cookies.set('ACCOUNT', result.account, { domain: '.dhwy.cn' })
        Cookies.set('DHWY_TOKEN', access_token, { domain: 'localhost' })
        AuthUtil.setSinzetechAuth(access_token, refresh_token)
        AuthUtil.setTenantId(tenant_id, { expires: 7 })
        AuthUtil.setTenantName(tenantInfo.name)
        AuthUtil.setTenants(tenants)
        AuthUtil.setRealName(result.real_name)
        AuthUtil.setAccout(result.account)
        history.push(ctxConfig.home || '/')
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

    const tenants = (<Menu>
        {AuthUtil.getTenants().map((item: any) => <Menu.Item key={item.id}>
            <p
                style={{
                    textAlign: "center",
                    height: "24px",
                    lineHeight: "24px",
                    margin: 0
                }}
                onClick={() => handleUseTenants(item)}>
                {item.name}
            </p>
        </Menu.Item>)}
    </Menu>)

    return <Layout style={{ backgroundColor: "#fff", height: "100%" }}>
        <Header className={styles.header}>
            <h1
                className={styles.logoStyle}
                style={{ width: ctxConfig.layout.width }}
                onClick={() => history.replace("/chooseApply")}>
                <img className={styles.logo} src={Logo} />
            </h1>
            <Hbreadcrumb isOpend={isOpend} onClick={handleClick} />
            <div className={styles.logout}>
                <Row>
                    <Col>
                        <Dropdown overlay={tenants} placement="bottomCenter">
                            <a className="ant-dropdown-link"
                                onClick={e => e.preventDefault()}>
                                <span style={{
                                    marginLeft: 4,
                                    fontSize: 14,
                                    marginRight: 16,
                                    color: "#fff"
                                }}>{AuthUtil.getTenantName()}<DownOutlined /></span>
                            </a>
                        </Dropdown>
                    </Col>
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
        </Header>
        <Layout style={{ height: "100%", backgroundColor: "#fff" }}>
            {
                location.pathname === "/chooseApply" ? <ChooseApplay /> :
                    <>
                        <Sider
                            width={ctxConfig.layout.width}
                            theme="light"
                            style={{ backgroundColor: ctxConfig.layout.theme }}
                            collapsed={isOpend}
                        >
                            <SiderMenu isOpend={isOpend} />
                        </Sider>
                        <Layout style={{ backgroundColor: `${location.pathname === "/cockpit/statements" ? '#071530' : '#fff'}`, height: "100%", overflow: "hidden", position: "relative" }}>
                            <Content
                                style={{
                                    height: "100%",
                                    boxSizing: "border-box",
                                    padding: `${location.pathname === "/cockpit/statements" ? '0' : '16px'}`,
                                    overflowY: "auto"
                                }}>
                                <Switch>
                                    {
                                        ctxRouter.routers.map((router: any): React.ReactNode => {
                                            return (
                                                router.path ? <Route
                                                    path={router.path}
                                                    key={router.path}
                                                    exact={router.exact}
                                                >{renderRoute(router.module, router.authority)}</Route> : null
                                            )
                                        })
                                    }
                                </Switch>
                            </Content>
                        </Layout>
                    </>
            }
        </Layout>
    </Layout>
}