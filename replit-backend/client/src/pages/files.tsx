import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, FileText, Download, Trash2, Loader2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import type { File } from "@shared/schema";

const uploadSchema = z.object({
  filename: z.string().min(1, "Filename is required"),
  fileType: z.string().min(1, "File type is required"),
  fileSize: z.coerce.number().positive("File size must be positive"),
});

type UploadFormData = z.infer<typeof uploadSchema>;

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}

function getFileIcon(fileType: string) {
  return <FileText className="h-8 w-8 text-primary" />;
}

export default function Files() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const { data: files, isLoading } = useQuery<File[]>({
    queryKey: ["/api/files"],
  });

  const form = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      filename: "",
      fileType: "",
      fileSize: 0,
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (data: UploadFormData) => {
      const response = await apiRequest<{ file: File; signedUrl: string }>(
        "POST",
        "/api/files/upload",
        data
      );
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });
      toast({
        title: "File uploaded!",
        description: `Signed URL generated for ${data.file.filename}`,
      });
      setOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Upload failed",
        description: error.message || "Could not upload file. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (fileId: string) => {
      await apiRequest("DELETE", `/api/files/${fileId}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });
      toast({
        title: "File deleted",
        description: "File has been removed successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Delete failed",
        description: error.message || "Could not delete file.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: UploadFormData) => {
    uploadMutation.mutate(data);
  };

  const filteredFiles = files?.filter(file => 
    file.filename.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="p-6 lg:p-12 space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-12 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Files</h1>
          <p className="text-muted-foreground">
            Manage and organize your uploaded files
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-upload-file">
              <Upload className="mr-2 h-4 w-4" />
              Upload File
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload New File</DialogTitle>
              <DialogDescription>
                Enter file metadata to generate a signed upload URL
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="filename"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Filename</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="document.pdf"
                          {...field}
                          data-testid="input-filename"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fileType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>File Type</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="application/pdf"
                          {...field}
                          data-testid="input-filetype"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fileSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>File Size (bytes)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="1024000"
                          {...field}
                          data-testid="input-filesize"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={uploadMutation.isPending}
                    data-testid="button-submit-upload"
                  >
                    {uploadMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      "Upload"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
          data-testid="input-search"
        />
      </div>

      {filteredFiles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Upload className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
            <CardTitle className="mb-2">No files yet</CardTitle>
            <CardDescription className="text-center max-w-sm">
              Upload your first file to start managing your documents with GramSetu AI
            </CardDescription>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredFiles.map((file) => (
            <Card key={file.id} className="hover-elevate" data-testid={`file-card-${file.id}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base truncate font-mono">
                      {file.filename}
                    </CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {file.fileType}
                    </CardDescription>
                  </div>
                  {getFileIcon(file.fileType)}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Size:</span>
                  <span className="font-mono font-medium">{formatBytes(file.fileSize)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Uploaded:</span>
                  <span className="font-medium">
                    {new Date(file.uploadedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex gap-2 pt-2">
                  {file.signedUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => window.open(file.signedUrl!, "_blank")}
                      data-testid={`button-download-${file.id}`}
                    >
                      <Download className="mr-2 h-3 w-3" />
                      Download
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteMutation.mutate(file.id)}
                    disabled={deleteMutation.isPending}
                    data-testid={`button-delete-${file.id}`}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
