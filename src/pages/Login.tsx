
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex items-center justify-center min-h-screen bg-background fade-in">
      <Card className="w-full max-w-md border border-primary/20">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Connexion à TetouanCars
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@tetouancars.ma"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button className="w-full bg-primary hover:bg-primary/90" onClick={(e) => handleLogin(e)}>
            Se connecter
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  // Update the login validation to accept any email and password
  function handleLogin(e) {
    e.preventDefault();
    if (email && password) { // Just check if fields are not empty
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify({ name: "Manager TetouanCars" }));
      navigate("/dashboard");
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur votre tableau de bord",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: "Veuillez remplir tous les champs",
      });
    }
  };
};

export default Login;
