type Journal = {
  id: string;
  userId: string;
  date?: Date;
  mood: number;
  text: string;
  tags: string[];
  imageUrl?: string;
};
