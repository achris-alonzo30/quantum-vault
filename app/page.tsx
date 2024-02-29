import { 
  useUser,
  useOrganization,  
} from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { Header } from "@/components/header";
import { UploadFileButton } from "@/components/upload-file-button";
import { FileCardWrapper } from "@/components/file-card-wrapper";




export default function Home() {
  const user = useUser();
  const organization = useOrganization();

  let orgId: string | undefined = undefined;
    if (organization.isLoaded && user.isLoaded) {
        orgId = organization.organization?.id ?? user.user?.id;
    }

  const files = useQuery(api.files.getFiles, orgId ? { orgId } : "skip");
  return (
    <>
      <Header />
      <main className="container mx-auto pt-12 ">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Your Files</h1>
          <UploadFileButton />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files?.map((file) => {
            return (
              <FileCardWrapper key={file._id} file={file} />
            )
          })}
        </div>
      </main>
    </>
  )
}