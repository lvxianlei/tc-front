import React from 'react'
import { LockOutlined, SafetyCertificateOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Form, Input, Layout, Space, notification, Carousel } from 'antd'
import { useHistory } from 'react-router-dom'
import ctxConfig from "../../app-ctx.config.jsonc"
import layoutStyles from '../../layout/Layout.module.less'
import AuthUtil from '../../utils/AuthUtil'
import RequestUtil from '../../utils/RequestUtil'
import style from './Login.module.less'
import Cookies from 'js-cookie'
import useRequest from '@ahooksjs/use-request'
import MD5 from 'crypto-js/md5'
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
    readonly tenant: ITenant
}

export default function Login(): JSX.Element {
    const history = useHistory()
    const { data } = useRequest<ILoginState>(() => new Promise(async (resole, reject) => {
        try {
            const captcha: ICaptcha = await RequestUtil.get(`/sinzetech-auth/oauth/captcha`)
            const tenant: ITenant = await RequestUtil.get<ITenant>(`/sinzetech-system/tenantClient/info?domain=${window.location.protocol}//${window.location.host}`)
            // const tenant: ITenant = await RequestUtil.get(`/sinzetech-system/tenantClient/info?domain=http://tc-erp-test.dhwy.cn`)
            // const tenant: ITenant = await RequestUtil.get(`/sinzetech-system/tenantClient/info?domain=http://tc-erp-test.dhwy.cn`)
            resole({ captcha, tenant })
        } catch (error) {
            reject(false)
        }
    }))
    const { loading: saveLoading, data: saveData, run } = useRequest<any>((values: { [key: string]: any }) => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.post(
                '/sinzetech-auth/oauth/token',
                {
                    ...values,
                    tenantId: data?.tenant.tenantId
                },
                {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Captcha-code': values.code,
                    'Captcha-key': data!.captcha.key
                }
            )
            resole(result)
        } catch (error) {
            reject(false)
        }
    }), { manual: true })

    const onSubmit = async (values: Record<string, any>) => {
        AuthUtil.setTenantId(data!.tenant.tenantId, { expires: 7 })
        //values.password = MD5(values.password).toString()
        const { access_token, refresh_token, user_id, tenant_id, tenant_name, ...result } = await run(values)
        if (result.error) {
            notification.error({
                message: result.error_description
            })
        } else {
            Cookies.set('DHWY_TOKEN', access_token, { domain: '.dhwy.cn' })
            Cookies.set('DHWY_TOKEN', access_token, { domain: 'localhost' })
            AuthUtil.setSinzetechAuth(access_token, refresh_token)
            AuthUtil.setUserId(user_id)
            AuthUtil.setTenantName(tenant_name)
            AuthUtil.setRealName(result.real_name)
            history.push(ctxConfig.home || '/')
        }
    }

    return (
        <Layout className={layoutStyles.height100}>
            <Layout.Content className={style.content} >
                <div className={style.logo}>
                    <Carousel style={{ position: "relative" }} autoplay>
                        <img style={{ height: "100%" }} src={process.env.PUBLIC_URL + "/VCG41N896058462.png"} />
                        <img style={{ height: "100%" }} src={process.env.PUBLIC_URL + "/VCG211101842372.jpg"} />
                        <img style={{ height: "100%" }} src={process.env.PUBLIC_URL + "/VCG211169486505.jpg"} />
                    </Carousel>
                </div>
                <div className={style.loginArea}>
                    <div className={style.loginCard}>
                        <div className={style.loginLogo}>
                            <div className={style.loginTitleTop}><span>塔云</span><span style={{ color: 'black' }}>平台</span></div>
                            <div className={style.loginTitleBottom}>铁塔设计制造一站式解决方案</div>
                        </div>
                        <Form onFinish={onSubmit}>
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
                            <Form.Item>
                                <Space direction="horizontal" className={layoutStyles.width100}>
                                    <Form.Item name="code" noStyle={true}
                                        rules={[{
                                            required: true,
                                            message: '请输入验证码'
                                        }, {
                                            pattern: new RegExp(/^[a-zA-Z0-9]*$/g, 'g'),
                                            message: '请输入正确的验证码',
                                        }]}
                                    >
                                        <Input placeholder="请输入验证码" size="large" prefix={<SafetyCertificateOutlined />} />
                                    </Form.Item>
                                    {
                                        data?.captcha.image
                                            ?
                                            <img src={data?.captcha.image} className={style.captcha} />
                                            :
                                            null
                                    }
                                </Space>
                            </Form.Item>
                            <Form.Item name="grant_type" initialValue="captcha" className={layoutStyles.hidden}>
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
