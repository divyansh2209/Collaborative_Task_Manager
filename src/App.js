import './App.css';
import RootLayout from './layout/RootLayout';
import { RouterProvider } from "react-router-dom";
import router from './routes/Root';
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
      <Toaster />
    </div>
  );
}

export default App;
