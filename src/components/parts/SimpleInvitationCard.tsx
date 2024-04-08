import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  CardActions,
  IconButton,
  CardHeader,
} from "@mui/material";
import { InvitationStatus, StaffInvitationDetailed } from "../../domain/Staff";
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
  invitation: StaffInvitationDetailed;
  acceptHandler?: (invitationId: number) => Promise<void>;
  declineHandler: (invitationId: number) => Promise<void>;
}) {
  const [pending, setPending] = useState<boolean>(true);

  useEffect(
    () => setPending(invitation.status === InvitationStatus.WAITING),
    [invitation]
  );

  const handleAccept = () => {
    if (acceptHandler)
      acceptHandler(invitation.id)
        .then(() => setPending(false))
        .catch(() => {});
  };

  const handleDecline = () => {
    declineHandler(invitation.id)
      .then(() => setPending(false))
      .catch(() => {});
  };

  return (
    <Card sx={{ display: "flex", flexDirection: "column", boxShadow: 3 }}>
      <CardHeader
        title={
          <Typography variant="h6" component="div">
            Приглашение для {invitation.sub}
          </Typography>
        }
      />
      <CardContent
        sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <Chip
          label={getReadableStatus(invitation.status)}
          color={
            invitation.status === InvitationStatus.ACCEPTED
              ? "success"
              : invitation.status === InvitationStatus.DECLINED
              ? "error"
              : "info"
          }
          sx={{ mr: 2 }}
        />
        <Typography variant="subtitle1" color="text.secondary" component="div">
          Создано: {invitation.createdAt.toLocalDate().toString()} в{" "}
          {invitation.createdAt.toLocalTime().truncatedTo(ChronoUnit.SECONDS).toString()}
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
