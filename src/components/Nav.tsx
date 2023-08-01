import { Box, List, Stack, Tooltip, Typography } from "@mui/material";
import logo from "../assets/spotify-logo.png";
import { Link } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { FIRST_NAV, SECOND_NAV } from "../constants/UI";
import { forwardRef } from "react";
import { selectUser } from "../features/auth/authSlice";

const style = {
    color: "gray",
    "&:hover": {
        cursor: "pointer",
        color: "white",
    }
};

interface LinkItemProps {
    to: string;
    name: string;
    icon: any;
    current: string;
}

const LinkItem = forwardRef<any, LinkItemProps>((props: LinkItemProps, ref) => {
    const { to, name, icon, current } = props;
    return (
        <div {...props} ref={ref}>
            <Link to={to} style={{ textDecoration: "none" }}>
                <Stack direction="row" spacing={1} paddingX={3} height="40px" sx={current === "true" ? { ...style, color: "white" } : style}>
                    {icon}
                    <Typography><b>{name}</b></Typography>
                </Stack>
            </Link>
        </div>
    );
});

const Nav = ({ currentPage }: { currentPage: string}) => {
    const user = useAppSelector(selectUser);
    const isLoggedIn = user.username.length > 0 && user.code.length > 0;
    const renderedFirstNav = FIRST_NAV.map(navItem => {
        const isCurrentPage = currentPage === navItem.name;
        const icon = isCurrentPage ? navItem.icon.current : navItem.icon.notCurrent;
        const changePathAndBlockEvent = (!isLoggedIn && navItem.name === "Your Library");
        let to = navItem.link;
        if (changePathAndBlockEvent) {
            to = "/login";
        }
        return (
            <li key={navItem.name}>
                <Tooltip title={changePathAndBlockEvent ? "You must log in first" : null} arrow placement="right-start">
                    <LinkItem to={to} name={navItem.name} current={isCurrentPage.toString()} icon={icon} />
                </Tooltip>
            </li>
        )
    });
    const renderedSecondNav = SECOND_NAV.map(navItem => {
        const isCurrent = currentPage === navItem.name;
        let to = navItem.link;
        if (!isLoggedIn) {
            to = "/login";
        }
        return (
            <li key={navItem.name}>
                <Tooltip title={!isLoggedIn ? "You must log in first" : null} arrow placement="right-start">
                    <LinkItem to={to} name={navItem.name} current={isCurrent.toString()} icon={navItem.icon} />
                </Tooltip>
            </li>
        );
    })
    return (
        <Stack height="100%" bgcolor="black">
            <Stack paddingTop={3} height="100%" justifyContent="space-between">
                <Box>
                    <Box paddingX={3} marginBottom={2}>
                        <Link to="/">
                            <img src={logo} alt="logo" width={131} height={40} />
                        </Link>
                    </Box>
                    <List disablePadding>
                        {renderedFirstNav}
                    </List>
                    <List disablePadding sx={{ mt: 3 }}>
                        {renderedSecondNav}
                    </List>
                </Box>
            </Stack>
        </Stack>
    );
}

export default Nav;