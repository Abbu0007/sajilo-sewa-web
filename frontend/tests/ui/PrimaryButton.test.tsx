import { render, screen } from "@testing-library/react";
import PrimaryButton from "@/components/ui/PrimaryButton";

describe("PrimaryButton", () => {
  it("renders children", () => {
    render(<PrimaryButton>Click</PrimaryButton>);
    expect(screen.getByRole("button", { name: "Click" })).toBeInTheDocument();
  });

  it("is disabled when disabled prop is true", () => {
    render(<PrimaryButton disabled>Save</PrimaryButton>);
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });

  it("uses type submit by default and can switch to button", () => {
    const { rerender } = render(<PrimaryButton>Submit</PrimaryButton>);
    expect(screen.getByRole("button", { name: "Submit" })).toHaveAttribute("type", "submit");

    rerender(<PrimaryButton type="button">Submit</PrimaryButton>);
    expect(screen.getByRole("button", { name: "Submit" })).toHaveAttribute("type", "button");
  });
});