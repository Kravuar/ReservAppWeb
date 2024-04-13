import React from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  IconButton,
  CardMedia,
  Typography,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { BusinessFormData } from "../../domain/Business";

export default function BusinessForm({
  onSubmit,
}: {
  onSubmit: (business: BusinessFormData) => Promise<void>;
}) {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [picture, setPicture] = React.useState<File | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formData: BusinessFormData = {
      name: name,
      description: description,
    };
    if (picture) formData.picture = picture;
    onSubmit(formData)
      .then(() => {
        setName("");
        setDescription("");
        setPicture(null);
      })
      .catch(() => {});
  };

  const handlePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setPicture(event.target.files[0]);
    }
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
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="picture-input"
          type="file"
          onChange={handlePictureChange}
        />
        {picture && (
          <CardMedia
            component="img"
            image={URL.createObjectURL(picture)}
            sx={{
              height: 200,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          />
        )}
        <label htmlFor="picture-input">
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="span"
          >
            <PhotoCamera sx={{ mr: 2 }} />
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {picture ? picture.name : "Загрузить изображение"}
            </Typography>
          </IconButton>
        </label>
      </CardContent>
      <CardActions>
        <Button type="submit" variant="contained" fullWidth sx={{backgroundColor: "success.dark"}}>
          Создать
        </Button>
      </CardActions>
    </Card>
  );
}
