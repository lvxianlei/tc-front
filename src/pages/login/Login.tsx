import { LockOutlined, SafetyCertificateOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Layout, Space, Typography, notification } from 'antd';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import MD5 from 'crypto-js/md5';

import AsyncComponent from '../../components/AsyncComponent';
import ApplicationContext from '../../configuration/ApplicationContext';
import layoutStyles from '../../layout/Layout.module.less';
import AuthUtil from '../../utils/AuthUtil';
import RequestUtil from '../../utils/RequestUtil';
import { ITenant } from '../system-mngt/ITenant';
import style from './Login.module.less';
import { ToolOutlined } from '@ant-design/icons';

interface ILoginProps { }
interface ILoginRouteProps extends RouteComponentProps<ILoginProps> { }

interface ILoginState {
    readonly captcha: ICaptcha;
    readonly tenant: ITenant;
}

interface ICaptcha {
    readonly image: string;
    readonly key: string;
}

/**
 * @description Login of the system
 */
class Login extends AsyncComponent<ILoginRouteProps, ILoginState> {

    public state: ILoginState = {
        captcha: {
            image: '',
            key: ''
        },
        tenant: {
            tenantId: '',
            tenantName: '',
            domain: '',
            logo: ''
        }
    };

    /**
     * @constructor
     * Creates an instance of login.
     * @param props 
     * @param context 
     */
    constructor(props: ILoginRouteProps, context: any) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    /**
     * @description Components did mount
     */
    public async componentDidMount() {
        super.componentDidMount();
        const [captcha, tenant] = await Promise.all<ICaptcha, ITenant>([
            RequestUtil.get<ICaptcha>('/sinzetech-auth/oauth/captcha'),
            RequestUtil.get<ITenant>(`/sinzetech-system/tenantClient/info?domain=${window.location.protocol}//${window.location.host}`)
        ]);
        this.setState({
            captcha: captcha,
            tenant: tenant
        });
    }

    /**
     * @description Determines whether submit on
     * @param values 
     */
    private async onSubmit(values: Record<string, any>) {
        AuthUtil.setTenantId(this.state.tenant.tenantId, { expires: 7 });
        values.password = MD5(values.password).toString();
        const { access_token, ...result } = await RequestUtil.post('/sinzetech-auth/oauth/token', {
            ...values,
            tenantId: this.state.tenant.tenantId
        }, {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Captcha-code': values.code,
            'Captcha-key': this.state.captcha.key
        });
        if (result.error) {
            notification.error({
                message: result.error_description
            })
        } else {
            AuthUtil.setSinzetechAuth(access_token, { expires: 7 });
            let gotoPath: string = decodeURIComponent(new URLSearchParams(this.props.location.search).get('goto') || '');
            const index: number = gotoPath.lastIndexOf("=");
            gotoPath = gotoPath.slice(index + 1, gotoPath.length);
            this.props.history.push(gotoPath || ApplicationContext.get().home || '/');
        }
    }

    /**
     * @description Renders login
     * @returns render 
     */
    public render(): React.ReactNode {
        return (
            <Layout className={layoutStyles.height100}>
                <Layout.Header className={style.header}></Layout.Header>
                <Layout.Content className={style.content}>
                    <div className={style.loginArea}>
                        <Card className={style.loginCard}>
                            <div className={style.loginLogo}>
                                <ToolOutlined />
                            </div>
                            <Typography.Title level={4} className={style.loginTitle}>XX管理系统</Typography.Title>
                            <Form onFinish={this.onSubmit}>
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
                                            }]}
                                        >
                                            <Input placeholder="请输入验证码" size="large" prefix={<SafetyCertificateOutlined />} />
                                        </Form.Item>
                                        {
                                            this.state.captcha.image
                                                ?
                                                <img src={this.state.captcha.image} />
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
                                <Form.Item name="scope" initialValue="all" className={layoutStyles.hidden}>
                                    <Input type="hidden" />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" size="large" className={layoutStyles.width100}>登录</Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </div>
                </Layout.Content>
                <Layout.Footer className={style.footer}></Layout.Footer>
            </Layout>
        );
    }
}

export default withRouter(Login);