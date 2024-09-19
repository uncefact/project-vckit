import React, { CSSProperties } from 'react'
import { Card } from 'antd'

interface JsonBlockProps {
  title: string
  data: any
  isLoading?: boolean
}

const preStyle: CSSProperties = {
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-all',
}

const JsonBlock: React.FC<JsonBlockProps> = ({ title, data, isLoading }) => {
  return (
    <Card title={title} loading={isLoading}>
      <code>
        <pre style={preStyle}>{data && JSON.stringify(data, null, 2)}</pre>
      </code>
    </Card>
  )
}

export default JsonBlock
