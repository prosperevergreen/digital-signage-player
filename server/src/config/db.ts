import { connect } from 'mongoose';
import http from 'http';

export default async (
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>,
  mongoURL: string
) => {
  try {
    await connect(mongoURL);
    console.log('MongoDb Connected');
  } catch (err) {
    console.error(err);
    server.close();
  }
};
