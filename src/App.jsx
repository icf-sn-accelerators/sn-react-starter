import { lazy, Suspense } from 'react';
import {
  Link,
  Outlet,
  Route,
  RouterProvider,
  createHashRouter,
  createRoutesFromElements,
} from 'react-router-dom';

const BasicForm = lazy(() =>
  import(/* webpackChunkName: "BasicForm" */ '@/components/BasicForm')
);
const BasicList = lazy(() =>
  import(/* webpackChunkName: "BasicList" */ '@/components/BasicList')
);

function Form() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BasicForm />
    </Suspense>
  );
}

function List() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BasicList />
    </Suspense>
  );
}

const router = createHashRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="form" element={<Form />} />
      <Route path="list" element={<List />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="*" element={<NoMatch />} />
    </Route>
  )
);

export default function App() {
  return (
    <div>
      <h1>Basic Example</h1>

      <p>
        This example demonstrates some of the core features of React Router including
        nested <code>&lt;Route&gt;</code>s, <code>&lt;Outlet&gt;</code>s,{' '}
        <code>&lt;Link&gt;</code>s, and using a &quot;*&quot; route (Aka &quot;splat
        route&quot;) to render a &quot;not found&quot; page when someone visits an
        unrecognized URL.
      </p>

      <RouterProvider router={router} />
    </div>
  );
}

function Layout() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/form">Basic Form</Link>
          </li>
          <li>
            <Link to="/list">Basic List</Link>
          </li>
          <li>
            <Link to="/nothing-here">Nothing Here</Link>
          </li>
        </ul>
      </nav>
      <hr />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

function Home() {
  return (
    <>
      <h2>Home</h2>
      <p>Welcome</p>
    </>
  );
}

function About() {
  return (
    <>
      <h2>About</h2>
      <p>About this site.</p>
    </>
  );
}

function Dashboard() {
  return (
    <>
      <h2>Dashboard</h2>
      <p>This shows reports</p>
    </>
  );
}

function NoMatch() {
  return (
    <>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page.</Link>
      </p>
    </>
  );
}
