import React from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  CardMedia
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { BusinessFormData } from "../../domain/Business";
import { Box } from "@mui/system";

export default function BusinessForm({
  onSubmit,
}: {
  onSubmit: (business: BusinessFormData) => Promise<void>;
}) {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [picture, setPicture] = React.useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formData: BusinessFormData = {
      name: name,
      description: description,
      pictureUrl: picture
    };
    onSubmit(formData)
      .then(() => {
        setName("");
        setDescription("");
        setPicture("");
      })
      .catch(() => {});
  };

  return (
    <Card component="form" onSubmit={handleSubmit}>
      <CardContent>
        <TextField
          label="Название"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          label="Описание"
          variant="outlined"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Box flexDirection="row">
          <PhotoCamera sx={{ mr: 2 }} />
          <TextField
            label="Изображение"
            variant="outlined"
            fullWidth
            margin="normal"
            value={picture}
            onChange={(e) => setPicture(e.target.value)}
          />
        </Box>
        {picture && (
          <CardMedia
            component="img"
            image={picture}
            sx={{
              height: 200,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          />
        )}
      </CardContent>
      <CardActions>
        <Button type="submit" variant="contained" fullWidth sx={{backgroundColor: "success.dark"}}>
          Создать
        </Button>
      </CardActions>
    </Card>
  );
}
