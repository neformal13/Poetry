import yenv from "yenv";
import express from "express";
import { promises as fs } from "fs";
import { getJSONFromFile } from "../utils/helpers.js";

const { DATA_PATH } = yenv();

const { Router } = express;
const poemsRoute = Router();

poemsRoute.get("/", async (req, res) => {
  const fileList = await fs.readdir(`${DATA_PATH}/poems`);
  const data = {
    authors: await Promise.all(
      fileList.map(fileName =>
        getJSONFromFile(`${DATA_PATH}/poems/${fileName}`)
      )
    )
  };

  res.send(data);
});

poemsRoute.get("/:id", async (req, res) => {
  const fileName = `${req.params.id}.json`;
  const poem = await getJSONFromFile(`${DATA_PATH}/poems/${fileName}`);
  res.send(poem);
});

poemsRoute.get("/:id/author", async (req, res) => {
  const fileName = `${req.params.id}.json`;
  const poem = await getJSONFromFile(`${DATA_PATH}/poems/${fileName}`);
  const author = await getJSONFromFile(
    `${DATA_PATH}/authors/${poem.author}.json`
  );

  res.send(author);
});

export default poemsRoute;
