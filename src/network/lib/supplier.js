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
  addSupplier: async (data) => {
    let result = {};
    try {
      const response = await instance.post(`/`, data);
      result = response.data;
    } catch (error) {
      result = error;
    }
    return result;
  },
  updateSupplier: async (id, data) => {
    let result = {};
    try {
      const response = await instance.put(`/${id}`, { ...data });
      result = response.data;
    } catch (error) {
      result = error;
    }
    return result;
  },
  getOneSupplier: async (id) => {
    let result = {};
    try {
      const response = await instance.get(`/${id}`);
      result = response.data;
    } catch (error) {
      result = error;
    }
    return result;
  },
};
