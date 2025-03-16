import { FlowbiteProvider, FlowbiteProviderHeader } from 'flowbite-qwik';

import { component$ } from '@builder.io/qwik';
import { isDev } from '@builder.io/qwik';
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from '@builder.io/qwik-city';
import { RouterHead } from './components/router-head/router-head';

import './global.css';

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Don't remove the `<head>` and `<body>` elements.
   */

  return (
    <QwikCityProvider>
      <head>
        <meta charset="utf-8" />
        {!isDev && <link rel="manifest" href={`${import.meta.env.BASE_URL}manifest.json`} />}
        <RouterHead />
        <FlowbiteProviderHeader />
      </head>
      <body lang="en">
        <FlowbiteProvider theme="blue" toastPosition="bottom-right">
          <RouterOutlet />
        </FlowbiteProvider>
        {!isDev && <ServiceWorkerRegister />}
      </body>
    </QwikCityProvider>
  );
});
