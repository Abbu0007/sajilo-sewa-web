import { render, screen } from "@testing-library/react";
import AuthShell from "@/app/(auth)/_components/AuthShell";
import FeatureTiles from "@/app/(auth)/_components/FeatureTiles";

describe("(auth) components", () => {
  test("FeatureTiles renders all tiles", () => {
    render(<FeatureTiles />);
    expect(screen.getByText("Verified Providers")).toBeInTheDocument();
    expect(screen.getByText("Quick Booking")).toBeInTheDocument();
    expect(screen.getByText("Quality Assured")).toBeInTheDocument();
    expect(screen.getByText("24/7 Support")).toBeInTheDocument();
  });

  test("AuthShell renders left panel and right title/subtitle", () => {
    render(
      <AuthShell
        left={<div>LEFT CONTENT</div>}
        rightTitle="Welcome"
        rightSubtitle="Subtitle here"
        rightImageSrc="/x.png"
        stats={<div>STATS</div>}
        footerBlocks={<div>FOOTER</div>}
      />
    );

    expect(screen.getByText("LEFT CONTENT")).toBeInTheDocument();
    expect(screen.getByText("Welcome")).toBeInTheDocument();
    expect(screen.getByText("Subtitle here")).toBeInTheDocument();
    expect(screen.getByText("STATS")).toBeInTheDocument();
    expect(screen.getByText("FOOTER")).toBeInTheDocument();
  });
});