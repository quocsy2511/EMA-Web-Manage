import { QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/Login/LoginPage";
import RootPage from "./pages/RootPage";
import { queryClient } from "./utils/http";
import ErrorPage from "./pages/Error/ErrorPage";
import { checkAuthLoader, tokenLoader } from "./utils/auth";
import LoadingPageIndicator from "./components/Indicator/LoadingPageIndicator";

const DashboardPage = lazy(() => import("./pages/Dashboard/DashboardPage"));
const EventListPage = lazy(() => import("./pages/Event/EventListPage"));
const EventHistoryPage = lazy(() => import("./pages/Event/EventHistoryPage"));
const PersonnelListPage = lazy(() =>
  import("./pages/Personnel/PersonnelListPage")
);
const PersonnelPositionPage = lazy(() =>
  import("./pages/Personnel/PersonnelPositionPage")
);
const PersonnelDepartmentPage = lazy(() =>
  import("./pages/Personnel/PersonnelDepartmentPage")
);
const RequestPage = lazy(() => import("./pages/Request/RequestPage"));
const ManagerTaskPage = lazy(() => import("./pages/Manager/Task"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootPage />,
    errorElement: <ErrorPage />,
    // loader: tokenLoader,
    // loader: checkAuthLoader, // Is call whenever a new navigation trigger
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingPageIndicator />}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: "event-list",
        element: (
          <Suspense fallback={<LoadingPageIndicator />}>
            <EventListPage />
          </Suspense>
        ),
      },
      {
        path: "event-history",
        element: (
          <Suspense fallback={<LoadingPageIndicator />}>
            <EventHistoryPage />,
          </Suspense>
        ),
      },
      {
        path: "personnel-list",
        element: (
          <Suspense fallback={<LoadingPageIndicator />}>
            <PersonnelListPage />
          </Suspense>
        ),
      },
      {
        path: "personnel-position",
        element: (
          <Suspense fallback={<LoadingPageIndicator />}>
            <PersonnelPositionPage />
          </Suspense>
        ),
      },
      {
        path: "personnel-department",
        element: (
          <Suspense fallback={<LoadingPageIndicator />}>
            <PersonnelDepartmentPage />
          </Suspense>
        ),
      },
      {
        path: "request",
        element: (
          <Suspense fallback={<LoadingPageIndicator />}>
            <RequestPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/manager-task",
    element: (
      <Suspense fallback={<LoadingPageIndicator />}>
        <ManagerTaskPage />
      </Suspense>
    ),
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
