import '../styles/global.scss';

import { AppContextProvider } from '../store/AppContext';
import { ContactContextProvider } from 'store/ContactContext';
import Header from 'components/Header/Header';
import Layout from 'components/Layout/Layout';
import MessageList from 'components/MessageList/MessageList';

function MyApp({ Component, pageProps }) {
  return (
    <AppContextProvider>
      <ContactContextProvider>
        <Layout>
          <Header />
          <MessageList />
          <Component {...pageProps} />
        </Layout>
      </ContactContextProvider>
    </AppContextProvider>
  );
}

export default MyApp;
