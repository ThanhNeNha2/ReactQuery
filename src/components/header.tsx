import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

function Header() {
  const [mode, setMode] = useState("light");

  useEffect(() => {
    const body = document.querySelector("body");
    if (body) body.setAttribute("data-bs-theme", mode);
  }, [mode]);
  const [totalUser, setTotalUser] = useState(0);
  const { isPending, error, data } = useQuery({
    queryKey: ["repoData", 1],
    queryFn: () =>
      fetch(`http://localhost:8000/users?_page=${1}&_limit=${2}`).then(
        (res) => {
          let total_user = +(res.headers?.get("X-Total-Count") ?? 0);
          setTotalUser(total_user);
          return res.json();
        }
      ),
    // staleTime: 3000,
  });
  console.log(isPending, error, data);

  return (
    <Navbar className="bg-body-tertiary" data-bs-theme={mode}>
      <Container>
        <Navbar.Brand href="#home">
          So luong Nguoi dung {totalUser}
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Form.Check
            defaultChecked={mode === "light" ? false : true}
            onChange={(e) => {
              setMode(e.target.checked === true ? "dark" : "light");
            }}
            type="switch"
            id="custom-switch"
            label={
              mode === "light" ? (
                <Navbar.Text>Light mode</Navbar.Text>
              ) : (
                <Navbar.Text>Dark mode</Navbar.Text>
              )
            }
          />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
