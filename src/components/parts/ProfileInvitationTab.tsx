import { Page } from "../../domain/Page";
import { Box } from "@mui/material";
import CardList from "./CardList";
import InvitationCard from "./InvitationCard";
import { StaffInvitationDetailed } from "../../domain/Staff";

export default function ProfileInvitationTab({
  pageSupplier,
  acceptHandler,
  declineHandler
}: {
  pageSupplier: (page: number) => Promise<Page<StaffInvitationDetailed>>;
  acceptHandler?: (invitationId: number) => Promise<void>;
  declineHandler: (invitationId: number) => Promise<void>;
}) {
  async function handleAccept(invitationId: number): Promise<void> {
    if (acceptHandler)
      return acceptHandler(invitationId)
        .then()
        .catch(() => {});
  }

  async function handleDecline(invitationId: number): Promise<void> {
    return declineHandler(invitationId)
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
            acceptHandler={handleAccept}
            declineHandler={handleDecline}
          />
        )}
      />
    </Box>
  );
}
