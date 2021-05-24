/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import { Col, ColProps, Row, Space } from 'antd';
import React from 'react';

import layoutStyles from '../layout/Layout.module.less';
import styles from './SummaryRenderUtil.module.less';

export interface ISection {
    readonly title: string;
    readonly className?: string;
}

export interface IRenderedSection extends ISection {
    readonly render: () => React.ReactNode;
}

interface IRenderedFieldItem {
    readonly label: string;
    readonly value?: string;
}

type IRenderedGridCols = IRenderedFieldItem[];

type IRenderedGridRow = IRenderedGridCols;

export interface IRenderedGrid {
    readonly labelCol?: ColProps;
    readonly valueCol?: ColProps;
    readonly rows: IRenderedGridRow[];
}

export interface IRenderdSummariableItem {
    readonly fieldItems: IRenderedFieldItem[];
    readonly renderExtraInBar?: () => React.ReactNode | React.ReactNode[];
    readonly render?: () => React.ReactNode | React.ReactNode[];
}

/**
 * Summary render util class
 */
export default abstract class SummaryRenderUtil {

    /**
     * @static
     * @description Renders grid
     * @param grid 
     * @returns grid 
     */
    public static renderGrid(grid: IRenderedGrid): React.ReactNode {
        const rows: IRenderedGridRow[] = grid.rows;
        const maxColNumber: number = rows
            .map<number>((cols: IRenderedGridCols): number => cols.length)
            .sort((a: number, b: number) => (a - b) * -1)[0] // desc;
        return (
            <React.Fragment>
                {
                    rows.map<React.ReactNode>((cols: IRenderedGridCols, rowIndex: number): React.ReactNode => (
                        <Row key={ `row_${ rowIndex }` }>
                            { this.renderGridRow(cols, maxColNumber, grid.labelCol, grid.valueCol) }
                        </Row>
                    ))
                }
            </React.Fragment>
        );
    }

    /**
     * @description Renders grid row
     * @param cols 
     * @param maxColNumber 
     * @param [labelCol] 
     * @param [valueCol] 
     * @returns grid row 
     */
    private static renderGridRow(cols: IRenderedGridCols, maxColNumber: number, labelCol: ColProps = {}, valueCol: ColProps = {}): React.ReactNode[] {
        const fields: React.ReactNode[] = [];
        for (let i: number = 0; i < maxColNumber; ++i) {
            const item: IRenderedFieldItem = cols[i] || {};
            fields.push(
                <React.Fragment key={ `col_${ i }` }>
                    <Col { ...labelCol } className={ `${ styles.col } ${ styles.label } ${ labelCol.className }` }>{ item.label }</Col>
                    <Col { ...valueCol } className={ `${ styles.col } ${ valueCol.className }` }>{ item.value }</Col>
                </React.Fragment>
            );
        }
        return fields;
    }

    /**
     * @static
     * @description Renders sections
     * @param sections 
     * @returns sections 
     */
    public static renderSections(sections: IRenderedSection[]): React.ReactNode | React.ReactNode[] {
        return (
            <Space direction="vertical" size="middle" className={ layoutStyles.width100 }>
                {
                    sections.map<React.ReactNode>((section: IRenderedSection, index: number): React.ReactNode => (
                        <section key={ `section_${ index }` } className={ styles.section }>
                            <h1 className={ styles.title }>{ section.title }</h1>
                            { section.render() }
                        </section>
                    ))
                }
            </Space>
        );
    }

    /**
     * @static
     * @description Renders summariable areas
     * @param items 
     * @returns summariable areas 
     */
    public static renderSummariableAreas(items: IRenderdSummariableItem[]): React.ReactNode {
        return (
            <Space direction="vertical" size="middle" className={ layoutStyles.width100 }>
                {
                    items.map<React.ReactNode>((item: IRenderdSummariableItem, index: number): React.ReactNode => (
                        <div key={ `summariable_${ index }` }>
                            <Space direction="horizontal" size="large" className={ `${ layoutStyles.width100 } ${ styles.summariableBar } ${ item.renderExtraInBar ? styles.hasExtraOperation : '' }` }>
                                {
                                    item.fieldItems.map<React.ReactNode>((fieldItem: IRenderedFieldItem, index: number): React.ReactNode => (
                                        <div key={ `field_item_${ index }` }>
                                            <span>{ fieldItem.label }：</span>
                                            <span>{ fieldItem.value }</span>
                                        </div>
                                    ))
                                }
                                <div>{ item.renderExtraInBar ? item.renderExtraInBar() : null }</div>
                            </Space>
                            { item.render ? item.render() : null }
                        </div>
                    ))
                }
            </Space>
        );
    }
}