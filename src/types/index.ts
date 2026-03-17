export type CommentType = {
  id: string;
  content: string;
  user: {
    name: string | null;
  };
};
