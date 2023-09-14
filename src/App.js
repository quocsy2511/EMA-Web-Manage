import { QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/Login/LoginPage";
import RootPage from "./pages/RootPage";
import { queryClient } from "./utils/http";

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

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootPage />,
    children: [
      {
        path: "/dashboard",
        element: (
          <Suspense fallback={<p>nguuuuuuuuuuuuuuuuu</p>}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: "/event-list",
        element: (
          <Suspense fallback={<p>nguuuuuuuuuuuuuuuuu</p>}>
            <EventListPage />
          </Suspense>
        ),
      },
      {
        path: "/event-history",
        element: (
          <Suspense fallback={<p>nguuuuuuuuuuuuuuuuu</p>}>
            <EventHistoryPage />,
          </Suspense>
        ),
      },
      {
        path: "/personnel-list",
        element: (
          <Suspense fallback={<p>nguuuuuuuuuuuuuuuuu</p>}>
            <PersonnelListPage />
          </Suspense>
        ),
      },
      {
        path: "/personnel-position",
        element: (
          <Suspense fallback={<p>nguuuuuuuuuuuuuuuuu</p>}>
            <PersonnelPositionPage />
          </Suspense>
        ),
      },
      {
        path: "/personnel-department",
        element: (
          <Suspense fallback={<p>nguuuuuuuuuuuuuuuuu</p>}>
            <PersonnelDepartmentPage />
          </Suspense>
        ),
      },
      {
        path: "/request",
        element: (
          <Suspense fallback={<p>nguuuuuuuuuuuuuuuuu</p>}>
            <RequestPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  // {
  //   path: "/product",
  //   element: <ProductPage />,
  //   errorElement: <ErrorPage />,
  //   children: [
  //     {
  //       // path: "/",
  //       index: true,
  //       element: <Ngu />,
  //       errorElement: <ErrorPage />,
  //     },
  //     {
  //       path: "detail",
  //       element: <Ngu1 />,
  //       children: [
  //         {
  //           path: "sub-detail",
  //           element: <Detail1 />
  //         }
  //       ],
  //     },
  //   ],
  // },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
