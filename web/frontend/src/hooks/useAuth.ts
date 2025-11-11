import { useUserStore } from "@/store/userStore";

export function useAuth() {
  const { user, isAuthenticated, setUser, logout } = useUserStore();

  return {
    user,
    isAuthenticated,
    setUser,
    logout,
  };
}
