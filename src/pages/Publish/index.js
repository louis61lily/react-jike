import {
    Card,
    Breadcrumb,
    Form,
    Button,
    Radio,
    Input,
    Upload,
    Space,
    Select,
    message
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import './index.scss'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useEffect, useState, useRef } from 'react'
import { request } from '@/utils'
import { useSearchParams } from 'react-router-dom';



const { Option } = Select

const Publish = () => {

    const [searchParams] = useSearchParams()
    const articleId = searchParams.get('id')
    const [form] = Form.useForm()
    useEffect(() => {
        async function getArticle() {
            const res = await request.get(`/mp/articles/${articleId}`)
            const { cover, ...formValue } = res.data
            // 设置表单数据
            form.setFieldsValue({ ...formValue, type: cover.type })
        }
        if (articleId) {
            // 拉取数据回显
            getArticle()
        }
    }, [articleId, form])

    // 设置接收频道列表的变量
    const [channel, setChannel] = useState([])
    // 异步获取频道列表数据
    const getChannelList = async () => {
        const res = await request.get('/channels')
        setChannel(res.data.channels)
    }

    // 上传图片
    const cacheImageList = useRef([])
    const [imageList, setImageList] = useState([])
    const onUploadChange = (info) => {
        setImageList(info.fileList)
        cacheImageList.current = info.fileList
    }

    // 控制图片Type
    const [imageType, setImageType] = useState(0)
    const onTypeChange = (e) => {
        const type = e.target.value
        setImageType(type)
        if (type === 1) {
            // 单图，截取第一张展示
            const imgList = cacheImageList.current[0] ? [cacheImageList.current[0]] : []
            setImageList(imgList)
        } else if (type === 3) {
            // 三图，取所有图片展示
            setImageList(cacheImageList.current)
        }
    }

    // 提交表单数据
    const onFinish = async (fromData) => {
        if (imageType !== imageList.length) {
            return message.warning('图片类型和数量不一致')
        }
        const { channel_id, content, title } = fromData
        const formatUrl = (list) => {
            return list.map(item => {
                if (item.response) {
                    return item.response.data.url
                } else {
                    return item.url
                }
            })
        }
        const params = {
            channel_id,
            content,
            title,
            type: 1,
            cover: {
                type: imageType,
                images: formatUrl(imageList)
            }
        }
        try {
            let res
            if (articleId) {
                // 编辑
                res = await request.put(`/mp/articles/${articleId}?draft=false`, params)
            } else {
                // 新增
                res = await request.post('/mp/articles?draft=false', params)
            }
            if (res.message === 'OK') message.success('发布成功！')
        } catch (e) {
            message.error('文章发布失败！')
        }
    }


    
    // dom渲染完成只执行一次渲染
    useEffect(() => {
        getChannelList()
    }, [])
    return (
        <div className="publish">
            <Card
                title={
                    <Breadcrumb items={[
                        { title: <Link to={'/'}>首页</Link> },
                        { title: `${articleId ? '编辑文章' : '发布文章'}` },
                    ]}
                    />
                }
            >
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ type: 0 }}
                    onFinish={onFinish}
                    form={form}
                >
                    <Form.Item
                        label="标题"
                        name="title"
                        rules={[{ required: true, message: '请输入文章标题' }]}
                    >
                        <Input placeholder="请输入文章标题" style={{ width: 400 }} />
                    </Form.Item>
                    <Form.Item
                        label="频道"
                        name="channel_id"
                        rules={[{ required: true, message: '请选择文章频道' }]}
                    >
                        <Select placeholder="请选择文章频道" style={{ width: 400 }}>
                            {
                                channel.map((item) => {
                                    return <Option value={item.id} key={item.id}>
                                        {item.name}
                                    </Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item label="封面">
                        <Form.Item name="type">
                            <Radio.Group onChange={onTypeChange}>
                                <Radio value={1}>单图</Radio>
                                <Radio value={3}>三图</Radio>
                                <Radio value={0}>无图</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {imageType > 0 &&
                            <Upload
                                name="image"
                                listType="picture-card"
                                showUploadList
                                action={'http://geek.itheima.net/v1_0/upload'}
                                onChange={onUploadChange}
                                maxCount={imageType}
                                multiple={imageType > 1}
                                fileList={imageList}
                            >
                                <div style={{ marginTop: 8 }}>
                                    <PlusOutlined />
                                </div>
                            </Upload>}
                    </Form.Item>
                    <Form.Item
                        label="内容"
                        name="content"
                        rules={[{ required: true, message: '请输入文章内容' }]}
                    >
                        <ReactQuill
                            className="publish-quill"
                            theme="snow"
                            placeholder="请输入文章内容"
                        />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 4 }}>
                        <Space>
                            <Button size="large" type="primary" htmlType="submit">
                                发布文章
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}

export default Publish