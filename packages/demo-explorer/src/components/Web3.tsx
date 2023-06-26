import React from 'react'
import { Typography, Card, Button } from 'antd'
import { hooks as metamaskHooks, metaMask } from '../context/web3/metaMask'

const Web3: React.FC = () => {
  const metaMaskIsActive = metamaskHooks.useIsActive()

  return (
    <Card title="Web3">
      <Typography>Metamask</Typography>
      {!metaMaskIsActive && (
        <Button onClick={() => metaMask.activate()}>Connect</Button>
      )}
      {metaMaskIsActive && (
        <Button onClick={() => metaMask.resetState()}>Disconnect</Button>
      )}
    </Card>
  )
}

export default Web3
