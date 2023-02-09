import express from 'express';

import PlaylistsRoute from './playlists';
import MediaRoute from './media';

const router = express.Router();

router.use('/playlists/', PlaylistsRoute);
router.use('/media', MediaRoute);

export default router;
