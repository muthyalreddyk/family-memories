import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { ContentType, ExternalBlob } from "../backend";
import { useCreateMemory } from "../hooks/use-memories";
import type { Category } from "../types";

const CATEGORIES: Category[] = [
  "Holidays",
  "Birthdays",
  "Milestones",
  "Everyday",
  "Reunions",
  "Travel",
];

const isImageFile = (name: string) =>
  /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(name);

interface UploadPageProps {
  onSuccess?: () => void;
}

export function UploadPage({ onSuccess }: UploadPageProps) {
  const createMemory = useCreateMemory();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [story, setStory] = useState("");
  const [category, setCategory] = useState<Category | undefined>(undefined);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((chosen: File) => {
    setFile(chosen);
    const url = URL.createObjectURL(chosen);
    setPreview(url);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) handleFile(dropped);
    },
    [handleFile],
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const chosen = e.target.files?.[0];
    if (chosen) handleFile(chosen);
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !date) return;

    setUploading(true);
    setProgress(0);

    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => {
        setProgress(pct);
      });

      const contentType: ContentType = isImageFile(file.name)
        ? ContentType.image
        : ContentType.video;

      await createMemory.mutateAsync({
        title,
        date,
        story: story.trim() || undefined,
        media: blob,
        filename: file.name,
        contentType,
        category: category ?? undefined,
      });

      toast.success("Memory saved!", {
        description: "Your memory has been added to the family album.",
      });
      onSuccess?.();
    } catch (err) {
      toast.error("Upload failed", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  const isValid = !!file && !!title && !!date;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-display font-semibold text-foreground tracking-tight">
            Add a Memory
          </h1>
          <p className="text-muted-foreground mt-1 font-body">
            Preserve a moment for the whole family to treasure.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Drop zone */}
          <div>
            <Label className="text-sm font-medium mb-2 block">
              Photo or Video
            </Label>

            {!file ? (
              <button
                type="button"
                data-ocid="upload-dropzone"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={[
                  "relative w-full border-2 border-dashed rounded-xl h-48",
                  "flex flex-col items-center justify-center cursor-pointer transition-smooth",
                  isDragging
                    ? "border-primary bg-primary/8"
                    : "border-border bg-muted/40 hover:border-primary/60 hover:bg-muted/60",
                ].join(" ")}
              >
                <div className="flex flex-col items-center gap-2 text-center px-4 pointer-events-none">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      className="w-5 h-5 text-primary"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-foreground font-medium">
                    Drag & drop or{" "}
                    <span className="text-primary underline underline-offset-2">
                      browse
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Images (JPG, PNG, GIF, WebP) or Videos (MP4, MOV)
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  className="sr-only"
                  onChange={handleFileInput}
                  data-ocid="upload-file-input"
                />
              </button>
            ) : (
              <Card className="overflow-hidden border border-border shadow-card">
                <div className="relative">
                  {isImageFile(file.name) ? (
                    <img
                      src={preview ?? ""}
                      alt={`Preview of ${file.name}`}
                      className="w-full max-h-64 object-cover"
                    />
                  ) : (
                    <video
                      src={preview ?? ""}
                      controls
                      className="w-full max-h-64 object-cover"
                    >
                      <track kind="captions" />
                    </video>
                  )}
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-foreground/70 hover:bg-foreground text-primary-foreground flex items-center justify-center text-sm transition-smooth"
                    aria-label="Remove selected file"
                    data-ocid="upload-remove-file"
                  >
                    ✕
                  </button>
                </div>
                <div className="px-4 py-2 bg-muted/30 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground truncate min-w-0 flex-1">
                    {file.name}
                  </span>
                  <Badge variant="secondary" className="shrink-0 text-xs">
                    {(file.size / 1024 / 1024).toFixed(1)} MB
                  </Badge>
                </div>
                {uploading && (
                  <div className="px-4 pb-3 pt-1">
                    <Progress value={progress} className="h-1.5" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Uploading… {Math.round(progress)}%
                    </p>
                  </div>
                )}
              </Card>
            )}
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-sm font-medium">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              data-ocid="upload-title"
              placeholder="e.g. Summer at Grandpa's Farm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              required
            />
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <Label htmlFor="date" className="text-sm font-medium">
              Date <span className="text-destructive">*</span>
            </Label>
            <Input
              id="date"
              data-ocid="upload-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Category (optional)</Label>
            <div className="flex flex-wrap gap-2" data-ocid="upload-categories">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() =>
                    setCategory(category === cat ? undefined : cat)
                  }
                  className={[
                    "px-3 py-1 rounded-full text-sm border transition-smooth",
                    category === cat
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-border hover:border-primary/50 hover:bg-muted",
                  ].join(" ")}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Story */}
          <div className="space-y-1.5">
            <Label htmlFor="story" className="text-sm font-medium">
              Story (optional)
            </Label>
            <Textarea
              id="story"
              data-ocid="upload-story"
              placeholder="Share the story behind this moment…"
              value={story}
              onChange={(e) => setStory(e.target.value)}
              rows={4}
              className="resize-none"
              maxLength={2000}
            />
            <p className="text-xs text-muted-foreground text-right">
              {story.length}/2000
            </p>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              data-ocid="upload-submit"
              disabled={!isValid || uploading}
              className="px-8"
            >
              {uploading ? "Saving…" : "Save Memory"}
            </Button>
            {onSuccess && (
              <Button
                type="button"
                variant="ghost"
                onClick={onSuccess}
                disabled={uploading}
                data-ocid="upload-cancel"
              >
                Cancel
              </Button>
            )}
            {!isValid && (
              <p className="text-xs text-muted-foreground">
                {!file
                  ? "Choose a photo or video to continue."
                  : !title
                    ? "Add a title to continue."
                    : "Pick a date to continue."}
              </p>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
}
