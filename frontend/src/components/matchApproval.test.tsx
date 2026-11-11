import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import MatchSuggestionTable from "./matchSuggestionTable";

vi.mock("@clerk/clerk-react", () => ({ useAuth: () => ({ getToken: async () => "test-token" }) }));
const tutee = { id: "1", first_name: "Test Student", last_name: "One", subjects: [], grade: "3", special_needs: "", priority: false, notes: "" };
const tutor = { id: "abc1234", first_name: "Test Tutor", last_name: "One", subject: [], grade_level_pref: [], priority: false, notes: "" };
const suggestion = { tutor, tutee1: tutee, tutee2: null, tutee3: null, unmatchedTutorId: 1 };
const response = (data: unknown, ok = true) => ({ ok, json: async () => data }) as Response;
const deferred = () => {
  let resolve!: (value: Response) => void;
  const promise = new Promise<Response>((r) => { resolve = r; });
  return { promise, resolve };
};
let approval: ReturnType<typeof deferred>;
let refresh: ReturnType<typeof deferred>;
let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  approval = deferred();
  refresh = deferred();
  let reads = 0;
  fetchMock = vi.fn((url: string, options?: RequestInit) => {
    if (options?.method === "POST") return approval.promise;
    if (url.endsWith("/tutees")) return Promise.resolve(response({ unmatchedTutees: [{ id: 1, tutee_first_name: "Test Student", tutee_last_name: "One" }] }));
    reads++;
    return reads === 1 ? Promise.resolve(response({ matchSuggestions: [suggestion] })) : refresh.promise;
  });
  vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });
const posts = () => fetchMock.mock.calls.filter(([, options]) => options?.method === "POST");

async function selectSuggestion() {
  await screen.findByText("Test Tutor One");
  fireEvent.click(screen.getByRole("radio"));
}

it("disables Approve, ignores double clicks, and removes the item before refetch completes", async () => {
  render(<MatchSuggestionTable />);
  await selectSuggestion();
  const button = screen.getByRole("button", { name: "Approve" });
  act(() => { fireEvent.click(button); fireEvent.click(button); });
  expect((button as HTMLButtonElement).disabled).toBe(true);
  await waitFor(() => expect(posts()).toHaveLength(1));
  await act(async () => approval.resolve(response({ success: true })));
  expect(screen.queryByText("Test Tutor One")).toBeNull();
  await act(async () => refresh.resolve(response({ matchSuggestions: [suggestion] })));
  expect(screen.queryByText("Test Tutor One")).toBeNull();
});

it("keeps the item and allows retry after failure", async () => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  render(<MatchSuggestionTable />);
  await selectSuggestion();
  fireEvent.click(screen.getByRole("button", { name: "Approve" }));
  await act(async () => approval.resolve(response({}, false)));
  expect(await screen.findByRole("alert")).toBeTruthy();
  expect(screen.getByText("Test Tutor One")).toBeTruthy();
  const button = screen.getByRole("button", { name: "Approve" });
  expect((button as HTMLButtonElement).disabled).toBe(false);
  approval = deferred();
  fireEvent.click(button);
  await waitFor(() => expect(posts()).toHaveLength(2));
  await act(async () => approval.resolve(response({ success: true })));
  expect(screen.queryByText("Test Tutor One")).toBeNull();
});

it("also disables and removes custom approvals", async () => {
  render(<MatchSuggestionTable />);
  await screen.findByText("Test Tutor One");
  fireEvent.click(screen.getByRole("button", { name: "Custom Match" }));
  fireEvent.click(within(await screen.findByRole("dialog")).getByRole("radio"));
  const buttons = screen.getAllByRole("button", { name: "Approve" });
  const button = buttons[buttons.length - 1];
  act(() => { fireEvent.click(button); fireEvent.click(button); });
  expect((button as HTMLButtonElement).disabled).toBe(true);
  await waitFor(() => expect(posts()).toHaveLength(1));
  await act(async () => approval.resolve(response({ success: true })));
  expect(screen.queryByText("Test Tutor One")).toBeNull();
  expect(screen.queryByRole("dialog")).toBeNull();
});

it("removes a successful approval immediately while the refresh is pending", async () => {
  render(<MatchSuggestionTable />);
  await selectSuggestion();
  fireEvent.click(screen.getByRole("button", { name: "Approve" }));
  await waitFor(() => expect(posts()).toHaveLength(1));
  await act(async () => approval.resolve(response({ success: true })));
  expect(screen.queryByText("Test Tutor One")).toBeNull();
});
