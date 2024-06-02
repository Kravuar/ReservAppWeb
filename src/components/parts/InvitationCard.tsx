import {
  Card,
  CardContent,
  Typography,
  Chip,
  CardActions,
  IconButton,
} from "@mui/material";
import { InvitationStatus, StaffInvitation } from "../../domain/Staff";
import BusinessCard from "./BusinessCard";
import { useEffect, useState } from "react";
import { Cancel, Check } from "@mui/icons-material";
import { ChronoUnit } from "@js-joda/core";

const getReadableStatus = (status: InvitationStatus) => {
  switch (status) {
    case InvitationStatus.ACCEPTED:
      return "Принято";
    case InvitationStatus.DECLINED:
      return "Отклонено";
    case InvitationStatus.WAITING:
      return "Ожидает";
    default:
      return "Неизвестно";
  }
};

export default function InvitationCard({
  invitation,
  acceptHandler,
  declineHandler,
}: {
  invitation: StaffInvitation;
  acceptHandler?: () => Promise<void>;
  declineHandler: () => Promise<void>;
}) {
  const [pending, setPending] = useState<boolean>(true);

  useEffect(
    () => setPending(invitation.status === InvitationStatus.WAITING),
    [invitation]
  );

  const handleAccept = () => {
    if (acceptHandler)
      acceptHandler()
        .then(() => setPending(false))
        .catch(() => {});
  };

  const handleDecline = () => {
    declineHandler()
      .then(() => setPending(false))
      .catch(() => {});
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        marginBottom: 2,
        boxShadow: 3,
      }}
    >
      {/* Business Details */}
      <BusinessCard business={invitation.business!} />
      {/* Invitation Details */}
      <CardContent
        sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <Chip
          label={getReadableStatus(invitation.status!)}
          color={
            invitation.status === InvitationStatus.ACCEPTED
              ? "success"
              : invitation.status === InvitationStatus.DECLINED
              ? "error"
              : "info"
          }
          sx={{ mt: 1, mr: 2 }}
        />
        {/* Invitation Creation Date */}
        <Typography
          variant="subtitle1"
          color="text.secondary"
          component="div"
          marginTop={1}
        >
          Создано: {invitation.createdAt!.toLocalDate().toString()} в{" "}
          {invitation.createdAt!.toLocalTime().truncatedTo(ChronoUnit.SECONDS).toString()}
        </Typography>
      </CardContent>
      {pending && (
        <CardActions>
          {acceptHandler && (
            <IconButton
              aria-label="accept"
              color="primary"
              onClick={handleAccept}
            >
              <Check />
            </IconButton>
          )}
          <IconButton
            aria-label="decline"
            color="secondary"
            onClick={handleDecline}
          >
            <Cancel />
          </IconButton>
        </CardActions>
      )}
    </Card>
  );
}
