// src/utils/auth.ts
export const setAdmin = (admin: any) => {
    localStorage.setItem("admin", JSON.stringify(admin));
  };
  
  export const getAdmin = () => {
    const admin = localStorage.getItem("admin");
    return admin ? JSON.parse(admin) : null;
  };
  
  export const logoutAdmin = () => {
    localStorage.removeItem("admin");
  };
  