import React, { useCallback, useEffect, useMemo, useState } from "react";

const peerContext = React.createContext(null);

export const usePeer = () => React.useContext(peerContext);

export const PeerProvider = (props) => {
    const [remoteStream , setRemotestreams] = useState();

    const peer = useMemo(() => new RTCPeerConnection({
        iceServers: [
            {
                urls: "stun:global.stun.twilio.com:3478"
            }
        ]
    }), []);

    const createOffer = async () => {
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        return offer;
    };

    const createAnswer = async (offer) => {
        await peer.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        return answer;
    };

    const setRemoteAns = async (ans) => {
        await peer.setRemoteDescription(new RTCSessionDescription(ans));
    };

    const sendStreams = async (stream) => {
        stream.getTracks().forEach(track => {
            peer.addTrack(track, stream);
        });
    };


    const handletrackevent = useCallback((e) => { 
        const streams = e.streams;
        setRemotestreams(streams[0]);

    })

  

    useEffect(() => { 
        peer.addEventListener('track'  , handletrackevent);
        return () => { 
            peer.removeEventListener('track' , handletrackevent);
        }
    } , [ handletrackevent ,peer]);


    return (
        <peerContext.Provider value={{ peer, sendStreams, setRemoteAns, createOffer, createAnswer , remoteStream }}>
            {props.children}
        </peerContext.Provider>
    );
};

export default PeerProvider;