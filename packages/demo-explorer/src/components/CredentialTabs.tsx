import React from 'react'
import { Button, Row, Tabs } from 'antd'
import { VerifiableCredential as Vcred } from '@veramo/core'
import { VerifiableCredential } from '@veramo-community/react-components'
import CredentialInfo from './CredentialInfo'
import JsonBlock from './Json'
import { getIssuerDID } from '../utils/did'
import IdentifierProfile from './IdentifierProfile'
import { EllipsisOutlined } from '@ant-design/icons'
import { formatRelative } from 'date-fns'
import { ProCard } from '@ant-design/pro-components'
import CredentialActionsDropdown from './CredentialActionsDropdown'
import CredentialRender from './CredentialRender'

interface CredentialTabsProps {
  credential: Vcred
  hash: string
}

const CredentialTabs: React.FC<CredentialTabsProps> = ({
  credential,
  hash,
}) => {
  return (
    <Tabs
      items={[
        {
          key: '0',
          label: 'Pretty',
          children: (
            <ProCard
              title={<IdentifierProfile did={getIssuerDID(credential)} />}
              extra={
                <Row align={'middle'}>
                  <div>
                    {formatRelative(
                      new Date(credential.issuanceDate),
                      new Date(),
                    )}
                  </div>{' '}
                  <CredentialActionsDropdown credential={credential}>
                    <Button type="text">
                      {/* @ts-ignore FIXME: why is ts complaining about this? */}
                      <EllipsisOutlined />
                    </Button>
                  </CredentialActionsDropdown>
                </Row>
              }
            >
              <VerifiableCredential credential={credential} />
            </ProCard>
          ),
        },
        {
          key: '1',
          label: 'Info',
          children: <CredentialInfo credential={credential} />,
        },
        {
          key: '2',
          label: 'Data',
          children: <JsonBlock title="Raw JSON" data={credential} />,
        },
        {
          key: '3',
          label: 'Rendered',
          children: <CredentialRender credential={credential} hash={hash} />,
        },
      ]}
    />
  )
}

export default CredentialTabs
