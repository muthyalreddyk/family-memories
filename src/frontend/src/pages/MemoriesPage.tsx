import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import { Calendar, ImageIcon, Plus, Tag, VideoIcon } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { ContentType, SortBy as SortByEnum } from "../backend";
import { useMemories } from "../hooks/use-memories";
import type { Memory, SortBy } from "../types";

// ── Skeletons ─────────────────────────────────────────────────────────────────

function FeaturedSkeleton() {
  return (
    <Card className="overflow-hidden shadow-elevated mb-6">
      <div className="grid md:grid-cols-[5fr_6fr]">
        <Skeleton className="w-full aspect-[4/3]" />
        <div className="p-6 md:p-10 space-y-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-9 w-4/5" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-3/4" />
          <div className="pt-6 flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      </div>
    </Card>
  );
}

function GridSkeleton() {
  return (
    <Card className="overflow-hidden shadow-card">
      <Skeleton className="w-full aspect-[4/3]" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <div className="pt-2 flex items-center gap-2">
          <Skeleton className="w-6 h-6 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </Card>
  );
}

// ── Shared subcomponents ──────────────────────────────────────────────────────

function MediaBadge({ isVideo }: { isVideo: boolean }) {
  return (
    <span className="inline-flex items-center gap-1 bg-foreground/60 text-primary-foreground text-xs px-2 py-1 rounded-full backdrop-blur-sm">
      {isVideo ? (
        <VideoIcon className="w-3 h-3" />
      ) : (
        <ImageIcon className="w-3 h-3" />
      )}
      {isVideo ? "Video" : "Photo"}
    </span>
  );
}

