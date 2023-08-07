import './App.css';
import { QrCodeDocumentWrapper } from './components/QrCodeDocumentWrapper';

/**
 * The App component is the entry point of the application. It is responsible for render the components as the demo page.
 *
 */

function App() {
  const qrCodeValue =
    'http://localhost:4200/verify?q=%7B%22payload%22%3A%7B%22uri%22%3A%22http%3A%2F%2Flocalhost%3A3332%2Fencrypted-storage%2Fencrypted-data%2Ff0754961-d831-411e-8596-786bf9a01aa2%22%2C%22key%22%3A%22ec6065ccf59c8cf466b23ca666813de69238c1f54eff927fa6f04316e55a3fd3%22%7D%7D';
  const doc = '<h1>hello world</h1>';

  return (
    <div className="App">
      <QrCodeDocumentWrapper qrCodeValue={qrCodeValue}>
        <div dangerouslySetInnerHTML={{ __html: doc }}></div>
      </QrCodeDocumentWrapper>
    </div>
  );
}

export default App;
