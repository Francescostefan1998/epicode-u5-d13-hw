import { useEffect, useState } from "react"
import {
  Container,
  Row,
  Col,
  Form,
  FormControl,
  ListGroup,
  Button,
} from "react-bootstrap"
import { Message, User } from "../types"
import { io } from "socket.io-client"


const socket = io("http://localhost:3001", {transports: ["websocket"]})


const Home = () => {
  const [username, setUsername] = useState("")
  const [message, setMessage] = useState("")
const [loggedIn, setLoggedIn] = useState(false)
const [onlineUsers, setOnlineUsers] = useState<User[]>([])

useEffect(()=>{
  socket.on("welcome", welcomeMessage =>{
    console.log(welcomeMessage)
    socket.on("loggedIn", onlineUserList => {
      console.log("logged in event:", onlineUserList)
      setLoggedIn(true)
      setOnlineUsers(onlineUserList)
    })
  })
})

const submitUserName = () => {
  socket.emit("setUserName", {username})
}
  return (
    <Container fluid>
      <Row style={{ height: "95vh" }} className="my-3">
        <Col md={9} className="d-flex flex-column justify-content-between">
          {/* LEFT COLUMN */}
          {/* TOP AREA: USERNAME INPUT FIELD */}
          {/* {!loggedIn && ( */}
          <Form
            onSubmit={e => {
              e.preventDefault();
              submitUserName();
              console.log(username)
            }}
          >
            <FormControl
              placeholder="Set your username here"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </Form>
          {/* )} */}
          {/* MIDDLE AREA: CHAT HISTORY */}
          <ListGroup></ListGroup>
          {/* BOTTOM AREA: NEW MESSAGE */}
          <Form
            onSubmit={e => {
              e.preventDefault()
            }}
          >
            <FormControl
              placeholder="Write your message here"
              value={message}
              onChange={e => setMessage(e.target.value)}
              disabled={!loggedIn}
            />
          </Form>
        </Col>
        <Col md={3}>
          {/* ONLINE USERS SECTION */}
          <div className="mb-3">Connected users:</div>
          {onlineUsers.length === 0 && <ListGroup.Item>log in to see who is online</ListGroup.Item>}
          <ListGroup>
            {onlineUsers.map(user => (<ListGroup.Item key={user.id}>{user.username}</ListGroup.Item>))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  )
}

export default Home
