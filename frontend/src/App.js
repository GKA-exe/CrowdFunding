import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./Components/RootLayout/RootLayout";
import Homepage from "./Components/HomePage/HomePage";
import CampaignEnrollment from "./Components/Enrollment/CampaignEnrollment/CampaignEnrollmentForm";
import Register from "./Components/Register/Register";
import Login from "./Components/Login/Login";
import AdminDashboard from "./Components/AdminDashboard/AdminDashboard";
import AdminVerify from "./Components/AdminVerify/AdminVerify";
import AllCampaigns from "./Components/AllCampaigns/AllCampaigns";
import VerifyOtp from "./Components/VerifyOtp/VerifyOtp";
//import AllCampaigns from './Components/AllCampaigns/AllCampaigns';

function App() {
  let browserRouter = createBrowserRouter([
    {
      path: "",
      element: <RootLayout />,
      children: [
        {
          path: "",
          element: <Homepage />,
        },
        {
          path: "create-campaign",
          element: <CampaignEnrollment />,
        },
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "admin-dashboard",
          element: <AdminDashboard />,
        },
        {
          path: "admin/campaign/:id",
          element: <AdminVerify />,
        },
        {
          path: "campaigns",
          element: <AllCampaigns />,
        },
        {
          path:"authentication",
          element:<VerifyOtp/>
        }
      ],
    },
  ]);

  return (
    <div className="App">
      <RouterProvider router={browserRouter} />
    </div>
  );
}

export default App;
