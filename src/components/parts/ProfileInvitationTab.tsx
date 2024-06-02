import { Page } from "../../domain/Page";
import { Box } from "@mui/material";
import CardList from "./CardList";
import InvitationCard from "./InvitationCard";
import { StaffInvitation } from "../../domain/Staff";

export default function ProfileInvitationTab({
  pageSupplier,
  acceptHandler,
  declineHandler
}: {
  pageSupplier: (page: number) => Promise<Page<StaffInvitation>>;
  acceptHandler?: (invitation: StaffInvitation) => Promise<void>;
  declineHandler: (invitation: StaffInvitation) => Promise<void>;
}) {
  async function handleAccept(invitation: StaffInvitation): Promise<void> {
    if (acceptHandler)
      return acceptHandler(invitation)
        .then()
        .catch(() => {});
  }

  async function handleDecline(invitation: StaffInvitation): Promise<void> {
    return declineHandler(invitation)
      .then()
      .catch(() => {});
  }

  return (
    <Box display="flex" flexDirection="column">
      <CardList
        pageSupplier={pageSupplier}
        CardComponent={(props) => (
          <InvitationCard
            invitation={props.item}
            acceptHandler={() => handleAccept(props.item)}
            declineHandler={() => handleDecline(props.item)}
          />
        )}
      />
    </Box>
  );
}
