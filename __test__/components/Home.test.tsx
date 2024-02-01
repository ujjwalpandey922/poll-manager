import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import Home from "@/Components/Home";
import { PollContextProvider } from "@/Context/PollContext";
import { toast } from "sonner";

// Mock the Toaster
jest.mock("sonner");

// Mock the next/navigation module
jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useRouter: jest.fn(),
}));

// setup a new mocking function for push method
const pushMock = jest.fn();

// mock a return value on useRouter
const useRouterMock = jest.spyOn(require("next/navigation"), "useRouter");
useRouterMock.mockImplementation(() => ({
  route: "/",
  pathname: "",
  query: "",
  asPath: "",
  push: pushMock,
  events: {
    on: jest.fn(),
    off: jest.fn(),
  },
  beforePopState: jest.fn(() => null),
  prefetch: jest.fn(() => null),
}));

describe("Home", () => {
  it("renders a heading", () => {
    render(
      <PollContextProvider>
        <Home />
      </PollContextProvider>
    );

    // Check if the welcome heading is rendered
    const welcomeElement = screen.getByText(/Welcome To Poll Manager/i);
    expect(welcomeElement).toBeInTheDocument();
  });

  it("adds and deletes options", () => {
    render(
      <PollContextProvider>
        <Home />
      </PollContextProvider>
    );

    // Simulate changing the question input value
    fireEvent.change(screen.getByLabelText(/Write Your Question/i), {
      target: { value: "Sample Question" },
    });

    // Simulate adding the first option
    fireEvent.click(screen.getByText(/Add Option/i));
    const optionInput = screen.getByPlaceholderText(/Enter Option 1/i);
    fireEvent.change(optionInput, { target: { value: "Option 1" } });

    // Simulate adding the second option
    fireEvent.click(screen.getByText(/Add Option/i));
    fireEvent.change(screen.getByPlaceholderText(/Enter Option 2/i), {
      target: { value: "Option 2" },
    });

    // Check if there are two delete buttons initially
    const deleteButtons = screen.getAllByTestId("delete-option");
    expect(deleteButtons).toHaveLength(2);

    // Simulate clicking the delete button for the first option
    fireEvent.click(deleteButtons[0]);

    // Check if there is only one option remaining
    const remainingOptions = screen.getAllByPlaceholderText(/Enter Option /i);
    expect(remainingOptions).toHaveLength(1);
  });

  it("adds options and question without input", () => {
    render(
      <PollContextProvider>
        <Home />
      </PollContextProvider>
    );

    // Fire Click Event On Add Option Button With Out Any Input In Question
    const voteButton = screen.getByText(/Add Option/i);
    fireEvent.click(voteButton);

    // Check if the toast.warning is called with the correct message
    expect(toast.warning).toHaveBeenCalledWith("Enter Question First");

    // Checking Same Warning for Adding New Options Without Filling Previous One....
    // Simulate changing the question input value
    fireEvent.change(screen.getByLabelText(/Write Your Question/i), {
      target: { value: "Sample Question" },
    });

    // Simulate adding the first option
    fireEvent.click(screen.getByText(/Add Option/i));
    // Clicking add option to create more W/O entering the option value
    fireEvent.click(screen.getByText(/Add Option/i));
    // Again Check if the toast.warning is called with the correct message
    expect(toast.warning).toHaveBeenCalledWith("Options Can Not Be Empty...");

    // Write Value in Option 1 And 2
    const optionInput1 = screen.getByPlaceholderText(/Enter Option 1/i);
    fireEvent.change(optionInput1, { target: { value: "Option 1" } });

    // Add 2nd Option....
    fireEvent.click(screen.getByText(/Add Option/i));

    // Write 2nd Option...
    const optionInput2 = screen.getByPlaceholderText(/Enter Option 2/i);
    fireEvent.change(optionInput2, { target: { value: "Option 2" } });

    // Get Submit Button And Click On It to Reroute to polls/id Page
    fireEvent.click(screen.getByText(/Submit/i));

    // Check if the router.push was called with the correct argument
    expect(pushMock).toHaveBeenCalledWith("/polls/3");
  });
});
