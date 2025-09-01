"use client";
import { Box, Button, Paper, Stack, TextField, Typography, Alert, LinearProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function SignInPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body?.message || "Sign in failed");
        return;
      }
      router.push("/");
      router.refresh();
    });
  }

  return (
    <Box sx={{ minHeight: '70dvh', display: 'grid', placeItems: 'center', px: 2 }}>
      {isPending && <LinearProgress sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1300, height: 2 }} />}
      <Paper elevation={4} sx={{ width: '100%', maxWidth: 420, p: 4, borderRadius: 3 }}>
        <Stack component="form" onSubmit={onSubmit} spacing={2}>
          <Typography variant="h6" textAlign="center">Sign in</Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} required autoFocus />
          <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" variant="contained" disabled={isPending}>Sign in</Button>
        </Stack>
      </Paper>
    </Box>
  );
}
