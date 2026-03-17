function Users() {
  const users = [
    {
      id: 1,
      name: "Admin",
      email: "admin@gmail.com",
      role: "admin",
    },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Users</h1>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200">
            <th>ID</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="text-center border-t">
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Users;