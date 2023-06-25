import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import Layout from './Layout'
import VerifierLayout from './VerifierLayout'
import { ThemeProvider } from '../context/ThemeProvider'
import { QueryClientProvider, QueryClient } from 'react-query'
import { ChatProvider } from '../context/ChatProvider'
import { VeramoWeb3Provider } from '../context/web3/VeramoWeb3Provider'
import { Auth0ProviderWithNavigate } from '../auth0-provider-with-navigate'
declare global {
  interface Window {
    BASE_URL: string
  }
}

const App = () => {
  const queryClient = new QueryClient()
  const mode = process.env.REACT_APP_MODE;
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {
          <VeramoWeb3Provider>
            <ChatProvider>
              <BrowserRouter>
                <Auth0ProviderWithNavigate>
                  { mode === 'verifier' ? <VerifierLayout /> : <Layout /> }
                </Auth0ProviderWithNavigate>
              </BrowserRouter>
            </ChatProvider>
          </VeramoWeb3Provider>
        }
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
