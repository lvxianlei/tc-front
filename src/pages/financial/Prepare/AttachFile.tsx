import React, { useState, forwardRef, useImperativeHandle, useRef } from "react"
import { Attachment, AttachmentRef} from '../../common'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
interface OverviewProps {
    id: string
    ref?: React.RefObject<{ onSubmit: () => Promise<any> }>
}
export default forwardRef(function AttchFile({ id }: OverviewProps, ref): JSX.Element {
    const attachRef = useRef<AttachmentRef>()
    const { run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-supply/applyPayment/completeApplyPayment`, { ...data, id })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = async () => {
        const result = await saveRun({ fileIds: attachRef.current?.getDataSource().map(item => item.id) })
    }

    useImperativeHandle(ref, () => ({ onSubmit }), [ref, onSubmit])

    return <Attachment edit ref={attachRef} />
})