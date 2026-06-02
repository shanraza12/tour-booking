// BookingManagement.tsx
import {useEffect, useState } from 'react';
import DataGrid from '../../components/tables/BasicTables/DataGrid';
import BookingModal from './BookingModal';
import {  usePost } from '../../hooks/useApi';
import { toast } from 'react-toastify';

const BookingManagement = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBooking] = useState<any>(null);
  const { mutate:fetchBookings ,loading } = usePost("/booking/getBookings",);

  useEffect(()=>{
    fetchBookings({},{
      onSuccess:(response)=>{
        setBookings(response?.data)
      },
      onError:()=>{
        toast.error("Faild to fetch Booking info")
      }
    })

  },[])
  const handleSave = (savedBooking: any) => {
    if (savedBooking.id) {
      setBookings(prev => prev.map(b => (b.id === savedBooking.id ? savedBooking : b)));
    } else {
      const newId = Math.max(...bookings.map(b => b.id), 0) + 1;
      setBookings(prev => [...prev, { ...savedBooking, id: newId }]);
    }
    toast.success('Booking saved (client-side)');
  };
  const bookingColumns = [
    { field: 'userEmail', headerName: 'User Email', sortable: true, width: 90 },
    { field: 'fullName', headerName: 'Full Name', sortable: true, flex: 1 },
    { field: 'tourName', headerName: 'Tour Name', sortable: true, flex: 1 },
    { field: 'groupSize', headerName: 'Guests ', sortable: true, width: 150 },
    { field: 'phone', headerName: 'Phone', sortable: true, filterType: 'select' as const },
    { field: 'bookAt', headerName: 'Booked At', sortable: true, filterType: 'select' as const },
    { field: 'paymentStatus', headerName: 'Payment Status', sortable: true,  renderCell:(row)=>{
           return  <div>{row?.payment ? row?.payment?.status : <div>Pending</div> }</div>
        } },
    { field: 'amountPaid', headerName: 'Amount Paid', sortable: true,  renderCell:(row)=>{
           return  <div>{row?.payment ? row?.payment?.amountPaid : <div>Pending</div> }</div>
        } },
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Bookings Management</h1>
      </div>

      {loading ? (
        <div>Loading bookings...</div>
      ) : (
        <DataGrid
          data={bookings}
          columns={bookingColumns}
          title="Current Bookings"
        />
      )}

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingBooking}
      />
    </div>
  );
};

export default BookingManagement;