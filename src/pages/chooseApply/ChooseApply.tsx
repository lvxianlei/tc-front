import React, { useState } from 'react';
import { DetailContent, DetailTitle } from '../common';
import styles from './ChooseApply.module.less';
import { Image } from 'antd';
import hr from '../../../public/hr.png';
import develop from '../../../public/develop.png';
import general from '../../../public/general.png';
import logistic from '../../../public/logistic.png';
import marketing from '../../../public/marketing.png';
import production from '../../../public/production.png';
import qualityInspection from '../../../public/qualityInspection.png';
import sales from '../../../public/sales.png';
import supply from '../../../public/supply.png';

interface IApplyType {
    readonly authority?: string;
    readonly icon?: string;
    readonly title?: string;
    readonly description?: string;
}
export default function ChooseApply(): React.ReactNode {
    const card: IApplyType[] = [
        {
            authority: '',
            icon: marketing,
            title: '营销中心',
            description: '包含合同、定档、任务等'
        },
        {
            authority: '',
            icon: develop,
            title: '研发中心',
            description: '包含合同、定档、任务等'
        },
        {
            authority: '',
            icon: supply,
            title: '供应中心',
            description: '包含合同、定档、任务等'
        },
        {
            authority: '',
            icon: qualityInspection,
            title: '质检中心',
            description: '包含合同、定档、任务等'
        },
        {
            authority: '',
            icon: production,
            title: '生产中心',
            description: '包含合同、定档、任务等'
        },
        {
            authority: '',
            icon: logistic,
            title: '物流中心',
            description: '包含合同、定档、任务等'
        },
        {
            authority: '',
            icon: sales,
            title: '售后中心',
            description: '包含合同、定档、任务等'
        },
        {
            authority: '',
            icon: hr,
            title: '人资中心',
            description: '包含合同、定档、任务等'
        },
        {
            authority: '',
            icon: general,
            title: '通用中心',
            description: '包含合同、定档、任务等'
        }
    ]
    return <DetailContent>
        <DetailTitle title="选择应用"/>
        {
            card.map((res: IApplyType) => (
                <div className={ styles.apply }>
                    <div className={ styles.icon }><Image preview={ false } src={ res.icon }/></div>
                    <div className={ styles.title }>{ res.title }</div>
                    <div className={ styles.description }>{ res.description }</div>
                </div>
            ))
        }
    </DetailContent>
}