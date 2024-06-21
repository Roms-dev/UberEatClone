import { UserContext } from "@/components/UserSessionProvider";
import { useContext } from "react";

export default function useUserSession()
{
    return useContext(UserContext)
};