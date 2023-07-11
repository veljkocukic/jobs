import { NotFoundException } from '@nestjs/common';

export const checkIfExistsAndReturn = (model, message) => {
  if (model) {
    return model;
  } else {
    throw new NotFoundException(message);
  }
};
