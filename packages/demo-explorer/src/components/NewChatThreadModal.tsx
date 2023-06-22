import React, { useState } from 'react'
import {
  Modal,
  Input,
  SelectProps,
  AutoComplete,
  Row,
  Button,
  Col,
  notification,
} from 'antd'
import { QrcodeOutlined } from '@ant-design/icons'
import { useVeramo } from '@veramo-community/veramo-react'
import { IDIDDiscovery } from '@veramo/did-discovery'
import { QrScanner } from '@yudiel/react-qr-scanner'
import parse from 'url-parse'
import { shortId } from '../utils/did'
import { decodeBase64url } from '@veramo/utils'

interface NewChatThreadModalProps {
  visible: boolean
  onCreate: (did: string) => void
  onCancel: () => void
}

const NewChatThreadModal: React.FC<NewChatThreadModalProps> = ({
  visible,
  onCreate,
  onCancel,
}) => {
  const { agent } = useVeramo<IDIDDiscovery>()
  const [options, setOptions] = useState<SelectProps<object>['options']>([])
  const [did, setDid] = useState<string>('')
  const [showQrCodeScanner, setShowQrCodeScanner] = useState<boolean>(false)

  const searchResult = async (query: string) => {
    const response = await agent?.discoverDid({ query })
    const selectOptions: Array<{ value: string; label: any }> = []
    response?.results.forEach((r) => {
      r.matches.forEach((m) => {
        selectOptions.push({
          value: m.did,
          label: (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>{shortId(m.did)}</span>
              <span>{r.provider}</span>
            </div>
          ),
        })
      })
    })
    return selectOptions
  }

  const handleSearch = async (value: string) => {
    setOptions(value ? await searchResult(value) : [])
  }

  const handleQrCodeResult = async (result: string) => {
    const parsed = parse(result, true)
    if ((parsed?.query as any)?._oob) {
      const decoded = decodeBase64url((parsed?.query as any)?._oob)
      try {
        const message = JSON.parse(decoded)
        if (
          message.from &&
          message.type === 'https://didcomm.org/out-of-band/2.0/invitation'
        ) {
          onCreate(message.from)
        }
      } catch (e) {}
    } else {
      onCreate(result)
    }
  }
  return (
    <Modal
      open={visible}
      title="Start new thread"
      okText="Create"
      cancelText="Cancel"
      onCancel={() => {
        setShowQrCodeScanner(false)
        onCancel()
      }}
      onOk={() => {
        onCreate(did)
      }}
    >
      {!showQrCodeScanner && (
        <Row>
          <AutoComplete
            dropdownMatchSelectWidth={true}
            options={options}
            onSelect={(e) => setDid(e)}
            onSearch={handleSearch}
            style={{ flex: 1 }}
          >
            <Input
              value={did}
              placeholder="Enter a DID"
              onChange={(e) => setDid(e.target.value)}
              style={{
                flex: 1,
                paddingTop: 10,
                paddingBottom: 10,
              }}
            />
          </AutoComplete>
          <Button onClick={() => setShowQrCodeScanner(true)} size="large">
            <QrcodeOutlined />
          </Button>
        </Row>
      )}

      {showQrCodeScanner && (
        <Col>
          <QrScanner
            onDecode={(result) => {
              setShowQrCodeScanner(false)
              setTimeout(() => {
                handleQrCodeResult(result)
              }, 125)
            }}
            onError={(error) => {
              notification.error({ message: error.message })
            }}
          />
        </Col>
      )}
    </Modal>
  )
}

export default NewChatThreadModal
