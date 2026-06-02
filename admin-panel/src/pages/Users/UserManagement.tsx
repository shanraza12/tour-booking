// src/pages/UserManagement.tsx (or wherever it lives)
import React, { useEffect, useState } from 'react';
import DataGrid from '../../components/tables/BasicTables/DataGrid';
import Button from '../../components/ui/button/Button';
import UserModal from './UserModal'; // Create this file next
import { usePost, useDelete } from '../../hooks/useApi';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash } from 'react-icons/fa';

const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const { mutate: fetchUsers } = usePost("/users/getAdmins");
  const { mutate: deleteUser } = useDelete("/users/delete"); // Adjust if your delete endpoint is different

  const handleFetchData = () => {
    fetchUsers({}, {
      onSuccess: (res) => {
        setUsers(res?.data || []);
      },
      onError: () => {
        toast.error("Failed to fetch users");
      },
    });
  };

  useEffect(() => {
    handleFetchData();
  }, []);

  const handleCreate = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleSave = (savedUser: any) => {
    if (editingUser) {
      setUsers(prev => prev.map(u => u._id === savedUser._id ? savedUser : u));
    } else {
      setUsers(prev => [...prev, savedUser]);
    }
    handleFetchData(); // Optional: refetch to ensure sync
  };

  const handleDelete = (userId: string) => {
    deleteUser({ id: userId }, { // Adjust payload if your API expects :id in URL
      onSuccess: () => {
        toast.success("User deleted successfully");
        handleFetchData();
      },
      onError: () => {
        toast.error("Failed to delete user");
      },
    });
    setDeleteConfirmId(null);
  };

  const columns = [
    { field: 'username', headerName: 'Full Name', flex: 1 },
    { field: 'email', headerName: 'Email Address', flex: 1 },
    { field: 'role', headerName: 'Role', flex: 1 },
    { field: 'createdAt', headerName: 'Created At', flex: 1 },
    { field: 'updatedAt', headerName: 'Updated At', flex: 1 },
    {
      field: 'Photo',
      headerName: 'Photo',
      width: 120,
      sortable: false,
      renderCell: (row: any) => (
        <div className="flex items-center gap-3">
          { row?.photo  !=="" ? <img src={row?.photo} alt="" /> : <img src={row?.photo} alt="" />  }
        </div>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (row: any) => (
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="lg" onClick={() => handleEdit(row)}>
            <FaEdit className="text-blue-600" />
          </Button>
          <Button variant="ghost" size="lg" onClick={() => setDeleteConfirmId(row._id)}>
            <FaTrash className="text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">User Management Portal</h1>
        <Button onClick={handleCreate}>Add New User</Button>
      </div>

      <DataGrid
        data={users}
        columns={columns}
        title="Company Directory"
      />

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingUser}
        handleFetchData={handleFetchData}
      />

      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">Are you sure? This cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
              <Button variant="destructive" onClick={() => handleDelete(deleteConfirmId)}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;