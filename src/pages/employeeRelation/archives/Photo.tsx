import React, { useState } from 'react'
import { Button, message, Spin, Upload } from 'antd'
import ImgCrop from 'antd-img-crop'
import AuthUtil from '../../../utils/AuthUtil'
import style from './Photo.module.less'
interface PhotoProps {
  id: string
  url: string
}
export default function Photo({ id, url }: PhotoProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const [imageUrl, setImageUrl] = useState<string>(url)
  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error("只支持JPG/PNG文件上传");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("图片最大为2M");
    }
    return isJpgOrPng && isLt2M;
  }

  const handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      return;
    }
    if (info.file.status === 'done') {
      setLoading(false)
      setImageUrl(info.file.response.data)
    }
  }

  const onPreview = async (file: any) => {
    let src = file.url
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      })
    }
    const image = new Image()
    image.src = src
    const imgWindow = window.open(src)
    imgWindow?.document.write(image.outerHTML)
  }

  return (
    <ImgCrop rotate>
      <Upload
        action={`${process.env.REQUEST_API_PATH_PREFIX}/tower-hr/employee/archives/photo`}
        data={{ archivesId: id }}
        headers={{
          'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
          'Sinzetech-Auth': AuthUtil.getSinzetechAuth(),
          'Tenant-Id': AuthUtil.getTenantId()
        }}
        listType="picture-card"
        beforeUpload={beforeUpload}
        className={style.uploadPicture}
        showUploadList={false}
        onChange={handleChange}
        onPreview={onPreview}
      >
        <Spin spinning={loading} size="small">
          {!imageUrl && <Button type="link" size="small">选择</Button>}
          {imageUrl && <img src={imageUrl} alt="" style={{ width: "100%" }} />}
        </Spin>
      </Upload>
    </ImgCrop>
  )
}