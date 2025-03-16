import type { JSXChildren, JSXOutput, RenderResult } from '@builder.io/qwik';
import { createDOM } from '@builder.io/qwik/testing';
import { FlowbiteProvider } from 'flowbite-qwik';

/**
 * Renders the given JSX children within a FlowbiteProvider using the provided render function.
 *
 * @param child - The JSX children to be rendered.
 * @param options - An object containing the render function.
 * @param options.render - A function that takes a JSX element and returns a Promise of RenderResult.
 * @returns A Promise that resolves to the result of the render function.
 */
export const renderWithProviders = async (
  child: JSXChildren,
  { render }: { render: (jsxElement: JSXOutput) => Promise<RenderResult> },
) => {
  return render(<FlowbiteProvider>{child}</FlowbiteProvider>);
};

/**
 * Asynchronously creates a DOM environment for testing purposes.
 *
 * This function uses `createDOM` to set up a DOM environment and returns
 * an object containing `screen`, `renderWithProviders`, and `render`.
 *
 * @example
 * ```
 * const { screen, renderWithProviders, render } = await getDOM();
 * // You can now use `screen` for querying elements and `renderWithProviders`
 * // to render components with necessary providers.
 * await renderWithProviders(<MyComponent />, { render });
 * expect(screen.outerHTML).toContain("some text");
 *
 * ```
 */
export const getDOM = async () => {
  const { screen, render } = await createDOM();
  return { screen, renderWithProviders, render };
};
