import React, { useCallback, useEffect, useState } from 'react'
import { useSockets } from '../Providers/Socket'
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const {socket} = useSockets();
    // socket.emit('join-room' , {roomId : 1 , emailId : "kinshuk@gmail.com"});
    // console.log("socket" , socket);

    const navigate = useNavigate();


    const [email , setEmail] = useState();
    const [roomId , setRoomId] = useState();

    const handleroomjoined = useCallback(({roomId}) => {
        navigate( `/room/${roomId}` );
    } , [navigate])
    // useeffect hook ; 
    useEffect(() => {
        socket.io('joined-room' , handleroomjoined);

        return () => { 
            socket.off("joined-room",handleroomjoined);

        }

    } , [ handleroomjoined,socket])

    const handleJoinroom = () => { 
        socket.emit('join-room' , {emailId : email , roomId })
    }
  return (
    <div className='Homepage-container'>
        <div className='input-container'>
            <h1 className='meet'>Meet/IO</h1>
            <span className='head'>Email : </span>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder='Email : ' />
            <span className='head'>Room code :</span>
            <input value={roomId} onChange={e => setRoomId(e.target.value)} type="text" placeholder='Enter room code' />
            <button onClick={handleJoinroom}>Join</button>
        </div>
    </div>
  )
}

export default Home