import DataGrid from '../../components/tables/BasicTables/DataGrid'; 
import { useFetch } from '../../hooks/useApi';

const PaymentManagement = () => {
    const {data:payments}=useFetch([],"/payments",{})
    const paymentColumns = [
    { field: 'paymentIntentId', headerName: 'Stripe Intent ID', width: 240 },
    { field: 'customerName', headerName: 'Customer Name', width: 160, renderCell:(row)=>{
           return  <div>{row?.bookingId?.fullName}</div>
        } },
    { field: 'tourName', headerName: 'Tour Name', width: 200 ,
        renderCell:(row)=>{
           return  <div>{row?.bookingId?.tourName}</div>
        }
    },
    { field: 'amountPaid', headerName: 'Amount ($)', width: 120, align: 'right' },
    { 
      field: 'status', 
      headerName: 'Payment Status', 
      width: 120,
      renderCell: (row) => (<div>{row?.status}</div>)
    },
    { 
      field: 'bookingStatus', 
      headerName: 'Booking Status', 
      width: 120,
      renderCell: (row) => (<div>{row?.bookingId?.status}</div>)
    },
    { 
      field: 'bookAt', 
      headerName: 'Booking At', 
      width: 120,
      renderCell: (row) => (<div>{row?.bookingId?.bookAt}</div>)
    },
    { field: 'createdAt', headerName: 'Payment Date', width: 180 },
  ];

    return (
        <div className="min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Payment Management Portal</h1>

            <DataGrid
                data={payments?.data}
                columns={paymentColumns}
                title="Payment Records"
            />
        </div>
    );
}

export default PaymentManagement;
