import { render, screen, fireEvent } from "@testing-library/react";
import ProviderDetailsModal from "@/app/client/_components/modals/ProviderDetailsModal";

describe("ProviderDetailsModal", () => {
  test("returns null when open=false or provider=null", () => {
    const { container: c1 } = render(
      <ProviderDetailsModal open={false} provider={{} as any} onClose={() => {}} />
    );
    expect(c1.firstChild).toBeNull();

    const { container: c2 } = render(
      <ProviderDetailsModal open={true} provider={null} onClose={() => {}} />
    );
    expect(c2.firstChild).toBeNull();
  });

  test("renders when open=true and provider exists (after mounted)", async () => {
    const onClose = jest.fn();
    const onToggleFavourite = jest.fn();
    const onBook = jest.fn();

    render(
      <ProviderDetailsModal
        open
        provider={{
          _id: "p1",
          firstName: "Sita",
          lastName: "Karki",
          phone: "98xxxx",
          email: "sita@mail.com",
          profession: "Cleaner",
          serviceSlug: "home-cleaning",
          ratingAvg: 4.5,
          ratingCount: 2,
          startingPrice: 200,
          completedJobs: 5,
        } as any}
        isFavourite
        onToggleFavourite={onToggleFavourite}
        onBook={onBook}
        onClose={onClose}
      />
    );

    // mounted flips true via useEffect; RTL sync render is enough here since our createPortal mock renders inline
    expect(await screen.findByText("Sita Karki")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("toggle favourite"));
    expect(onToggleFavourite).toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: /book now/i }));
    expect(onBook).toHaveBeenCalled();

    fireEvent.click(screen.getByLabelText("close"));
    expect(onClose).toHaveBeenCalled();
  });
});