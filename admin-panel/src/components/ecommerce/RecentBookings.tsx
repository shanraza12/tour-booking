import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";

// Define the TypeScript interface for the table rows
interface Product {
  id: number; // Unique identifier for each product
  name: string; // Product name
  variants: string; // Number of variants (e.g., "1 Variant", "2 Variants")
  category: string; // Category of the product
  price: string; // Price of the product (as a string with currency symbol)
  // status: string; // Status of the product
  image: string; // URL or path to the product image
  status: "Delivered" | "Pending" | "Canceled"; // Status of the product
}

// Define the table data using the interface


export default function RecentBookings({ recentPayments }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
        Recent Payments
      </h3>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-y border-gray-100 dark:border-gray-800">
            <TableRow>
              <TableCell isHeader className="w-[35%] py-3 text-start text-theme-xs text-gray-500">
                Tour
              </TableCell>
              <TableCell isHeader className="w-[25%] py-3 text-start text-theme-xs text-gray-500">
                Customer
              </TableCell>
              <TableCell isHeader className="w-[20%] py-3 text-start text-theme-xs text-gray-500">
                Amount
              </TableCell>
              <TableCell isHeader className="w-[20%] py-3 text-start text-theme-xs text-gray-500">
                Status
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {recentPayments?.map((payment) => (
              <TableRow key={payment._id}>
                <TableCell className="w-[35%] py-3 text-start font-medium text-gray-800 dark:text-white/90">
                  {payment.bookingId?.tourName || "—"}
                </TableCell>

                <TableCell className="w-[25%] py-3 text-start text-gray-500 dark:text-gray-400">
                  {payment.bookingId?.fullName || "—"}
                </TableCell>

                <TableCell className="w-[20%] py-3 text-start text-gray-500 dark:text-gray-400">
                  Rs. {payment.amountPaid.toLocaleString()}
                </TableCell>

                <TableCell className="w-[20%] py-3 text-start">
                  <Badge
                    size="sm"
                    color={
                      payment.status === "Succeeded"
                        ? "success"
                        : payment.status === "Pending"
                          ? "warning"
                          : "error"
                    }
                  >
                    {payment.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

      </div>
    </div>
  );
}
