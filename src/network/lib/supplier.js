import { instance } from "../instance";

export const network = {
  getSupplier: async () => {
    let result = [];
    try {
      const response = await instance.get();
      result = response.data;
    } catch (error) {
      result = error;
    }

    return result;
  },
  deleteSupplier: async (id) => {
    let result = {};
    try {
      const response = await instance.delete(`/${id}`);
      result = response.data;
    } catch (error) {
      result = error;
    }
    return result;
  },
};
