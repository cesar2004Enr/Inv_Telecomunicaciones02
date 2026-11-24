import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./shared/context/AuthProvider";
import AppRouter from "./app/routes/AppRouter";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
