import { useMeeting, useParticipant } from "@videosdk.live/react-sdk";
import ReactPlayer from "react-player";
import { useMemo } from "react";
const PresenterView = ({ presenterId }) => {
  const { screenShareStream, screenShareOn } = useParticipant(presenterId);

  //Creating a media stream from the screen share stream
  const mediaStream = useMemo(() => {
    if (screenShareOn && screenShareStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(screenShareStream.track);
      return mediaStream;
    }
  }, [screenShareStream, screenShareOn]);

  return (
    <>
      <ReactPlayer
        //
        playsinline // extremely crucial prop
        playIcon={<></>}
        //
        pip={false}
        light={false}
        controls={false}
        muted={true}
        playing={true}
        //
        url={mediaStream} // passing mediastream here
        //
        height={"100%"}
        width={"100%"}
        onError={(err) => {
          console.log(err, "presenter video error");
        }}
      />
    </>
  );
};

export default PresenterView;
