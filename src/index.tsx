import React from "react";
import { createRoot } from "react-dom/client"; 
import "./index.css";
import AppRoutes from "./routes";
import { Provider } from "react-redux";
import store from "./redux/store";
import ErrorBoundary from "./components/ErrorBoundary";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container); 

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <AppRoutes />
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
);
