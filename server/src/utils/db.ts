import { Model } from 'mongoose';
import { MediaType, PlaylistType } from '../common/types';

type AppTypes = MediaType | PlaylistType;

/**
 * Returns a document in a collection by it's id
 *
 */
export async function getItemById<T extends AppTypes>(
  Model: Model<T>,
  itemId: string
) {
  return await Model.findById(itemId);
}

/**
 * Returns a document in a collection matching the provided field value
 *
 */
export async function getItemByField<T extends AppTypes>(
  Model: Model<T>,
  field: Partial<T>
) {
  return await Model.find(field);
}

/**
 * Deletes a document from a collection by it's id and returns the deleted document
 *
 */
export async function deleteItemById<T extends AppTypes>(
  Model: Model<T>,
  itemId: string
) {
  return await Model.findByIdAndRemove(itemId);
}

/**
 * Deletes many documents from a collection by field property and returns the deleted document
 *
 */
export async function deleteItemByField<T extends AppTypes>(
  Model: Model<T>,
  field: Partial<T>
) {
  return await Model.deleteMany(field);
}

/**
 * Adds a document into a collection and returns the added document
 *
 */
export async function addItem<T extends AppTypes>(Model: Model<T>, item: T) {
  return await Model.create(item);
}

/**
 * Modifies a document in a collection and returns the previous document
 *
 */
export async function updateItemById<T extends AppTypes>(
  Model: Model<T>,
  itemId: string,
  newItem: Partial<T>
) {
  return await Model.findByIdAndUpdate(itemId, newItem, { new: true });
}

/**
 * reset a collection to empty or provide the default documents in a collection and returns the previous document
 *
 */
export async function resetItems<T extends AppTypes>(
  Model: Model<T>,
  defaultItem: T
) {
  await Model.deleteMany({});
  return defaultItem && (await addItem(Model, defaultItem));
}
