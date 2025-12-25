export default function useAuth() {

  const role = "admin"; // "candidate","company"

  return {
    isAuthenticated: true,
    role,
    user: { id: "mock-user", role },
  };
}
//***for testing purposes, will change later***