/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-放样列表-杆塔配段-配段
*/
import React from 'react';
import { Button, Space, Modal, Form, Input, FormInstance, Descriptions, Row, Col, Select, message } from 'antd';
import { DetailContent } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import styles from './TowerLoftingAssign.module.less';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { IDetailData, IProductSegmentList } from './ISetOut';

export interface WithSectionModalProps { }
export interface IWithSectionModalRouteProps extends RouteComponentProps<WithSectionModalProps>, WithTranslation {
    readonly id?: number | string;
    readonly updateList: () => void;
    readonly type?: string;
    readonly productCategoryId?: string;
}

export interface WithSectionModalState {
    readonly visible: boolean;
    readonly detailData?: IDetailData;
    readonly fastVisible: boolean;
    readonly fastLoading?: boolean;
    readonly basicHeightList?: IBasicHeight[];
    readonly productList?: IProductVOList[];
}

interface IBasicHeight {
    readonly basicHeight?: string;
    readonly productVOList?: IProductVOList[];
}

interface IProductVOList {
    readonly id?: string;
    readonly productCategoryId?: string;
    readonly productCategoryNum?: string;
    readonly productCategoryType?: string;
    readonly productNum?: string;
    readonly productNumber?: string;
    readonly totalWeight?: string;
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
        this.fastForm.current?.resetFields();
    }

    private async modalShow(): Promise<void> {
        if (this.props.type === 'batch') {
            const data = await RequestUtil.get<IBasicHeight[]>(`/tower-science/product/getBasicHeightProduct?productCategoryId=${this.props.productCategoryId}`);
            if (data && data.length > 0 && data[0]?.productVOList && data[0]?.productVOList.length > 0) {
                const detail = await RequestUtil.get<IDetailData>(`/tower-science/productSegment/distribution?productId=${data[0]?.productVOList[0].id}`);
                this.setState({
                    detailData: {
                        productCategoryName: detail.productCategoryName,
                        productCategoryId: this.props.productCategoryId,
                        loftingProductSegmentList: detail.loftingProductSegmentList?.map(res => {
                            return {
                                ...res,
                                count: 0
                            }
                        })
                    }
                })
            }
            this.setState({
                visible: true,
                basicHeightList: data
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
        if (this.fastForm) {
            if (this.state.detailData?.productId || this.state.detailData?.productIdList) {
                this.fastForm.current?.validateFields().then(res => {
                    const value = this.getForm()?.getFieldsValue(true);
                    const loftingProductSegmentList = this.state.detailData?.loftingProductSegmentList;
                    value.productCategoryId = this.props.productCategoryId;
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
                    value.productIdList = this.state.detailData?.productIdList
                    RequestUtil.post(path, { ...value }).then(res => {
                        this.props.updateList();
                        this.modalCancel();
                    }).catch(error => {
                        this.getForm()?.setFieldsValue({})
                    });
                })
            } else {
                message.warning('请选择杆塔')
            }

        }
    }

    public delSameObjValue = (list: IProductSegmentList[]) => {
        let target: IProductSegmentList[] = [];
        let keysArr = new Set(list.map(item => item.segmentName));
        keysArr.forEach(item => {
            const arr = list.filter(keys => keys.segmentName == item);
            const sum = arr.reduce((total, currentValue) => total + Number(currentValue.count), 0)
            target.push({
                segmentName: item,
                count: Number(sum)
            })
        })
        return target;
    }

    public fastWithSectoin = async () => {
        this.setState({
            fastLoading: true
        })
        // const detailData: IProductSegmentList[] = await RequestUtil.get<IProductSegmentList[]>(`/tower-science/productSegment/quickLofting/${this.props.id}/${this.fastForm.current?.getFieldsValue(true).part}`);
        // this.setState({
        //     fastVisible: false,
        //     detailData: {
        //         ...this.getForm()?.getFieldsValue(true),
        //         loftingProductSegmentList: [...detailData]
        //     },
        //     fastLoading: false
        // })
        // this.getForm()?.setFieldsValue({
        //     ...this.getForm()?.getFieldsValue(true),
        //     productSegmentListDTOList: [...detailData]
        // })
        const inputString: string = this.fastForm.current?.getFieldsValue(true).part;
        if (inputString) {
            if ((/[(,*-]+\*[0-9]+|[(,*-]+\*[a-zA-Z()-*,]+|^[*),]+/g).test(inputString)) {
                message.error('请输入正确格式');
                this.setState({
                    fastLoading: false
                })
            } else {
                const inputList = inputString.split(',');
                let list: IProductSegmentList[] = [];
                inputList.forEach((res: string) => {
                    const newRes = res.split('*')[0].replace(/\(|\)/g, "");
                    if ((/^[0-9]+-[0-9]+$/).test(newRes)) {
                        const length = Number(newRes.split('-')[0]) - Number(newRes.split('-')[1]);
                        if (length <= 0) {
                            let num = Number(newRes.split('-')[0]);
                            let t = setInterval(() => {
                                list.push({
                                    segmentName: (num++).toString(),
                                    count: Number(res.split('*')[1]) || 1
                                })
                                if (num > Number(newRes.split('-')[1])) {
                                    clearInterval(t);
                                }
                            }, 0)
                        } else {
                            let num = Number(newRes.split('-')[0])
                            let t = setInterval(() => {
                                list.push({
                                    segmentName: (num--).toString(),
                                    count: Number(res.split('*')[1]) || 1
                                })
                                if (num < Number(newRes.split('-')[1])) {
                                    clearInterval(t);
                                }
                            }, 0)
                        }
                    } else {
                        list.push({
                            segmentName: newRes,
                            count: Number(res.split('*')[1]) || 1
                        })
                    }

                })
                setTimeout(() => {
                    const delSameObjList = this.delSameObjValue(list);
                    const newList = this.state.detailData?.loftingProductSegmentList?.map(res => {
                        const newData = delSameObjList.filter(item => item?.segmentName === res?.segmentName);
                        if (res?.segmentName === newData[0]?.segmentName) {
                            return {
                                ...res,
                                count: newData[0].count
                            }
                        } else {
                            return res
                        }
                    })
                    this.setState({
                        fastVisible: false,
                        detailData: {
                            ...this.getForm()?.getFieldsValue(true),
                            productCategoryName: this.state.detailData?.productCategoryName,
                            productNumber: this.state.detailData?.productNumber,
                            productIdList: this.state.detailData?.productIdList,
                            loftingProductSegmentList: [...newList || []]
                        },
                        fastLoading: false
                    })
                    this.getForm()?.setFieldsValue({
                        ...this.getForm()?.getFieldsValue(true),
                        productSegmentListDTOList: [...newList || []]
                    })
                    this.fastForm.current?.resetFields(['part'])
                }, 1000)
            }
        } else {
            message.warning('请输入需快速配段的信息')
            this.setState({
                fastLoading: false
            })
        }
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
                    <Button type="primary" onClick={() => this.save('/tower-science/productSegment/distribution/submit')} ghost>保存并提交</Button>
                </Space>}
                onCancel={() => this.modalCancel()}
            >
                <Form ref={this.fastForm}>
                    <Row>
                        {this.props.type === 'batch' ? <><Col span={6}>
                            <Form.Item name="basicHeight" label="杆塔" rules={[{
                                required: true,
                                message: '请选择呼高'
                            }]}>
                                <Select placeholder="请选择呼高" style={{ width: '150px' }} getPopupContainer={triggerNode => triggerNode.parentNode} onChange={(e) => {
                                    const data = this.state.basicHeightList?.filter(res => res.basicHeight === e);
                                    this.setState({
                                        productList: data && data[0].productVOList,
                                        detailData: {
                                            ...this.state.detailData,
                                            productNumber: '',
                                            productIdList: []
                                        }
                                    })
                                    this.fastForm.current?.setFieldsValue({
                                        productId: []
                                    })
                                }}>
                                    {this.state.basicHeightList && this.state.basicHeightList?.map(({ basicHeight }, index) => {
                                        return <Select.Option key={index} value={basicHeight || ''}>
                                            {basicHeight}
                                        </Select.Option>
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                            <Col span={5}>
                                <Form.Item name="productId" rules={[{
                                    required: true,
                                    message: '请选择杆塔'
                                }]}>
                                    <Select placeholder="请选择杆塔" mode="multiple" style={{ width: '150px' }} getPopupContainer={triggerNode => triggerNode.parentNode} onChange={(e: any) => {
                                        if (Array.from(e)?.findIndex(res => res === 'all') !== -1) {
                                            this.fastForm?.current?.setFieldsValue({
                                                productId: [...this.state.productList?.map(res => {
                                                    return res?.id + ',' + res?.productNumber
                                                }) || [], 'all']
                                            })
                                            this.setState({
                                                detailData: {
                                                    ...this.state.detailData,
                                                    productNumber: this.state.productList?.map((res: any) => res.productNumber).join(','),
                                                    productIdList: this.state.productList?.map((res: any) => res.id)
                                                }
                                            })
                                        } else {
                                            const productId = this.fastForm.current?.getFieldsValue(true).productId;
                                            this.setState({
                                                detailData: {
                                                    ...this.state.detailData,
                                                    productNumber: productId?.map((res: string) => res.split(',')[1]).join(','),
                                                    productIdList: productId?.map((res: string) => res.split(',')[0])
                                                }
                                            })
                                        }
                                    }}>
                                        <Select.Option key={999} value={'all'}>全部</Select.Option>
                                        {this.state.productList && this.state.productList.map(({ id, productNumber }, index) => {
                                            return <Select.Option key={index} value={id + ',' + productNumber || ''}>
                                                {productNumber}
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
