/**
 * @author lxy
 * @copyright © 2021
 */
import { FormItemProps } from 'antd';
import { ColumnType, TablePaginationConfig } from 'antd/lib/table';
import { GetRowKey } from 'rc-table/lib/interface';
import RequestUtil from '../utils/RequestUtil';
import AbstractSelectionModal from './AbstractSelectableModal';
import { IAbstractSelectableModalProps, IAbstractSelectableModalState, IResponseData } from './AbstractSelectableModal';

export interface ITowerSelectionComponentState extends IAbstractSelectableModalState {
    readonly tableDataSource: ITower[];
}
export interface ITowerSelectionComponentProps extends IAbstractSelectableModalProps {
    readonly dataSource: ITower[];
}

export interface ITower {
    readonly id: string | number;
    readonly steelProductShape: string;
    readonly productCategoryName: string;
}

/**
 * Tower Selection Component
 */
export default class TowerSelectionComponent extends AbstractSelectionModal<ITowerSelectionComponentProps, ITowerSelectionComponentState> {

    /**
     * @override
     * @description Gets state
     * @returns state 
     */
    protected getState(): ITowerSelectionComponentState {
        return {
            ...super.getState(),
            tablePagination: {
                current: 1,
                pageSize: 10,
                total: 0,
                showSizeChanger: false
            },
            confirmTitle: "选择塔型"
        };
    }

    public async getTable(filterValues: Record<string, any>, pagination: TablePaginationConfig = {}) {
        const resData: IResponseData = await RequestUtil.get<IResponseData>('/tower-market/extractionMaterial/getProductShape', {
            ...filterValues,
            current: pagination.current || this.state.tablePagination.current,
            size: pagination.pageSize || this.state.tablePagination.pageSize
        });
        if (resData?.records?.length === 0 && resData?.current && resData?.current > 1) {
            this.getTable({}, {
                current: resData.current - 1,
                pageSize: 10,
                total: 0,
            });
        }
        this.setState({
            ...filterValues,
            tableDataSource: resData.records,
            tablePagination: {
                ...this.state.tablePagination,
                current: resData.current,
                pageSize: resData.size,
                total: resData.total
            }
        });
    }

    public getFilterFormItemProps(): FormItemProps[] {
        return [];
    }

    public onFilterSubmit = async (values: Record<string, any>) => {
        this.getTable(values);
    }

    public getTableDataSource(): object[] {
        return this.props.dataSource;
    }

    public getTableColumns(): ColumnType<object>[] {
        return [{
            key: 'productCategoryName',
            title: '塔型',
            dataIndex: 'productCategoryName'
        }, {
            key: 'steelProductShape',
            title: '钢印塔型',
            dataIndex: 'steelProductShape'
        }];
    }

    protected getTableRowKey(): string | GetRowKey<object> {
        return 'id';
    }
}