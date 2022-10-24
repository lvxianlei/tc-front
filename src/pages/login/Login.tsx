import React, { useRef, useState } from 'react'
import { Button, Form, Input, Layout, notification, Carousel, message } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { useHistory, useLocation } from 'react-router-dom'
import ReactSimpleVerify from 'react-simple-verify'
import ctxConfig from "../../app-ctx.config.jsonc"
import AuthUtil from '../../utils/AuthUtil'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../utils/RequestUtil'
import Cookies from 'js-cookie'
import MD5 from 'crypto-js/md5'
import { Base64 } from 'js-base64'
import 'react-simple-verify/dist/react-simple-verify.css'
import layoutStyles from '../../layout/Layout.module.less'
import style from './Login.module.less'
const ossUrl = "https://dhwy-dev-tc-operation.oss-cn-beijing.aliyuncs.com/tower-erp/%E9%A6%96%E9%A1%B5%E5%9B%BE%E7%89%87"
interface ITenant {
    readonly tenantId: string;
    readonly domain: string;
    readonly tenantName: string;
    readonly logo: string;
}
interface ICaptcha {
    readonly image: string
    readonly key: string
}
interface ILoginState {
    readonly captcha: ICaptcha
}

export default function Login(): JSX.Element {
    const location = useLocation()
    const history = useHistory()
    const verifyRef = useRef<any>()
    const [verify, setVerify] = useState<boolean>(false)
    const [loginForm] = Form.useForm();
    const { loading: saveLoading, run } = useRequest<any>((values: { [key: string]: any }) => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.post(
                '/sinzetech-auth/oauth/token',
                {
                    ...values
                },
                {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Tenant-Id': "null",
                    'Sinzetech-Auth': "null"
                }
            )
            resole(result)
        } catch (error) {
            reject(false)
        }
    }), { manual: true })

    const onSubmit = async (values: Record<string, any>) => {
        if (!verify) {
            message.error("请先按住滑块，拖动至最右边完成验证")
            return
        }
        const {
            access_token,
            refresh_token,
            user_id,
            tenant_id,
            tenant_name,
            tenants,
            ...result
        } = await run(values)
        if (result.error) {
            // 错误提示
            notification.error({
                message: result.error_description
            })
        } else {
            const redirectURL = Base64.decode(location.hash)
            Cookies.set('DHWY_TOKEN', access_token, { domain: '.dhwy.cn' })
            Cookies.set('ACCOUNT', result.account, { domain: 'localhost' })
            AuthUtil.setSinzetechAuth(access_token, refresh_token)
            AuthUtil.setUserInfo({
                user_id,
                password: values.password,
                username: values.username
            })
            AuthUtil.setTenantId(tenant_id, { expires: 7 })
            AuthUtil.setTenantName(tenant_name)
            AuthUtil.setTenants(tenants)
            AuthUtil.setRealName(result.real_name)
            AuthUtil.setAccout(result.account)
            if (redirectURL) {
                window.location.assign(redirectURL)
            } else {
                history.push(ctxConfig.home || '/')
            }
        }
    }

    return (
        <Layout className={layoutStyles.height100}>
            <Layout.Content className={style.content} >
                <div className={style.logo}>
                    <Carousel style={{ position: "relative" }} autoplay>
                        <img style={{ height: "100%" }} src={ossUrl + "/banner-1.png"} />
                        <img style={{ height: "100%" }} src={ossUrl + "/banner-2.png"} />
                        <img style={{ height: "100%" }} src={ossUrl + "/banner-3.png"} />
                    </Carousel>
                </div>
                <div className={style.loginArea}>
                    <div className={style.loginCard}>
                        <div className={style.loginLogo}>
                            <div className={style.loginTitleTop}><span>塔云</span><span style={{ color: 'black' }}>平台</span></div>
                            <div className={style.loginTitleBottom}>铁塔设计制造一站式解决方案</div>
                        </div>
                        <Form onFinish={onSubmit} form={loginForm}>
                            <Form.Item name="username" rules={[
                                {
                                    required: true,
                                    message: '请输入用户名'
                                }
                            ]}>
                                <Input placeholder="请输入用户名" size="large" autoFocus={true} prefix={<UserOutlined />} />
                            </Form.Item>
                            <Form.Item name="password" rules={[
                                {
                                    required: true,
                                    message: '请输入密码'
                                }
                            ]}>
                                <Input.Password placeholder="请输入密码" size="large" prefix={<LockOutlined />} />
                            </Form.Item>
                            <Form.Item name="verify">
                                <ReactSimpleVerify ref={verifyRef} success={() => setVerify(true)} />
                            </Form.Item>
                            <Form.Item name="grant_type" initialValue="password" className={layoutStyles.hidden}>
                                <Input type="hidden" />
                            </Form.Item>
                            <Form.Item name="type" initialValue="account" className={layoutStyles.hidden}>
                                <Input type="hidden" />
                            </Form.Item>
                            <div>
                                <Button type="primary" loading={saveLoading} htmlType="submit" size="large" className={style.submitButton}>登录</Button>
                            </div>
                            <Button htmlType="submit" type='link' size='large'>忘记密码</Button>
                        </Form>
                    </div>
                    <div className={style.bottom}>© 2019 powered by 德汇科技. All rights reserved</div>
                </div>
            </Layout.Content>
        </Layout>
    )
}
