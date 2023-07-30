import { NotFoundException } from '@nestjs/common';

export const checkIfExistsAndReturn = (
  model: any,
  message: string,
  actual?: any,
) => {
  if (model) {
    return actual ?? model;
  } else {
    throw new NotFoundException(message);
  }
};
