import { MenuDataItem, ProLayout } from '@ant-design/pro-components'
import {
  EyeOutlined,
  UserOutlined,
  SafetyOutlined,
  BarsOutlined,
  InteractionOutlined,
  MessageOutlined,
  SettingOutlined,
  CodeOutlined,
  GlobalOutlined,
  FileProtectOutlined,
} from '@ant-design/icons'
import { Routes, Route, useLocation, Link, Navigate } from 'react-router-dom'
import Connect from '../pages/Connect'
import Identifier from '../pages/Identifier'
import Credentials from '../pages/Credentials'
import Credential from '../pages/Credential'
import Activity from '../pages/Messages'
import Requests from '../pages/Requests'
import Settings from '../pages/Settings'
import Agents from '../pages/Agents'
import Agent from '../pages/Agent'
import Chats from '../pages/Chats'
import { useVeramo } from '@veramo-community/veramo-react'
import CreateResponse from '../components/CreateResponse'
import Statistics from '../pages/Statistics'
import DataGenerator from '../pages/DevTools/DataGenerator'
import SelectSchemaAndIssue from '../pages/DevTools/SelectSchemaAndIssue'
import CreateProfileCredential from '../pages/DevTools/CreateProfileCredential'
import IssueCredential from '../pages/DevTools/IssueCredential'
import CreatePresentation from '../pages/DevTools/CreatePresentation'
import md5 from 'md5'
import AgentDropdown from '../components/AgentDropdown'
import KnownIdentifiers from '../pages/KnownIdentifiers'
import ManagedIdentifiers from '../pages/ManagedIdentifiers'
import CredentialVerifier from '../pages/CredentialVerifier'

const GRAVATAR_URI = 'https://www.gravatar.com/avatar/'

const Layout = () => {
  const { agent } = useVeramo()
  const location = useLocation()

  const availableMethods = agent?.availableMethods() || []
  const currentAgentName = agent?.context?.name || 'No Agent Connected'

  const uri =
    agent?.context?.name &&
    GRAVATAR_URI + md5(agent?.context?.name) + '?s=200&d=retro'

  const mainMenuItems: MenuDataItem = []

  if (availableMethods.includes('dataStoreORMGetVerifiableCredentials')) {
    mainMenuItems.push({
      path: '/statistics',
      name: 'Statistics',
      icon: <EyeOutlined />,
    })
  }
  if (availableMethods.includes('didManagerFind')) {
    mainMenuItems.push({
      path: '/managed-identifiers',
      name: 'Managed identifiers',
      icon: <UserOutlined />,
    })
  }

  if (availableMethods.includes('dataStoreORMGetVerifiableCredentials')) {
    mainMenuItems.push({
      path: '/credentials',
      name: 'Credentials',
      icon: <SafetyOutlined />,
    })
  }

  if (availableMethods.includes('dataStoreORMGetMessages')) {
    mainMenuItems.push({
      path: '/activity',
      name: 'Activity',
      icon: <BarsOutlined />,
    })
    mainMenuItems.push({
      path: '/requests',
      name: 'Requests',
      icon: <InteractionOutlined />,
    })
  }

  if (
    availableMethods.includes('packDIDCommMessage') &&
    availableMethods.includes('sendDIDCommMessage')
  ) {
    mainMenuItems.push({
      path: '/chats/threads',
      name: 'DID Chats',
      icon: <MessageOutlined />,
    })
  }

  if (availableMethods.includes('dataStoreORMGetIdentifiers')) {
    mainMenuItems.push({
      path: '/known-identifiers',
      name: 'Known identifiers',
      icon: <GlobalOutlined />,
    })
  }

  if (availableMethods.includes('verifyCredential')) {
    mainMenuItems.push({
      path: '/credential-verifier',
      name: 'Credential verifier',
      icon: <FileProtectOutlined />,
    })
  }

  mainMenuItems.push({ type: 'divider' })

  if (agent) {
    mainMenuItems.push({
      path: '/developer',
      name: 'Developer tools',
      icon: <CodeOutlined />,
      routes: [
        {
          path: '/developer/data-generator',
          name: 'Data generator',
        },
        {
          path: '/developer/credential-from-schema',
          name: 'Issue credential from schema',
        },
        {
          path: '/developer/issue-profile-credential',
          name: 'Issue profile credential',
        },
        {
          path: '/developer/issue-credential',
          name: 'Issue credential',
        },
        {
          path: '/developer/create-presentation',
          name: 'Create presentation',
        },
      ],
    })
  }

  mainMenuItems.push({
    path: '/settings',
    name: 'Settings',
    icon: <SettingOutlined />,
  })

  return (
    <div
      style={{
        height: '100vh',
      }}
    >
      <ProLayout
        locale="en-US"
        contentWidth="Fixed"
        title="Agent explorer"
        logo={false}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (menuItemProps.isUrl || menuItemProps.children) {
            return defaultDom
          }
          if (menuItemProps.path && location.pathname !== menuItemProps.path) {
            return (
              // handle wildcard route path, for example /slave/* from qiankun
              <Link
                to={menuItemProps.path.replace('/*', '')}
                target={menuItemProps.target}
              >
                {defaultDom}
              </Link>
            )
          }
          return defaultDom
        }}
        route={{
          routes: mainMenuItems,
        }}
        layout="mix"
        avatarProps={{
          src: uri,
          size: 'small',
          title: currentAgentName,
          render: (props, children) => (
            <AgentDropdown>{children}</AgentDropdown>
          ),
        }}
        token={{
          pageContainer: {
            paddingBlockPageContainerContent: 15,
            paddingInlinePageContainerContent: 15,
          },
        }}
      >
        <Routes>
          <Route path="/connect" element={<Connect />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/agent/:id" element={<Agent />} />
          <Route path="/chats/threads/:threadId" element={<Chats />} />
          <Route path="/chats/threads" element={<Chats />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/known-identifiers" element={<KnownIdentifiers />} />
          <Route path="/managed-identifiers" element={<ManagedIdentifiers />} />
          <Route path="/identifier/:id" element={<Identifier />} />
          <Route path="/credentials" element={<Credentials />} />
          <Route path="/credential/:id" element={<Credential />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/credential-verifier" element={<CredentialVerifier />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/requests/sdr/:messageId" element={<CreateResponse />} />
          <Route path="/developer/data-generator" element={<DataGenerator />} />
          <Route
            path="/developer/credential-from-schema"
            element={<SelectSchemaAndIssue />}
          />
          <Route
            path="/developer/issue-profile-credential"
            element={<CreateProfileCredential />}
          />
          <Route
            path="/developer/issue-credential"
            element={<IssueCredential />}
          />
          <Route
            path="/developer/create-presentation"
            element={<CreatePresentation />}
          />
          <Route path="/settings" element={<Settings />} />
          {!agent && (
            <Route path="/" element={<Navigate replace to="/connect" />} />
          )}
        </Routes>
      </ProLayout>
    </div>
  )
}

export default Layout
