import Types "../types/memories";
import List "mo:core/List";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Time "mo:core/Time";

module {
  public func createMemory(
    memories : List.List<Types.MemoryInternal>,
    nextId : Nat,
    args : Types.CreateMemoryArgs,
    caller : Principal,
  ) : Types.MemoryInternal {
    let memory : Types.MemoryInternal = {
      id = nextId;
      title = args.title;
      date = args.date;
      story = args.story;
      media = args.media;
      filename = args.filename;
      contentType = args.contentType;
      category = args.category;
      uploader = caller;
      uploadedAt = Time.now();
    };
    memories.add(memory);
    memory;
  };

  public func getMemory(
    memories : List.List<Types.MemoryInternal>,
    id : Types.MemoryId,
  ) : ?Types.MemoryInternal {
    memories.find(func(m) { m.id == id });
  };

  public func listMemories(
    memories : List.List<Types.MemoryInternal>,
    sortBy : Types.SortBy,
  ) : [Types.MemoryInternal] {
    let arr = memories.toArray();
    switch (sortBy) {
      case (#date) {
        // newest first — compare uploadedAt descending (uploadedAt is Int/Time)
        arr.sort(func(a, b) { Int.compare(b.uploadedAt, a.uploadedAt) });
      };
      case (#category) {
        arr.sort(
          func(a, b) {
            let catA = switch (a.category) { case (?c) c; case null "" };
            let catB = switch (b.category) { case (?c) c; case null "" };
            if (catA < catB) #less
            else if (catA > catB) #greater
            else Int.compare(b.uploadedAt, a.uploadedAt);
          }
        );
      };
    };
  };

  public func updateMemory(
    memories : List.List<Types.MemoryInternal>,
    args : Types.UpdateMemoryArgs,
    caller : Principal,
  ) : Bool {
    var updated = false;
    memories.mapInPlace(
      func(m) {
        if (m.id == args.id and m.uploader == caller) {
          updated := true;
          { m with title = args.title; date = args.date; story = args.story; category = args.category };
        } else {
          m;
        };
      }
    );
    updated;
  };

  public func deleteMemory(
    memories : List.List<Types.MemoryInternal>,
    id : Types.MemoryId,
    caller : Principal,
  ) : Bool {
    let sizeBefore = memories.size();
    let filtered = memories.filter(func(m) { not (m.id == id and m.uploader == caller) });
    let sizeAfter = filtered.size();
    if (sizeAfter < sizeBefore) {
      memories.clear();
      memories.append(filtered);
      true;
    } else {
      false;
    };
  };

  public func toPublic(self : Types.MemoryInternal) : Types.Memory {
    {
      self with
      uploaderName = self.uploader.toText();
    };
  };
};
