import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import MemoriesApi "mixins/memories-api";
import Types "types/memories";
import List "mo:core/List";

actor {
  let memories = List.empty<Types.MemoryInternal>();
  // Counter stored as single-element list so mixin can mutate it
  let memoryIdCounter = List.singleton<Nat>(0);

  include MixinObjectStorage();
  include MemoriesApi(memories, memoryIdCounter);
};
