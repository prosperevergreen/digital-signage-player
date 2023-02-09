import express from 'express';

import { MediaType } from '../common/types';
import MediaModel from '../models/Media';
import * as db from '../utils/db';

const router = express.Router();

/* GET all media in a playlist. */
router.get('/playlist/:playlistId', async function (req, res) {
  try {
    const { playlistId } = req.params;
    const mediaItems = await db.getItemByField(MediaModel, { playlistId });
    res.json(mediaItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

/* GET media by id.*/
router.get('/:mediaId', async function (req, res) {
  try {
    const { mediaId } = req.params;
    const mediaItems = await db.getItemById(MediaModel, mediaId);
    res.json(mediaItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

/* GET media all media.*/
router.get('/', async function (req, res) {
  try {
    const mediaItems = await db.getItemByField(MediaModel, {});
    res.json(mediaItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

/* Add a new media. */
router.post('/', async function (req, res) {
  const newPlaylist: MediaType = req.body;
  try {
    const mediaData = await db.addItem(MediaModel, newPlaylist);
    res.json(mediaData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

/* Add a update media. */
router.put('/:mediaId', async function (req, res) {
  const { mediaId } = req.params;
  const modifiedPlaylist = req.body;
  try {
    const mediaData = await db.updateItemById(
      MediaModel,
      mediaId,
      modifiedPlaylist
    );
    res.json(mediaData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

/* DELETE media by id. */
router.delete('/:mediaId', async function (req, res) {
  const { mediaId } = req.params;
  try {
    const mediaData = await db.deleteItemById(MediaModel, mediaId);
    res.json(mediaData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

export default router;
