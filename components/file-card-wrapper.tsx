import { Doc } from "@/convex/_generated/dataModel";

import { 
    Card, 
    CardTitle,
    CardFooter,
    CardHeader,
    CardContent,    
} from "@/components/ui/card";
import { FileActions } from "./file-actions";


export const FileCardWrapper = ({ file }: { file: Doc<"files">}) => {
    return (
        <Card>
            <CardHeader className="flex items-center justify-between">
                <CardTitle>
                    {file.name}
                </CardTitle>
                <FileActions file={file}/>
            </CardHeader>
            <CardContent>

            </CardContent>
            <CardFooter></CardFooter>
        </Card>
    )
}