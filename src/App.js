import { QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { queryClient } from "./utils/http";
import { checkAuthLoader, loginLoader, tokenLoader } from "./utils/auth";
import LoadingPageIndicator from "./components/Indicator/LoadingPageIndicator";
import LoginPage from "./pages/Login/LoginPage";
import ErrorPage from "./pages/Error/ErrorPage";

const ProfilePage = lazy(() => import("./pages/Profile/ProfilePage"));

// Mana pages
const RootPage = lazy(() => import("./pages/RootPage"));
const DashboardPage = lazy(() => import("./pages/Dashboard/DashboardPage"));
const EventPage = lazy(() => import("./pages/Event/EventPage"));
const PersonnelPage = lazy(() => import("./pages/Personnel/PersonnelPage"));
const DivisionPage = lazy(() => import("./pages/Division/DivisionPage"));
const RolePage = lazy(() => import("./pages/Role/RolePage"));
const TimekeepingPage = lazy(() =>
  import("./pages/Timekeeping/TimekeepingPage")
);
const RequestPage = lazy(() => import("./pages/Request/RequestPage"));
const EventTaskPage = lazy(() => import("./pages/Event/EventTaskPage"));

// Staff pages
const ManagerLayout = lazy(() => import("./pages/ManagerLayout"));
const EventStaffPage = lazy(() => import("./pages/Event/EventStaffPage"));
const RequestStaffPage = lazy(() => import("./pages/Request/RequestStaffPage"));
const TimekeepingStaffPage = lazy(() =>
  import("./pages/Timekeeping/TimekeepingStaffPage")
);
const DashboardPageStaff = lazy(() =>
  import("./pages/Dashboard/DashboardPageStaff")
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
    errorElement: <ErrorPage />,
    // loader: loginLoader,
  },
  {
    path: "/manager",
    element: (
      <Suspense fallback={<LoadingPageIndicator />}>
        <RootPage />
      </Suspense>
    ),
    errorElement: <ErrorPage />,
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
        path: "event",
        element: (
          <Suspense fallback={<LoadingPageIndicator />}>
            <EventPage />
          </Suspense>
        ),
      },
      {
        path: "event/:eventId",
        element: <EventTaskPage />,
      },
      {
        path: "personnel",
        element: (
          <Suspense fallback={<LoadingPageIndicator />}>
            <PersonnelPage />
          </Suspense>
        ),
      },
      {
        path: "division",
        element: (
          <Suspense fallback={<LoadingPageIndicator />}>
            <DivisionPage />
          </Suspense>
        ),
      },
      {
        path: "role",
        element: (
          <Suspense fallback={<LoadingPageIndicator />}>
            <RolePage />
          </Suspense>
        ),
      },
      {
        path: "timekeeping",
        element: (
          <Suspense fallback={<LoadingPageIndicator />}>
            <TimekeepingPage />
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
      {
        path: "profile",
        element: (
          <Suspense fallback={<LoadingPageIndicator />}>
            <ProfilePage />
          </Suspense>
        ),
      },
    ],
  },

  //Staff
  {
    path: "/staff",
    element: (
      <Suspense fallback={<LoadingPageIndicator />}>
        <ManagerLayout />
      </Suspense>
    ),
    errorElement: <ErrorPage />,
    // loader: checkAuthLoader,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingPageIndicator />}>
            <EventStaffPage />,
          </Suspense>
        ),
      },
      {
        path: "request",
        element: (
          <Suspense fallback={<LoadingPageIndicator />}>
            <RequestStaffPage />,
          </Suspense>
        ),
      },
      {
        path: "timekeeping",
        element: (
          <Suspense fallback={<LoadingPageIndicator />}>
            <TimekeepingStaffPage />,
          </Suspense>
        ),
      },
      {
        path: "dashboard",
        element: (
          <Suspense fallback={<LoadingPageIndicator />}>
            <DashboardPageStaff />,
          </Suspense>
        ),
      },
    ],
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
