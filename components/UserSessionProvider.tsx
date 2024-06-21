import React, { useState } from "react";

export const UserContext = React.createContext<UserContextData>({userId: null, setUserId: () => {}});

interface UserContextData{
    userId: string | null;
    setUserId: (id: string) => void;
}

export default function UserSessionProvider(props: any)
{
    const [userId, setUserId] = useState('');
    return(
        <UserContext.Provider value={{ userId, setUserId }} {...props}/>
        
    )
};