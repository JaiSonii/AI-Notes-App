import { useState } from "react";
import api from "@/lib/api";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AuthPage({ type, switchTo, setToken }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post(`/auth/${type}`, { email, password });
      if (type === "login") {
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
      } else {
        alert("Registered successfully!");
        switchTo();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-slate-100">
      <Card className="w-[380px]">
        <CardHeader>
          <h2 className="text-2xl font-bold">
            {type === "login" ? "Welcome Back" : "Create Account"}
          </h2>
        </CardHeader>

        <form onSubmit={submit}>
          <CardContent className="space-y-4">
            <Input
              placeholder="you@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button className="w-full" disabled={loading}>
              {loading
                ? "Processing..."
                : type === "login"
                ? "Sign In"
                : "Sign Up"}
            </Button>
          </CardContent>
        </form>

        <CardFooter className="text-sm text-center">
          <span
            className="text-blue-600 cursor-pointer"
            onClick={switchTo}
          >
            {type === "login" ? "Create an account" : "Login instead"}
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}
