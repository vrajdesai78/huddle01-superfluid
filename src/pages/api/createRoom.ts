import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  fetch("https://us-central1-nfts-apis.cloudfunctions.net/createroom", {
    method: "POST",
    body: JSON.stringify({
      title: `Meeting with ${req.body.name}`,
      hostWallets: req.body.hostWallets,
      startTime: req.body.startTime,
    }),
    headers: {
      "Content-Type": "application/json",
      "x-api-key": "Lgiukg7CvVMxgdlMRUnOGoWqzRmBv85i",
    },
  }).then((response) => {
    response.json().then((data) => {
      res.status(200).json(data);
    });
  });
}
