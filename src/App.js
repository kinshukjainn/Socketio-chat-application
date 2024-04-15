import React from 'react'
import { Route , Routes } from 'react-router-dom';
import "./App.css";
import { Peerprovider } from './Providers/Peer';
import Room from './Pages/Room';
import Home from './Pages/Home';
import { SocketProvider } from './Providers/Socket';

function App() {
  return (
      <SocketProvider>
        <Peerprovider>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/room/:roomId' element={<Room/>}/>
    </Routes>
        </Peerprovider>
      </SocketProvider>
  )
}

export default App;
