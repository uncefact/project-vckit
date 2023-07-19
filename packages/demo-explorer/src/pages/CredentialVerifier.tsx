import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useVeramo } from '@veramo-community/veramo-react'
import '@veramo-community/react-components/dist/cjs/index.css'
import { PageContainer } from '@ant-design/pro-components'
import CredentialTabs from '../components/CredentialTabs'
import { ICredentialPlugin, IVerifyResult } from '@veramo/core'
import { Alert, Button, Input, Space, Tabs, Typography, theme } from 'antd'
import { InboxOutlined } from '@ant-design/icons'

const { TextArea } = Input

const CredentialVerifier = () => {
  const { token } = theme.useToken()
  const { agent } = useVeramo<ICredentialPlugin>()
  const [verificationResult, setVerificationResult] = useState<
    IVerifyResult | undefined
  >(undefined)
  const [text, setText] = useState<string>('')
  const [isVerifying, setIsVerifying] = useState<boolean>(false)

  const verify = useCallback(
    async (text: string) => {
      setIsVerifying(true)
      setVerificationResult(undefined)
      try {
        const result = await agent?.verifyCredential({
          credential: JSON.parse(text),
        })
        setVerificationResult(result)
      } catch (e: any) {
        setVerificationResult({
          verified: false,
          error: { message: e.message },
        })
      }
      setIsVerifying(false)
    },
    [agent],
  )

  const onDrop = useCallback(
    (files: File[]) => {
      const reader = new FileReader()
      reader.readAsText(files[0])
      reader.onload = () => {
        verify(reader.result?.toString() || '')
      }
    },
    [verify],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <PageContainer title="Credential Verifier">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Tabs
          items={[
            {
              key: '0',
              label: 'File',
              children: (
                <>
                  <div
                    {...getRootProps()}
                    style={{
                      border: '1px dashed ' + token.colorBorder,
                      borderRadius: token.borderRadius,
                      backgroundColor: token.colorBgContainer,
                      padding: token.padding,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <input {...getInputProps()} />
                    <Typography.Title>
                      {/* @ts-ignore FIXME: why is ts complaining about this? */}
                      <InboxOutlined />
                    </Typography.Title>
                    {isDragActive ? (
                      <Typography.Paragraph>
                        Drop the file here ...
                      </Typography.Paragraph>
                    ) : (
                      <Typography.Paragraph>
                        Drag 'n' drop a file here, or click to select a file
                      </Typography.Paragraph>
                    )}
                  </div>
                </>
              ),
            },
            {
              key: '1',
              label: 'Text',
              children: (
                <Space direction="vertical" style={{ width: '100%' }}>
                  <TextArea
                    rows={4}
                    placeholder="Paste in a Verifiable Credential"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                  <Button
                    type="primary"
                    onClick={() => verify(text)}
                    disabled={text === ''}
                  >
                    Verify
                  </Button>
                </Space>
              ),
            },
          ]}
        />

        {isVerifying && <Alert message={'Verifying'} type="info" showIcon />}
        {verificationResult?.error && (
          <Alert
            message={verificationResult.error.message}
            type="error"
            showIcon
          />
        )}

        {verificationResult?.verified && (
          <Alert message={'Credential valid'} type="success" showIcon />
        )}

        {verificationResult?.verified &&
          verificationResult?.verifiableCredential && (
            <CredentialTabs
              credential={verificationResult?.verifiableCredential}
              hash=""
            />
          )}
      </Space>
    </PageContainer>
  )
}

export default CredentialVerifier
