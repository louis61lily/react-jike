import {
    Card,
    Breadcrumb,
    Form,
    Button,
    //Radio,
    Input,
    //Upload,
    Space,
    Select,
    message
} from 'antd'
// import { PlusOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import './index.scss'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useEffect, useState } from 'react'
import { request } from '@/utils'


const { Option } = Select

const Publish = () => {
    // 设置接收频道列表的变量
    const [channel, setChannel] = useState([])
    // 异步获取频道列表数据
    const getChannelList = async() => {
        const res = await request.get('/channels')
        setChannel(res.data.channels)
    }

    // 提交表单数据
    const onFinish = async(fromData) => {
        const { channel_id, content, title} = fromData
        const params = {
            channel_id,
            content,
            title,
            type: 1,
            cover: {
                type: 1,
                image: []
            }
        }
        try {
            const res = await request.post('/mp/articles?draft=false', params)
            console.log(res)
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
                        { title: '发布文章' },
                    ]}
                    />
                }
            >
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ type: 1 }}
                    onFinish={ onFinish }
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
                                        { item.name }
                                    </Option>
                                })
                            }
                        </Select>
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