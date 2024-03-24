import { Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ErrorPage({ message }: { message?: string }) {
  const navigate = useNavigate();

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Typography component="h1" variant="h4" align="center">
        Что-то пошло не так...
      </Typography>
      {message && (
        <Typography component="h2" variant="h4" align="center">
          {message}
        </Typography>
      )}
      <Button onClick={handleBackButtonClick} color="primary">
        Вернуться
      </Button>
    </Container>
  );
}
