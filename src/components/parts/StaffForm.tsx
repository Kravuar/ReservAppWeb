import React from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";

export default function ServiceForm({
  onSubmit,
}: {
  onSubmit: (subject: string) => Promise<void>;
}) {
  const [subject, setSubject] = React.useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(subject)
      .then(() => {
        setSubject("");
      })
      .catch(() => {});
  };

  return (
    <Card component="form" onSubmit={handleSubmit}>
      <CardContent>
        <TextField
          label="Имя пользователя нового сотрудника"
          variant="outlined"
          fullWidth
          margin="normal"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
      </CardContent>
      <CardActions>
        <Button type="submit" variant="contained" color="success" fullWidth>
          Создать
        </Button>
      </CardActions>
    </Card>
  );
}
