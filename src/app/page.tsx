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
            
        </div>
    )
}