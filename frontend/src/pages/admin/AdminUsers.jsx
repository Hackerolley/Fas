import { useEffect, useState } from "react";
import AdminNav from "./AdminNav";
import api from "../../api/axios";

// Admin users page displays real customers from database.
const AdminUsers = () => {

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);


  useEffect(() => {

    const fetchUsers = async () => {

      try {

        const { data } = await api.get("/admin/users");

        setUsers(data);

      } catch (error) {

        console.error(
          "Failed to fetch users:",
          error
        );

      } finally {

        setLoading(false);

      }

    };


    fetchUsers();

  }, []);



  if (loading) {

    return (

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        <AdminNav />

        <p className="mt-8 text-sm text-gray-500">
          Loading users...
        </p>

      </section>

    );

  }



  return (

    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

      <AdminNav />

      <h1 className="text-4xl font-extrabold">
        Users
      </h1>


      <div className="thin-scrollbar mt-8 overflow-x-auto rounded-lg bg-white shadow-soft ring-1 ring-black/5">

        <table className="w-full min-w-[640px] text-left text-sm">


          <thead className="bg-pearl text-ink/60">

            <tr>

              <th className="p-4">
                Name
              </th>

              <th>
                Email
              </th>

              <th>
                Role
              </th>

              <th>
                Joined
              </th>

            </tr>

          </thead>



          <tbody>


            {users.map((user) => (

              <tr
                key={user._id}
                className="border-t border-linen"
              >

                <td className="p-4 font-bold">
                  {user.name}
                </td>


                <td>
                  {user.email}
                </td>


                <td>

                  <span className="rounded-full bg-pearl px-3 py-1 text-xs font-bold text-moss">

                    {user.isAdmin
                      ? "admin"
                      : "customer"}

                  </span>

                </td>


                <td>

                  {new Date(user.createdAt)
                    .toLocaleDateString()}

                </td>


              </tr>

            ))}


          </tbody>


        </table>


      </div>


    </section>

  );
};


export default AdminUsers;