function UploaderRow({ name, date }: { name: string; date: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-xs font-semibold text-primary font-display flex-shrink-0">
          {name.slice(0, 1).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground leading-none mb-0.5">
            Uploaded by
          </p>
          <p className="text-xs font-medium text-foreground truncate">{name}</p>
        </div>
      </div>
      <span className="text-xs text-muted-foreground flex-shrink-0 flex items-center gap-1">
        <Calendar className="w-3 h-3" />
        {date}
      </span>
    </div>
  );
}

// ── Featured card ─────────────────────────────────────────────────────────────

function FeaturedCard({
  memory,
  onClick,
}: {
  memory: Memory;
  onClick: () => void;
}) {
  const isVideo = memory.contentType === ContentType.video;
  const mediaUrl = memory.media.getDirectURL();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      data-ocid="memory-featured-card"
    >
      <Card
        className="overflow-hidden shadow-elevated cursor-pointer mb-6 bg-card border-border group"
        onClick={onClick}
      >
        <div className="grid md:grid-cols-[5fr_6fr]">
          {/* Media side */}
          <div className="relative overflow-hidden aspect-[4/3] md:aspect-auto bg-muted">
            {isVideo ? (
              <video
                src={mediaUrl}
                className="w-full h-full object-cover"
                muted
                playsInline
              >
                <track kind="captions" />
              </video>
            ) : (
              <img
                src={mediaUrl}
                alt={memory.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="eager"
              />
            )}
            <div className="absolute top-3 left-3">
              <MediaBadge isVideo={isVideo} />
            </div>
            {memory.category && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-primary/90 text-primary-foreground text-xs">
                  {memory.category}
                </Badge>
              </div>
            )}
          </div>

          {/* Detail side */}
          <div className="p-6 md:p-10 flex flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-primary font-medium mb-3">
                Latest Memory
              </p>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground leading-tight mb-4">
                {memory.title}
              </h2>
              {memory.story && (
                <p className="text-muted-foreground leading-relaxed line-clamp-5 text-sm md:text-base">
                  {memory.story}
                </p>
              )}
            </div>
            <div className="mt-6 pt-4 border-t border-border">
              <UploaderRow name={memory.uploaderName} date={memory.date} />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// ── Grid card ─────────────────────────────────────────────────────────────────

function MemoryCard({
  memory,
  index,
  onClick,
}: {
  memory: Memory;
  index: number;
  onClick: () => void;
}) {
  const isVideo = memory.contentType === ContentType.video;
  const mediaUrl = memory.media.getDirectURL();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      data-ocid="memory-card"
    >
      <Card
        className="overflow-hidden shadow-card memory-card-hover cursor-pointer bg-card border-border h-full flex flex-col"
        onClick={onClick}
      >
        <div className="relative overflow-hidden aspect-[4/3] bg-muted flex-shrink-0">
          {isVideo ? (
            <video
              src={mediaUrl}
              className="w-full h-full object-cover"
              muted
              playsInline
            >
              <track kind="captions" />
            </video>
          ) : (
            <img
              src={mediaUrl}
              alt={memory.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
            />
          )}
          <div className="absolute top-2 right-2">
            <MediaBadge isVideo={isVideo} />
          </div>
          {memory.category && (
            <div className="absolute bottom-2 left-2">
              <Badge
                variant="secondary"
                className="text-xs bg-card/90 backdrop-blur-sm flex items-center gap-1"
              >
                <Tag className="w-2.5 h-2.5" />
                {memory.category}
              </Badge>
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-display font-semibold text-foreground leading-snug mb-1 line-clamp-2">
            {memory.title}
          </h3>
          {memory.story && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3 flex-1">
              {memory.story}
            </p>
          )}
          <div className="mt-auto pt-3 border-t border-border">
            <UploaderRow name={memory.uploaderName} date={memory.date} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-24 text-center px-4"
      data-ocid="memories-empty-state"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-24 h-24 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 shadow-card"
      >
        <ImageIcon className="w-12 h-12 text-primary/60" />
      </motion.div>
      <motion.h3
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="font-display text-2xl font-semibold text-foreground mb-3"
      >
        No memories yet
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="text-muted-foreground mb-8 max-w-sm leading-relaxed"
      >
        Start preserving your family's story. Upload your first photo or video
        to capture a moment that will last forever.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Button
          onClick={onAdd}
          className="gap-2 rounded-full px-6"
          data-ocid="memories-add-first-btn"
        >
          <Plus className="w-4 h-4" />
          Add your first memory
        </Button>
      </motion.div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function MemoriesPage() {
  const [sortBy, setSortBy] = useState<SortBy>(SortByEnum.date);
  const { data: memories, isLoading } = useMemories(sortBy);
  const navigate = useNavigate();

  const isSortedByDate = sortBy === SortByEnum.date;
  const [featured, ...rest] = memories ?? [];

  function goToMemory(id: bigint) {
    navigate({ to: "/memory/$memoryId", params: { memoryId: id.toString() } });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Our Memories
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {isLoading
              ? "Loading your family album…"
              : memories && memories.length > 0
                ? `${memories.length} cherished moment${memories.length !== 1 ? "s" : ""}`
                : "Your family album awaits"}
          </p>
        </div>

        <div className="flex items-center gap-2" data-ocid="memories-controls">
          {/* Sort toggle */}
          <div
            className="flex items-center gap-0.5 bg-secondary rounded-full p-1"
            data-ocid="memories-sort-control"
          >
            <button
              type="button"
              onClick={() => setSortBy(SortByEnum.date)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-smooth ${
                isSortedByDate
                  ? "bg-card shadow-subtle text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-ocid="memories-sort-date"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Date</span>
            </button>
            <button
              type="button"
              onClick={() => setSortBy(SortByEnum.category)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-smooth ${
                !isSortedByDate
                  ? "bg-card shadow-subtle text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-ocid="memories-sort-category"
            >
              <Tag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Category</span>
            </button>
          </div>

          <Button
            className="gap-2 rounded-full"
            onClick={() => navigate({ to: "/upload" })}
            data-ocid="memories-add-btn"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add memory</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <>
          <FeaturedSkeleton />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 3 }, (_, i) => `sk-${i}`).map((k) => (
              <GridSkeleton key={k} />
            ))}
          </div>
        </>
      ) : !memories || memories.length === 0 ? (
        <EmptyState onAdd={() => navigate({ to: "/upload" })} />
      ) : (
        <>
          {featured && (
            <FeaturedCard
              memory={featured}
              onClick={() => goToMemory(featured.id)}
            />
          )}

          {rest.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.map((memory, i) => (
                <MemoryCard
                  key={memory.id.toString()}
                  memory={memory}
                  index={i}
                  onClick={() => goToMemory(memory.id)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
