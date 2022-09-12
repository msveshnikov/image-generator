import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import logo from "./assets/images/logo.png";

const useStyles = makeStyles((theme) => ({
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6, 0),
    },
}));

export default function Copyright() {
    const classes = useStyles();
    return (
        <footer className={classes.footer}>
            <Typography variant="body2" color="textSecondary" align="center">
                {"Copyright © UI+Wrapper "}
                <Link color="inherit" target="_blank" href="https://blog.maxsoft.tk/">
                    MaxSoft,
                </Link>
                {" 2022"}
                <img
                    style={{ width: "24px", height: "24px", marginLeft: "3px", marginRight: "3px" }}
                    src={logo}
                    alt="maxsoft"
                />
                <br />
            </Typography>
            <Typography variant="body2" color="textSecondary" align="center">
                {"Copyright ©  "}
                <Link color="inherit" target="_blank" href="https://stability.ai/blog/stable-diffusion-public-release">
                    Stable Diffusion
                </Link>
            </Typography>
        </footer>
    );
}
