/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-放样列表-杆塔配段-配段
*/
import React from 'react';
import { Button, Space, Modal, Form, Input, FormInstance, Descriptions, message } from 'antd';
import { DetailContent } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import styles from './TowerLoftingAssign.module.less';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';

export interface WithSectionModalProps {}
export interface IWithSectionModalRouteProps extends RouteComponentProps<WithSectionModalProps>, WithTranslation {
    readonly id: number | string;
    readonly updateList: () => void;
}

export interface WithSectionModalState {
    readonly visible: boolean;
    readonly detailData?: IDetailData;
}

interface IDetailData {
    readonly productCategoryId?: string;
    readonly productCategoryName?: string;
    readonly productId?: string;
    readonly productNumber?: string;
    readonly loftingProductSegmentList?: IProductSegmentList[];
}

interface IProductSegmentList {
    readonly productCategoryId?: string;
    readonly segmentName?: string;
    readonly id?: string | number;
    readonly count?: string;
    readonly segmentId?: string;
}

class WithSectionModal extends React.Component<IWithSectionModalRouteProps, WithSectionModalState> {
   
    private form: React.RefObject<FormInstance> = React.createRef<FormInstance>();

    private getForm = (): FormInstance | null => {
        return this.form?.current;
    }

    public state: WithSectionModalState = {
        visible: false
    }

    private modalCancel(): void {
        this.setState({
            visible: false
        })
        this.getForm()?.resetFields();
    }

    private async modalShow(): Promise<void> {
        const data = await RequestUtil.get<IDetailData>(`/tower-science/productSegment/distribution?productId=${ this.props.id }`);
        this.setState({
            visible: true,
            detailData: {...data}
        })
        this.getForm()?.setFieldsValue({ productSegmentListDTOList: [...data.loftingProductSegmentList || []] });
    }

    protected save = (path: string) => {
        if(this.getForm()) {
            this.getForm()?.validateFields().then(res => {
                const value = this.getForm()?.getFieldsValue(true);
                const loftingProductSegmentList = this.state.detailData?.loftingProductSegmentList;
                value.productCategoryId = this.state.detailData?.productCategoryId;
                value.productId = this.state.detailData?.productId;
                if(value.productSegmentListDTOList) {
                    value.productSegmentListDTOList = value.productSegmentListDTOList?.map((items: IProductSegmentList, index: number) => {
                        if(items) {
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
                    value.productSegmentListDTOList = value.productSegmentListDTOList.filter((item: IProductSegmentList)=>{ return item !== undefined });
                    RequestUtil.post(path, { ...value }).then(res => {
                        this.props.updateList();
                        this.modalCancel();
                    }); 
                } else {
                    message.warning('暂无段名信息，无法保存')
                }
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
            <Button type="link" key={this.props.id} onClick={ () => this.modalShow() } ghost>配段</Button>
            <Modal
                visible={ this.state.visible } 
                width="40%" 
                title="配段"
                footer={ <Space>
                    <Button type="ghost" onClick={() => this.modalCancel() }>关闭</Button>
                    <Button type="primary" onClick={() => this.save('/tower-science/productSegment/distribution/save') } ghost>保存</Button>
                    <Button type="primary" onClick={() => this.save('/tower-science/productSegment/distribution/submit') } ghost>保存并提交</Button>
                </Space> } 
                onCancel={ () => this.modalCancel() }
            >
                <DetailContent key={this.props.id}>
                    <p>配段信息</p>
                    <Form ref={ this.form } className={ styles.descripForm }>
                        <Descriptions title="" bordered size="small" colon={ false } column={ 2 }>
                            <Descriptions.Item label="塔型">    
                                <span>{ detailData?.productCategoryName }</span>
                            </Descriptions.Item>
                            <Descriptions.Item label="杆塔号">    
                                <span>{ detailData?.productNumber }</span>
                            </Descriptions.Item>
                            {
                                [...detailData?.loftingProductSegmentList || []]?.map((items: IProductSegmentList, index: number) => {
                                    return <>
                                        <Descriptions.Item key={ index+'_'+this.props.id } label="段号">    
                                            <Form.Item name={ ["productSegmentListDTOList", index, "segmentName"] }>
                                                <span>{ items.segmentName }</span>
                                            </Form.Item>
                                        </Descriptions.Item>
                                        <Descriptions.Item key={ index } label="段数">    
                                            <Form.Item key={ index+'_'+this.props.id } name={ ["productSegmentListDTOList", index, "count"] } initialValue={ items.count } rules={[{
                                                pattern: /^[0-9-,]*$/,
                                                message: '仅可输入数字/特殊字符',
                                            }]}>
                                                <Input placeholder="请输入"/>
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
