import { Card, Form, Input, Button, message } from 'antd'
import { useDispatch } from 'react-redux'
import { getToken } from '@/store/module/user'
import { useNavigate } from 'react-router-dom'

import logo from '@/assets/logo.png'
import './index.scss'


const Login = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    // 点击登录按钮时触发，用于获取表单数据
    const onFinish = async(formValue) => {
        dispatch(getToken(formValue))
        .then(() => {
            navigate('/')
            message.success('登录成功')
        })
        .catch(() => {
            message.error('登录异常')
        })
    }
    return (
        <div className="login">
            <Card className="login-container">
                <img className="login-logo" src={logo} alt="" />
                {/* 登录表单 */}
                <Form onFinish={onFinish} validateTrigger={['onBlur']}>
                    <Form.Item
                        name="mobile"
                        rules={[
                            { required: true, message: '请输入手机号' },
                            {
                                pattern: /^1[3-9]\d{9}$/,
                                message: '手机号码格式不对'
                            }
                        ]}
                    >
                        <Input size="large" placeholder="请输入手机号" />
                    </Form.Item>
                    <Form.Item
                        name="code"
                        rules={[
                            { required: true, message: '请输入验证码' },
                        ]}
                    >
                        <Input size="large" placeholder="请输入验证码" maxLength={6} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" size="large" block>
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}

export default Login