import { Link, useNavigate } from 'react-router-dom'
import { Popconfirm, Card, Breadcrumb, Form, Button, Radio, DatePicker, Select } from 'antd'
import locale from 'antd/es/date-picker/locale/zh_CN'
import { Table, Tag, Space } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import img404 from '@/assets/error.png'
import { request } from '@/utils'
import { useEffect, useState } from 'react'
import {getArticleListAPI} from '@/apis/article'

const { Option } = Select
const { RangePicker } = DatePicker

const Article = () => {
    const navigate = useNavigate()
    const columns = [
        {
            title: '封面',
            dataIndex: 'cover',
            width: 120,
            render: cover => {
                return <img src={cover.images[0] || img404} width={80} height={60} alt="" />
            }
        },
        {
            title: '标题',
            dataIndex: 'title',
            width: 220
        },
        {
            title: '状态',
            dataIndex: 'status',
            render: data => <Tag color="green">审核通过</Tag>
        },
        {
            title: '发布时间',
            dataIndex: 'pubdate'
        },
        {
            title: '阅读数',
            dataIndex: 'read_count'
        },
        {
            title: '评论数',
            dataIndex: 'comment_count'
        },
        {
            title: '点赞数',
            dataIndex: 'like_count'
        },
        {
            title: '操作',
            render: data => {
                return (
                    <Space size="middle">
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<EditOutlined />}
                            onClick={() => navigate(`/publish?id=${data.id}`)} />
                        <Popconfirm
                            title="确认删除该条文章吗?"
                            onConfirm={() => delArticle(data)}
                            okText="确认"
                            cancelText="取消"
                        >
                            <Button
                                type="primary"
                                danger
                                shape="circle"
                                icon={<DeleteOutlined />}
                            />
                        </Popconfirm>
                    </Space>
                )
            }
        }
    ]
    // 准备表格body数据
    // const data = [
    //     {
    //         id: '8218',
    //         comment_count: 0,
    //         cover: {
    //             images: [],
    //         },
    //         like_count: 0,
    //         pubdate: '2019-03-11 09:00:00',
    //         read_count: 2,
    //         status: 2,
    //         title: 'wkwebview离线化加载h5资源解决方案'
    //     }
    // ]
    // 设置接收频道列表的变量
    const [channel, setChannel] = useState([])
    // 异步获取频道列表数据
    const getChannelList = async () => {
        const res = await request.get('/channels')
        setChannel(res.data.channels)
    }
    // dom渲染完成只执行一次渲染
    useEffect(() => {
        getChannelList()
    }, [])

    const [article, setArticleList] = useState({
        list: [],
        count: 0
    })

    const [params, setParams] = useState({
        page: 1,
        per_page: 4,
        begin_pubdate: null,
        end_pubdate: null,
        status: null,
        channel_id: null
    })

    
    useEffect(() => {
        async function fetchArticleList() {
            const res = await request.get('/mp/articles', { params })
            const { results, total_count } = res.data
            setArticleList({
                list: results,
                count: total_count
            })
        }
        fetchArticleList()
    }, [params])

    // 获取文章列表
    const [list, setList] = useState([])
    const [count, setCount] = useState(0)

    async function getList(reqData = {}) {
        const res = await getArticleListAPI(reqData)
        setList(res.data.results)
        setCount(res.data.total_count)
    }

    useEffect(() => {
        getList()
    }, [])

    const onFinish = async (formValue) => {
        console.log(formValue)
        // 1. 准备参数
        const { channel_id, date, status } = formValue
        const reqData = {
            status,
            channel_id,
            begin_pubdate: date[0].format('YYYY-MM-DD'),
            end_pubdate: date[1].format('YYYY-MM-DD'),
        }
        // 2. 使用参数获取新的列表
        getList(reqData)
    }

    const pageChange = (page) => {
        // 拿到当前页参数 修改params 引起接口更新
        setParams({
            ...params,
            page
        })
    }

    // 删除回调
    const delArticle = async (data) => {
        await request.delete(`/mp/articles/${data.id}`)
        // 更新列表
        setParams({
            page: 1,
            per_page: 10
        })
    }
    return (
        <div>
            <Card
                title={
                    <Breadcrumb items={[
                        { title: <Link to={'/'}>首页</Link> },
                        { title: '文章列表' },
                    ]} />
                }
                style={{ marginBottom: 20 }}
            >
                <Form initialValues={{ status: '' }} onFinish={onFinish}>
                    <Form.Item label="状态" name="status">
                        <Radio.Group>
                            <Radio value={''}>全部</Radio>
                            <Radio value={0}>草稿</Radio>
                            <Radio value={2}>审核通过</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label="频道" name="channel_id" >
                        <Select placeholder="请选择频道" style={{ width: 200 }} >
                            {channel.map(item => (
                                <Option key={item.id} value={item.id}>
                                    {item.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label="日期" name="date">
                        {/* 传入locale属性 控制中文显示*/}
                        <RangePicker locale={locale}></RangePicker>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ marginLeft: 40 }}>
                            筛选
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
            <Card title={`根据筛选条件共查询到 ${article.count} 条结果：`}>
                <Table rowKey="id" columns={columns} dataSource={article.list} pagination={{
                    current: params.page,
                    pageSize: params.per_page,
                    onChange: pageChange,
                    total: article.count
                }} />
            </Card>
        </div>
    )
}

export default Article