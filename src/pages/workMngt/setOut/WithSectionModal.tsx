/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-放样列表-杆塔配段-配段
*/
import React from 'react';
import { Button, Space, Modal, Form, Input, FormInstance, Descriptions, message, Row, Col, Select } from 'antd';
import { DetailContent } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import styles from './TowerLoftingAssign.module.less';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { IDetailData, IProductSegmentList } from './ISetOut';
import { patternTypeOptions } from '../../../configuration/DictionaryOptions';

export interface WithSectionModalProps { }
export interface IWithSectionModalRouteProps extends RouteComponentProps<WithSectionModalProps>, WithTranslation {
    readonly id?: number | string;
    readonly updateList: () => void;
    readonly type?: string;
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
        if (this.props.type === 'batch') {
            this.setState({
                visible: true
            })
        } else {
            const data = await RequestUtil.get<IDetailData>(`/tower-science/productSegment/distribution?productId=${this.props.id}`);
            this.setState({
                visible: true,
                detailData: { ...data }
            })
            this.getForm()?.setFieldsValue({ ...data, productSegmentListDTOList: [...data.loftingProductSegmentList || []] });
        }
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
            {this.props.type === 'batch' ? <Button type="primary" onClick={() => this.modalShow()} ghost>批量配段</Button> : <Button type="link" key={this.props.id} onClick={() => this.modalShow()}>配段</Button>}
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
                        {this.props.type === 'batch' ? <><Col span={6}>
                            <Form.Item name="part" label="杆塔" rules={[{
                                required: true,
                                message: '请选择呼高'
                            }]}>
                                <Select placeholder="请选择" style={{ width: '150px' }} getPopupContainer={triggerNode => triggerNode.parentNode}>
                                    {patternTypeOptions && patternTypeOptions.map(({ id, name }, index) => {
                                        return <Select.Option key={index} value={id}>

                                            {name}
                                        </Select.Option>
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                            <Col span={5}>
                                <Form.Item name="part" rules={[{
                                    required: true,
                                    message: '请选择杆塔'
                                }]}>
                                    <Select placeholder="请选择" style={{ width: '150px' }} getPopupContainer={triggerNode => triggerNode.parentNode}>
                                        {patternTypeOptions && patternTypeOptions.map(({ id, name }, index) => {
                                            return <Select.Option key={index} value={id}>

                                                {name}
                                            </Select.Option>
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col></> : null}
                        <Col offset={this.props.type === 'batch' ? 1 : 0} span={6}>
                            <Form.Item name="part" label="快速配段" rules={[{
                                pattern: /^[a-zA-Z0-9-,*()]*$/,
                                message: '仅可输入英文字母/数字/特殊字符',
                            }]}>
                                <Input />
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
                        </p>
                        <Descriptions title="" bordered size="small" colon={false} column={4}>
                            <Descriptions.Item key={1} label="A">
                                <Form.Item name="legNumberA" initialValue={detailData?.legNumberA} rules={[{
                                    pattern: /^[0-9a-zA-Z]*$/,
                                    message: '仅可输入数字/字母',
                                }]}>
                                    <Input placeholder="请输入" maxLength={50} />
                                </Form.Item>
                            </Descriptions.Item>
                            <Descriptions.Item key={2} label="B">
                                <Form.Item name="legNumberB" initialValue={detailData?.legNumberB} rules={[{
                                    pattern: /^[0-9a-zA-Z]*$/,
                                    message: '仅可输入数字/字母',
                                }]}>
                                    <Input placeholder="请输入" maxLength={50} />
                                </Form.Item>
                            </Descriptions.Item>
                            <Descriptions.Item key={3} label="C">
                                <Form.Item name="legNumberC" initialValue={detailData?.legNumberC} rules={[{
                                    pattern: /^[0-9a-zA-Z]*$/,
                                    message: '仅可输入数字/字母',
                                }]}>
                                    <Input placeholder="请输入" maxLength={50} />
                                </Form.Item>
                            </Descriptions.Item>
                            <Descriptions.Item key={4} label="D">
                                <Form.Item name="legNumberD" initialValue={detailData?.legNumberD} rules={[{
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
