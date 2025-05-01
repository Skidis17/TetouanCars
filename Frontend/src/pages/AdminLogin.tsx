// src/pages/AdminLogin.tsx
import { useState } from "react";
import { loginAdmin } from "../services/api";
import { setAdmin } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await loginAdmin(email, password);
      if (res.success) {
        setAdmin(res.admin);
        navigate("/admin/dashboard"); // Redirige vers dashboard
      } else {
        setError("Email ou mot de passe incorrect.");
      }
    } catch (err: any) {
      setError(err.message || "Erreur de connexion");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form className="bg-white p-6 rounded shadow-md w-80" onSubmit={handleLogin}>
        <h2 className="text-2xl font-bold mb-4">Connexion Admin</h2>

        {error && <div className="text-red-500 mb-2">{error}</div>}

        <input
          type="email"
          placeholder="Email"
          className="border w-full p-2 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          className="border w-full p-2 mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white w-full p-2 rounded hover:bg-blue-600"
        >
          Connexion
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
