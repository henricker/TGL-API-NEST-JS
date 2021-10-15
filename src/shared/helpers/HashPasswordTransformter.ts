import * as bcrypt from 'bcrypt';
export const HashPasswordTransform = {
  hash: (password: string): string => {
    const passwordHashed = bcrypt.hashSync(password, 10);
    return passwordHashed;
  },

  compare: (hash: string, password: string): boolean => {
    return bcrypt.compareSync(password, hash);
  },
};
