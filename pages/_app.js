// pages/_app.js
import "../global-styles/main.css";
import '../global-styles/chat.css';
import '../global-styles/auth.css';

import { Provider, useAtom } from 'jotai';

export default function MyApp({ Component, pageProps }) {
  return (
    <Provider>
      <Component {...pageProps} />
    </Provider>
  )
}