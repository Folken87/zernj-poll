// pages/_app.js
import "../global-styles/main.css";
import '../global-styles/chat.css';

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}