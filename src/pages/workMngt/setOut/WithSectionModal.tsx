/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-放样列表-杆塔配段-配段
*/
import React from 'react';
import { Button, Space, Modal, Form, Input, FormInstance, Descriptions, message, Row, Col } from 'antd';
import { DetailContent } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import styles from './TowerLoftingAssign.module.less';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { IDetailData, IProductSegmentList } from './ISetOut';

export interface WithSectionModalProps { }
export interface IWithSectionModalRouteProps extends RouteComponentProps<WithSectionModalProps>, WithTranslation {
    readonly id: number | string;
    readonly updateList: () => void;
}

export interface WithSectionModalState {
    readonly visible: boolean;
    readonly detailData?: IDetailData;
    readonly fastVisible: boolean;
    readonly fastLoading?: boolean;
}

class WithSectionModal extends React.Component<IWithSectionModalRouteProps, WithSectionModalState> {

    private form: React.RefObject<FormInstance> = React.createRef<FormInstance>();
    private fastForm: React.RefObject<FormInstance> = React.createRef<FormInstance>();

    private getForm = (): FormInstance | null => {
        return this.form?.current;
    }

    public state: WithSectionModalState = {
        visible: false,
        fastVisible: false
    }

    private modalCancel(): void {
        this.setState({
            visible: false
        })
        this.getForm()?.resetFields();
    }

    private async modalShow(): Promise<void> {
        const data = await RequestUtil.get<IDetailData>(`/tower-science/productSegment/distribution?productId=${this.props.id}`);
        this.setState({
            visible: true,
            detailData: { ...data }
        })
        this.getForm()?.setFieldsValue({ ...data, productSegmentListDTOList: [...data.loftingProductSegmentList || []] });
    }

    protected save = (path: string) => {
        if (this.getForm()) {
            this.getForm()?.validateFields().then(res => {
                const value = this.getForm()?.getFieldsValue(true);
                const loftingProductSegmentList = this.state.detailData?.loftingProductSegmentList;
                value.productCategoryId = this.state.detailData?.productCategoryId;
                value.productId = this.state.detailData?.productId;
                value.productSegmentListDTOList = value.productSegmentListDTOList?.map((items: IProductSegmentList, index: number) => {
                    if (items) {
                        return {
                            id: loftingProductSegmentList && loftingProductSegmentList[index].id === -1 ? '' : loftingProductSegmentList && loftingProductSegmentList[index].id,
                            segmentName: loftingProductSegmentList && loftingProductSegmentList[index].segmentName,
                            count: items.count,
                            segmentId: loftingProductSegmentList && loftingProductSegmentList[index].segmentId,
                        }
                    } else {
                        return undefined
                    }
                });
                value.productSegmentListDTOList = value.productSegmentListDTOList.filter((item: IProductSegmentList) => { return item !== undefined });
                RequestUtil.post(path, { ...value }).then(res => {
                    this.props.updateList();
                    this.modalCancel();
                }).catch(error => {
                    this.getForm()?.setFieldsValue({})
                });
            })
        }
    }

    // public handleModalOk = async () => {
    //     const detailData: IProductSegmentList[] = await RequestUtil.get<IProductSegmentList[]>(`/tower-science/productSegment/quickLofting/${this.props.id}/${this.fastForm.current?.getFieldsValue(true).part}`);
    //     this.setState({
    //         fastVisible: false,
    //         detailData: {
    //             ...this.getForm()?.getFieldsValue(true),
    //             loftingProductSegmentList: [...detailData]
    //         }
    //     })
    //     this.getForm()?.setFieldsValue({
    //         ...this.getForm()?.getFieldsValue(true),
    //         productSegmentListDTOList: [...detailData]
    //     })
    // }

    public fastWithSectoin = async () => {
        this.setState({
            fastLoading: true
        })
        const detailData: IProductSegmentList[] = await RequestUtil.get<IProductSegmentList[]>(`/tower-science/productSegment/quickLofting/${this.props.id}/${this.fastForm.current?.getFieldsValue(true).part}`);
        this.setState({
            fastVisible: false,
            detailData: {
                ...this.getForm()?.getFieldsValue(true),
                loftingProductSegmentList: [...detailData]
            },
            fastLoading: false
        })
        this.getForm()?.setFieldsValue({
            ...this.getForm()?.getFieldsValue(true),
            productSegmentListDTOList: [...detailData]
        })
    }

