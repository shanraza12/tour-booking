// components/modals/TourModal.tsx
import { useState, useEffect, FormEvent } from "react";
import { toast } from "react-toastify";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import TextArea from "../../components/form/input/TextArea";
import Button from "../../components/ui/button/Button";
import { usePost, usePostFormData } from "../../hooks/useApi";
import { CloseIcon } from "../../icons";

interface TourApiResponse {
  _id: string;
  title: string;
  city: string;
  address: string;
  photo: string;
  desc: string;
  price: number;
  maxGroupSize: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface TourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tour: TourApiResponse) => void;
  initialData?: TourApiResponse | null;
}

export default function TourModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  handleFetchData,
}: TourModalProps) {
  const isEdit = !!initialData;

  const { mutate: createTour, isPending: createLoading } = usePost<TourApiResponse, any>("/tours/create");
  const { mutate: updateTour, isPending: updateLoading } = usePost<TourApiResponse, any>("/tours/update");
  const { mutate: uploadPhotoMutation, isPending: uploadLoading } = usePostFormData<{ url: string }>("/tours/tour-photo"); // or /tours/tour-photo

  const [title, setTitle] = useState(initialData?.title || "");
  const [city, setCity] = useState(initialData?.city || "");
  const [address, setAddress] = useState(initialData?.address || "");
  const [desc, setDesc] = useState(initialData?.desc || "");
  const [price, setPrice] = useState(initialData?.price?.toString() || "");
  const [maxGroupSize, setMaxGroupSize] = useState(initialData?.maxGroupSize?.toString() || "");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(initialData?.photo || null);
  const [photoCleared, setPhotoCleared] = useState(false);
  const [featured, setFeatured] = useState(initialData?.featured ?? false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTitle(initialData?.title || "");
      setCity(initialData?.city || "");
      setAddress(initialData?.address || "");
      setDesc(initialData?.desc || "");
      setPrice(initialData?.price?.toString() || "");
      setMaxGroupSize(initialData?.maxGroupSize?.toString() || "");
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
      toast.error("Please select a valid image file.");
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

    if (!title || !city || !address || !desc || !maxGroupSize) {
      setError("All required fields must be filled.");
      return;
    }

    if (!isEdit && !photoFile && !initialData?.photo) {
      setError("A photo is required for new tours.");
      return;
    }

    if (isNaN(Number(maxGroupSize)) || Number(maxGroupSize) <= 0) {
      setError("Max group size must be a positive number.");
      return;
    }

    let photoUrl = initialData?.photo || "";

    try {
      if (photoCleared) {
        photoUrl = "";
      } else if (photoFile) {
        photoUrl = await new Promise<string>((resolve, reject) => {
          const formData = new FormData();
          formData.append("photo", photoFile);
          uploadPhotoMutation(formData, {
            onSuccess: (data) => resolve(data.url),
            onError: (err: any) => reject(err),
          });
        });
      }

      const tourData = {
        title,
        city,
        address,
        desc,
        price: Number(price),
        maxGroupSize: Number(maxGroupSize),
        photo: photoUrl,
        featured,
        ...(isEdit && { id: initialData?._id }),
      };

      if (isEdit) {
        updateTour(tourData, {
          onSuccess: (response: any) => {
            toast.success(response?.message || "Tour updated successfully!");
            onSave(response?.data || response);
            onClose();
            handleFetchData()
          },
          onError: (err: any) => {
            const msg = err?.response?.data?.message || "Failed to update tour.";
            setError(msg);
            toast.error(msg);
          },
        });
      } else {
        createTour(tourData, {
          onSuccess: (response: any) => {
            toast.success(response?.message || "Tour created successfully!");
            onSave(response?.data || response);
            onClose();
            handleFetchData()
          },
          onError: (err: any) => {
            const msg = err?.response?.data?.message || "Failed to create tour.";
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

  const isLoading = createLoading || updateLoading || uploadLoading;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
      <div className="w-full max-w-2xl m-4 rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900 overflow-y-auto "  style={{maxHeight:'80dvh'}} >
         <div className="flex items-end justify-end "  >
         <Button type="button" variant="secondary"  onClick={onClose}><CloseIcon/></Button> 
          </div> 
        <h2 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">
          {isEdit ? "Edit Tour" : "Create New Tour"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label>Title <span className="text-red-500">*</span></Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required disabled={isLoading} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>From: <span className="text-red-500">*</span></Label>
              <Input value={city} onChange={(e) => setCity(e.target.value)} required disabled={isLoading} />
            </div>
            <div>
              <Label>To: <span className="text-red-500">*</span></Label>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} required disabled={isLoading} />
            </div>
          </div>

          <div>
            <Label>Description <span className="text-red-500">*</span></Label>
            <TextArea value={desc} onChange={(e) => setDesc(e)} rows={6} required disabled={isLoading} />
          </div>

          <div>
            <Label>Max Group Size <span className="text-red-500">*</span></Label>
            <Input type="number" min="1" value={maxGroupSize} onChange={(e) => setMaxGroupSize(e.target.value)} required disabled={isLoading} />
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
                  <img src={photoPreview} alt="Tour photo preview" className="max-h-64 rounded-lg object-cover" />
                  <button type="button" onClick={handleRemovePhoto} disabled={isLoading} className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full hover:bg-red-700">
                    Remove
                  </button>
                </div>
              </div>
            )}
            {isEdit && !photoPreview && !photoFile && !photoCleared && initialData?.photo && (
              <p className="mt-2 text-sm text-gray-500 italic">Current photo will be kept unless replaced or removed.</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" id="featured" checked={featured} onChange={(e) => setFeatured(e.target.checked)} disabled={isLoading} className="size-5" />
            <Label htmlFor="featured" className="cursor-pointer">Featured tour</Label>
          </div>

          {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20">{error}</div>}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {uploadLoading ? "Uploading photo..." : createLoading || updateLoading ? "Saving..." : isEdit ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}