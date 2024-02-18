import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Suspense, lazy, useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { queryClient } from "./utils/http";
import { checkAuthLoader, loginLoader } from "./utils/auth";
import LoadingPageIndicator from "./components/Indicator/LoadingPageIndicator";

import LoginPage from "./pages/Login/LoginPage";
import ErrorPage from "./pages/Error/ErrorPage";

const ProfilePage = lazy(() => import("./pages/Profile/ProfilePage"));

// Mana pages
const ManagerLayout = lazy(() => import("./pages/ManagerLayout"));
const DashboardPage = lazy(() => import("./pages/Dashboard/DashboardPage"));
const EventLayout = lazy(() => import("./pages/Event/EventLayout"));
const EventPage = lazy(() => import("./pages/Event/EventPage"));
const PersonnelPage = lazy(() => import("./pages/Personnel/PersonnelPage"));
const EventTaskPage = lazy(() => import("./pages/Event/EventTaskPage"));
const EventBudgetPage = lazy(() => import("./pages/Event/EventBudgetPage"));
const EventSubTaskPage = lazy(() => import("./pages/Event/EventSubTaskPage"));
const EventCreationPage = lazy(() => import("./pages/Event/EventCreationPage"));
const DivisionPage = lazy(() => import("./pages/Division/DivisionPage"));
const ChatPage = lazy(() => import("./pages/Chat/ChatPage"));
const TimekeepingPage = lazy(() =>
  import("./pages/Timekeeping/TimekeepingPage")
);
const RequestPage = lazy(() => import("./pages/Request/RequestPage"));
const NotificationPage = lazy(() =>
  import("./pages/Notification/NotificationPage")
);
const CustomerLayout = lazy(() => import("./pages/Customer/CustomerLayout.js"));
const CustomerPage = lazy(() => import("./pages/Customer/CustomerPage.js"));
const EventAssignDivisionPage = lazy(() =>
  import("./pages/Event/EventAssignDivisionPage.js")
);

// Staff pages
const StaffLayout = lazy(() => import("./pages/StaffLayout"));
const EventStaffPage = lazy(() => import("./pages/Event/EventStaffPage"));
const TimekeepingStaffPage = lazy(() =>
  import("./pages/Timekeeping/TimekeepingStaffPage")
);
const DashboardPageStaff = lazy(() =>
  import("./pages/Dashboard/DashboardPageStaff")
);
const TaskPageStaff = lazy(() => import("./pages/Task/MyTaskPageStaff"));
const StaffChatPage = lazy(() => import("./pages/Chat/StaffChatPage.js"));

// Admin pages
const AdminLayout = lazy(() => import("./pages/AdminLayout.js"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
    errorElement: <ErrorPage />,
    loader: loginLoader,
  },
  {
    path: "/manager",
    id: "manager",
    element: (
      <Suspense fallback={<LoadingPageIndicator />}>
        <ManagerLayout />
      </Suspense>
    ),
    errorElement: <ErrorPage />,
    loader: checkAuthLoader, // Is call whenever a new navigation trigger
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingPageIndicator title="trang chủ" />}>
            {/* <DashboardPage /> */}
            <DashboardPageStaff />
          </Suspense>
        ),
      },
      {
        path: "event",
        element: (
          <Suspense fallback={<LoadingPageIndicator title="trang sự kiện" />}>
            <EventLayout />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: <EventPage />,
          },
          {
            path: ":eventId",
            element: (
              <Suspense
                fallback={<LoadingPageIndicator title="thông tin sự kiện" />}
              >
                <EventTaskPage />
              </Suspense>
            ),
          },
          {
            path: ":eventId/:taskId",
            element: (
              <Suspense
                fallback={
                  <LoadingPageIndicator title="công việc của sự kiện" />
                }
              >
                <EventSubTaskPage />
              </Suspense>
            ),
          },
          {
            path: ":eventId/budget",
            element: (
              <Suspense
                fallback={
                  <LoadingPageIndicator title="ngân sách của sự kiện" />
                }
              >
                <EventBudgetPage />
              </Suspense>
            ),
          },
          {
            path: ":eventId/division",
            element: (
              <Suspense
                fallback={<LoadingPageIndicator title="danh sách bộ phận" />}
              >
                <EventAssignDivisionPage />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "chat",
        element: (
          <Suspense fallback={<LoadingPageIndicator />}>
            <ChatPage />
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
      {
        path: "notification",
        element: (
          <Suspense fallback={<LoadingPageIndicator />}>
            <NotificationPage />
          </Suspense>
        ),
      },
      {
        path: "customer",
        element: (
          <Suspense
            fallback={
              <LoadingPageIndicator title="Trang thông tin khách hàng" />
            }
          >
            <CustomerLayout />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense
                fallback={
                  <LoadingPageIndicator title="Trang yêu cầu khách hàng" />
                }
              >
                <CustomerPage />
              </Suspense>
            ),
          },
          {
            path: "addition",
            element: (
              <Suspense
                fallback={
                  <LoadingPageIndicator title="trang tạo mới sự kiện" />
                }
              >
                <EventCreationPage />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
  {
    path: "/staff",
    id: "staff",
    element: (
      <Suspense fallback={<LoadingPageIndicator />}>
        <StaffLayout />
      </Suspense>
    ),
    errorElement: <ErrorPage />,
    loader: checkAuthLoader,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingPageIndicator />}>
            <EventStaffPage />
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
        path: "timekeeping",
        element: (
          <Suspense fallback={<LoadingPageIndicator />}>
            <TimekeepingStaffPage />
          </Suspense>
        ),
      },
      {
        path: "dashboard",
        element: (
          <Suspense fallback={<LoadingPageIndicator />}>
            <DashboardPageStaff />
          </Suspense>
        ),
      },
      {
        path: "task",
        element: (
          <Suspense fallback={<LoadingPageIndicator />}>
            <TaskPageStaff />
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
      {
        path: "notification",
        element: (
          <Suspense fallback={<LoadingPageIndicator />}>
            <NotificationPage />
          </Suspense>
        ),
      },
      {
        path: "chat",
        element: (
          <Suspense fallback={<LoadingPageIndicator />}>
            <StaffChatPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/administrator",
    id: "administrator",
    element: (
      <Suspense fallback={<LoadingPageIndicator />}>
        <AdminLayout />
      </Suspense>
    ),
    errorElement: <ErrorPage />,
    loader: checkAuthLoader,
    children: [
      {
        index: true,
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
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
