import Image from "next/image";
import { 
    OrganizationSwitcher, 
    UserButton,
    SignedIn,
    SignedOut,
    SignInButton,  
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";


export const Header = () => {
    return (
        <div className="border-b p-4">
            <div className="flex items-center container mx-auto justify-between">
                <div className="flex items-center gap-x-2">
                    <Image src="/logo.svg" alt="logo" width={"30"} height={"30"} />
                    <h1 className="text-2xl font-bold">QuantumVault</h1>
                </div>
                <div className="flex items-center gap-x-4">
                    <OrganizationSwitcher />
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                    <SignedOut>
                        <SignInButton>
                            <Button>Sign In</Button>
                        </SignInButton>
                    </SignedOut>
                </div>
            </div>
        </div>
    )
}