import React from "react";
import { render, screen } from "@testing-library/react";
import TextInput from "@/components/ui/TextInput";

describe("TextInput", () => {
  test("renders label and placeholder", () => {
    render(<TextInput label="Email" placeholder="Enter email" registration={{ name: "email" }} />);
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
  });

  test("uses type=text by default and accepts custom type", () => {
    const { rerender, container } = render(
      <TextInput label="Email" placeholder="Enter email" registration={{ name: "email" }} />
    );

    // default type
    const emailInput = container.querySelector("input[name='email']") as HTMLInputElement;
    expect(emailInput).toBeTruthy();
    expect(emailInput.getAttribute("type") || "text").toBe("text");

    // custom type
    rerender(<TextInput label="Password" type="password" registration={{ name: "pw" }} />);
    const pwInput = container.querySelector("input[name='pw']") as HTMLInputElement;
    expect(pwInput).toBeTruthy();
    expect(pwInput).toHaveAttribute("type", "password");
  });

  test("shows error message when provided", () => {
    render(<TextInput label="Email" error="Required" registration={{ name: "email" }} />);
    expect(screen.getByText("Required")).toBeInTheDocument();
  });

  test("renders left and right icons", () => {
    render(
      <TextInput
        label="Field"
        registration={{ name: "field" }}
        leftIcon={<span data-testid="left">L</span>}
        rightIcon={<span data-testid="right">R</span>}
      />
    );
    expect(screen.getByTestId("left")).toBeInTheDocument();
    expect(screen.getByTestId("right")).toBeInTheDocument();
  });
});