// Updated TourManagement.tsx
import React, { useEffect, useState } from 'react';
import DataGrid from '../../components/tables/BasicTables/DataGrid';
import Button from '../../components/ui/button/Button';
import TourModal from './TourModal';
import { useDelete, useFetch, usePost } from '../../hooks/useApi';
import { toast } from 'react-toastify';
import { FaDumpster, FaEdit, FaTrash } from 'react-icons/fa';


const TourManagement = () => {
  const [tours, setTours] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<any>(null);
  const { mutate } = usePost("/tours",)
  const { mutate :deleteTour} = useDelete("/tours/delete",)
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const handleFetchData=()=>{
     mutate({}, {
      onSuccess: (response) => {
        setTours(response?.data)
      },
      onError: () => {
        toast.error("Failed to fetch Tours")
      }
    })
  }
  useEffect(() => {
    handleFetchData()
  }, [])
  const handleCreate = () => {
    setEditingTour(null);
    setIsModalOpen(true);
  };

  const handleEdit = (tour: any) => {
    setEditingTour(tour);
    setIsModalOpen(true);
  };

  const handleSave = (savedTour: any) => {
    if (savedTour.id) {
      // Update existing
      setTours(prev => prev.map(t => (t.id === savedTour.id ? savedTour : t)));
    } else {
      // Create new - assign new ID
      const newId = Math.max(...tours.map(t => t.id), 0) + 1;
      setTours(prev => [...prev, { ...savedTour, id: newId }]);
    }
  };

 const handleDelete = (tourId: number) => {
  
    // setTours(prev => prev.filter(t => t.id !== tourId));
    deleteTour(tourId)
    handleFetchData()
    toast.success('Tour deleted successfully');
    setDeleteConfirmId(null);
  };

  const tourColumns = [
    // { field: 'id', headerName: 'Tour ID', sortable: true, width: 90 },
    { field: 'title', headerName: 'Tour Title', sortable: true, flex: 1 },
    { field: 'address', headerName: 'Tour Title', sortable: true, flex: 1 },
    { field: 'maxGroupSize', headerName: 'Tour Title', sortable: true, flex: 1 },
    { field: 'price', headerName: 'Tour Title', sortable: true, flex: 1 },
    { field: 'distance', headerName: 'Destination', sortable: true, },
    { field: 'city', headerName: 'Destination', sortable: true, },
    {
      field: 'photo',
      headerName: 'Photo',
      width: 160,
      sortable: false,
      renderCell: (row: any) => (
        <div className="flex items-center gap-2">
          <img src={row?.photo} alt="" />
        </div>
      ),
    },

    {
      field: 'actions',
      headerName: 'Actions',
      width: 160,
      sortable: false,
      renderCell: (row: any) => (
        <div className="flex items-center gap-3">
          <Button
            size="lg"
            variant="ghost"
            className="text-blue-600 hover:bg-blue-50"
            onClick={() => handleEdit(row)}
          >
            <FaEdit />
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="text-red-600 hover:bg-red-50"
            onClick={() => setDeleteConfirmId(row._id)}
          >
            <FaTrash />
          </Button>
        </div>
      ),
    },
  ];




  return (
    <div className="min-h-screen p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Tour Management</h1>
        <Button onClick={handleCreate}>Add New Tour</Button>
      </div>

      <DataGrid
        data={tours}
        columns={tourColumns}
        title="Available Tours"
      />

      <TourModal
        isOpen={isModalOpen}
        handleFetchData={handleFetchData}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingTour}
      />


      {deleteConfirmId !== null && (
        <div className="fixed inset-0 bg-blur flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this tour? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive" // or className="bg-red-600 text-white hover:bg-red-700"
                onClick={() => handleDelete(deleteConfirmId)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourManagement;