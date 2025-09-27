import { useState } from "react";
import { Registration } from "@/components/Registration";
import { CasinoDashboard } from "@/components/CasinoDashboard";

interface User {
  name: string;
  phone: string;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleRegister = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <Registration onRegister={handleRegister} />;
  }

  return <CasinoDashboard user={user} onLogout={handleLogout} />;
};

export default Index;