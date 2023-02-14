import React, { useRef, useState } from 'react';
import { Button, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import UserTable from './UserTable';

interface SelectUserProps {
    onSelect: (selectedRows: Record<string, any>) => void;
    selectedKey?: string[];
    selectType?: 'radio' | 'checkbox';
    disabled?: boolean;
    requests?: Record<string, any>
    searchItems?: any
}

export interface EditRefProps {
    onSubmit: () => void
    resetFields: () => void
}

export default function SelectUser({
    ...props
}: SelectUserProps): JSX.Element {    
    const [visible, setVisible] = useState<boolean>(false);
    const ref = useRef<EditRefProps>();



    return <>
        <Button disabled={props.disabled} size='small' type='link' onClick={() => setVisible(true)}><PlusOutlined /></Button>
        <Modal
            visible={visible}
            title="选择人员"
            onCancel={() => {
                setVisible(false);
                ref.current?.resetFields();
            }}
            onOk={async () => {
                const data = await ref.current?.onSubmit() || [];
                setVisible(false);
                props.onSelect(data)
                ref.current?.resetFields();
            }}
            width='60%'
        >
            <UserTable ref={ref} {...props}/>
        </Modal>
    </>
}