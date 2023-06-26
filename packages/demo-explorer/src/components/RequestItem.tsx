import React from 'react'
import { Typography } from 'antd'

interface SimpleProps {}

const Simple: React.FC<SimpleProps> = () => {
  return <Typography.Text>Dumb</Typography.Text>
}

export default Simple
