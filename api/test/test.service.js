export const getMembers = async (req, res) => {
  try {
    const members = ["Luka", "Marine", "Sesili"];

    res.send(members);
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};
