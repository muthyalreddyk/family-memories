import Storage "mo:caffeineai-object-storage/Storage";
import Time "mo:core/Time";

module {
  public type MemoryId = Nat;

  public type ContentType = {
    #image;
    #video;
  };

  public type Category = Text;

  // Internal mutable record used in state
  public type MemoryInternal = {
    id : MemoryId;
    title : Text;
    date : Text; // ISO date string e.g. "2024-01-15"
    story : ?Text;
    media : Storage.ExternalBlob;
    filename : Text;
    contentType : ContentType;
    category : ?Category;
    uploader : Principal;
    uploadedAt : Time.Time;
  };

  // Shared (immutable) record returned to callers
  public type Memory = {
    id : MemoryId;
    title : Text;
    date : Text;
    story : ?Text;
    media : Storage.ExternalBlob;
    filename : Text;
    contentType : ContentType;
    category : ?Category;
    uploader : Principal;
    uploaderName : Text;
    uploadedAt : Time.Time;
  };

  public type CreateMemoryArgs = {
    title : Text;
    date : Text;
    story : ?Text;
    media : Storage.ExternalBlob;
    filename : Text;
    contentType : ContentType;
    category : ?Category;
  };

  public type UpdateMemoryArgs = {
    id : MemoryId;
    title : Text;
    date : Text;
    story : ?Text;
    category : ?Category;
  };

  public type SortBy = {
    #date;
    #category;
  };
};
