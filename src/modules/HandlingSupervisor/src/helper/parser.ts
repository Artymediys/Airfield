export const parser = (req: string) => {
  console.log("PARSER------------", req);

  const json = JSON.parse(req);

  console.log(json.sender);
};
