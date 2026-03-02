import { useEffect, useState, useRef } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Plus, Trash2, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { useAuth } from "@/hooks/use-auth";
import { useNotices } from "@/hooks/use-service-requests";

export default function AdminNotices() {
  const [, setLocation] = useLocation();
  const { admin, isLoading } = useAuth();
  const { notices, createNotice, deleteNotice } = useNotices();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading && !admin) setLocation("/admin/login");
  }, [admin, isLoading]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!admin) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("Image size must be less than 2MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        setError("Only image files are allowed");
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    setSubmitting(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (image) formData.append("image", image);

      const res = await fetch("/api/notices", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to create notice");
      
      setTitle("");
      setContent("");
      setImage(null);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      
      // We need to invalidate the notices query, useNotices hook should handle this if it uses React Query
      window.location.reload(); // Simple way to refresh for now
    } catch (err: any) {
      setError(err.message || "Failed to create notice");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Delete this notice?")) await deleteNotice(id);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/20">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Notices Management</h1>

            <Card className="mb-8 border-primary/10 shadow-lg">
              <CardHeader className="border-b bg-card/50">
                <CardTitle className="text-lg">Create New Notice</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleCreate} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label>Title</Label>
                        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Notice title" className="mt-1.5" />
                      </div>
                      <div>
                        <Label>Content</Label>
                        <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Detailed notice content..." rows={5} className="mt-1.5" />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <Label>Notice Image (Optional, max 2MB)</Label>
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-1.5 border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors h-[180px] relative overflow-hidden"
                      >
                        {preview ? (
                          <>
                            <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                            <div className="relative z-10 flex flex-col items-center gap-2">
                              <ImageIcon className="h-8 w-8 text-primary" />
                              <span className="text-sm font-medium">Change Image</span>
                            </div>
                            <Button 
                              type="button" 
                              variant="destructive" 
                              size="icon" 
                              className="absolute top-2 right-2 h-8 w-8 rounded-full z-20"
                              onClick={(e) => {
                                e.stopPropagation();
                                setImage(null);
                                setPreview(null);
                                if (fileInputRef.current) fileInputRef.current.value = "";
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <ImageIcon className="h-10 w-10 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Click to upload image</span>
                          </>
                        )}
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                      </div>
                    </div>
                  </div>

                  {error && <p className="text-destructive text-sm font-medium">{error}</p>}
                  
                  <div className="pt-2">
                    <Button type="submit" disabled={submitting} className="w-full sm:w-auto px-8 gap-2 h-11">
                      {submitting ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          Post Notice
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                Active Notices 
                <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">{notices.length}</span>
              </h2>
              
              {notices.length === 0 && (
                <Card className="border-dashed">
                  <CardContent className="py-12 text-center text-muted-foreground">
                    No notices published yet. Use the form above to add one.
                  </CardContent>
                </Card>
              )}
              
              {notices.map((notice: any, i: number) => (
                <motion.div key={notice.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="overflow-hidden border-primary/5 hover:border-primary/20 transition-all shadow-sm">
                    <CardContent className="p-0 flex flex-col sm:flex-row">
                      {notice.imageUrl && (
                        <div className="w-full sm:w-40 h-40 sm:h-auto shrink-0 bg-muted">
                          <img src={`/uploads/${notice.imageUrl}`} alt={notice.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="p-5 flex-1 min-w-0 flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg leading-tight">{notice.title}</h3>
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{notice.content}</p>
                          <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground font-medium">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(notice.createdAt).toLocaleString("en-IN", { dateStyle: 'medium', timeStyle: 'short' })}
                            </span>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 shrink-0"
                          onClick={() => handleDelete(notice.id)}>
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
