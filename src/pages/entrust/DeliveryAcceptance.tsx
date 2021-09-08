/**
 * @author zyc
 * @copyright © 2021 
 */
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import RequestUtil from '../../utils/RequestUtil';
import { Button, Col, Divider, Form, FormInstance, Input,  Modal, Row, Space } from 'antd';
import AsyncComponent from '../../components/AsyncComponent';
import styles from './AbstractEntrustSetting.module.less';
import AuthUtil from '../../utils/AuthUtil';
import { stringify } from 'query-string';

export interface IDeliveryAcceptanceProps {}
export interface IDeliveryAcceptanceRouteProps extends RouteComponentProps<IDeliveryAcceptanceProps>, WithTranslation {
    readonly id: number | string;
    readonly entrustId: number | string;
    readonly getTable:() => void;
    readonly productCategoryId: string;
    readonly type?: string;
    readonly btnName?: string;
}
export interface IDeliveryAcceptanceState {
    readonly isVisible?: boolean;
    readonly deliveryFiles?: IDeliveryFiles;
    readonly isBack?: boolean;
    readonly detailData?: IDetailData;
}

export interface IDeliveryFiles{
    readonly id?: string;
    readonly productCategoryId?: string;
    readonly deliveryList?: number[];
    readonly attachList?: IAttachVo[];
}


export interface IDetailData {
    readonly buildChart?: string;
}

export interface IAttachVo {
    readonly id?: number | string;
    readonly name?: string;
    readonly fileUploadTime?: string;
    readonly fileSuffix?: string;
    readonly fileSize?: number;        
    readonly filePath?: string;
    readonly description?: string;
    readonly userName?: string;
}

/**
 * Create a new entrust.
 */
class DeliveryAcceptance extends AsyncComponent<IDeliveryAcceptanceRouteProps, IDeliveryAcceptanceState> {

    private form: React.RefObject<FormInstance> = React.createRef<FormInstance>();

    public state: IDeliveryAcceptanceState = {
        isVisible: false,
        isBack: false
    } as IDeliveryAcceptanceState;

    public popModalButton(): React.ReactNode {
        return <Button type="link" htmlType="button" onClick={ this.showModal }>{ this.props.type === 'detail' ? this.props.btnName : '交付验收' }</Button>
    }

    /**
     * @constructor
     * @description show modal
     * @param props 
     */
    public showModal = async () : Promise<void> => {
        this.setState({
            isVisible: true
        })
        const [deliveryFiles, detailData] = await Promise.all<IDeliveryFiles, IDetailData>([
            RequestUtil.get(`/tp-task-dispatch/productCategory/getDeliveryFiles/${ this.props.productCategoryId }`),
            RequestUtil.get<IDetailData>(`/tower-data-archive/productCategory/${ this.props.productCategoryId }`)
        ]);
        this.setState({
            isVisible: true,
            deliveryFiles: deliveryFiles,
            detailData: detailData
        })
    } 

    /**
     * @description Determines whether cancel on
     */
    protected onCancel = (): void => {
        this.setState({
            isVisible: false,
            isBack: false
        })
    }

    /**
     * @description Determines whether back on
     */
    protected onBack = (): void => {
        this.setState({
            isBack: true
        })
    }

    /**
     * @implements
     * @description Determines whether submit on
     * @param values 
     * @returns save 
     */
    public onFinishSubmit = async (values: Record<string, any>): Promise<void> => {
        values = { entrustId: this.props.entrustId, productCategoryId: this.props.id, ...values };
        return await RequestUtil.post('/tp-task-dispatch/productCategory/accept', values).then((res) => {
            if(res) {
                this.setState({
                    isVisible: false
                })
                this.props.getTable();
            }
        });
    }

    /**
     * @implements
     * @description Determines whether submit on
     * @param values 
     * @returns back submit 
     */
    public onBackSubmit = async (): Promise<void> => {
        let values: Record<string, any> = this.getForm()?.getFieldsValue(true);
        values = { entrustId: this.props.entrustId, productCategoryId: this.props.id, description: this.getForm()?.getFieldValue('description') };
        return await RequestUtil.put('/tp-task-dispatch/productCategory/reject', values).then((res) => {
            if(res) {
                this.setState({
                    isVisible: false
                })
                this.props.getTable();
            }
        });
    }

    public uploadAttach = (value: string): void => {
        window.open(value);
    }

