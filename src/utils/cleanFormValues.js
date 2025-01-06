export const cleanedFormValues = (values) => {
  return Object.entries(values).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: value ?? "",
    }),
    {}
  );
};
