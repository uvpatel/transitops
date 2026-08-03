import { auth } from "@/lib/auth"
import { authClient } from "@/lib/auth-client"
import { headers } from "next/headers"

export default async function ServerComponent() {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if(!session) {
        return <div>Not authenticated</div>
    }
    return (
        <div>
            <h1>Welcome {session.user.name}</h1>
            <button onClick={() => authClient.signOut()}>Sign Out</button>
        </div>
    )
}