    /**
    * @description Renders AbstractDetailComponent
    * @returns render 
    */
    public render(): React.ReactNode {
        const detailData: IDetailData | undefined = this.state.detailData;
        return <>
            <Button type="link" key={this.props.id} onClick={() => this.modalShow()} ghost>配段</Button>
            {/* <Modal
                destroyOnClose
                visible={this.state.fastVisible}
                width="30%"
                title="配段信息"
                onOk={this.handleModalOk}
                className={styles.tryAssemble}
                onCancel={() => {
                    this.setState({
                        fastVisible: false
                    })
                }}>
                <Form ref={this.fastForm} className={styles.descripForm}>
                    <Descriptions title="" bordered size="small" colon={false} column={4}>
                        <Descriptions.Item key={4} label="配段">
                            <Form.Item name="part" rules={[{
                                pattern: /^[a-zA-Z0-9-,*()]*$/,
                                message: '仅可输入英文字母/数字/特殊字符',
                            }]}>
                                <Input placeholder="请输入" />
                            </Form.Item>
                        </Descriptions.Item>
                    </Descriptions>
                </Form>
            </Modal> */}
            <Modal
                visible={this.state.visible}
                width="60%"
                title="配段"
                footer={<Space>
                    <Button type="ghost" onClick={() => this.modalCancel()}>关闭</Button>
                    <Button type="primary" onClick={() => this.save('/tower-science/productSegment/distribution/save')} ghost>保存</Button>
                    <Button type="primary" onClick={() => this.save('/tower-science/productSegment/distribution/submit')} ghost>保存并提交</Button>
                </Space>}
                onCancel={() => this.modalCancel()}
            >
                <Form ref={this.fastForm}>
                    <Row>
                        <Col span={14}>
                            <Form.Item name="part" label="快速配段" rules={[{
                                pattern: /^[a-zA-Z0-9-,*()]*$/,
                                message: '仅可输入英文字母/数字/特殊字符',
                            }]}>
                                <Input style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col offset={2} span={4}>
                            <Button type="primary" loading={this.state.fastLoading} onClick={this.fastWithSectoin} ghost>确定</Button>
                        </Col>
                    </Row>
                </Form>
                <DetailContent key={this.props.id}>
                    <Form ref={this.form} className={styles.descripForm}>
                        <p style={{ paddingBottom: "12px", fontWeight: "bold", fontSize: '14PX' }}>
                            <span>塔腿配段信息</span>
                            <Button className={styles.fastBtn} type="primary" onClick={() => {
                                this.setState({
                                    fastVisible: true
                                })
                            }} ghost>快速配段</Button>
                        </p>
                        <Descriptions title="" bordered size="small" colon={false} column={4}>
                            <Descriptions.Item key={1} label="A">
                                <Form.Item name="legNumberA" initialValue={detailData?.legNumberA} rules={[{
                                    required: true,
                                    message: '请输入塔腿A'
                                }, {
                                    pattern: /^[0-9a-zA-Z]*$/,
                                    message: '仅可输入数字/字母',
                                }]}>
                                    <Input placeholder="请输入" maxLength={50} />
                                </Form.Item>
                            </Descriptions.Item>
                            <Descriptions.Item key={2} label="B">
                                <Form.Item name="legNumberB" initialValue={detailData?.legNumberB} rules={[{
                                    required: true,
                                    message: '请输入塔腿B'
                                }, {
                                    pattern: /^[0-9a-zA-Z]*$/,
                                    message: '仅可输入数字/字母',
                                }]}>
                                    <Input placeholder="请输入" maxLength={50} />
                                </Form.Item>
                            </Descriptions.Item>
                            <Descriptions.Item key={3} label="C">
                                <Form.Item name="legNumberC" initialValue={detailData?.legNumberC} rules={[{
                                    required: true,
                                    message: '请输入塔腿C'
                                }, {
                                    pattern: /^[0-9a-zA-Z]*$/,
                                    message: '仅可输入数字/字母',
                                }]}>
                                    <Input placeholder="请输入" maxLength={50} />
                                </Form.Item>
                            </Descriptions.Item>
                            <Descriptions.Item key={4} label="D">
                                <Form.Item name="legNumberD" initialValue={detailData?.legNumberD} rules={[{
                                    required: true,
                                    message: '请输入塔腿D'
                                }, {
                                    pattern: /^[0-9a-zA-Z]*$/,
                                    message: '仅可输入数字/字母',
                                }]}>
                                    <Input placeholder="请输入" maxLength={50} />
                                </Form.Item>
                            </Descriptions.Item>
                        </Descriptions>
                        <p style={{ padding: "12px 0px", fontWeight: "bold", fontSize: '14PX' }}>塔身配段信息</p>
                        <Descriptions title="" bordered size="small" colon={false} column={2}>
                            <Descriptions.Item label="塔型">
                                <span>{detailData?.productCategoryName}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label="杆塔号">
                                <span>{detailData?.productNumber}</span>
                            </Descriptions.Item>
                            {
                                [...detailData?.loftingProductSegmentList || []]?.map((items: IProductSegmentList, index: number) => {
                                    return <>
                                        <Descriptions.Item key={index + '_' + this.props.id} label="段号">
                                            <Form.Item name={["productSegmentListDTOList", index, "segmentName"]}>
                                                <span>{items.segmentName}</span>
                                            </Form.Item>
                                        </Descriptions.Item>
                                        <Descriptions.Item key={index} label="段数">
                                            <Form.Item key={index + '_' + this.props.id} name={["productSegmentListDTOList", index, "count"]} initialValue={items.count} rules={[{
                                                required: true,
                                                message: '请输入段数 '
                                            }, {
                                                pattern: /^[0-9]*$/,
                                                message: '仅可输入数字',
                                            }]}>
                                                <Input maxLength={2} placeholder="请输入" />
                                            </Form.Item>
                                        </Descriptions.Item>
                                    </>
                                })
                            }
                        </Descriptions>
                    </Form>
                </DetailContent>
            </Modal>
        </>
    }
}

export default withRouter(withTranslation('translation')(WithSectionModal))
