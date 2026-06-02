import { useState, useEffect, FormEvent } from "react";
import { toast } from "react-toastify";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import TextArea from "../../components/form/input/TextArea";
import Button from "../../components/ui/button/Button";
import { usePost, usePostFormData } from "../../hooks/useApi";
import { CloseIcon } from "../../icons";

interface BlogApiResponse {
  _id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  photo: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (blog: BlogApiResponse) => void;
  initialData?: BlogApiResponse | null;
}

export default function BlogModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  handleFetchData,
}: BlogModalProps) {
  const isEdit = !!initialData;

  const { mutate: createBlog, isPending: createLoading } = usePost<BlogApiResponse, any>("/blogs/create");
  const { mutate: updateBlog, isPending: updateBlogPending } = usePost<BlogApiResponse, any>("/blogs/update");
  const { mutate: uploadPhotoMutation, isPending: uploadLoading } = usePostFormData<{ url: string }>("/blogs/blog-photo");

  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [author, setAuthor] = useState(initialData?.author || "");
  const [date, setDate] = useState(initialData?.date || "");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(initialData?.photo || null);
  const [photoCleared, setPhotoCleared] = useState(false);
  const [featured, setFeatured] = useState(initialData?.featured ?? false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTitle(initialData?.title || "");
      setContent(initialData?.content || "");
      setAuthor(initialData?.author || "");
      setDate(initialData?.updatedAt || "");
      setPhotoPreview(initialData?.photo || null);
      setPhotoFile(null);
      setPhotoCleared(false);
      setFeatured(initialData?.featured ?? false);
      setError(null);
    }
  }, [isOpen, initialData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be under 10MB.");
      return;
    }

    setPhotoFile(file);
    setPhotoCleared(false);

    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    setPhotoCleared(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title || !content || !author || !date) {
      setError("All required fields must be filled.");
      return;
    }

    // For new blog, photo is required
    if (!isEdit && !photoFile && !initialData?.photo) {
      setError("Photo is required for new blog posts.");
      return;
    }

    let photoUrl = initialData?.photo || "";

    try {
      if (photoCleared) {
        photoUrl = "";
      } else if (photoFile) {
        // Properly upload using mutation and await via Promise
        photoUrl = await new Promise<string>((resolve, reject) => {
          const formData = new FormData();
          formData.append("photo", photoFile);

          uploadPhotoMutation(formData, {
            onSuccess: (data) => resolve(data.url),
            onError: (err: any) => reject(err),
          });
        });
      }
      // If no change → keep existing photoUrl

      const blogData = { title, content, author, date, photo: photoUrl, featured ,...(isEdit && { id: initialData?._id }),};
      
      if (isEdit) {
        updateBlog(blogData, {
        onSuccess: (response: any) => {
          toast.success(response?.message || "Blog created successfully!");
          onSave(response?.data || response);
          onClose();
          handleFetchData()
        },
        onError: (err: any) => {
          const msg = err?.response?.data?.message || "Failed to create blog.";
          setError(msg);
          toast.error(msg);
        },
      });
      }else{
        createBlog(blogData, {
        onSuccess: (response: any) => {
          toast.success(response?.message || "Blog created successfully!");
          onSave(response?.data || response);
          onClose();
          handleFetchData()
        },
        onError: (err: any) => {
          const msg = err?.response?.data?.message || "Failed to create blog.";
          setError(msg);
          toast.error(msg);
        },
      });
    }
    } catch (uploadErr: any) {
      setError(uploadErr.message || "Failed to upload photo.");
      toast.error(uploadErr.message || "Photo upload failed.");
    }
  };

  const isLoading = createLoading || uploadLoading;

  if (!isOpen) return null;

  return (
    <div className="fixed  inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto"  >
      <div className="w-full max-w-2xl m-4 rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900 overflow-y-auto " style={{maxHeight:'80dvh'}}>
        <div className="flex items-end justify-end text-red-900 "  >
         <Button variant="" onClick={onClose}><CloseIcon/></Button> 
          </div> 
        <h2 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">
          {isEdit ? "Edit Blog Post" : "Create New Blog Post"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label>Title <span className="text-red-500">*</span></Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required disabled={isLoading} />
          </div>

          <div>
            <Label>Content <span className="text-red-500">*</span></Label>
            <TextArea
              value={content}
              onChange={(e) => setContent(e)}
              rows={8}
              required
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Author <span className="text-red-500">*</span></Label>
              <Input value={author} onChange={(e) => setAuthor(e.target.value)} required disabled={isLoading} />
            </div>
            <div>
              <Label>Publish Date <span className="text-red-500">*</span></Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required disabled={isLoading} />
            </div>
          </div>

          <div>
            <Label>Photo {!isEdit && <span className="text-red-500">*</span>}</Label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isLoading}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />

            {photoPreview && (
              <div className="mt-4 relative">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <div className="relative inline-block">
                  <img src={photoPreview} alt="Photo preview" className="max-h-64 rounded-lg object-cover" />
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    disabled={isLoading}
                    className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}

            {isEdit && !photoPreview && !photoFile && !photoCleared && initialData?.photo && (
              <p className="mt-2 text-sm text-gray-500 italic">
                Current photo will be kept unless replaced or removed.
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              disabled={isLoading}
              className="size-5"
            />
            <Label htmlFor="featured" className="cursor-pointer">Featured post</Label>
          </div>

          {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20">{error}</div>}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {uploadLoading ? "Uploading photo..." : createLoading ? "Saving..." : isEdit ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}