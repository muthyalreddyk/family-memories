import { ContentType, ExternalBlob, SortBy } from "../backend";
import type { backendInterface } from "../backend.d";

const sampleImageURL =
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=640&q=80";

const mockMemories = [
  {
    id: BigInt(1),
    media: ExternalBlob.fromURL(sampleImageURL),
    title: "Summer at Grandma's Farm",
    uploaderName: "Aunt Margaret",
    contentType: ContentType.image,
    date: "1987-07-14",
    filename: "grandma-farm-1987.jpg",
    story:
      "Every summer we would pile into Dad's old station wagon and drive three hours to Grandma's farm. The smell of fresh-baked apple pie would greet us at the door.",
    category: "Childhood",
    uploader: { toText: () => "aaaaa-aaaaa-aaaaa-aaaaa-aaa" } as never,
    uploadedAt: BigInt(Date.now()),
  },
  {
    id: BigInt(2),
    media: ExternalBlob.fromURL(
      "https://images.unsplash.com/photo-1511895426328-dc8714191011?w=640&q=80",
    ),
    title: "Christmas Morning 1995",
    uploaderName: "Uncle Bill",
    contentType: ContentType.image,
    date: "1995-12-25",
    filename: "christmas-1995.jpg",
    story:
      "The year we got the puppy. Nobody expected it — Mom had kept the secret for months.",
    category: "Holidays",
    uploader: { toText: () => "bbbbb-bbbbb-bbbbb-bbbbb-bbb" } as never,
    uploadedAt: BigInt(Date.now() - 86400000),
  },
  {
    id: BigInt(3),
    media: ExternalBlob.fromURL(
      "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=640&q=80",
    ),
    title: "Dad's 60th Birthday",
    uploaderName: "Sarah",
    contentType: ContentType.image,
    date: "2010-03-08",
    filename: "dad-60th.jpg",
    story:
      "We threw Dad a surprise party at the old lake house. He cried when everyone jumped out.",
    category: "Birthdays",
    uploader: { toText: () => "ccccc-ccccc-ccccc-ccccc-ccc" } as never,
    uploadedAt: BigInt(Date.now() - 172800000),
  },
];

export const mockBackend: backendInterface = {
  createMemory: async () => BigInt(4),
  deleteMemory: async () => true,
  getMemory: async (id) =>
    mockMemories.find((m) => m.id === id) ?? null,
  listMemories: async () => mockMemories,
  updateMemory: async () => true,
};
