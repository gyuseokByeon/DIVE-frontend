import {
  WIPE_PROJECT_STATE,
  SELECT_COMPOSE_VISUALIZATION,
<<<<<<< HEAD
  SELECT_DOCUMENT,
  RECEIVE_DOCUMENTS,
  RECEIVE_CREATE_DOCUMENT,
  SAVE_DOCUMENT,
=======
  REQUEST_SAVE_DOCUMENT,
  RECEIVE_SAVE_DOCUMENT,
>>>>>>> 8e092d5d53da02cfab5b44e656b270fe080d9898
  SAVE_BLOCK
} from '../constants/ActionTypes';

import { BLOCK_FORMATS } from '../constants/BlockFormats';

const baseState = {
  blocks: [],
<<<<<<< HEAD
  documentId: null,
=======
>>>>>>> 8e092d5d53da02cfab5b44e656b270fe080d9898
  saving: false,
  updatedAt: Date.now()
}

// blocks: [
//   {
//     heading:
//     body:
//     exportedSpecId:
//     format:
//     dimensions:
//   } ,...
// ]

export default function composeSelector(state = baseState, action) {
  switch (action.type) {

    case SELECT_COMPOSE_VISUALIZATION:
      var blocks = state.blocks.slice();
      const filteredBlocks = blocks.filter((block) => block.exportedSpecId != action.exportedSpecId);

      if (filteredBlocks.length != blocks.length) {
        blocks = filteredBlocks;
      } else {
        blocks.push({
          heading: action.heading,
          body: '',
          exportedSpecId: action.exportedSpecId,
          format: BLOCK_FORMATS.TEXT_LEFT,
          dimensions: {}
        })
      }

      return { ...state, blocks: blocks };

    case SELECT_DOCUMENT:
      return { ...state, documentId: action.documentId };

    case RECEIVE_CREATE_DOCUMENT:
      return { ...state, documentId: action.document.id };

    case SAVE_BLOCK:
      const newBlocks = state.blocks.slice().map(function(block) {
        var newBlock = block;
        if (block.exportedSpecId == action.exportedSpecId) {
          newBlock[action.key] = action[action.key];
        }
        return newBlock;
      });
      return { ...state, blocks: newBlocks, updatedAt: Date.now(), saving: true };

    case SAVE_DOCUMENT:

      return { ...state, saving: false };

    case WIPE_PROJECT_STATE:
      return baseState;

    default:
      return state;
  }
}
