import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import RecentBookings from "../../components/ecommerce/RecentBookings";
import DemographicCard from "../../components/ecommerce/DemographicCard";
import PageMeta from "../../components/common/PageMeta";
import { useFetch, usePost } from "../../hooks/useApi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Home() {
  const [bookings,setBookings]=useState([]);
  const [customers,setCustomers]=useState([]);
  const { mutate:fetchCustomer} = usePost("/users/customers",);
  const { data} = useFetch([],"/payments/metrics",{});
  const { mutate:fetchBookings  } = usePost("/booking/getBookings",);

  useEffect(()=>{
    fetchCustomer({},{
      onSuccess:(response)=>{
        setCustomers(response?.data)
      },
      onError:()=>{
        toast.error("Faild to fetch Customer info")
      }
    })
    fetchBookings({},{
      onSuccess:(response)=>{
        setBookings(response?.data)
      },
      onError:()=>{
        toast.error("Faild to fetch Booking info")
      }
    })

  },[])

  return (
    <>
      <PageMeta
        title="SkyLiner | SkyLiners - React.js Admin Dashboard Template"
        description="This is SkyLiner page for SkyLiners "
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 ">
          <EcommerceMetrics bookings={bookings} totalRevenue={data?.metrics?.totalRevenue}  customers={customers} />

          <MonthlySalesChart  montlySales={data?.metrics?.monthlyRevenue}/>
        </div>

        {/* <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>

        <div className="col-span-12">
          <StatisticsChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div> */}

        <div className="col-span-12 ">
          <RecentBookings recentPayments={data?.metrics?.recentPayments} />
        </div>
      </div>
    </>
  );
}
