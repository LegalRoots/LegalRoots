//This is the Auth token, you will use it to generate a meeting and connect to it
export const authToken = process.env.REACT_APP_VIDEOCALL_API_TOKEN;
// API call to create a meeting
export const createMeeting = async ({ token }) => {
  const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
    method: "POST",
    headers: {
      authorization: `${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  const { roomId } = await res.json();
  console.log("room id:  " + roomId); //log the room id
  return roomId;
};
