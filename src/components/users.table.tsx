import Table from "react-bootstrap/Table";
import { useState, forwardRef } from "react";
import Button from "react-bootstrap/Button";
import UserCreateModal from "./modal/user.create.modal";
import UserEditModal from "./modal/user.edit.modal";
import UserDeleteModal from "./modal/user.delete.modal";
import UsersPagination from "./pagination/users.pagination";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import { useQuery } from "@tanstack/react-query";

function UsersTable() {
  const [isOpenCreateModal, setIsOpenCreateModal] = useState<boolean>(false);

  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState<boolean>(false);
  const [dataUser, setDataUser] = useState({});

  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);

  // const users = [
  //   {
  //     id: 1,
  //     name: "Eric",
  //     email: "eric@gmail.com",
  //   },
  //   {
  //     id: 2,
  //     name: "hihi",
  //     email: "hoidanit@gmail.com",
  //   },
  //   {
  //     id: 3,
  //     name: "hihi",
  //     email: "admin@gmail.com",
  //   },
  // ];

  const { isPending, error, data } = useQuery({
    queryKey: ["fetchData"],
    queryFn: () =>
      fetch("http://localhost:8000/users").then((res) => res.json()),
    staleTime: 3000,
  });
  if (isPending) return "Loading...";
  if (error) return "An error has occurred: " + error.message;

  const handleEditUser = (user: any) => {
    setDataUser(user);
    setIsOpenUpdateModal(true);
  };

  const handleDelete = (user: any) => {
    setDataUser(user);
    setIsOpenDeleteModal(true);
  };

  const PopoverComponent = forwardRef((props: any, ref: any) => {
    const { id } = props;
    const { isPending, error, data } = useQuery({
      queryKey: ["hihi", id],
      queryFn: () =>
        fetch(`http://localhost:8000/users/${id}`).then((res) => res.json()),
    });

    const getInfo = () => {
      if (isPending) return "Loading...";
      if (data)
        return (
          <>
            <div>ID = {id}</div>
            <div>Name = {data.name}</div>
            <div>Email = {data.email}</div>
          </>
        );
      if (error) return "An error has occurred: " + error.message;
    };
    return (
      <Popover ref={ref} {...props}>
        <Popover.Header as="h3">Detail User</Popover.Header>
        <Popover.Body>{getInfo()}</Popover.Body>
      </Popover>
    );
  });

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "15px 0",
        }}
      >
        <h4>Table Users</h4>
        <Button variant="primary" onClick={() => setIsOpenCreateModal(true)}>
          Add New
        </Button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((user: any) => {
            return (
              <tr key={user.id}>
                <OverlayTrigger
                  trigger="click"
                  placement="right"
                  rootClose
                  overlay={<PopoverComponent id={user.id} />}
                >
                  <td>
                    <a href="#">{user.id}</a>
                  </td>
                </OverlayTrigger>

                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <Button
                    variant="warning"
                    onClick={() => handleEditUser(user)}
                  >
                    Edit
                  </Button>
                  &nbsp;&nbsp;&nbsp;
                  <Button variant="danger" onClick={() => handleDelete(user)}>
                    Delete
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <UsersPagination totalPages={0} />
      <UserCreateModal
        isOpenCreateModal={isOpenCreateModal}
        setIsOpenCreateModal={setIsOpenCreateModal}
      />

      <UserEditModal
        isOpenUpdateModal={isOpenUpdateModal}
        setIsOpenUpdateModal={setIsOpenUpdateModal}
        dataUser={dataUser}
      />

      <UserDeleteModal
        dataUser={dataUser}
        isOpenDeleteModal={isOpenDeleteModal}
        setIsOpenDeleteModal={setIsOpenDeleteModal}
      />
    </>
  );
}

export default UsersTable;
