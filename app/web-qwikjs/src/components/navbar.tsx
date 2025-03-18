import { component$ } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';
import cn from 'classnames';
import { Dropdown, Navbar } from 'flowbite-qwik';
import { useUser } from '~/routes/layout';

export default component$(() => {
  const user = useUser();
  const location = useLocation();

  // The following adhoc styles are required to target the navbar list items that are otherwise
  // inaccessible by flowbit-qwik at the moment.
  const styleOverrides = {
    base: '[&>ul]:border [&>ul]:border-gray-300 [&>ul]:shadow-md [&>ul>li>*]:text-gray-700 [&>ul>li>*]:hover:text-black [&>ul>li>*]:text-base [&>ul>li>*]:font-light',
    md: '[&>ul]:md:w-full [&>ul]:md:bg-transparent [&>ul>li>*]:md:text-white [&>ul>li>*]:md:hover:text-white [&>ul>li>*]:md:text-base [&>ul>li>*]:md:font-light [&>ul]:md:border-0 [&>ul]:md:shadow-none',
  };

  return (
    <Navbar
      fluid
      class="fixed z-10 w-full bg-blue-600 text-white shadow-lg text-center"
      theme={{
        link: {
          main: 'bg-transparent',
        },
      }}
    >
      <Navbar.Toggle class="text-white hover:bg-blue-700" />
      <Navbar.Brand tag={Link} href="/">
        <span class="self-center whitespace-nowrap text-xl">Todo App</span>
      </Navbar.Brand>
      {user.value && (
        <div class="flex items-center md:order-2">
          <Dropdown
            as={
              <img
                class="h-8 w-8 rounded-full"
                src="https://avatars.githubusercontent.com/u/32885?v=4&size=64"
                alt="user avatar"
              />
            }
          >
            <Dropdown.Item header>
              <span class="block text-sm">User</span>
              <span class="block truncate text-xs font-medium">user@example.com</span>
            </Dropdown.Item>
            <Dropdown.Item>Dashboard</Dropdown.Item>
            <Dropdown.Item>Settings</Dropdown.Item>
            <Dropdown.Item divider />
            <Dropdown.Item>
              <Navbar.Link href="/logout/">Sign out</Navbar.Link>
            </Dropdown.Item>
          </Dropdown>
        </div>
      )}
      {user.value && (
        <Navbar.Collapse class={cn(styleOverrides.base, styleOverrides.md)}>
          <Navbar.Link href="/" active>
            Home
          </Navbar.Link>
          <Navbar.Link tag="div">
            <Dropdown label="Apps" inline size="l" class="max-w-full">
              <Dropdown.Item>
                <Navbar.Link href="/todos">Todos</Navbar.Link>
              </Dropdown.Item>
            </Dropdown>
          </Navbar.Link>
          <Navbar.Link href="/contact">Contact</Navbar.Link>
          <Navbar.Link href="/about">About</Navbar.Link>
        </Navbar.Collapse>
      )}
      {!user.value && (
        <Navbar.Collapse class={cn(styleOverrides.base, styleOverrides.md)}>
          {location.url.pathname === '/login/' && (
            <Navbar.Link href="/register" active>
              Register
            </Navbar.Link>
          )}
          {location.url.pathname === '/register/' && (
            <Navbar.Link href="/login" active>
              Login
            </Navbar.Link>
          )}
        </Navbar.Collapse>
      )}
    </Navbar>
  );
});
