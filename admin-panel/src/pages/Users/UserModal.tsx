import { useState, useEffect, FormEvent } from "react";
import { toast } from "react-toastify";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { usePost, usePostFormData } from "../../hooks/useApi";
import { CloseIcon } from "../../icons";

interface UserApiResponse {
  _id: string;
  username: string;
  email: string;
  photo?: string;
  createdAt: string;
  updatedAt: string;
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: UserApiResponse) => void;
  initialData?: UserApiResponse | null;
  handleFetchData: () => void;
}

export default function UserModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  handleFetchData,
}: UserModalProps) {
  const isEdit = !!initialData;

  const { mutate: createUser, isPending: createLoading } = usePost<UserApiResponse>("/users/");
  const { mutate: updateUser, isPending: updateLoading } = usePost<UserApiResponse>("/users/update");
  const { mutate: uploadPhoto, isPending: uploadLoading } = usePostFormData<{ url: string }>("/users/user-photo");

  const [username, setUsername] = useState(initialData?.username || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(initialData?.photo || null);
  const [photoCleared, setPhotoCleared] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setUsername(initialData?.username || "");
      setEmail(initialData?.email || "");
      setPassword("");
      setConfirmPassword("");
      setPhotoPreview(initialData?.photo || null);
      setPhotoFile(null);
      setPhotoCleared(false);
      setError(null);
    }
  }, [isOpen, initialData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please select a valid image.");
    if (file.size > 10 * 1024 * 1024) return toast.error("Image must be under 10MB.");

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

    // Basic required fields
    if (!username || !email) {
      setError("Username and email are required.");
      return;
    }

    // Password validation only on create
    if (!isEdit) {
      if (!password) {
        setError("Password is required for new users.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    let photoUrl = initialData?.photo || "";

    try {
      if (photoCleared) {
        photoUrl = "";
      } else if (photoFile) {
        photoUrl = await new Promise<string>((resolve, reject) => {
          const formData = new FormData();
          formData.append("photo", photoFile);
          uploadPhoto(formData, {
            onSuccess: (data) => resolve(data.url),
            onError: reject,
          });
        });
      }

      const userData: any = {
        username,
        email,
        photo: photoUrl,
        ...(isEdit && { id: initialData?._id }),
        ...(!isEdit && { password }), // Only send password on create
      };

      const mutation = isEdit ? updateUser : createUser;

      mutation(userData, {
        onSuccess: (response: any) => {
          toast.success(response?.message || `User ${isEdit ? "updated" : "created"} successfully!`);
          onSave(response?.data || response);
          onClose();
          handleFetchData();
        },
        onError: (err: any) => {
          const msg = err?.response?.data?.message || `Failed to ${isEdit ? "update" : "create"} user.`;
          setError(msg);
          toast.error(msg);
        },
      });
    } catch (uploadErr: any) {
      const msg = uploadErr.message || "Photo upload failed.";
      setError(msg);
      toast.error(msg);
    }
  };

  const isLoading = createLoading || updateLoading || uploadLoading;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
      <div className="w-full max-w-2xl m-4 rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900 overflow-y-auto" style={{ maxHeight: '80dvh' }}>
        <div className="flex justify-end">
          <Button type="button" variant="secondary" onClick={onClose}><CloseIcon /></Button>
        </div>
        <h2 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">
          {isEdit ? "Edit User" : "Create New User"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Full Name <span className="text-red-500">*</span></Label>
              <Input value={username} onChange={(e) => setUsername(e.target.value)} required disabled={isLoading} />
            </div>
            <div>
              <Label>Email <span className="text-red-500">*</span></Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
            </div>
          </div>

          {!isEdit && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Password <span className="text-red-500">*</span></Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder="Min. 6 characters"
                />
              </div>
              <div>
                <Label>Confirm Password <span className="text-red-500">*</span></Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          )}


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
              <div className="mt-4 relative inline-block">
                <img src={photoPreview} alt="Preview" className="max-h-64 rounded-lg object-cover" />
                <button type="button" onClick={handleRemovePhoto} disabled={isLoading} className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full hover:bg-red-700">
                  Remove
                </button>
              </div>
            )}
          </div>

          {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : isEdit ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}