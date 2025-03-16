import type { JSXChildren, JSXOutput, RenderResult } from '@builder.io/qwik';
import { createDOM } from '@builder.io/qwik/testing';
import { FlowbiteProvider } from 'flowbite-qwik';

export const renderWithProviders = async (
  child: JSXChildren,
  { render }: { render: (jsxElement: JSXOutput) => Promise<RenderResult> },
) => {
  return render(<FlowbiteProvider>{child}</FlowbiteProvider>);
};

export const getDOM = async () => {
  const { screen, render } = await createDOM();
  return { screen, renderWithProviders, render };
};
