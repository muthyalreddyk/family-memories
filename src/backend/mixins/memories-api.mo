import Types "../types/memories";
import MemoriesLib "../lib/memories";
import List "mo:core/List";

mixin (
  memories : List.List<Types.MemoryInternal>,
  memoryIdCounter : List.List<Nat>,
) {
  // Create a new memory with uploaded media
  public shared ({ caller }) func createMemory(args : Types.CreateMemoryArgs) : async Types.MemoryId {
    let nextId = memoryIdCounter.at(0);
    memoryIdCounter.put(0, nextId + 1);
    let memory = MemoriesLib.createMemory(memories, nextId, args, caller);
    memory.id;
  };

  // Get all memories sorted by date (newest first) or by category
  public query func listMemories(sortBy : Types.SortBy) : async [Types.Memory] {
    let sorted = MemoriesLib.listMemories(memories, sortBy);
    sorted.map<Types.MemoryInternal, Types.Memory>(func(m) { m.toPublic() });
  };

  // Get a single memory by ID for the detail view
  public query func getMemory(id : Types.MemoryId) : async ?Types.Memory {
    switch (MemoriesLib.getMemory(memories, id)) {
      case (?m) ?m.toPublic();
      case null null;
    };
  };

  // Edit title, date, story of a memory (only by owner)
  public shared ({ caller }) func updateMemory(args : Types.UpdateMemoryArgs) : async Bool {
    MemoriesLib.updateMemory(memories, args, caller);
  };

  // Delete a memory (only by owner)
  public shared ({ caller }) func deleteMemory(id : Types.MemoryId) : async Bool {
    MemoriesLib.deleteMemory(memories, id, caller);
  };
};
