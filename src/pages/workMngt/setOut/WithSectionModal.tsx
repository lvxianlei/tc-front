/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-放样列表-杆塔配段-配段
*/
import React from 'react';
import { Button, Space, Modal, Form, Input, FormInstance, Descriptions } from 'antd';
import { DetailContent } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import styles from './TowerLoftingAssign.module.less';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import useRequest from '@ahooksjs/use-request';

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
    readonly productSegmentVOList?: IProductSegmentList[];
}

interface IProductSegmentList {
    readonly productCategoryId?: string;
    readonly name?: string;
    readonly id?: string;
    readonly count?: string;
}

class WithSectionModal extends React.Component<IWithSectionModalRouteProps, WithSectionModalState> {
   
    private form: React.RefObject<FormInstance> = React.createRef<FormInstance>();

    private getForm = (): FormInstance | null => {
        return this.form?.current;
    }

    constructor(props: IWithSectionModalRouteProps) {
        super(props)
    }

    public state: WithSectionModalState = {
        visible: false
    }

    private modalCancel(): void {
        this.setState({
            visible: false
        })
    }

    private async modalShow(): Promise<void> {
        const data = await RequestUtil.get<IDetailData>(`/tower-science/productSegment/distribution?productId=${ this.props.id }`);
        this.setState({
            visible: true,
            detailData: data
        })
    }

    protected save = (path: string) => {
        if(this.getForm()) {
            this.getForm()?.validateFields().then(res => {
                const value = this.getForm()?.getFieldsValue(true);
                const productSegmentVOList = this.state.detailData?.productSegmentVOList;
                value.productCategoryId = this.state.detailData?.productCategoryId;
                value.productId = this.state.detailData?.productId;
                value.productSegmentListDTOList = value.productSegmentVOList?.map((items: IProductSegmentList, index: number) => {
                    if(items) {
                        return {
                            id: productSegmentVOList && productSegmentVOList[index].id,
                            name: productSegmentVOList && productSegmentVOList[index].name,
                            count: items.count
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
            <Button type="link" onClick={ () => this.modalShow() } ghost>配段</Button>
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
                <DetailContent>
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
                                    detailData?.productSegmentVOList?.map((items: IProductSegmentList, index: number) => {
                                        return <>
                                        <Descriptions.Item label="段号">    
                                            <Form.Item name={ ["productSegmentVOList", index, "name"] }>
                                                <span>{ items.name }</span>
                                            </Form.Item>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="段数">    
                                            <Form.Item name={ ["productSegmentVOList", index, "count"] } initialValue={ items.count }>
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
