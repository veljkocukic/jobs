import { Injectable } from '@nestjs/common';
import { Conversation, User } from '@prisma/client';
import { EventsGateway } from 'src/events/events.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddMessageDto } from './dto';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService, private gw: EventsGateway) {}

  async getConversations(userId: number) {
    try {
      const conversations = await this.prisma.conversation.findMany({
        where: {
          participants: {
            some: {
              id: userId,
            },
          },
        },
        select: {
          id: true,
          participants: {
            select: {
              name: true,
              lastName: true,
              id: true,
            },
            where: {
              id: {
                not: { equals: userId },
              },
            },
          },
        },
      });

      const getConversationsWithJobOffers = () => {
        const promises = conversations.map(async (c) => {
          const jobOffers = await this.prisma.jobOffer.findMany({
            where: {
              userId: c.participants.find((p) => p.id !== userId)?.id,
              job: {
                userId,
                hasAcceptedOffer: false,
              },
            },
            select: {
              id: true,
              job: {
                select: {
                  name: true,
                  category: true,
                  id: true,
                },
              },
            },
          });
          return { ...c, jobOffers };
        });
        return Promise.all(promises);
      };

      const respArray = await getConversationsWithJobOffers();

      return respArray;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getMessages(conversationId: number, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const messages = await this.prisma.conversation.findFirst({
        where: {
          id: conversationId,
        },
        select: {
          messages: {
            orderBy: {
              createdAt: 'desc',
            },
            take: limit,
            skip,
          },
        },
      });
      return messages;
    } catch (error) {
      throw new Error(error);
    }
  }

  async goToConversation(senderId: number, receiverId: number) {
    try {
      let conversation: Conversation;
      const found = await this.prisma.conversation.findFirst({
        where: {
          participants: {
            every: {
              id: {
                in: [senderId, receiverId],
              },
            },
          },
        },
      });

      if (found) {
        conversation = found;
      } else {
        conversation = await this.prisma.conversation.create({
          data: {
            participants: {
              connect: [{ id: senderId }, { id: receiverId }],
            },
          },
        });
      }

      return { conversationId: conversation.id };
    } catch (error) {
      throw new Error(error);
    }
  }

  async addNewMessage(dto: AddMessageDto) {
    try {
      const { userId, receiverId, conversationId, content } = dto;
      let conversation: Conversation;
      if (!conversationId) {
        const sender: User = await this.prisma.user.findFirst({
          where: {
            id: userId,
          },
        });

        const receiver: User = await this.prisma.user.findFirst({
          where: {
            id: receiverId,
          },
        });

        conversation = await this.prisma.conversation.create({
          data: {
            participants: {
              connect: [{ id: sender.id }, { id: receiver.id }],
            },
          },
        });
      } else {
        conversation = await this.prisma.conversation.findFirst({
          where: {
            id: conversationId,
          },
        });
      }

      const newMessage = await this.prisma.message.create({
        data: {
          content,
          senderId: userId,
          receiverId,
          conversationId: conversation.id,
        },
      });

      this.gw.sendNewMessage(newMessage);

      return newMessage;
    } catch (error) {
      throw new Error(error);
    }
  }
}
