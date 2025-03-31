import { HttpFunction } from "@google-cloud/functions-framework";

export const getShoes: HttpFunction = (req, res) => {
  res.status(200).json({
    shoes: [
      {
        id: "1",
        name: "Nike Air Max",
      },
    ],
  });
};
