import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminNav from "./AdminNav";
import api from "../../api/axios";
import CircleLoader from "../../components/CircleLoader";
import Button from "../../components/Button";


// Admin orders page displays real database orders.
const AdminOrders = () => {

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);



  useEffect(() => {

    const fetchOrders = async () => {

      try {

        const { data } = await api.get("/admin/orders");

        setOrders(data);


      } catch (error) {

        console.error(
          "Failed to fetch orders:",
          error
        );

      } finally {

        setLoading(false);

      }

    };


    fetchOrders();


  }, []);



  if (loading) {

    return (

      <section className="mx-auto max-w-7xl px-4 py-12">

        <AdminNav />

        <div className="mt-10 flex justify-center"><CircleLoader className="text-clay" label="Loading orders" /></div>

      </section>

    );

  }



  return (

    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">


      <AdminNav />


      <h1 className="text-4xl font-extrabold">
        Orders
      </h1>



      <div className="thin-scrollbar mt-8 overflow-x-auto rounded-lg bg-white shadow-soft ring-1 ring-black/5">


        <table className="w-full min-w-[1000px] text-left text-sm">


          <thead className="bg-pearl text-ink/60">

            <tr>

              <th className="p-4">
                Order
              </th>

              <th>
                Customer
              </th>

              <th>
                Total
              </th>

              <th>
                Payment
              </th>

              <th>
                Status
              </th>

              <th>
                Date
              </th>

              <th>
                Action
              </th>

            </tr>

          </thead>



          <tbody>


            {orders.map((order)=>(


              <tr
                key={order._id}
                className="border-t border-linen"
              >


                <td className="p-4 font-medium">

                  #{order._id.slice(-6)}

                </td>



                <td>

                  {order.user?.name ||
                  order.shippingAddress?.fullName}

                </td>



                <td>

                  ₦{order.totalPrice.toLocaleString()}

                </td>



                <td>

                  <span className={
                    order.isPaid
                    ? "text-green-600"
                    : "text-gray-500"
                  }>

                    {order.isPaid
                      ? "Paid"
                      : "Pending"}

                  </span>

                </td>



                <td className="capitalize">

                  {order.status}

                </td>



                <td>

                  {new Date(order.createdAt)
                    .toLocaleDateString()}

                </td>



                <td>


                  <Link to={`/admin/orders/${order._id}`}>
                    <Button size="sm">View</Button>
                  </Link>


                </td>



              </tr>


            ))}



          </tbody>


        </table>


      </div>


    </section>

  );

};


export default AdminOrders;
