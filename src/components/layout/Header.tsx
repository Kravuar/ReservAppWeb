import React from "react";
import { useOktaAuth } from "@okta/okta-react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Divider,
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import useAuthUser from "../../services/oauth/useOAuthUser";

export interface TabInfo {
  displayName: string;
  route: string;
}

export default function Header({ tabs }: { tabs: TabInfo[] }) {
  const { authState, oktaAuth } = useOktaAuth();
  const user = useAuthUser();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await oktaAuth.signOut();
    handleMenuClose();
  };

  const handleLogin = async () => {
    await oktaAuth.signInWithRedirect();
  };

  const renderLoginButton = () => {
    return (
      <Tooltip title="Войти">
        <IconButton
          edge="end"
          aria-label="login"
          aria-haspopup="true"
          onClick={handleLogin}
          color="inherit"
        >
          <AccountCircleIcon />
        </IconButton>
      </Tooltip>
    );
  };

  const renderUserMenu = () => (
    <>
      <IconButton
        size="large"
        edge="end"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleProfileMenuOpen}
        color="inherit"
      >
        <Avatar sx={{ width: 32, height: 32 }} />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center"
        }}
        keepMounted
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center"
        }}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>{user?.name}</MenuItem>
        <Divider orientation="horizontal" flexItem/>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <MenuList tabs={tabs} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          ReservApp
        </Typography>
        {authState?.isAuthenticated ? renderUserMenu() : renderLoginButton()}
      </Toolbar>
    </AppBar>
  );
}

function MenuList({ tabs }: { tabs: TabInfo[] }) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={handleClick}
      >
        <MenuIcon/>
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center"
        }}
        keepMounted
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center"
        }}
        open={open}
        onClose={handleClose}
      >
        {tabs.map((tab, index) => (
          <MenuItem
            key={index}
            component={Link}
            to={tab.route}
            onClick={handleClose}
          >
            {tab.displayName}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
