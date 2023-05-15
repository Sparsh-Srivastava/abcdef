import jwt from 'jsonwebtoken';
import config from '../config';

type Payload = {
  email: string;
};

const sign = ({ email }: Payload) => {
  return jwt.sign({ email }, config.jwtSecret, { issuer: 'Adblink', expiresIn: '8h' });
};

const verify = (token: string) => {
  const payload = jwt.verify(token, config.jwtSecret);
  return payload as Payload;
};

export { sign, verify };
