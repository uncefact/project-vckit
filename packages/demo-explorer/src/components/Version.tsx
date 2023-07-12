import React from 'react'
import { Typography, Space } from 'antd'
import packageJson from '../../package.json'

const Version: React.FC<{
  versionOnly?: boolean
}> = ({ versionOnly }) => (
  <Space direction="vertical">
    <Typography.Text>v{packageJson.version}</Typography.Text>
    {!versionOnly && (
      <Typography.Text>
        <b>License:</b> {packageJson.license}
      </Typography.Text>
    )}
  </Space>
)

export default Version
