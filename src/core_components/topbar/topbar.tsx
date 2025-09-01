import React from "react";
import { AppBar, Toolbar, Typography, Box, Link, Button, IconButton, Tooltip } from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { getSession } from "@/core_components/auth/getSession";
import FeatureGate from "@/core_components/feature_flags/FeatureGate";
import SignOutButton from "./SignOutButton";

export const dynamic = "force-dynamic";

export default async function TopBar() {
    const session = await getSession();
    return (
        <AppBar position="sticky" color="transparent" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: 'black' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

                    <Link href="/" underline="none" color="inherit"><Typography variant="h6" component="div">SSR-POC</Typography></Link>
                    <Link href="/categories" underline="none" color="inherit">Categories</Link>
                    <FeatureGate flag="shirts">
                        <Link href="/cloths" underline="none" color="inherit">Cloths</Link>
                    </FeatureGate>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {session ? (

                        <>
                            <Typography variant="body2">{session.username}</Typography>
                            <SignOutButton />
                        </>
                    ) : (
                        <Button component={Link} href="/sign-in" color="inherit" size="small">Sign in</Button>
                    )}
                    <Tooltip title="Cart">
                        <IconButton component={Link} href="/cart" color="inherit" size="small" aria-label="cart">
                            <ShoppingCartOutlinedIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
