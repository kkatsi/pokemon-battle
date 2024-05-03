import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.tsx";
import { store } from "./app/store.ts";
import "./assets/global.css";
import GlobalStyle from "./styles/global.styled.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <GlobalStyle />
    <App />
  </Provider>
);
