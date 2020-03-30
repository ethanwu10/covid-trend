import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import Spinner from './components/Spinner'
import * as serviceWorker from './serviceWorker'
import './index.css'

import 'typeface-nunito'

import { SWRConfig } from 'swr'
import { ThemeProvider } from 'emotion-theming'
import theme from '@rebass/preset'

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={{
      ...theme,
      fonts: {
        body: 'Nunito, sans-serif',
        heading: 'inherit'
      }
    }}>
      <SWRConfig value={{
        refreshInterval: 10 * 60 * 1000,
        fetcher: (...args) => fetch(...args).then(r => r.json()),
        suspense: true,
        revalidateOnFocus: false
      }}>
        <Suspense fallback={<Spinner />}>
          <App />
        </Suspense>
      </SWRConfig>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
