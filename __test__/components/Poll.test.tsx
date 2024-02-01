import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Poll from "@/Components/Poll";
import { toast } from "sonner"; // Import the toast library you are using

jest.mock("sonner");

describe("Poll component", () => {
  const samplePoll = {
    question: "Sample Question",
    options: ["Option 1", "Option 2"],
    id: "123",
  };

  it("renders poll component with question and options", () => {
    render(<Poll {...samplePoll} />);

    // Check if the question and options are rendered
    const questionElement = screen.getByText(/Q\. Sample Question/i);
    expect(questionElement).toBeInTheDocument();

    const option1Element = screen.getByText(/Option 1/i);
    expect(option1Element).toBeInTheDocument();

    const option2Element = screen.getByText(/Option 2/i);
    expect(option2Element).toBeInTheDocument();
  });

  it("allows user to select an option and vote", () => {
    render(<Poll {...samplePoll} />);

    // Select an option and click the Vote button
    const option1Radio = screen.getByLabelText(/Option 1/i);
    const voteButton = screen.getByText(/Vote/i);

    fireEvent.click(option1Radio);
    fireEvent.click(voteButton);

    // Check if the result heading and count element are rendered
    const resultHeading = screen.getByText(/Result...!!!/i);
    expect(resultHeading).toBeInTheDocument();

    const count1Element = screen.getByText(/100%/i);
    expect(count1Element).toBeInTheDocument();
  });

  afterEach(() => {
    // Clear local storage after each test
    localStorage.clear();
  });

  it("displays result percentages based on votes", async () => {
    // Assuming there are existing votes for this test
    const localStorageKey = `poll_${samplePoll.id}`;
    const storedVotes = [2, 3]; // Sample votes for Option 1 and Option 2
    localStorage.setItem(localStorageKey, JSON.stringify(storedVotes));

    render(<Poll {...samplePoll} />);

    // Check if the result heading is rendered
    const resultHeading = screen.getByText(/Result...!!!/i);
    expect(resultHeading).toBeInTheDocument();

    // Use waitFor to wait for the state to be updated
    await waitFor(() => {
      // Check if the count elements are rendered based on the updated state
      const count1Element = screen.getByText(/40/i);
      expect(count1Element).toBeInTheDocument();

      const count2Element = screen.getByText(/60/i);
      expect(count2Element).toBeInTheDocument();
    });
  });

  it("displays warning if user tries to vote without selecting an option", () => {
    render(<Poll {...samplePoll} />);

    // Click the Vote button without selecting an option
    const voteButton = screen.getByText(/Vote/i);
    fireEvent.click(voteButton);

    // Check if the toast.warning is called with the correct message
    expect(toast.warning).toHaveBeenCalledWith("Select Any Option First...");
  });
});
