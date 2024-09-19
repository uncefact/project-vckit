import pointer from 'json-pointer';

const objectToMessages = (obj: any) => {
  const dict = pointer.dict(obj);
  const messages = Object.keys(dict).map(key => {
    const messageObj: { [k: string]: any } = {};
    messageObj[key] = dict[key];
    return JSON.stringify(messageObj);
  });
  return messages;
};

const messagesToObject = (messages: string[]) => {
  const obj = {};
  messages
    .map(m => {
      return JSON.parse(m);
    })
    .forEach(m => {
      const [key] = Object.keys(m);
      const value = m[key];
      pointer.set(obj, key, value);
    });
  return obj;
};

export { objectToMessages, messagesToObject };