    public download = async (code: number): Promise<void> => {
        return fetch(`${process.env.REQUEST_API_PATH_PREFIX?.replace(/\/*$/, '/') || ''.replace(/\/*$/, '/')}${`/tower-data-archive/componentDetail/downloadCompAttach`.replace(/^\/*/, '')}`, {
            mode: 'cors',
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
              'Tenant-Id': AuthUtil.getTenantId(),
              'Sinzetech-Auth': AuthUtil.getSinzetechAuth(),
            },
            body: stringify({ productCategoryId: this.props.id,
                fileType: code })
        }).then((res) => {
            return res.blob();
        }).then((data) => {
            let blob = new Blob([data], {type: 'application/zip'})
            let blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.download = code === 2 ? '工艺卡' : code === 3 ? '大样图' :  code === 6 ? '角钢nc数据' : '钢板nc数据' ;
            a.href = blobUrl;
            a.click();
            if(document.body.contains(a)) {
                document.body.removeChild(a);
            }
        })
    }

    public downloadTMA = async (): Promise<void> => {
        return fetch(`${process.env.REQUEST_API_PATH_PREFIX?.replace(/\/*$/, '/') || ''.replace(/\/*$/, '/')}${`/tower-vcs/fileVersion/downloadCompFile`.replace(/^\/*/, '')}`, {
            mode: 'cors',
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
              'Tenant-Id': AuthUtil.getTenantId(),
              'Sinzetech-Auth': AuthUtil.getSinzetechAuth(),
            },
            body: stringify({ productCategoryId: this.props.id })
        }).then((res) => {
            return res.blob();
        }).then((data) => {
            let blob = new Blob([data], {type: 'application/zip'})
            let blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.download = 'TMA文件' ;
            a.href = blobUrl;
            a.click();
            if(document.body.contains(a)) {
                document.body.removeChild(a);
            }
        })
    }

    public exportBoltStatistics = async (): Promise<void> => {
        return fetch(`${process.env.REQUEST_API_PATH_PREFIX?.replace(/\/*$/, '/') || ''.replace(/\/*$/, '/')}${`/tower-data-archive/boltStatistics/exportBoltStatistics`.replace(/^\/*/, '')}`, {
            mode: 'cors',
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
              'Tenant-Id': AuthUtil.getTenantId(),
              'Sinzetech-Auth': AuthUtil.getSinzetechAuth(),
            },
            body: stringify({ productCategoryId: this.props.id })
        }).then((res) => {
            return res.blob();
        }).then((data) => {
            let blobUrl = window.URL.createObjectURL(data);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.download = '螺栓清单';
            a.href = blobUrl;
            a.click();
            if(document.body.contains(a)) {
                document.body.removeChild(a);
            }
        })
    }

    public exportAssemblyWeld = async (): Promise<void> => {
        return fetch(`${process.env.REQUEST_API_PATH_PREFIX?.replace(/\/*$/, '/') || ''.replace(/\/*$/, '/')}${`/tower-data-archive/assemblyWeld/exportAssemblyWeld`.replace(/^\/*/, '')}`, {
            mode: 'cors',
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
              'Tenant-Id': AuthUtil.getTenantId(),
              'Sinzetech-Auth': AuthUtil.getSinzetechAuth(),
            },
            body: stringify({ productCategoryId: this.props.id })
        }).then((res) => {
            return res.blob();
        }).then((data) => {
            let blobUrl = window.URL.createObjectURL(data);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.download = '组焊清单';
            a.href = blobUrl;
            a.click();
            if(document.body.contains(a)) {
                document.body.removeChild(a);
            }
        })
    }

    /**
     * @description Renders AbstractFillableComponent
     * @returns render 
     */
    public render(): React.ReactNode {
        const deliveryFiles: IDeliveryFiles | undefined = this.state.deliveryFiles;
        const deliveryList: number[] | undefined = deliveryFiles?.deliveryList;
        return (
            <>
                { this.popModalButton() }
                <Modal title={ this.state.isBack ? "退回确认" : "交付文件" } width="50%" footer={ null } visible={ this.state.isVisible } onCancel={ this.onCancel }>
                     <Form onFinish={ this.onFinishSubmit } ref={ this.form } style={ { width: '100%' } }>
                        { this.state.isBack ? 
                            <Space size="middle" direction="vertical" className={ styles.modal_center }>
                                <Form.Item 
                                    name="description"  
                                    rules={[{ required: true,
                                    message: '请输入退回原因' }]}
                                    wrapperCol={{ offset: 7, span: 10 }}
                                >
                                    <Input.TextArea placeholder={ "请输入退回原因（必填）" }/>
                                </Form.Item>
                                <Space size="large" direction="horizontal">
                                    <Button type="primary" htmlType="button" onClick={ this.onBackSubmit }>确认退回</Button>
                                </Space>
                            </Space>
                            :
                            <Space size="middle" direction="vertical" className={ styles.modal_center }>
                                <Form.Item 
                                    label="审核件数" 
                                    name="examineNum" 
                                    rules={[{ required: true,
                                    message: '请输入审核件数' }]}
                                    wrapperCol={{ span: 10 }}
                                    labelCol={{ offset: 7 }}
                                    >
                                    <Input disabled={ this.props.type === 'detail' }/>
                                </Form.Item>
                                <Divider />
                                <div className={ styles.files }>
                                    <Row>
                                    { deliveryList?.includes(1) ?
                                        <Col span={ 8 }>
                                            <span key="1">
                                                <Button type="link" onClick={ () => this.downloadTMA() }>TMA文件</Button>
                                            </span>
                                        </Col>
                                        : null
                                    }
                                    { deliveryList?.includes(2) ?
                                        <Col span={ 8 }>
                                            <span key="2">
                                                <Button type="link" onClick={ () => this.download(2) }>工艺卡</Button>
                                            </span>
                                        </Col>
                                        : null
                                    }
                                    { deliveryList?.includes(3) ? 
                                        <Col span={ 8 }>
                                            <span key="3">
                                                <Button type="link" onClick={ () => this.download(3) }>大样图</Button>
                                            </span>
                                        </Col>
                                        : null
                                    }
                                    { deliveryList?.includes(4) ?
                                        <Col span={ 8 }>
                                            <span key="4">
                                                构建明细
                                            </span>
                                        </Col>
                                        : null
                                    }
                                    { deliveryList?.includes(5) ? 
                                        <Col span={ 8 }>
                                            <span key="5">
                                                <Button type="link" onClick={ () => this.exportBoltStatistics() }>螺栓清单</Button>
                                            </span>
                                        </Col>
                                        : null
                                    }
                                    { deliveryList?.includes(6) ? 
                                        <Col span={ 8 }>
                                            <span key="6">
                                                <Button type="link" onClick={ () => this.download(6) }>角钢NC数据</Button>  
                                            </span>
                                        </Col>
                                        : null
                                    }   
                                    { deliveryList?.includes(7) ?
                                        <Col span={ 8 }>
                                            <span key="7">
                                                <Button type="link" onClick={ () => this.download(7) }>钢板NC数据</Button>  
                                            </span>
                                        </Col>
                                        : null
                                    }
                                    { deliveryList?.includes(8) ?
                                        <Col span={ 8 }>
                                            <span key="8">
                                                <Button type="link" onClick={ () => this.exportAssemblyWeld() }>组焊清单</Button>
                                            </span>
                                        </Col>
                                        : null
                                    }
                                    { deliveryList?.includes(9) ?
                                        <Col span={ 8 }>
                                            <span key="9">
                                                <Button type="link" onClick={ () => this.uploadAttach(this.state.detailData?.buildChart || '') }>结构图</Button>
                                            </span>
                                        </Col>
                                        : null
                                    }
                                    </Row>
                                </div>
                                { deliveryList?.includes(10) ?
                                    <div>
                                        <p>其他文件</p>
                                        <div className={ styles.content }> 
                                            { this.state.deliveryFiles?.attachList?.map<React.ReactNode>((items: IAttachVo, index: number): React.ReactNode => {
                                                return <Row justify="center" gutter={16} className={ styles.row } key={ index }>
                                                    <Col span={6} className={ styles.col }>{ items.name }</Col>
                                                    <Col span={6} className={ styles.col }>{ items.fileUploadTime }</Col>
                                                    <Col span={6}>
                                                    <Button type="link" onClick={ () => this.uploadAttach(items.filePath || '') } danger>
                                                        下载
                                                    </Button>
                                                    </Col>
                                                </Row>
                                            }) }
                                        </div>
                                    </div>
                                    : null
                                }
                                <Space size="large" direction="horizontal">
                                    <Button type="default" htmlType="button" onClick={ this.onCancel }>关闭</Button>
                                    { this.props.type === 'detail' ? null : 
                                        <>
                                            <Button type="default" htmlType="button" onClick={ this.onBack }>退回</Button>
                                            <Button type="primary" htmlType="submit">验收通过</Button>
                                        </>
                                    }
                                </Space>
                            </Space> 
                        }
                    </Form>
                </Modal>
                { this.backModal() }
            </>
        );
    }

    public backModal(): React.ReactNode {
        return <Modal>

        </Modal>
    }

    /**
     * @protected
     * @description Gets form
     * @returns form 
     */
     protected getForm(): FormInstance | null {
        return this.form?.current;
    }

}

export default withRouter(withTranslation()(DeliveryAcceptance));
