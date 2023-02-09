import { Schema, model } from 'mongoose';
import { PlaylistType } from '../common/types';

const schema = new Schema<PlaylistType>(
  {
    // id: { type: String, required: true },
    name: { type: String, required: true }
  },
  {
    toJSON: {
      transform(doc, ret) {
        (ret.id = ret._id), (ret.key = ret._id), delete ret._id, delete ret.__v;
      }
    }
  }
);

const PlaylistModel = model<PlaylistType>('Playlist', schema);

export default PlaylistModel;
