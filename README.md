### Pro-Mate schedule call with your favourite mentor and pay in crypto per second

Using Pro-Mate anyone can schedule a paid call with the mentor and will pay per second in crypto (fDAIx Token).  

### Steps to use

1. Visit the [Home](https://pro-mate.vercel.app/) page and connect your wallet and switch to polygon mumbai. 
2. Click on any service like Mentorship and select date and time. 
3. Install push protocol’s [web extension](https://chrome.google.com/webstore/detail/push-staging-protocol-alp/bjiennpmhdcandkpigcploafccldlakj) to receive notifications. 
3. Make sure you have enough matic in mumbai testnet, if you don’t have get it from [here](https://mumbaifaucet.com/). 
4. Click send icon to schedule a call on selected date and time. Sign a transaction to complete the booking. 
5. Once you complete your transaction, go to push protocol’s extension and check your spam to get the link to join huddle01’s call. 
6. You can join the call by navigating to `https://pro-mate.vercel.app/video/[roomid]`
7. To join make sure you have same connected wallet, which you used while scheduling your call. Click on Join Lobby, then turn on your camera and mic. 
8. Make sure you have fDAIx in your wallet, to claim it in your wallet navigate to [claim token page](https://pro-mate.vercel.app/claim) and click on `Clic to get 100k fDAIx` button. 
9. After claiming fDAIx, you can click on Join room and sign a transaction which will start a money streaming using Superfluid. 
10. To end the call, click on call end button and sign a transaction which delete money streaming from superfluid. 

### How to work with this project

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
