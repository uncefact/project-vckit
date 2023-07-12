import React from 'react'
import { Card } from 'antd'

interface JsonBlockProps {
  title: string
  data: any
  isLoading?: boolean
}

const JsonBlock: React.FC<JsonBlockProps> = ({ title, data, isLoading }) => {
  return (
    <Card title={title} loading={isLoading}>
      <code>
        <pre>{data && JSON.stringify(data, null, 2)}</pre>
      </code>
    </Card>
  )
}

export default JsonBlock
