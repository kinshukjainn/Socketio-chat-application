import React, { useEffect , useCallback , useState } from "react";
import ReactPlayer from "react-player";
import { useSockets } from "../Providers/Socket";
import { usePeer } from "../Providers/Peer";


const Room = () => {
    const {socket} = useSockets();
    const {peer , createOffer , sendStreams , createAnswere ,  remoteStream ,  setRemoteAns} = usePeer();

    const [myStream , setMystream] = useState(null);
    const [remoteEmailid ,  setremoteid ] = useState(null);



    const handlenewUserjoined = useCallback(async (data) => {
        const {emailId} = data;
        console.log("New user joined the room" , emailId);
        const offer = await createOffer();
        socket.emit('call-user' , {emailId , offer})
        setremoteid(emailId);

    } , [createOffer , socket]);


    const handleIncommingcall =  useCallback(async(data) => { 
        const {from , offer} = data;
        console.log('Incomming-call from' , from , offer );
        const ans = await createAnswere(offer);
        socket.emit('call-accepted' , {emailId  : from ,ans});
        setremoteid(from);
    } , [createAnswere , socket ]);

    const handleCallAccepted = useCallback( async (data) => { 
        const { ans} = data;
        console.log('call got accecpted');
        await setRemoteAns(ans);


    } , [setRemoteAns]);

    const getUsermediaStreams = useCallback(async()=>{
        const stream = await navigator.mediaDevices.getUserMedia(audio : true , video : true)
        setMystream(stream); 
    } , []);


    const handlenegotitation = useCallback(async () => { 
        console.log("offer please");
        const localoffer = peer.createOffer();
        socket.emit('call-user' , {emailId : remoteEmailid , offer : localoffer} );

    } , [peer.localDescription , remoteEmailid , socket]);



    useEffect(()=> { 
        socket.on('user-joined', handlenewUserjoined)
        socket.on('incomming-call' , handleIncommingcall);
        socket.on('call-accecpted' , handleCallAccepted);

        return () => { 
            socket.off('user-joined' , handlenewUserjoined);
            socket.off('Incomming-call' , handleIncommingcall);
            socket.off('call-accecpted' , handleCallAccepted);
        }
    } , [handleCallAccepted, handleIncommingcall, handlenewUserjoined, socket])

    useEffect(() => { 
        peer.addEventListener('negotiationneeded' , handlenegotitation);
        return()=> { 
            peer.removeEventListener('negotiationneeded' , handlenegotitation);
        }


    } , []);

    useEffect(() => { 
        getUsermediaStreams();
    } , [getUsermediaStreams]);

    return (
    <div className="room-page-container">
        <h1>You are connected to {remoteEmailid}</h1>
        <button onClick={e => sendStreams(myStream)}>Send</button>
        <ReactPlayer url={myStream} playing  muted/>
        <ReactPlayer url={remoteStream} playing />
    </div>
  )
}

export default Room