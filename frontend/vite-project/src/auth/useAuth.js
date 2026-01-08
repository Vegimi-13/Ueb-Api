import { useAuthContext } from "./AuthContext";
export default function useAuth() {
  return useAuthContext();
  // const role = "admin"; // "candidate","company"
  // //const role = "candidate"; 
  // //const role = "company"; 

  // return {
  //   isAuthenticated: true,
  //   role,
  //   user: { id: "mock-user", role },
  // };

}
//***for testing purposes, will change later***