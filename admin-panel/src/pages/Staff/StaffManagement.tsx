import React, { useEffect, useState } from 'react';
import DataGrid from '../../components/tables/BasicTables/DataGrid';
import Button from '../../components/ui/button/Button';
import { usePost, useDelete } from '../../hooks/useApi';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const ROLES = ['admin', 'agency'];

interface StaffForm {
  username: string;
  email: string;
  password: string;
  role: string;
  photo?: string;
}

const defaultForm: StaffForm = { username: '', email: '', password: '', role: 'agency' };

const StaffManagement: React.FC = () => {
  const [staff, setStaff] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<StaffForm>(defaultForm);
  const [editing, setEditing] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const { mutate: fetchStaff } = usePost('/users/getAdmins');
  const { mutate: deleteStaff } = useDelete('/users');
  const { mutate: createStaff } = usePost('/auth/admin/register');
  const { mutate: updateStaff } = usePost('/users/update');

  const load = () => fetchStaff({}, {
    onSuccess: (res: any) => setStaff(res?.data || []),
    onError: () => toast.error('Failed to load staff'),
  });

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(defaultForm); setIsModalOpen(true); };
  const openEdit = (row: any) => { setEditing(row); setForm({ username: row.username, email: row.email, password: '', role: row.role }); setIsModalOpen(true); };

  const handleSave = async () => {
    setSaving(true);
    if (editing) {
      updateStaff({ id: editing._id, ...form, ...(form.password ? {} : { password: undefined }) }, {
        onSuccess: () => { toast.success('Staff updated'); load(); setIsModalOpen(false); },
        onError: () => toast.error('Update failed'),
        onSettled: () => setSaving(false),
      });
    } else {
      createStaff(form, {
        onSuccess: () => { toast.success('Staff member created'); load(); setIsModalOpen(false); },
        onError: (e: any) => toast.error(e?.message || 'Create failed'),
        onSettled: () => setSaving(false),
      });
    }
  };

  const handleDelete = (id: string) => {
    deleteStaff({ id }, {
      onSuccess: () => { toast.success('Staff removed'); load(); },
      onError: () => toast.error('Delete failed'),
    });
    setDeleteId(null);
  };

  const columns = [
    { field: 'username', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    {
      field: 'role', headerName: 'Role', width: 120,
      renderCell: (row: any) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${row.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
          {row.role?.toUpperCase()}
        </span>
      ),
    },
    {
      field: 'isActive', headerName: 'Status', width: 100,
      renderCell: (row: any) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${row.isActive !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {row.isActive !== false ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      field: 'lastLoginAt', headerName: 'Last Login',
      renderCell: (row: any) => row.lastLoginAt
        ? new Date(row.lastLoginAt).toLocaleString('en-PK')
        : <span className="text-gray-400 text-xs">Never</span>,
    },
    {
      field: 'actions', headerName: 'Actions', width: 120, sortable: false,
      renderCell: (row: any) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => openEdit(row)}>
            <FaEdit className="text-blue-600" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setDeleteId(row._id)}>
            <FaTrash className="text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Staff Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage admin and agency staff for SkyLiners.</p>
        </div>
        <Button onClick={openCreate} className="flex items-center gap-2">
          <FaPlus /> Add Staff Member
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{staff.filter(s => s.role === 'admin').length}</div>
          <div className="text-xs text-gray-500 mt-1">Admins</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{staff.filter(s => s.role === 'agency').length}</div>
          <div className="text-xs text-gray-500 mt-1">Agency Staff</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{staff.filter(s => s.isActive !== false).length}</div>
          <div className="text-xs text-gray-500 mt-1">Active</div>
        </div>
      </div>

      <DataGrid data={staff} columns={columns} title="SkyLiners Staff Directory" />

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-5 text-gray-800">{editing ? 'Edit Staff' : 'Add New Staff'}</h3>
            <div className="space-y-3">
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Username" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder={editing ? 'New Password (leave blank to keep)' : 'Password'} type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                <option value="agency">Agency Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editing ? 'Save Changes' : 'Create Staff'}</Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Remove Staff Member</h3>
            <p className="text-gray-500 mb-5">This will permanently remove this staff member. Continue?</p>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
              <Button variant="destructive" onClick={() => handleDelete(deleteId)}>Remove</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
