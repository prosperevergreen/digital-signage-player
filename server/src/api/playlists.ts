import express from 'express';

import { PlaylistType } from '../common/types';
import MediaModel from '../models/Media';
import PlaylistModel from '../models/Playlists';
import * as db from '../utils/db';

const router = express.Router();

/* GET category all for current user.*/
router.get('/:playlistId', async function (req, res) {
  try {
    const { playlistId } = req.params;
    const playlistItem = await db.getItemById(PlaylistModel, playlistId);
    res.json(playlistItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

/* GET all playlist items.*/
router.get('/', async function (_, res) {
  try {
    const playlistItems = await db.getItemByField(PlaylistModel, {});
    res.json(playlistItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

/* Add a new playlist. */
router.post('/', async function (req, res) {
  const newPlaylist: PlaylistType = req.body;
  try {
    const playlistData = await db.addItem(PlaylistModel, newPlaylist);
    res.json(playlistData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

/* Add a update playlist. */
router.put('/:playlistId', async function (req, res) {
  const { playlistId } = req.params;
  const modifiedPlaylist = req.body;
  try {
    const playlistData = await db.updateItemById(
      PlaylistModel,
      playlistId,
      modifiedPlaylist
    );
    res.json(playlistData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

/* DELETE category by id. */
router.delete('/:playlistId', async function (req, res) {
  const { playlistId } = req.params;
  try {
    await db.deleteItemByField(MediaModel, { playlistId });
    const playlistData = await db.deleteItemById(PlaylistModel, playlistId);
    res.json(playlistData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

export default router;
