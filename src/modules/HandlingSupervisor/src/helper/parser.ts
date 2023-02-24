export const parser = (req: string) => {
  try {
    const json = JSON.parse(req);

    return json.sender;
  } catch (error) {
    console.log(error);
  }
};
