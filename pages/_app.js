// pages/_app.js
import "../global-styles/main.css";
import '../global-styles/chat.css';
import '../global-styles/auth.css';

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}