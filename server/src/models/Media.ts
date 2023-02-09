import { Schema, model } from 'mongoose';
import { MediaType } from '../common/types';

const schema = new Schema<MediaType>(
  {
    // id: { type: String, required: true },
    name: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String, required: true, enum: ['IMAGE', 'VIDEO'] },
    playlistId: { type: String, required: true }
  },
  {
    toJSON: {
      transform(doc, ret) {
        (ret.id = ret._id), (ret.key = ret._id), delete ret._id, delete ret.__v;
      }
    }
  }
);

const MediaModel = model<MediaType>('Media', schema);

export default MediaModel;
