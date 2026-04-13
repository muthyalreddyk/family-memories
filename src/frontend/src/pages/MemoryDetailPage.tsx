import { ContentType } from "@/backend";
import { Layout } from "@/components/Layout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import {
  useDeleteMemory,
  useMemory,
  useUpdateMemory,
} from "@/hooks/use-memories";
import type { Category } from "@/types";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Check, Loader2, Pencil, Trash2, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const CATEGORIES: Category[] = [
  "Holidays",
  "Birthdays",
  "Milestones",
  "Everyday",
  "Reunions",
];

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function MemoryDetailPage() {
  const { memoryId } = useParams({ from: "/memory/$memoryId" });
  const navigate = useNavigate();
  const { principalText } = useAuth();

  const id = BigInt(memoryId);
  const { data: memory, isLoading } = useMemory(id);
  const updateMemory = useUpdateMemory();
  const deleteMemory = useDeleteMemory();

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editStory, setEditStory] = useState("");
  const [editCategory, setEditCategory] = useState<Category | undefined>(
    undefined,
  );

  const isOwner =
    memory !== undefined &&
    principalText !== null &&
    memory.uploader.toText() === principalText;

  function startEditing() {
    if (!memory) return;
    setEditTitle(memory.title);
    setEditDate(memory.date);
    setEditStory(memory.story ?? "");
    setEditCategory(memory.category);
    setIsEditing(true);
  }

  function cancelEditing() {
    setIsEditing(false);
  }

  async function handleSave() {
    if (!memory) return;
    try {
      await updateMemory.mutateAsync({
        id: memory.id,
        title: editTitle.trim(),
        date: editDate,
        story: editStory.trim() || undefined,
        category: editCategory || undefined,
      });
      toast.success("Memory updated successfully");
      setIsEditing(false);
    } catch {
      toast.error("Failed to update memory");
    }
  }

  async function handleDelete() {
    if (!memory) return;
    try {
      await deleteMemory.mutateAsync(memory.id);
      toast.success("Memory deleted");
      navigate({ to: "/" });
    } catch {
      toast.error("Failed to delete memory");
    }
  }

  const isVideo = memory && memory.contentType === ContentType.video;

  return (
    <Layout>
      <div className="min-h-screen bg-background texture-paper">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="ghost"
              onClick={() => navigate({ to: "/" })}
              className="mb-6 gap-2 text-muted-foreground hover:text-foreground transition-colors"
              data-ocid="memory-detail-back"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to memories
            </Button>
          </motion.div>

          {isLoading ? (
            <DetailSkeleton />
          ) : !memory ? (
            <NotFound onBack={() => navigate({ to: "/" })} />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-card rounded-2xl shadow-elevated overflow-hidden"
            >
              {/* Media */}
              <div className="relative w-full bg-muted aspect-[16/9] overflow-hidden">
                {isVideo ? (
                  <video
                    src={memory.media.getDirectURL()}
                    controls
                    className="w-full h-full object-cover"
                    data-ocid="memory-detail-video"
                  >
                    <track kind="captions" />
                  </video>
                ) : (
                  <img
                    src={memory.media.getDirectURL()}
                    alt={memory.title}
                    className="w-full h-full object-cover"
                    data-ocid="memory-detail-image"
                  />
                )}
              </div>

              {/* Content */}
              <div className="p-6 md:p-10">
                {/* Header row: title + actions */}
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="text-2xl font-display font-bold h-auto py-1 px-2"
                        data-ocid="memory-edit-title"
                      />
                    ) : (
                      <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight">
                        {memory.title}
                      </h1>
                    )}
                  </div>

                  {isOwner && !isEditing && (
                    <div className="flex gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={startEditing}
                        className="gap-1.5"
                        data-ocid="memory-edit-btn"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5 text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/5"
                            data-ocid="memory-delete-btn"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete this memory?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. "{memory.title}"
                              will be permanently removed from your family
                              album.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel data-ocid="memory-delete-cancel">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDelete}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              data-ocid="memory-delete-confirm"
                            >
                              {deleteMemory.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "Delete memory"
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}

                  {isEditing && (
                    <div className="flex gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={cancelEditing}
                        className="gap-1.5"
                        data-ocid="memory-edit-cancel"
                      >
                        <X className="h-3.5 w-3.5" />
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={updateMemory.isPending || !editTitle.trim()}
                        className="gap-1.5 bg-primary text-primary-foreground"
                        data-ocid="memory-edit-save"
                      >
                        {updateMemory.isPending ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Check className="h-3.5 w-3.5" />
                        )}
                        Save
                      </Button>
                    </div>
                  )}
                </div>

                {/* Meta row: date + category */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  {isEditing ? (
                    <>
                      <div className="flex flex-col gap-1">
                        <Label className="text-xs text-muted-foreground">
                          Date
                        </Label>
                        <Input
                          type="date"
                          value={editDate}
                          onChange={(e) => setEditDate(e.target.value)}
                          className="w-44"
                          data-ocid="memory-edit-date"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <Label className="text-xs text-muted-foreground">
                          Category
                        </Label>
                        <select
                          value={editCategory ?? ""}
                          onChange={(e) =>
                            setEditCategory(
                              e.target.value
                                ? (e.target.value as Category)
                                : undefined,
                            )
                          }
                          className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                          data-ocid="memory-edit-category"
                        >
                          <option value="">No category</option>
                          {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  ) : (
                    <>
                      <time
                        dateTime={memory.date}
                        className="text-sm font-medium text-muted-foreground"
                      >
                        {formatDate(memory.date)}
                      </time>
                      {memory.category && (
                        <span className="text-xs font-medium uppercase tracking-wide px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                          {memory.category}
                        </span>
                      )}
                    </>
                  )}
                </div>

                {/* Story */}
                <div className="mb-8">
                  {isEditing ? (
                    <div className="flex flex-col gap-1">
                      <Label className="text-xs text-muted-foreground">
                        Story
                      </Label>
                      <Textarea
                        value={editStory}
                        onChange={(e) => setEditStory(e.target.value)}
                        rows={6}
                        placeholder="Share the story behind this memory…"
                        className="resize-none"
                        data-ocid="memory-edit-story"
                      />
                    </div>
                  ) : memory.story ? (
                    <p className="text-foreground/85 leading-relaxed text-base whitespace-pre-wrap">
                      {memory.story}
                    </p>
                  ) : (
                    <p className="text-muted-foreground italic text-sm">
                      No story added yet.
                    </p>
                  )}
                </div>

                {/* Uploader */}
                <div className="pt-6 border-t border-border flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                    <span className="text-primary font-display font-semibold text-sm">
                      {memory.uploaderName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Uploaded by</p>
                    <p className="text-sm font-medium text-foreground">
                      {memory.uploaderName}
                    </p>
                  </div>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {formatDate(
                      new Date(Number(memory.uploadedAt) / 1_000_000)
                        .toISOString()
                        .split("T")[0],
                    )}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}

function DetailSkeleton() {
  return (
    <div className="bg-card rounded-2xl shadow-elevated overflow-hidden">
      <Skeleton className="w-full aspect-[16/9]" />
      <div className="p-6 md:p-10 space-y-5">
        <Skeleton className="h-10 w-3/4" />
        <div className="flex gap-3">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="pt-4 border-t border-border flex items-center gap-3">
          <Skeleton className="w-9 h-9 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}

function NotFound({ onBack }: { onBack: () => void }) {
  return (
    <div
      className="bg-card rounded-2xl shadow-elevated p-12 text-center"
      data-ocid="memory-not-found"
    >
      <p className="font-display text-2xl text-foreground mb-2">
        Memory not found
      </p>
      <p className="text-muted-foreground text-sm mb-6">
        This memory may have been deleted or you don't have access to it.
      </p>
      <Button onClick={onBack} className="bg-primary text-primary-foreground">
        Back to memories
      </Button>
    </div>
  );
}
