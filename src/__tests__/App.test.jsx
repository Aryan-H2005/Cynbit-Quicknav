import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App.jsx';

let openSpy;
beforeEach(() => { openSpy = vi.spyOn(window, 'open').mockImplementation(() => null); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

const palette = () => screen.queryByRole('dialog');
const input = () => screen.getByRole('combobox');

describe('QuickNav command palette', () => {
  it('opens with Ctrl+K and focuses the input', async () => {
    const user = userEvent.setup(); render(<App />);
    expect(palette()).toBeNull();
    await user.keyboard('{Control>}k{/Control}');
    expect(palette()).not.toBeNull();
    expect(document.activeElement).toBe(input());
  });

  it('opens with Cmd+K', async () => {
    const user = userEvent.setup(); render(<App />);
    await user.keyboard('{Meta>}k{/Meta}');
    expect(palette()).not.toBeNull();
  });

  it('opens from the header button', async () => {
    const user = userEvent.setup(); render(<App />);
    await user.click(screen.getByRole('button', { name: /search pages/i }));
    expect(palette()).not.toBeNull();
  });

  it('filters while typing, case-insensitively', async () => {
    const user = userEvent.setup(); render(<App />);
    await user.keyboard('{Control>}k{/Control}');
    await user.type(input(), 'ABOUT');
    expect(screen.getAllByRole('option')).toHaveLength(1);
    expect(screen.getByRole('option').textContent).toContain('Our Story');
  });

  it('shows a helpful message when nothing matches', async () => {
    const user = userEvent.setup(); render(<App />);
    await user.keyboard('{Control>}k{/Control}');
    await user.type(input(), 'qqqxyz');
    expect(screen.queryAllByRole('option')).toHaveLength(0);
    expect(screen.getByText(/no pages match/i)).toBeTruthy();
  });

  it('moves with arrow keys and opens the selection with Enter', async () => {
    const user = userEvent.setup(); render(<App />);
    await user.keyboard('{Control>}k{/Control}');
    await user.type(input(), 'cynbit studio');
    await user.keyboard('{Enter}');
    expect(openSpy).toHaveBeenCalledWith('https://www.cynbit.in/products#cynbit-studio', '_blank', 'noopener,noreferrer');
    expect(palette()).toBeNull();
  });

  it('ArrowDown changes the selected option', async () => {
    const user = userEvent.setup(); render(<App />);
    await user.keyboard('{Control>}k{/Control}');
    expect(screen.getAllByRole('option')[0].getAttribute('aria-selected')).toBe('true');
    await user.keyboard('{ArrowDown}');
    const options = screen.getAllByRole('option');
    expect(options[0].getAttribute('aria-selected')).toBe('false');
    expect(options[1].getAttribute('aria-selected')).toBe('true');
    await user.keyboard('{ArrowUp}{ArrowUp}');
    expect(screen.getAllByRole('option').at(-1).getAttribute('aria-selected')).toBe('true');
  });

  it('closes with Escape', async () => {
    const user = userEvent.setup(); render(<App />);
    await user.keyboard('{Control>}k{/Control}');
    await user.keyboard('{Escape}');
    expect(palette()).toBeNull();
  });

  it('opens a result on mouse click', async () => {
    const user = userEvent.setup(); render(<App />);
    await user.keyboard('{Control>}k{/Control}');
    await user.type(input(), 'contact');
    await user.click(screen.getAllByRole('option')[0]);
    expect(openSpy).toHaveBeenCalledWith('https://www.cynbit.in/contact', '_blank', 'noopener,noreferrer');
  });

  it('does not react to typing the letter k in a text field', async () => {
    const user = userEvent.setup(); render(<App />);
    await user.type(screen.getByPlaceholderText(/type k here/i), 'kkk');
    expect(palette()).toBeNull();
    expect(screen.getByPlaceholderText(/type k here/i).value).toBe('kkk');
  });

  it('has dialog semantics and returns focus on close', async () => {
    const user = userEvent.setup(); render(<App />);
    const trigger = screen.getByRole('button', { name: /search pages/i });
    await user.click(trigger);
    expect(palette().getAttribute('aria-modal')).toBe('true');
    expect(palette().getAttribute('aria-labelledby')).toBeTruthy();
    await user.keyboard('{Escape}');
    expect(document.activeElement).toBe(trigger);
  });
});
