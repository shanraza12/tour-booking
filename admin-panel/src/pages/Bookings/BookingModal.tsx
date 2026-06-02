// BookingModal.tsx
import { useState, useEffect, FormEvent } from "react";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { toast } from "react-toastify";
import { usePost } from "../../hooks/useApi"; // Assuming this is your mutation hook

interface BookingApiResponse {
  id: number; // Or _id: string if Mongo
  customer: string;
  tour: string;
  date: string;
  amount: number;
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  bookingStatus: 'Confirmed' | 'Pending' | 'Cancelled';
}

interface BookingFormData {
  customer: string;
  tour: string;
  date: string;
  amount: number;
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  bookingStatus: 'Confirmed' | 'Pending' | 'Cancelled';
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (booking: BookingApiResponse) => void;
  initialData?: BookingApiResponse | null;
}

export default function BookingModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: BookingModalProps) {
  const isEdit = !!initialData;

  const { mutate: createBooking, loading: createLoading } = usePost("/bookings/create"); // Adjust endpoint

  // TODO: Add usePatch for update like /bookings/update/${initialData?.id}

  const [customer, setCustomer] = useState(initialData?.customer || "");
  const [tour, setTour] = useState(initialData?.tour || "");
  const [date, setDate] = useState(initialData?.date || "");
  const [amount, setAmount] = useState(initialData?.amount || 0);
  const [paymentStatus, setPaymentStatus] = useState<'Paid' | 'Pending' | 'Refunded'>(initialData?.paymentStatus || 'Pending');
  const [bookingStatus, setBookingStatus] = useState<'Confirmed' | 'Pending' | 'Cancelled'>(initialData?.bookingStatus || 'Pending');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCustomer(initialData?.customer || "");
      setTour(initialData?.tour || "");
      setDate(initialData?.date || "");
      setAmount(initialData?.amount || 0);
      setPaymentStatus(initialData?.paymentStatus || 'Pending');
      setBookingStatus(initialData?.bookingStatus || 'Pending');
      setError(null);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!customer || !tour || !date || amount <= 0) {
      setError("All required fields must be filled, and amount must be positive.");
      return;
    }

    const formData: BookingFormData = {
      customer,
      tour,
      date,
      amount,
      paymentStatus,
      bookingStatus,
    };

    if (isEdit) {
      // TODO: Implement update logic with usePatch
      setError("Edit functionality not implemented yet. Add a PATCH endpoint.");
      toast.error("Update not supported yet.");
      return;
    }

    createBooking(
      formData,
      {
        onSuccess: (response: any) => {
          toast.success(response?.message || "Booking created successfully!");
          onSave(response?.data || response); // Assuming API returns the created booking
          onClose();
        },
        onError: (err: any) => {
          const msg = err?.response?.data?.message || "Failed to create booking.";
          setError(msg);
          toast.error(msg);
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
      <div className="w-full max-w-2xl m-4 rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900">
        <h2 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">
          {isEdit ? "Edit Booking" : "Create New Booking"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label>Customer Name <span className="text-red-500">*</span></Label>
            <Input
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              required
              disabled={createLoading}
              placeholder="e.g., Alice Johnson"
            />
          </div>

          <div>
            <Label>Tour Booked <span className="text-red-500">*</span></Label>
            <Input
              value={tour}
              onChange={(e) => setTour(e.target.value)}
              required
              disabled={createLoading}
              placeholder="e.g., Historic Rome"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Tour Date <span className="text-red-500">*</span></Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                disabled={createLoading}
              />
            </div>

            <div>
              <Label>Amount ($) <span className="text-red-500">*</span></Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                required
                min={0}
                disabled={createLoading}
                placeholder="e.g., 1800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Payment Status</Label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as 'Paid' | 'Pending' | 'Refunded')}
                disabled={createLoading}
                className="w-full border border-gray-300 rounded-md p-2"
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>

            <div>
              <Label>Booking Status</Label>
              <select
                value={bookingStatus}
                onChange={(e) => setBookingStatus(e.target.value as 'Confirmed' | 'Pending' | 'Cancelled')}
                disabled={createLoading}
                className="w-full border border-gray-300 rounded-md p-2"
              >
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={onClose} disabled={createLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={createLoading}>
              {createLoading ? "Saving..." : isEdit ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}