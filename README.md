# Pro-Mate 

Schedule a meetl with your favorite the mentor and pay crypto per second in (fDAIx Token).  

## Steps to use

1. Visit the [Home](https://pro-mate.vercel.app/) page and connect your wallet and switch to polygon mumbai. 
2. Click on any service like Mentorship and select date and time. 
3. Install push protocol’s [web extension](https://chrome.google.com/webstore/detail/push-staging-protocol-alp/bjiennpmhdcandkpigcploafccldlakj) to receive notifications. 
3. Make sure you have enough matic in mumbai testnet, if you don’t have get it from [here](https://mumbaifaucet.com/). 
4. Click send icon to schedule a call on selected date and time. Sign a transaction to complete the booking. 
5. Once you complete your transaction, go to push protocol’s extension and check your spam to get the link to join huddle01’s call. 
6. You can join the call by navigating to `https://pro-mate.vercel.app/video/[roomid]`
7. To join make sure you have same connected wallet, which you used while scheduling your call. Click on Join Lobby, then turn on your camera and mic. 
8. Make sure you have fDAIx in your wallet, to claim it in your wallet navigate to [claim token page](https://pro-mate.vercel.app/claim) and click on `Click to get 100k fDAIx` button. 
9. After claiming fDAIx, you can click on Join room and sign a transaction which will start a money streaming using Superfluid. 
10. To end the call, click on call end button and sign a transaction which delete money streaming from superfluid. 

## How to work with this project

Run following commands: 
 ```bash 
git clone https://github.com/vrajdesai78/huddle01-superfluid
```
 ```bash 
cd huddle01-superfluid
```
If you want, you can change the profile data in `src/utils/userData.json`

Generate your huddle01 API from [here](https://huddle01.com/docs/apis/api-key) 

**Note:** Get a private key from [here](https://gist.github.com/vrajdesai78/a6c1839f8e2aa7b347547537b48c08f1)

```
HUDDLE01_API_KEY=[API_KEY]
NEXT_PUBLIC_PRIVATE_KEY=[PRIVATE_KEY]
``` 
Once you create .env.local you can run following command to start server
```bash
yarn && yarn dev
```

## Technical Implementation

### Huddle01

Huddle01’s client SDK is used to build a video conferencing page, in which client user and mentor will join the meet and communicate with each other. Huddle01’s **Create Room API** is used to create a room when any user schedule a meet. 

### SuperFluid

Superfluid is used for money streaming, so whenever the user joins the room, money streaming will be started and it will deduct fDAIx per second. Once user ends the call, money streaming will be stopped. The fDAIx will directly go the to mentor. 

### Push Protocol

Whenever any user schedule a meet, push notification is sent using Push Protocol to the user as well as the mentor for whom the meet is scheduled. User and mentor and easily join the meet by just clicking on the notification. 

### Smart Contract

Solidity smart contract is deployed on Polygon Mumbai which stores the data for each scheduled meet. Smart contract will map all of the information like user’s address, mentor’s address, and per second rate with room-id which is generated from Huddle01’s API. This will make sure that only the user who have scheduled the meet will be able to join the room with given room-id. 
