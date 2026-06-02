import { useEffect, useState } from 'react';
import DataGrid from '../../components/tables/BasicTables/DataGrid';
import Button from '../../components/ui/button/Button';
import BlogModal from './BlogModal';
import { useDelete, usePost } from '../../hooks/useApi';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash } from 'react-icons/fa';

interface Blog {
  _id?: string;
  title: string;
  content: string;
  author: string;
  date: string;
  photo: string;
  featured: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const BlogManagement = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null); // Added
  const { mutate :deleteBlog} = useDelete("/blogs/delete",)
  const { mutate: fetchBlogs } = usePost("/blogs/getAll");
  const handleFetchData=()=>{
      fetchBlogs({}, {
      onSuccess: (response) => {
        setBlogs(response?.data || []);
      },
      onError: () => {
        toast.error("Failed to fetch blogs");
      }
    });
  }
  useEffect(() => {
    handleFetchData()
  }, [fetchBlogs]);

  const handleCreate = () => {
    setEditingBlog(null);
    setIsModalOpen(true);
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setIsModalOpen(true);
  };

  const handleSave = (savedBlog: Blog) => {
    if (editingBlog?._id) {
      setBlogs(prev => prev.map(b => b._id === savedBlog._id ? savedBlog : b));
    } else {
      setBlogs(prev => [...prev, savedBlog]);
    }
  };

  const handleDelete = (blogId: string) => {
    deleteBlog(blogId)
    handleFetchData()
    toast.success('Blog post deleted successfully');
    setDeleteConfirmId(null);
  };

  const blogColumns = [
    { field: 'title', headerName: 'Title', flex: 1, sortable: true },
    { field: 'author', headerName: 'Author', width: 150, sortable: true },
    { field: 'date', headerName: 'Publish Date', width: 150, sortable: true },
    {
      field: 'photo',
      headerName: 'Image',
      width: 120,
      sortable: false,
      renderCell: (row: Blog) => (
        row.photo ? <img src={row.photo} alt={row.title} className="h-16 w-24 object-cover rounded" /> : <span>No image</span>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 140,
      sortable: false,
      renderCell: (row: Blog) => (
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
            onClick={() => setDeleteConfirmId(row._id!)}
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
        <h1 className="text-3xl font-bold text-gray-800">Blog Management</h1>
        <Button onClick={handleCreate}>Add New Blog Post</Button>
      </div>

      <DataGrid
        data={blogs}
        columns={blogColumns}
        title="Blog Posts"
      />

      <BlogModal
        isOpen={isModalOpen}
        handleFetchData={handleFetchData}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingBlog || undefined}
      />

      {/* Delete Confirmation Modal - copied from TourManagement */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this blog post? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
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

export default BlogManagement;