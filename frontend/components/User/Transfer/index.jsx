// frontend/components/User/Transfer/index.jsx

import React from 'react'
import UserLayout from '../../Layout/UserLayout'
import { Card, Form, Input, InputNumber, Button, Typography } from 'antd'

const { Item } = Form

function Transfer() {
  const onFinish = (values) => {
    console.log('Transfer submit:', values)
  }

  return (
    <UserLayout>
      <Card className="max-w-xl">
        <Typography.Title level={4} className="!mb-4">Transfer Money</Typography.Title>
        <Form layout="vertical" onFinish={onFinish} name="transfer">
          <Item name="to" label="To (email)" rules={[{ required: true, message: 'Recipient email is required' }, { type: 'email', message: 'Enter a valid email' }]}>
            <Input placeholder="recipient@example.com" />
          </Item>
          <Item name="amount" label="Amount" rules={[{ required: true, message: 'Amount is required' }]}> 
            <InputNumber className="w-full" min={1} step={1} addonAfter="$" placeholder="0" />
          </Item>
          <Item>
            <Button type="primary" htmlType="submit">Send</Button>
          </Item>
        </Form>
      </Card>
    </UserLayout>
  )
}

export default Transfer;