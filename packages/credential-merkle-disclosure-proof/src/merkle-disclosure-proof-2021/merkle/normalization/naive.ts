import flatten from 'flat';

const objectToMessages = (obj: any) => {
  const data = flatten(obj);
  const messages = Object.keys(data).map(key => {
    return `{"${key}": "${data[key]}"}`;
  });
  return messages;
};

const messagesToObject = (messages: string[]) => {
  return flatten.unflatten(
    messages
      .map(m => {
        return JSON.parse(m);
      })
      .reduce((accumulator, message) => {
        return { ...accumulator, ...message };
      })
  );
};

export { objectToMessages, messagesToObject };
