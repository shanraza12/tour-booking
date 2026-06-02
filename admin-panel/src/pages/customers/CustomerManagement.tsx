// UserManagement.js
import React, { useEffect, useState } from 'react';
import DataGrid from '../../components/tables/BasicTables/DataGrid';
import { toast } from 'react-toastify';
import { usePost } from '../../hooks/useApi';
// Assuming you have the Tailwind CSS version of DataGrid implemented

// --- Dummy Data Setup for Users ---
const MOCK_USER_DATA = [
    { id: 1, name: 'Sandra Johnson', email: 'sandra@corp.com', role: 'Executive', department: 'Management', status: 'Active' },
    { id: 2, name: 'Robert Reagan', email: 'robert@corp.com', role: 'Designer', department: 'Creative', status: 'Active' },
    { id: 3, name: 'Samantha Bright', email: 'sam@corp.com', role: 'HR Specialist', department: 'Human Resources', status: 'Active' },
    { id: 4, name: 'John Heart', email: 'john@corp.com', role: 'Engineer', department: 'Technology', status: 'Inactive' },
    { id: 5, name: 'Morgan Kennedy', email: 'morgan@corp.com', role: 'Analyst', department: 'Finance', status: 'Active' },
    { id: 6, name: 'Violet Bailey', email: 'violet@corp.com', role: 'Marketing Lead', department: 'Marketing', status: 'Active' },
    { id: 7, name: 'David Lee', email: 'david@corp.com', role: 'Engineer', department: 'Technology', status: 'Active' },
    { id: 8, name: 'Emily Clark', email: 'emily@corp.com', role: 'Intern', department: 'Finance', status: 'Inactive' },
    { id: 9, name: 'Victor Stone', email: 'victor@corp.com', role: 'Executive', department: 'Management', status: 'Active' },
    { id: 10, name: 'Laura Miller', email: 'laura@corp.com', role: 'Designer', department: 'Creative', status: 'Active' },
];

const CustomerManagement = () => {
    const [users, setUsers] = useState(MOCK_USER_DATA);
    const { mutate: fetchCustomer } = usePost("/users/customers",);

    useEffect(() => {
        fetchCustomer({}, {
            onSuccess: (response) => {
                setUsers(response?.data)
            },
            onError: () => {
                toast.error("Faild to fetch Customer info")
            }
        })
    }, [])
    // --- CRUD Handlers (Recommended for full functionality) ---
    const handleAddUser = (newUser) => {
        const newId = Math.max(...users.map(u => u.id)) + 1;
        setUsers(prevUsers => [...prevUsers, { ...newUser, id: newId }]);
    };

    const handleUpdateUser = (updatedUser) => {
        setUsers(prevUsers =>
            prevUsers.map(user => user.id === updatedUser.id ? updatedUser : user)
        );
    };

    const handleDeleteUser = (userId) => {
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    };

    const userColumns = [
        { field: 'username', headerName: 'Full Name', sortable: true },
        { field: 'email', headerName: 'Email Address', sortable: true },
        { field: 'role', headerName: 'Role', sortable: true, filterType: 'date' },
        { field: 'createdAt', headerName: 'Created At', sortable: true },
        { field: 'updatedAt', headerName: 'Updated At', sortable: true, filterType: 'date' }, // Dropdown filter for Status
    ];

    return (
        <div className="  min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Customer Management Portal</h1>

            <DataGrid
                data={users}
                columns={userColumns}
                onAdd={handleAddUser}
                onEdit={handleUpdateUser}
                onDelete={handleDeleteUser}
                title="Company Directory"
            />

            {/* Note: You would typically render the DataForm (Add/Edit Modal) here */}
        </div>
    );
}

export default CustomerManagement;