import { signer } from "./constants";
import * as PushAPI from "@pushprotocol/restapi";

export const subscribeUser = async (address: string) => {
    await PushAPI.channels.subscribe({
      signer: signer,
      channelAddress: "eip155:5:0xf080640b6CcF8c27bFA1E85D8e925aB00f7C295e",
      userAddress: `eip155:5:${address as string}`,
      onSuccess: () => {
        console.log("Subscribed");
      },
      onError: (error: any) => {
        console.log(error);
      },
      env: "staging" as any,
    });
  };

 export const sendPushNotification = async (roomId: string, address: string, name: string, service: string, isMentor: boolean) => {
    try {
      const apiResponse = await PushAPI.payloads.sendNotification({
        signer: signer,
        type: PushAPI.payloads.NOTIFICATION_TYPE.TARGETTED, // target
        identityType: PushAPI.payloads.IDENTITY_TYPE.DIRECT_PAYLOAD, // direct payload
        notification: {
          title: `${isMentor ? `Someone has scheduled a call with you for ${service}` : `Your ${service} call with ${name} is scheduled`}`,
          body: `You can join the call with this link: https://pro-mate.vercel.app/${roomId}`,
        },
        payload: {
          title: `${isMentor ? `Someone has scheduled a call with you for ${service}` : `Your ${service} call with ${name} is scheduled`}`,
          body: `You can join the call with this link: https://pro-mate.vercel.app/${roomId}`,
          cta: `https://pro-mate.vercel.app/${roomId}`,
          img: "",
        },
        recipients: `eip155:5:${address}`, // recipient address
        channel: "eip155:5:0xf080640b6CcF8c27bFA1E85D8e925aB00f7C295e", // your channel address
        env: "staging" as any,
      });
      if (apiResponse?.status === 204) {
        console.log("Notification sent");
      }
      console.log(apiResponse?.status);
    } catch (error) {
      console.log(error);
    }
  };
