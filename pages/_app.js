import '../styles/globals.css'
import { DataProvider } from '../store/GlobalState'
import Layout from '../components/Layout'

function MyApp({ Component, pageProps }) {
  return (
    <DataProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </DataProvider>
  )
}

export default MyApp
