import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOrganization, useUser } from "@clerk/nextjs";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Dialog,
    DialogTitle,
    DialogHeader,
    DialogTrigger,
    DialogContent,
    DialogDescription,

} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react";





const formSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }).max(100),
    file: z.custom<FileList>((val) => val instanceof FileList, "File is required").refine((files) => files.length > 0, "File is required"),
})
export const UploadFileButton = () => {
    const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);

    const user = useUser();
    const organization = useOrganization();

    const { toast } = useToast();

    const createFile = useMutation(api.files.createFile);
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            file: undefined,
        },
    })

    const fileRef = form.register("file")

    let orgId: string | undefined = undefined;
    if (organization.isLoaded && user.isLoaded) {
        orgId = organization.organization?.id ?? user.user?.id;
    }

    const onSubmit = async (data: z.infer<typeof formSchema>) => {

        if (!orgId) return;

        const postUrl = await generateUploadUrl();

        const fileType = data.file[0].type;

        const result = await fetch(postUrl, {
            method: "POST",
            headers: {
                "Content-Type": fileType
            },
            body: data.file[0],
        });

        const { storageId } = await result.json();

        try {
            await createFile({
                name: data.title,
                fileId: storageId,
                orgId,
                type: ""
            })

            form.reset();

            setIsFileDialogOpen(false);
            toast({
                variant: "success",
                title: "File uploaded",
                description: "Your file has been uploaded and now available in public.",
            })
        } catch (error) {
            console.error(error)
            toast({
                variant: "destructive",
                title: "File upload failed",
                description: "Please try again later.",
            })
        }

    }

    return (
        <Dialog
            open={isFileDialogOpen}
            onOpenChange={(isOpen) => {
                setIsFileDialogOpen(isOpen);
                form.reset();
            }}
        >
            <DialogTrigger asChild>
                <Button size="lg">Upload File</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="mb-8">This file will only be accessible who belong to your organization.</DialogTitle>
                    <DialogDescription>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-2">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter title" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="file"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>File</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    {...fileRef}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? <span className="flex items-center gap-x-2"><Loader2 className="h-4 w-4 animate-spin" />Uploading</span> : "Upload"}</Button>
                            </form>
                        </Form>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}