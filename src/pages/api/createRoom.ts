import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  fetch("https://iriko.testing.huddle01.com/api/v1/create-room", {
    method: "POST",
    body: JSON.stringify({
      title: `Meeting with ${req.body.name}`,
      hostWallets: req.body.hostWallets,
      startTime: req.body.startTime,
    }),
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.HUDDLE01_API_KEY as string,
    },
  }).then((response) => {
    response.json().then((data) => {
      res.status(200).json(data);
    });
  });
}
