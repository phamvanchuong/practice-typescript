import * as bull from 'bull';
import { sendEmailProcess } from '../process/email';

// export const emailQueue = new bull('email', 'redis://127.0.0.1:6379');
export const emailQueue: bull.Queue<any> = new bull('email', 'redis://127.0.0.1:6379');

emailQueue.process(sendEmailProcess);
