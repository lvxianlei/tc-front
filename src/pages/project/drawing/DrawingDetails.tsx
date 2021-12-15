import React, { useState } from 'react'
import { Modal } from 'antd'
import { useHistory, useParams, Link } from 'react-router-dom'
import { Attachment, BaseInfo, DetailTitle } from '../../common'
import {drawingConfiremationitem} from './Drawingdata.json'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'



export default function DrawingDetail(): React.ReactNode {

    
    
    // 获取详情的数据
    
   
    
    return <>
         <Modal
         title={'图纸确认信息'}
         maskClosable={false}
         width={800}

         >
            <DetailTitle title="图纸确认信息" />
            <BaseInfo dataSource={[]} col={ 2 }
                columns={[
                    
                ]}
            />
         </Modal> 
    </>  
}

