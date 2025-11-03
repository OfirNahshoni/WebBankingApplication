// frontend/components/User/index.jsx

import React from 'react'
import UserLayout from '../../Layout/UserLayout'
import { Card, Statistic, Table, Typography } from 'antd'

function Dashboard() {
  const columns = [
    { title: '#', dataIndex: 'key', key: 'key', width: 80 },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    { title: 'To', dataIndex: 'to', key: 'to' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
  ];

  const dataSource = [
    { key: 1, amount: '$200', to: 'john@gmail.com', status: 'approved' },
    { key: 2, amount: '$150', to: 'mary@gmail.com', status: 'sent' },
    { key: 3, amount: '$50', to: 'alex@gmail.com', status: 'rejected' },
  ];

  return (
    <UserLayout>
      <div className="space-y-6">
        <Card>
          <Statistic title="Your balance is" value={5000} prefix={<span>$</span>} precision={0} />
        </Card>

        <div>
          <Typography.Title level={5} className="!mb-3">Transactions Table:</Typography.Title>
          <Table columns={columns} dataSource={dataSource} pagination={false} />
        </div>
      </div>
    </UserLayout>
  )
}

export default Dashboard;
